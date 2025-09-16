-- Add driver-related columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type text DEFAULT 'customer' CHECK (user_type IN ('customer', 'driver', 'admin'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS driver_license text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vehicle_type text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_available boolean DEFAULT false;

-- Add driver assignment to packages
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS driver_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS assigned_at timestamp with time zone;

-- Create chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    package_id uuid NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    is_read boolean DEFAULT false
);

-- Enable RLS on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat messages policies
CREATE POLICY "Users can view messages for their packages" ON public.chat_messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.packages p 
        WHERE p.id = package_id 
        AND (p.sender_id = auth.uid() OR p.driver_id = auth.uid())
    )
);

CREATE POLICY "Users can send messages for their packages" ON public.chat_messages
FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.packages p 
        WHERE p.id = package_id 
        AND (p.sender_id = auth.uid() OR p.driver_id = auth.uid())
    )
);

-- Update packages policies to allow drivers to view assigned packages
CREATE POLICY "Drivers can view assigned packages" ON public.packages
FOR SELECT USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can update assigned packages" ON public.packages
FOR UPDATE USING (auth.uid() = driver_id);

-- Create FAQ table
CREATE TABLE IF NOT EXISTS public.faqs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    category text NOT NULL DEFAULT 'general',
    user_type text NOT NULL DEFAULT 'customer' CHECK (user_type IN ('customer', 'driver', 'both')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on FAQs (public read access)
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQs are publicly readable" ON public.faqs
FOR SELECT USING (true);

-- Insert some sample FAQs
INSERT INTO public.faqs (question, answer, category, user_type) VALUES
('How do I track my package?', 'You can track your package using the tracking number provided when you booked the delivery. Simply enter it on our tracking page.', 'tracking', 'customer'),
('What are your delivery hours?', 'We deliver Monday to Friday 8 AM to 8 PM, and Saturday 9 AM to 5 PM. Sunday deliveries are available for express services.', 'delivery', 'customer'),
('How do I become a driver?', 'To become a driver, sign up for an account and select "Driver" as your account type. You will need to provide your driving license and vehicle information.', 'registration', 'driver'),
('How do I accept delivery jobs?', 'Available jobs are shown in your driver dashboard. Click "Accept Job" to take on a delivery. Make sure you are available and ready to complete the delivery.', 'jobs', 'driver'),
('What if a customer is not available?', 'If a customer is not available, use the chat feature to contact them. If still unreachable, follow the failed delivery protocol in your driver handbook.', 'delivery', 'driver'),
('Can I cancel a booking?', 'Yes, you can cancel a booking up to 2 hours before the pickup time. Cancellations made less than 2 hours before pickup may incur fees.', 'booking', 'customer');

-- Add trigger for updating FAQs updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add some package events types for driver actions
INSERT INTO public.package_events (package_id, event_type, description, location)
SELECT id, 'assigned', 'Package assigned to driver', delivery_city
FROM public.packages 
WHERE driver_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.package_events pe 
    WHERE pe.package_id = packages.id AND pe.event_type = 'assigned'
);