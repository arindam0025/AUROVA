import { BarChart3, Briefcase, TrendingUp, Bell, Settings, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3, current: location === "/" },
    { name: "Portfolio", href: "/portfolio", icon: Briefcase, current: false },
    { name: "Analytics", href: "/analytics", icon: TrendingUp, current: false },
    { name: "Alerts", href: "/alerts", icon: Bell, current: false },
    { name: "Settings", href: "/settings", icon: Settings, current: false },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="text-sidebar-primary-foreground text-sm" />
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">PortfolioIQ</h1>
        </div>
      </div>
      
      <nav className="px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                    item.current
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="text-muted-foreground text-sm" />
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground" data-testid="text-username">John Doe</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
