import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Calculator, Clock, Package, Truck, MapPin, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const pricingTiers = [
  {
    icon: Package,
    name: "Standard Delivery",
    price: "£4.99",
    description: "Perfect for regular packages",
    features: [
      "Next day delivery",
      "Up to 5kg weight",
      "Basic tracking",
      "SMS notifications",
      "Package insurance up to £100"
    ],
    popular: false
  },
  {
    icon: Clock,
    name: "Same Day Express",
    price: "£12.99",
    description: "When time is critical",
    features: [
      "Same day delivery",
      "Up to 10kg weight",
      "Real-time tracking",
      "SMS & email notifications",
      "Package insurance up to £500",
      "Priority handling"
    ],
    popular: true
  },
  {
    icon: Zap,
    name: "Emergency Rush",
    price: "£29.99",
    description: "Ultra-fast 2-hour delivery",
    features: [
      "2-hour delivery guarantee",
      "Up to 15kg weight",
      "Live GPS tracking",
      "Instant notifications",
      "Package insurance up to £1000",
      "Direct courier assignment",
      "24/7 support"
    ],
    popular: false
  }
];

const additionalServices = [
  {
    icon: Truck,
    name: "Bulk Delivery",
    price: "Custom",
    description: "Volume discounts for businesses"
  },
  {
    icon: MapPin,
    name: "International Shipping",
    price: "From £24.99",
    description: "Worldwide delivery with customs handling"
  },
  {
    icon: Shield,
    name: "Fragile & Special Care",
    price: "From £19.99",
    description: "Specialized handling for delicate items"
  }
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <Calculator className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              No hidden fees, no surprises. Choose the delivery speed that works for you 
              with our competitive and transparent pricing structure.
            </p>
          </div>
        </section>

        {/* Main Pricing Tiers */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Choose Your Delivery Speed</h2>
              <p className="text-xl text-muted-foreground">
                All prices include VAT and basic package insurance
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-primary' : ''}`}>
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-6">
                    <tier.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="text-4xl font-bold text-primary my-4">{tier.price}</div>
                    <p className="text-muted-foreground">{tier.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-success flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={tier.popular ? "default" : "outline"}
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

        {/* Additional Services */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Additional Services</h2>
              <p className="text-xl text-muted-foreground">
                Specialized delivery options for unique requirements
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {additionalServices.map((service, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <service.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <Button variant="outline" onClick={() => navigate('/book')}>
                      Get Quote
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl">Need a Custom Quote?</CardTitle>
                  <p className="text-muted-foreground">
                    For bulk shipments, recurring deliveries, or special requirements
                  </p>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">500+</div>
                      <div className="text-sm text-muted-foreground">Packages/month</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">15%</div>
                      <div className="text-sm text-muted-foreground">Volume discount</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">24/7</div>
                      <div className="text-sm text-muted-foreground">Priority support</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">API</div>
                      <div className="text-sm text-muted-foreground">Integration</div>
                    </div>
                  </div>
                  <Button size="lg" onClick={() => navigate('/book')}>
                    Get Custom Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's included in the base price?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All our prices include pickup, delivery, basic tracking, SMS notifications, 
                    and package insurance up to the stated value. No hidden fees.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do you calculate pricing for bulk deliveries?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Bulk pricing depends on volume, frequency, and distance. We offer significant 
                    discounts for regular customers and high-volume shipments. Contact us for a custom quote.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, debit cards, PayPal, and bank transfers. 
                    Business customers can also set up monthly invoicing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;