-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create packages table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT UNIQUE NOT NULL DEFAULT 'PKG-' || EXTRACT(EPOCH FROM now())::TEXT || '-' || SUBSTRING(gen_random_uuid()::TEXT, 1, 8),
  sender_id UUID REFERENCES auth.users(id),
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_city TEXT NOT NULL,
  pickup_postal_code TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_postal_code TEXT NOT NULL,
  package_type TEXT NOT NULL,
  weight_kg DECIMAL(5,2),
  dimensions TEXT,
  value_pounds DECIMAL(10,2),
  service_type TEXT NOT NULL CHECK (service_type IN ('same_day', 'standard', 'bulk', 'international', 'fragile', 'emergency')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'pickup_scheduled', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled')),
  price_pounds DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  pickup_date TIMESTAMP WITH TIME ZONE,
  delivery_date TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Create policies for packages
CREATE POLICY "Users can view own packages" ON public.packages
  FOR SELECT USING (auth.uid() = sender_id);

CREATE POLICY "Users can create packages" ON public.packages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own packages" ON public.packages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Create package tracking events table
CREATE TABLE public.package_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.package_events ENABLE ROW LEVEL SECURITY;

-- Create policy for package events (read-only for package owners)
CREATE POLICY "Package owners can view events" ON public.package_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.packages 
      WHERE packages.id = package_events.package_id 
      AND packages.sender_id = auth.uid()
    )
  );

-- Create trigger for profile updates
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to track packages publicly (no auth required)
CREATE OR REPLACE FUNCTION public.track_package(tracking_num TEXT)
RETURNS TABLE (
  id UUID,
  tracking_number TEXT,
  status TEXT,
  recipient_name TEXT,
  delivery_city TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  pickup_date TIMESTAMP WITH TIME ZONE,
  delivery_date TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;