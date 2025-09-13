import { Package, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8" />
              <span className="text-2xl font-bold">SwiftCourier</span>
            </div>
            <p className="text-primary-foreground/80">
              Your trusted partner for fast, reliable courier services across the UK and beyond.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li className="hover:text-secondary cursor-pointer transition-colors">Same Day Delivery</li>
              <li className="hover:text-secondary cursor-pointer transition-colors">Standard Delivery</li>
              <li className="hover:text-secondary cursor-pointer transition-colors">International Shipping</li>
              <li className="hover:text-secondary cursor-pointer transition-colors">Bulk Delivery</li>
              <li className="hover:text-secondary cursor-pointer transition-colors">Special Handling</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li className="hover:text-secondary cursor-pointer transition-colors">Track Package</li>
              <li className="hover:text-secondary cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-secondary cursor-pointer transition-colors">Shipping Guide</li>
              <li className="hover:text-secondary cursor-pointer transition-colors">Returns</li>
              <li className="hover:text-secondary cursor-pointer transition-colors">Insurance Claims</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" />
                <span>0800 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span>support@swiftcourier.uk</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4" />
                <span>London, Manchester, Birmingham</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 SwiftCourier. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;