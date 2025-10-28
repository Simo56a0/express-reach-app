-- Fix search path for calculate_distance function
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 numeric, lon1 numeric, 
  lat2 numeric, lon2 numeric
)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
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