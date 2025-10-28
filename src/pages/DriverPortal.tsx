import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Package, Clock, MapPin, Phone, ShieldX, Navigation } from 'lucide-react';
import PackageChat from '@/components/PackageChat';
import MultiStopRoute from '@/components/MultiStopRoute';

interface Package {
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
  pickup_date: string;
  delivery_date: string;
  assigned_at: string;
  sender_id: string;
}

interface NearbyPackage {
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
  pickup_date: string;
  delivery_date: string;
  distance_km: number;
}

const DriverPortal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [assignedJobs, setAssignedJobs] = useState<Package[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDriver, setIsDriver] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyJobs, setNearbyJobs] = useState<NearbyPackage[]>([]);

  useEffect(() => {
    if (user) {
      checkDriverAccess();
      getDriverLocation();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const getDriverLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDriverLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location access denied",
            description: "Enable location to see nearby jobs",
            variant: "destructive"
          });
        }
      );
    }
  };

  const checkDriverAccess = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        navigate('/');
        return;
      }

      if (profile?.user_type === 'driver') {
        setIsDriver(true);
        fetchJobs();
      } else {
        setIsDriver(false);
      }
    } catch (error) {
      console.error('Error checking driver access:', error);
      navigate('/');
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      // Fetch assigned jobs
      const { data: assigned, error: assignedError } = await supabase
        .from('packages')
        .select('*')
        .eq('driver_id', user?.id)
        .in('status', ['picked_up', 'in_transit', 'assigned']);

      if (assignedError) throw assignedError;

      // Fetch all available jobs
      const { data: available, error: availableError } = await supabase
        .from('packages')
        .select('*')
        .is('driver_id', null)
        .eq('status', 'pending');

      if (availableError) throw availableError;

      setAssignedJobs(assigned || []);
      setAvailableJobs(available || []);

      // Fetch nearby jobs if location is available
      if (driverLocation) {
        const { data: nearby, error: nearbyError } = await supabase.rpc('get_nearby_packages', {
          driver_lat: driverLocation.lat,
          driver_lon: driverLocation.lng,
          max_distance_km: 50
        });

        if (!nearbyError && nearby) {
          setNearbyJobs(nearby);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptJob = async (packageId: string) => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ 
          driver_id: user?.id, 
          status: 'assigned',
          assigned_at: new Date().toISOString()
        })
        .eq('id', packageId);

      if (error) throw error;

      // Add package event
      await supabase
        .from('package_events')
        .insert({
          package_id: packageId,
          event_type: 'assigned',
          description: 'Package assigned to driver'
        });

      toast({
        title: "Success",
        description: "Job accepted successfully!",
      });

      fetchJobs();
    } catch (error) {
      console.error('Error accepting job:', error);
      toast({
        title: "Error",
        description: "Failed to accept job",
        variant: "destructive",
      });
    }
  };

  const updateJobStatus = async (packageId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ status: newStatus })
        .eq('id', packageId);

      if (error) throw error;

      // Add package event
      await supabase
        .from('package_events')
        .insert({
          package_id: packageId,
          event_type: newStatus,
          description: `Package ${newStatus.replace('_', ' ')}`
        });

      toast({
        title: "Success",
        description: `Package status updated to ${newStatus.replace('_', ' ')}`,
      });

      fetchJobs();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
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
      default: return 'bg-gray-500';
    }
  };

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <div>Loading driver portal...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isDriver) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="py-8 text-center">
              <ShieldX className="mx-auto h-16 w-16 text-destructive mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                This portal is only accessible to registered drivers.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Driver Portal</h1>
          <p className="text-muted-foreground">Manage your deliveries and communicate with customers</p>
        </div>

        <Tabs defaultValue="assigned" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assigned">My Jobs ({assignedJobs.length})</TabsTrigger>
            <TabsTrigger value="available">Available Jobs</TabsTrigger>
            <TabsTrigger value="route">Multi-Stop Route</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="assigned" className="space-y-4">
            {assignedJobs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No assigned jobs at the moment</p>
                </CardContent>
              </Card>
            ) : (
              assignedJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.tracking_number}</CardTitle>
                        <p className="text-sm text-muted-foreground">{job.recipient_name}</p>
                      </div>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Pickup: {job.pickup_address}, {job.pickup_city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Delivery: {job.delivery_address}, {job.delivery_city}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{job.recipient_phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{job.package_type} ({job.weight_kg}kg)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {job.status === 'assigned' && (
                        <Button onClick={() => updateJobStatus(job.id, 'picked_up')} size="sm">
                          Mark as Picked Up
                        </Button>
                      )}
                      {job.status === 'picked_up' && (
                        <Button onClick={() => updateJobStatus(job.id, 'in_transit')} size="sm">
                          Mark as In Transit
                        </Button>
                      )}
                      {job.status === 'in_transit' && (
                        <Button onClick={() => updateJobStatus(job.id, 'delivered')} size="sm">
                          Mark as Delivered
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedPackage(job)}
                      >
                        Chat with Customer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="nearby-filter"
                  checked={showNearbyOnly}
                  onCheckedChange={setShowNearbyOnly}
                  disabled={!driverLocation}
                />
                <Label htmlFor="nearby-filter" className="cursor-pointer">
                  Show nearby jobs only (within 50km)
                </Label>
              </div>
              {driverLocation && showNearbyOnly && (
                <Badge variant="outline">
                  {nearbyJobs.length} nearby jobs
                </Badge>
              )}
            </div>

            {(showNearbyOnly ? nearbyJobs : availableJobs).length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {showNearbyOnly ? 'No nearby jobs found' : 'No available jobs at the moment'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              (showNearbyOnly ? nearbyJobs : availableJobs).map((job) => {
                const isNearbyJob = 'distance_km' in job;
                return (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.tracking_number}</CardTitle>
                          <p className="text-sm text-muted-foreground">{job.recipient_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-green-500">£{job.price_pounds}</Badge>
                          {isNearbyJob && (
                            <Badge variant="outline">{(job as NearbyPackage).distance_km.toFixed(1)} km away</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Pickup: {job.pickup_address}, {job.pickup_city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Delivery: {job.delivery_address}, {job.delivery_city}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Pickup: {new Date(job.pickup_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{job.package_type} ({job.weight_kg}kg)</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={() => acceptJob(job.id)} className="w-full">
                      Accept Job
                    </Button>
                  </CardContent>
                </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="route">
            {assignedJobs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Navigation className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Accept multiple jobs to plan your route</p>
                </CardContent>
              </Card>
            ) : (
              <MultiStopRoute 
                stops={assignedJobs.map((job, index) => ({
                  id: job.id,
                  tracking_number: job.tracking_number,
                  recipient_name: job.recipient_name,
                  recipient_phone: job.recipient_phone,
                  delivery_address: job.delivery_address,
                  delivery_city: job.delivery_city,
                  order: index + 1
                }))}
              />
            )}
          </TabsContent>

          <TabsContent value="chat">
            {selectedPackage ? (
              <PackageChat 
                packageData={selectedPackage} 
                onBack={() => setSelectedPackage(null)} 
              />
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Select a job from "My Jobs" to start chatting with the customer</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default DriverPortal;