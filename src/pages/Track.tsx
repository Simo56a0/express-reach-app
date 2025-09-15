import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Package, Search, MapPin, Calendar, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PackageInfo {
  id: string;
  tracking_number: string;
  status: string;
  recipient_name: string;
  delivery_city: string;
  created_at: string;
  pickup_date: string | null;
  delivery_date: string | null;
  delivered_at: string | null;
}

const Track = () => {
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('number') || '');
  const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const trackPackage = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Please enter a tracking number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('track_package', {
        tracking_num: trackingNumber.trim()
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setPackageInfo(data[0]);
      } else {
        setPackageInfo(null);
        toast({
          title: "Package not found",
          description: "Please check your tracking number and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error tracking package",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success text-success-foreground';
      case 'out_for_delivery': return 'bg-warning text-warning-foreground';
      case 'in_transit': return 'bg-primary text-primary-foreground';
      case 'pickup_scheduled': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold">Track Your Package</h1>
            <p className="text-muted-foreground">
              Enter your tracking number to see real-time updates
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Package Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter tracking number (e.g., PKG-1234567890-abc12345)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && trackPackage()}
                />
                <Button onClick={trackPackage} disabled={isLoading}>
                  {isLoading ? "Tracking..." : "Track"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {packageInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Package Details</span>
                  <Badge className={getStatusColor(packageInfo.status)}>
                    {formatStatus(packageInfo.status)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>Tracking Number</span>
                    </div>
                    <p className="font-mono text-sm">{packageInfo.tracking_number}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Destination</span>
                    </div>
                    <p>{packageInfo.recipient_name} - {packageInfo.delivery_city}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Shipped Date</span>
                    </div>
                    <p>{new Date(packageInfo.created_at).toLocaleDateString()}</p>
                  </div>

                  {packageInfo.delivered_at && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Delivered</span>
                      </div>
                      <p>{new Date(packageInfo.delivered_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Delivery Timeline</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center space-x-2 ${
                      ['pending', 'pickup_scheduled', 'in_transit', 'out_for_delivery', 'delivered'].includes(packageInfo.status) 
                        ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                      <span className="text-sm">Package created</span>
                    </div>
                    
                    <div className={`flex items-center space-x-2 ${
                      ['pickup_scheduled', 'in_transit', 'out_for_delivery', 'delivered'].includes(packageInfo.status) 
                        ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                      <span className="text-sm">Pickup scheduled</span>
                    </div>
                    
                    <div className={`flex items-center space-x-2 ${
                      ['in_transit', 'out_for_delivery', 'delivered'].includes(packageInfo.status) 
                        ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                      <span className="text-sm">In transit</span>
                    </div>
                    
                    <div className={`flex items-center space-x-2 ${
                      ['out_for_delivery', 'delivered'].includes(packageInfo.status) 
                        ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                      <span className="text-sm">Out for delivery</span>
                    </div>
                    
                    <div className={`flex items-center space-x-2 ${
                      packageInfo.status === 'delivered' ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                      <span className="text-sm">Delivered</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Track;