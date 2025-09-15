-- Fix the handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix the track_package function with proper search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;