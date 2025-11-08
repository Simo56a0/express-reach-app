import { Button } from "@/components/ui/button";
import { Package, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">SwiftCourier</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {user && userRole === 'driver' ? (
                <NavigationMenuItem>
                  <Link to="/driver-portal">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Driver Portal
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ) : (
                <>
                  <NavigationMenuItem>
                    <Link to="/services">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Services
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/pricing">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Pricing
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/track">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Track Package
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/faq">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        FAQ
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {userRole !== 'driver' && (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/my-bookings')}>
                      My Bookings
                    </Button>
                    <Button variant="ghost" onClick={() => navigate('/book')}>
                      Book Delivery
                    </Button>
                  </>
                )}
                <Button variant="ghost" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/book')}>
                  Book Now
                </Button>
                <Button variant="outline" onClick={() => navigate('/auth')}>Customer Sign In</Button>
                <Button onClick={() => navigate('/driver-auth')}>Driver Sign In</Button>
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
              {user && userRole === 'driver' ? (
                <button onClick={() => navigate('/driver-portal')} className="text-foreground hover:text-primary transition-colors text-left">
                  Driver Portal
                </button>
              ) : (
                <>
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
                </>
              )}
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <>
                    {userRole !== 'driver' && (
                      <>
                        <Button variant="ghost" onClick={() => navigate('/my-bookings')}>
                          My Bookings
                        </Button>
                        <Button variant="ghost" onClick={() => navigate('/book')}>
                          Book Delivery
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" onClick={signOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/book')}>Book Now</Button>
                    <Button variant="outline" onClick={() => navigate('/auth')}>Customer Sign In</Button>
                    <Button onClick={() => navigate('/driver-auth')}>Driver Sign In</Button>
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