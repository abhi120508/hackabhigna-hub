import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
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

// Import the logo image (updated)
import logo1 from "@/assets/WhatsApp Image 2025-09-25 at 15.21.58_58f43034.jpg";

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
      const element = document.getElementById(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: path } });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between h-14 px-3">
        {/* Desktop Logo */}
        <button 
          onClick={() => {
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
            }
          }}
          className="hidden md:flex items-center ml-6"
        >
          <img
            src={logo1}
            alt="HackAbhigna Logo"
            className="h-10 w-auto object-contain"
          />
        </button>

        {/* Mobile Logo (left) */}
        <button 
          onClick={() => {
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
            }
          }}
          className="flex md:hidden items-center ml-2"
        >
          <img
            src={logo1}
            alt="HackAbhigna Logo"
            className="h-8 w-auto object-contain"
          />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 absolute right-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            if (item.path.startsWith("/")) {
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm md:text-base font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-200 hover:text-blue-900 hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            } else {
              return (
                <button
                  key={item.name}
                  onClick={() => handleScroll(item.path)}
                  className="flex items-center space-x-2 px-3 py-1 rounded-md text-sm md:text-base font-medium transition-colors text-gray-200 hover:text-blue-900 hover:bg-muted"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{item.name}</span>
                </button>
              );
            }
          })}
        </div>

        {/* Mobile Navigation (hamburger on right) */}
        <div className="md:hidden flex items-center space-x-3 ml-auto mr-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-3 mt-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  if (item.path.startsWith("/")) {
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors ${
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-gray-200 hover:text-blue-900 hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  } else {
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleScroll(item.path)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors text-gray-200 hover:text-blue-900 hover:bg-muted"
                      >
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
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
    </nav>
  );
}
