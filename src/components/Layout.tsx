import { Link, useLocation } from "react-router-dom";
import { Radio, Map, BarChart3, Database, Brain, Bird } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Bird },
  { path: "/risk-map", label: "Risk Map", icon: Map },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/research", label: "Research Data", icon: Database },
  { path: "/prediction", label: "Prediction", icon: Brain },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Radio className="h-5 w-5 text-primary" />
            <span className="font-heading font-semibold text-foreground tracking-tight">
              Avian RF Shield
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
