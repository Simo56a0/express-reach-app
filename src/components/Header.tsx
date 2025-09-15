import { Button } from "@/components/ui/button";
import { Package, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">SwiftCourier</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/services')} className="text-foreground hover:text-primary transition-colors">
              Services
            </button>
            <button onClick={() => navigate('/track')} className="text-foreground hover:text-primary transition-colors">
              Track Package
            </button>
            <button onClick={() => navigate('/pricing')} className="text-foreground hover:text-primary transition-colors">
              Pricing
            </button>
            <button onClick={() => navigate('/#contact')} className="text-foreground hover:text-primary transition-colors">
              Contact
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/book')}>
                  Book Delivery
                </Button>
                <Button variant="ghost" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
                <Button variant="hero" onClick={() => navigate('/auth')}>Get Started</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-4">
              <button onClick={() => navigate('/services')} className="text-foreground hover:text-primary transition-colors text-left">
                Services
              </button>
              <button onClick={() => navigate('/track')} className="text-foreground hover:text-primary transition-colors text-left">
                Track Package
              </button>
              <button onClick={() => navigate('/pricing')} className="text-foreground hover:text-primary transition-colors text-left">
                Pricing
              </button>
              <button onClick={() => navigate('/#contact')} className="text-foreground hover:text-primary transition-colors text-left">
                Contact
              </button>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/book')}>
                      Book Delivery
                    </Button>
                    <Button variant="ghost" onClick={signOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
                    <Button variant="hero" onClick={() => navigate('/auth')}>Get Started</Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;