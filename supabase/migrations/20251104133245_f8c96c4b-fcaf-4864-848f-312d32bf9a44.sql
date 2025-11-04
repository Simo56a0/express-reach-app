-- Fix existing driver users who have incorrect roles

-- First, update the profile if it exists or create it
INSERT INTO public.profiles (id, full_name, user_type, driver_license, vehicle_type)
SELECT 
  u.id,
  u.raw_user_meta_data->>'full_name',
  COALESCE(u.raw_user_meta_data->>'user_type', 'customer'),
  u.raw_user_meta_data->>'driver_license',
  u.raw_user_meta_data->>'vehicle_type'
FROM auth.users u
WHERE u.raw_user_meta_data->>'user_type' = 'driver'
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO UPDATE SET
  user_type = EXCLUDED.user_type,
  driver_license = EXCLUDED.driver_license,
  vehicle_type = EXCLUDED.vehicle_type;

-- Fix user_roles: Delete incorrect customer role and add driver role
DELETE FROM public.user_roles ur
USING auth.users u
WHERE ur.user_id = u.id
  AND u.raw_user_meta_data->>'user_type' = 'driver'
  AND ur.role = 'customer';

-- Insert driver role for users who signed up as drivers
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'driver'::app_role
FROM auth.users u
WHERE u.raw_user_meta_data->>'user_type' = 'driver'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = u.id AND ur.role = 'driver'
  )
ON CONFLICT (user_id, role) DO NOTHING;