-- Fix the handle_new_user trigger to handle existing records
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert or update profile
  INSERT INTO public.profiles (id, full_name, user_type, driver_license, vehicle_type)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer'),
    NEW.raw_user_meta_data->>'driver_license',
    NEW.raw_user_meta_data->>'vehicle_type'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    user_type = EXCLUDED.user_type,
    driver_license = EXCLUDED.driver_license,
    vehicle_type = EXCLUDED.vehicle_type;
  
  -- Insert user role based on user_type (ignore if already exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'user_type')::app_role, 'customer'::app_role)
  )
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$function$;