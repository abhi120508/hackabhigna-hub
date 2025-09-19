import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Code,
  Shield,
  QrCode,
  Scale,
  User,
  Users,
  FileText,
  Heart,
  Mail,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const publicNavItems = [
  { name: "Register", path: "registration", icon: Users },
  { name: "Brochure", path: "brochure", icon: FileText },
  { name: "About Us", path: "about-us", icon: Heart },
  { name: "Contact", path: "contact", icon: Mail },
];

const restrictedPages = ["/brochure", "/about-us", "/contact"];

const coordinatorNavItems = [
  { name: "Admin", path: "/admin", icon: Shield },
  { name: "QR Panel", path: "/qr-panel", icon: QrCode },
  { name: "Judge Panel", path: "/judge", icon: Scale },
  { name: "Participant", path: "/participant", icon: User },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navigation on admin, qr-panel, judge, participant pages
  const hideNavPaths = ["/admin", "/qr-panel", "/judge", "/participant"];
  if (hideNavPaths.includes(location.pathname)) {
    return null;
  }

  // Show public nav items on home page and register page, else coordinator nav items
  const isHomeOrRegister =
    location.pathname === "/" || location.pathname === "/register";
  const navItems = isHomeOrRegister ? publicNavItems : coordinatorNavItems;

  const handleScroll = (path: string) => {
    if (location.pathname === "/") {
      // Scroll to section on homepage
      const element = document.getElementById(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to homepage and scroll after navigation
      navigate("/", { state: { scrollTo: path } });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">HackAbhigna</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              if (item.path.startsWith("/")) {
                // Normal link for external pages
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              } else {
                // Scroll link for homepage sections
                return (
                  <button
                    key={item.name}
                    onClick={() => handleScroll(item.path)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              }
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    if (item.path.startsWith("/")) {
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    } else {
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            handleScroll(item.path);
                          }}
                          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </button>
                      );
                    }
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
