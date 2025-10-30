-- Fix 1: Create user roles system for proper authorization
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('customer', 'driver', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fix 2: Remove unrestricted packages SELECT policy and replace with secure function
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Guests can view packages by tracking" ON public.packages;

-- Create a secure function to get package info by tracking number
CREATE OR REPLACE FUNCTION public.get_package_by_tracking(tracking_num text)
RETURNS TABLE(
  id uuid,
  tracking_number text,
  status text,
  recipient_name text,
  delivery_city text,
  created_at timestamp with time zone,
  pickup_date timestamp with time zone,
  delivery_date timestamp with time zone,
  delivered_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.tracking_number,
    p.status,
    p.recipient_name,
    p.delivery_city,
    p.created_at,
    p.pickup_date,
    p.delivery_date,
    p.delivered_at
  FROM public.packages p
  WHERE p.tracking_number = tracking_num;
END;
$$;

-- Fix 3: Update driver policies to use role-based authorization
-- Drop old driver policies
DROP POLICY IF EXISTS "Drivers can assign packages" ON public.packages;
DROP POLICY IF EXISTS "Drivers can update assigned packages" ON public.packages;
DROP POLICY IF EXISTS "Drivers can view available packages" ON public.packages;

-- Create new secure driver policies
CREATE POLICY "Verified drivers can view available packages"
ON public.packages
FOR SELECT
USING (
  public.has_role(auth.uid(), 'driver'::app_role) OR
  auth.uid() = sender_id OR
  auth.uid() = claimed_by OR
  auth.uid() = driver_id
);

CREATE POLICY "Verified drivers can assign packages"
ON public.packages
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'driver'::app_role) AND
  driver_id IS NULL AND
  status = 'pending'
)
WITH CHECK (driver_id = auth.uid());

CREATE POLICY "Verified drivers can update assigned packages"
ON public.packages
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'driver'::app_role) AND
  auth.uid() = driver_id
);

-- Fix 4: Add INSERT policy for package_events
CREATE POLICY "Drivers can create events for assigned packages"
ON public.package_events
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'driver'::app_role) AND
  EXISTS (
    SELECT 1 FROM packages
    WHERE packages.id = package_events.package_id
    AND packages.driver_id = auth.uid()
  )
);

-- Create trigger to automatically assign roles based on profiles.user_type
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete existing role for this user
  DELETE FROM public.user_roles WHERE user_id = NEW.id;
  
  -- Insert new role based on user_type
  IF NEW.user_type IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, NEW.user_type::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS sync_user_role_trigger ON public.profiles;
CREATE TRIGGER sync_user_role_trigger
AFTER INSERT OR UPDATE OF user_type ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_role();

-- Migrate existing users to user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, user_type::app_role
FROM public.profiles
WHERE user_type IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;