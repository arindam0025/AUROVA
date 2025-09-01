import { BarChart3, Briefcase, TrendingUp, Bell, Settings, User, DollarSign, Target, Activity } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { 
      name: "Dashboard", 
      href: "/", 
      icon: BarChart3,
      description: "Portfolio overview and key metrics"
    },
    { 
      name: "Portfolio", 
      href: "/portfolio", 
      icon: Briefcase,
      description: "Detailed holdings and performance",
      stats: "20 stocks"
    },
    { 
      name: "Analytics", 
      href: "/analytics", 
      icon: TrendingUp,
      description: "Advanced charts and insights",
      stats: "Real-time data"
    },
    { 
      name: "Alerts", 
      href: "/alerts", 
      icon: Bell,
      description: "Price alerts and notifications"
    },
    { 
      name: "Settings", 
      href: "/settings", 
      icon: Settings,
      description: "Account and preferences"
    },
  ];

  return (
  <aside className="w-64 min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 border-r border-slate-600/50 dark:border-slate-700/50 shadow-2xl rounded-r-3xl relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-slate-900/20 dark:from-blue-950/30 dark:via-transparent dark:to-slate-950/30"></div>
      
      <div className="relative z-10">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 transform hover:scale-110 hover:rotate-3 group-hover:shadow-2xl">
            <img src="/aurovva-logo.svg" alt="AUROVA" className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-100 via-white to-blue-100 dark:from-amber-200 dark:via-yellow-200 dark:to-amber-200 bg-clip-text text-transparent tracking-tight">
            AUROVA
          </h1>
        </div>
        
        {/* Portfolio Summary */}
        <div className="px-6 mb-6">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 dark:from-slate-800/80 dark:to-slate-700/80 rounded-2xl p-4 border border-slate-600/30 dark:border-slate-600/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300 dark:text-slate-200">Portfolio Value</p>
                <p className="text-lg font-bold text-white">$31,541.60</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-400">+12.8%</span>
              </div>
              <span className="text-xs text-slate-400">This month</span>
            </div>
          </div>
        </div>
        
        <nav className="px-4">
          <ul className="space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group/nav flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium text-base transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-slate-700 to-slate-600 dark:from-slate-700 dark:to-slate-600 text-white shadow-xl transform scale-105"
                        : "text-slate-100 dark:text-slate-200 hover:bg-gradient-to-r hover:from-slate-600/80 hover:to-slate-500/80 dark:hover:from-slate-700/80 dark:hover:to-slate-600/80 hover:text-white hover:transform hover:scale-105"
                    }`}
                    style={{ 
                      boxShadow: isActive ? '0 8px 32px rgba(59,130,246,0.25)' : undefined,
                      backdropFilter: isActive ? 'blur(20px)' : undefined
                    }}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600' 
                        : 'bg-slate-600/50 dark:bg-slate-700/50 group-hover/nav:bg-gradient-to-r group-hover/nav:from-amber-500/80 group-hover/nav:to-yellow-600/80'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        {item.stats && (
                          <span className="text-xs bg-slate-600/50 dark:bg-slate-700/50 px-2 py-1 rounded-lg text-slate-300 dark:text-slate-400">
                            {item.stats}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      <div className="relative z-10 p-6 border-t border-slate-600/50 dark:border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-3">
            <User className="text-slate-100 text-xl" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-100 dark:text-slate-200" data-testid="text-username">AUROVA User</p>
            <p className="text-xs text-slate-300 dark:text-slate-400">Premium Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
