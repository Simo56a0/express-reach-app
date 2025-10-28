import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Phone } from 'lucide-react';

interface RouteStop {
  id: string;
  tracking_number: string;
  recipient_name: string;
  recipient_phone: string;
  delivery_address: string;
  delivery_city: string;
  distance_km?: number;
  order: number;
}

interface MultiStopRouteProps {
  stops: RouteStop[];
}

const MultiStopRoute = ({ stops }: MultiStopRouteProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Multi-Stop Route ({stops.length} stops)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stops.map((stop, index) => (
            <div
              key={stop.id}
              className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
            >
              <div className="flex-shrink-0">
                <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center">
                  {index + 1}
                </Badge>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{stop.recipient_name}</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {stop.tracking_number}
                    </p>
                  </div>
                  {stop.distance_km !== undefined && (
                    <Badge variant="secondary">
                      {stop.distance_km.toFixed(1)} km
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{stop.delivery_address}, {stop.delivery_city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{stop.recipient_phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiStopRoute;
