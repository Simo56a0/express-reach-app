import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, Truck, MapPin, Shield, Zap, Phone, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const services = [
  {
    icon: Clock,
    title: "Same Day Delivery",
    description: "Get your packages delivered within hours in major UK cities",
    features: ["Express pickup", "Real-time tracking", "SMS notifications", "2-6 hour delivery"],
    price: "From £12.99",
    popular: true
  },
  {
    icon: Package,
    title: "Standard Delivery",
    description: "Reliable next-day delivery across the UK",
    features: ["48-hour guarantee", "Package insurance", "Proof of delivery", "Email updates"],
    price: "From £4.99",
    popular: false
  },
  {
    icon: Truck,
    title: "Bulk Delivery",
    description: "Perfect for businesses with multiple packages",
    features: ["Volume discounts", "Scheduled pickups", "Account management", "Monthly invoicing"],
    price: "Custom pricing",
    popular: false
  },
  {
    icon: MapPin,
    title: "International",
    description: "Worldwide shipping with customs handling",
    features: ["Global network", "Customs clearance", "Door-to-door", "Insurance included"],
    price: "From £24.99",
    popular: false
  },
  {
    icon: Shield,
    title: "Fragile & Special",
    description: "Specialized handling for delicate items",
    features: ["Special packaging", "Temperature control", "High-value insurance", "White-glove service"],
    price: "From £19.99",
    popular: false
  },
  {
    icon: Zap,
    title: "Emergency Rush",
    description: "Ultra-fast delivery for urgent packages",
    features: ["2-hour delivery", "Priority handling", "Direct courier", "24/7 support"],
    price: "From £29.99",
    popular: false
  }
];

const features = [
  {
    icon: Phone,
    title: "24/7 Customer Support",
    description: "Round-the-clock assistance for all your delivery needs"
  },
  {
    icon: Mail,
    title: "Real-time Updates",
    description: "Get instant notifications via SMS and email about your package status"
  },
  {
    icon: Globe,
    title: "Nationwide Coverage",
    description: "Serving all major cities and remote areas across the UK"
  }
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Our Delivery Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              From same-day express to international shipping, we offer flexible delivery solutions 
              tailored to meet your specific needs with guaranteed reliability and competitive pricing.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/book')}
              className="text-lg px-8 py-6"
            >
              Book Delivery Now
            </Button>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-normal group relative">
                  {service.popular && (
                    <Badge className="absolute -top-2 right-4 bg-primary">
                      Most Popular
                    </Badge>
                  )}
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
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose SwiftCourier?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We go above and beyond to ensure your packages are delivered safely, quickly, and reliably
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Ship?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who trust us with their deliveries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/book')}
                className="text-lg px-8 py-6"
              >
                Book Delivery
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/track')}
                className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Track Package
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;