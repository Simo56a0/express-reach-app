import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Package, Truck, MapPin, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: Clock,
    title: "Same Day Delivery",
    description: "Get your packages delivered within hours in major UK cities",
    features: ["Express pickup", "Real-time tracking", "SMS notifications"],
    price: "From £12.99"
  },
  {
    icon: Package,
    title: "Standard Delivery",
    description: "Reliable next-day delivery across the UK",
    features: ["48-hour guarantee", "Package insurance", "Proof of delivery"],
    price: "From £4.99"
  },
  {
    icon: Truck,
    title: "Bulk Delivery",
    description: "Perfect for businesses with multiple packages",
    features: ["Volume discounts", "Scheduled pickups", "Account management"],
    price: "Custom pricing"
  },
  {
    icon: MapPin,
    title: "International",
    description: "Worldwide shipping with customs handling",
    features: ["Global network", "Customs clearance", "Door-to-door"],
    price: "From £24.99"
  },
  {
    icon: Shield,
    title: "Fragile & Special",
    description: "Specialized handling for delicate items",
    features: ["Special packaging", "Temperature control", "High-value insurance"],
    price: "From £19.99"
  },
  {
    icon: Zap,
    title: "Emergency Rush",
    description: "Ultra-fast delivery for urgent packages",
    features: ["2-hour delivery", "Priority handling", "Direct courier"],
    price: "From £29.99"
  }
];

const ServicesSection = () => {
  const navigate = useNavigate();
  
  return (
    <section id="services" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Delivery Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of flexible delivery options to meet your specific needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-normal group">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <p className="text-primary font-semibold">{service.price}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={() => navigate('/book')}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => navigate('/services')}
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;