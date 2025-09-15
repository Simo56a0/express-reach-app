import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Package, MapPin, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Book = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const serviceTypes = [
    { value: 'same_day', label: 'Same Day Delivery', price: 12.99 },
    { value: 'standard', label: 'Standard Delivery', price: 4.99 },
    { value: 'bulk', label: 'Bulk Delivery', price: 0 },
    { value: 'international', label: 'International', price: 24.99 },
    { value: 'fragile', label: 'Fragile & Special', price: 19.99 },
    { value: 'emergency', label: 'Emergency Rush', price: 29.99 }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const serviceType = formData.get('serviceType') as string;
    const selectedService = serviceTypes.find(s => s.value === serviceType);

    try {
      const { data, error } = await supabase
        .from('packages')
        .insert({
          sender_id: user?.id,
          recipient_name: formData.get('recipientName') as string,
          recipient_phone: formData.get('recipientPhone') as string,
          pickup_address: formData.get('pickupAddress') as string,
          pickup_city: formData.get('pickupCity') as string,
          pickup_postal_code: formData.get('pickupPostalCode') as string,
          delivery_address: formData.get('deliveryAddress') as string,
          delivery_city: formData.get('deliveryCity') as string,
          delivery_postal_code: formData.get('deliveryPostalCode') as string,
          package_type: formData.get('packageType') as string,
          weight_kg: parseFloat(formData.get('weight') as string) || null,
          dimensions: formData.get('dimensions') as string,
          value_pounds: parseFloat(formData.get('value') as string) || null,
          service_type: serviceType,
          price_pounds: selectedService?.price || 0,
          notes: formData.get('notes') as string
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking confirmed!",
        description: `Your package has been booked. Tracking number: ${data.tracking_number}`
      });

      navigate(`/track?number=${data.tracking_number}`);
    } catch (error) {
      toast({
        title: "Error creating booking",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold">Book a Delivery</h1>
            <p className="text-muted-foreground">
              Fill out the details below to schedule your package delivery
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Pickup Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupAddress">Pickup Address</Label>
                    <Input id="pickupAddress" name="pickupAddress" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupCity">City</Label>
                    <Input id="pickupCity" name="pickupCity" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupPostalCode">Postal Code</Label>
                    <Input id="pickupPostalCode" name="pickupPostalCode" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Delivery Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input id="recipientName" name="recipientName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientPhone">Recipient Phone</Label>
                    <Input id="recipientPhone" name="recipientPhone" type="tel" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Input id="deliveryAddress" name="deliveryAddress" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryCity">City</Label>
                    <Input id="deliveryCity" name="deliveryCity" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryPostalCode">Postal Code</Label>
                    <Input id="deliveryPostalCode" name="deliveryPostalCode" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Package Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageType">Package Type</Label>
                    <Input id="packageType" name="packageType" placeholder="e.g., Documents, Electronics" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" name="weight" type="number" step="0.1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions (L×W×H cm)</Label>
                    <Input id="dimensions" name="dimensions" placeholder="e.g., 30x20x10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Declared Value (£)</Label>
                    <Input id="value" name="value" type="number" step="0.01" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Instructions</Label>
                  <Textarea id="notes" name="notes" placeholder="Any special handling instructions..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Service Type</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Select Service</Label>
                  <Select name="serviceType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose delivery service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label} - {service.price > 0 ? `£${service.price}` : 'Custom pricing'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Booking..." : "Book Delivery"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Book;