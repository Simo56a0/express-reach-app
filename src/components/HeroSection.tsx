import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Clock, Shield, Truck } from "lucide-react";
import heroImage from "@/assets/hero-courier.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-background py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Fast, Reliable{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Courier Services
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Get your packages delivered anywhere in the UK with our professional courier network. 
                Same-day delivery available in major cities.
              </p>
            </div>

            {/* Quick Tracking */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Track Your Package</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter tracking number..." 
                  className="flex-1"
                />
                <Button variant="default">
                  Track
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Book Delivery Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Same Day</p>
                <p className="text-xs text-muted-foreground">Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium">Insured</p>
                <p className="text-xs text-muted-foreground">Packages</p>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 text-secondary mx-auto mb-2" />
                <p className="text-sm font-medium">Real-time</p>
                <p className="text-xs text-muted-foreground">Tracking</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="Professional courier delivery service" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-primary rounded-lg opacity-20 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;