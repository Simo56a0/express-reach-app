-- Add coordinates for location-based filtering
ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS pickup_latitude numeric,
ADD COLUMN IF NOT EXISTS pickup_longitude numeric,
ADD COLUMN IF NOT EXISTS delivery_latitude numeric,
ADD COLUMN IF NOT EXISTS delivery_longitude numeric;

-- Add guest email for tracking packages before login
ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS guest_email text;

-- Add claimed_by field to link guest packages after login
ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS claimed_by uuid REFERENCES auth.users(id);

-- Create index for distance-based queries
CREATE INDEX IF NOT EXISTS idx_packages_pickup_coords ON public.packages(pickup_latitude, pickup_longitude);

-- Update RLS policies to allow guest bookings

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create packages" ON public.packages;
DROP POLICY IF EXISTS "Users can view own packages" ON public.packages;
DROP POLICY IF EXISTS "Users can update own packages" ON public.packages;
DROP POLICY IF EXISTS "Drivers can view assigned packages" ON public.packages;
DROP POLICY IF EXISTS "Drivers can update assigned packages" ON public.packages;

-- Allow anyone to insert packages (guest or authenticated)
CREATE POLICY "Anyone can create packages"
ON public.packages
FOR INSERT
TO authenticated, anon
WITH CHECK (
  (sender_id IS NULL AND guest_email IS NOT NULL) OR 
  (auth.uid() = sender_id)
);

-- Allow users to view their own packages or packages they've claimed
CREATE POLICY "Users can view own packages"
ON public.packages
FOR SELECT
TO authenticated
USING (
  auth.uid() = sender_id OR 
  auth.uid() = claimed_by OR
  auth.uid() = driver_id
);

-- Allow guests to view packages by tracking number (handled via RPC function)
CREATE POLICY "Guests can view packages by tracking"
ON public.packages
FOR SELECT
TO anon
USING (true);

-- Allow users to update their own packages if not yet assigned
CREATE POLICY "Users can update own unassigned packages"
ON public.packages
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = sender_id OR auth.uid() = claimed_by) AND 
  driver_id IS NULL
);

-- Drivers can view available and assigned packages
CREATE POLICY "Drivers can view available packages"
ON public.packages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'driver'
  )
);

-- Drivers can update assigned packages
CREATE POLICY "Drivers can update assigned packages"
ON public.packages
FOR UPDATE
TO authenticated
USING (
  auth.uid() = driver_id AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'driver'
  )
);

-- Drivers can assign themselves to packages
CREATE POLICY "Drivers can assign packages"
ON public.packages
FOR UPDATE
TO authenticated
USING (
  driver_id IS NULL AND
  status = 'pending' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'driver'
  )
)
WITH CHECK (
  driver_id = auth.uid()
);

-- Create function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 numeric, lon1 numeric, 
  lat2 numeric, lon2 numeric
)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  R numeric := 6371; -- Earth's radius in kilometers
  dLat numeric;
  dLon numeric;
  a numeric;
  c numeric;
BEGIN
  dLat := radians(lat2 - lat1);
  dLon := radians(lon2 - lon1);
  
  a := sin(dLat/2) * sin(dLat/2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dLon/2) * sin(dLon/2);
  
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN R * c;
END;
$$;

-- Create function to get nearby packages for drivers
CREATE OR REPLACE FUNCTION public.get_nearby_packages(
  driver_lat numeric,
  driver_lon numeric,
  max_distance_km numeric DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  tracking_number text,
  status text,
  recipient_name text,
  recipient_phone text,
  pickup_address text,
  delivery_address text,
  pickup_city text,
  delivery_city text,
  package_type text,
  weight_kg numeric,
  price_pounds numeric,
  pickup_date timestamp with time zone,
  delivery_date timestamp with time zone,
  distance_km numeric
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
    p.recipient_phone,
    p.pickup_address,
    p.delivery_address,
    p.pickup_city,
    p.delivery_city,
    p.package_type,
    p.weight_kg,
    p.price_pounds,
    p.pickup_date,
    p.delivery_date,
    calculate_distance(driver_lat, driver_lon, p.pickup_latitude, p.pickup_longitude) as distance_km
  FROM public.packages p
  WHERE 
    p.driver_id IS NULL AND
    p.status = 'pending' AND
    p.pickup_latitude IS NOT NULL AND
    p.pickup_longitude IS NOT NULL AND
    calculate_distance(driver_lat, driver_lon, p.pickup_latitude, p.pickup_longitude) <= max_distance_km
  ORDER BY distance_km ASC;
END;
$$;