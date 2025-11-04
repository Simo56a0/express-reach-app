import { z } from 'zod';

// UK phone regex - supports various formats
const ukPhoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;

// UK postcode regex
const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;

export const bookingSchema = z.object({
  recipientName: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  recipientPhone: z.string()
    .trim()
    .regex(ukPhoneRegex, 'Please enter a valid UK phone number (e.g., 07123456789 or +44 7123 456 789)'),
  guestEmail: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  pickupAddress: z.string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  pickupCity: z.string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  pickupPostalCode: z.string()
    .trim()
    .regex(ukPostcodeRegex, 'Please enter a valid UK postcode (e.g., SW1A 1AA)'),
  deliveryAddress: z.string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  deliveryCity: z.string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  deliveryPostalCode: z.string()
    .trim()
    .regex(ukPostcodeRegex, 'Please enter a valid UK postcode (e.g., SW1A 1AA)'),
  packageType: z.string()
    .trim()
    .min(2, 'Package type must be at least 2 characters')
    .max(100, 'Package type must be less than 100 characters'),
  weight: z.string()
    .optional()
    .refine((val) => !val || (parseFloat(val) > 0 && parseFloat(val) <= 1000), {
      message: 'Weight must be between 0 and 1000 kg'
    }),
  value: z.string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 1000000), {
      message: 'Value must be between £0 and £1,000,000'
    }),
  dimensions: z.string()
    .max(50, 'Dimensions must be less than 50 characters')
    .optional(),
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  serviceType: z.string().min(1, 'Please select a service type')
});

export const editBookingSchema = z.object({
  recipientName: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  recipientPhone: z.string()
    .trim()
    .regex(ukPhoneRegex, 'Please enter a valid UK phone number (e.g., 07123456789 or +44 7123 456 789)'),
  deliveryAddress: z.string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  deliveryCity: z.string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  packageType: z.string()
    .trim()
    .min(2, 'Package type must be at least 2 characters')
    .max(100, 'Package type must be less than 100 characters'),
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
});

export const messageSchema = z.object({
  message: z.string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters')
});
