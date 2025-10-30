-- Fix get_nearby_packages function to verify driver role
-- This prevents unauthorized users from accessing sensitive package data

CREATE OR REPLACE FUNCTION public.get_nearby_packages(
  driver_lat numeric, 
  driver_lon numeric, 
  max_distance_km numeric DEFAULT 50
)
RETURNS TABLE(
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
SET search_path = 'public'
AS $$
BEGIN
  -- Verify caller is a driver - CRITICAL SECURITY CHECK
  IF NOT has_role(auth.uid(), 'driver') THEN
    RAISE EXCEPTION 'Access denied: driver role required';
  END IF;
  
  -- Only return packages if caller is verified driver
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