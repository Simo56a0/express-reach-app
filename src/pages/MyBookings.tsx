import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Package, Edit, XCircle, MapPin, Calendar } from 'lucide-react';
import { editBookingSchema } from '@/lib/validationSchemas';

interface PackageBooking {
  id: string;
  tracking_number: string;
  status: string;
  recipient_name: string;
  recipient_phone: string;
  pickup_address: string;
  delivery_address: string;
  pickup_city: string;
  delivery_city: string;
  package_type: string;
  weight_kg: number;
  price_pounds: number;
  created_at: string;
  driver_id: string | null;
}

const MyBookings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<PackageBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<PackageBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchBookings();
    }
  }, [user, loading, navigate]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('sender_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPackage) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const formValues = {
      recipientName: formData.get('recipientName') as string,
      recipientPhone: formData.get('recipientPhone') as string,
      deliveryAddress: formData.get('deliveryAddress') as string,
      deliveryCity: formData.get('deliveryCity') as string,
      packageType: formData.get('packageType') as string,
      notes: formData.get('notes') as string
    };

    // Validate form data
    const validation = editBookingSchema.safeParse(formValues);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('packages')
        .update({
          recipient_name: formValues.recipientName,
          recipient_phone: formValues.recipientPhone,
          delivery_address: formValues.deliveryAddress,
          delivery_city: formValues.deliveryCity,
          package_type: formValues.packageType,
          notes: formValues.notes
        })
        .eq('id', editingPackage.id);

      if (error) throw error;

      toast({
        title: "Booking updated",
        description: "Your booking has been updated successfully",
      });

      setEditingPackage(null);
      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const { error } = await supabase
        .from('packages')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled",
      });

      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'assigned': return 'bg-blue-500';
      case 'picked_up': return 'bg-orange-500';
      case 'in_transit': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <div>Loading your bookings...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">
              View and manage your delivery bookings
            </p>
          </div>

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">You don't have any bookings yet</p>
                <Button onClick={() => navigate('/book')}>
                  Book a Delivery
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{booking.tracking_number}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">From:</span>
                        </div>
                        <p className="text-sm">{booking.pickup_address}, {booking.pickup_city}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">To:</span>
                        </div>
                        <p className="text-sm">{booking.delivery_address}, {booking.delivery_city}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Package:</span>
                        </div>
                        <p className="text-sm">{booking.package_type} ({booking.weight_kg}kg)</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Price:</span>
                        </div>
                        <p className="text-sm">£{booking.price_pounds}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/track?number=${booking.tracking_number}`)}
                      >
                        Track Package
                      </Button>
                      
                      {!booking.driver_id && booking.status === 'pending' && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingPackage(booking)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Booking</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleEdit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="recipientName">Recipient Name</Label>
                                    <Input
                                      id="recipientName"
                                      name="recipientName"
                                      defaultValue={editingPackage?.recipient_name}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="recipientPhone">Recipient Phone</Label>
                                    <Input
                                      id="recipientPhone"
                                      name="recipientPhone"
                                      defaultValue={editingPackage?.recipient_phone}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                                    <Input
                                      id="deliveryAddress"
                                      name="deliveryAddress"
                                      defaultValue={editingPackage?.delivery_address}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="deliveryCity">Delivery City</Label>
                                    <Input
                                      id="deliveryCity"
                                      name="deliveryCity"
                                      defaultValue={editingPackage?.delivery_city}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-2">
                                    <Label htmlFor="packageType">Package Type</Label>
                                    <Input
                                      id="packageType"
                                      name="packageType"
                                      defaultValue={editingPackage?.package_type}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-2">
                                    <Label htmlFor="notes">Special Instructions</Label>
                                    <Textarea id="notes" name="notes" />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingPackage(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancel(booking.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Booking
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;
