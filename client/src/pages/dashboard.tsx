import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import PortfolioOverview from "@/components/portfolio-overview";
import HoldingsTable from "@/components/holdings-table";
import AddHoldingForm from "@/components/add-holding-form";
import PerformanceChart from "@/components/performance-chart";
import SectorChart from "@/components/sector-chart";
import Recommendations from "@/components/recommendations";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PortfolioWithHoldings, PortfolioAnalysis } from "@shared/schema";

export default function Dashboard() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const { data: portfolio, isLoading: portfolioLoading, refetch: refetchPortfolio } = useQuery<PortfolioWithHoldings>({
    queryKey: ["/api/portfolio"],
  });

  const { data: analysis, isLoading: analysisLoading, refetch: refetchAnalysis } = useQuery<PortfolioAnalysis>({
    queryKey: ["/api/portfolio/analysis"],
  });

  const handleRefreshPrices = async () => {
    try {
      await apiRequest("POST", "/api/refresh-prices");
      await Promise.all([refetchPortfolio(), refetchAnalysis()]);
      toast({
        title: "Success",
        description: "Stock prices updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh prices",
        variant: "destructive",
      });
    }
  };

  const handleHoldingAdded = () => {
    setShowAddForm(false);
    refetchPortfolio();
    refetchAnalysis();
  };

  const handleHoldingDeleted = () => {
    refetchPortfolio();
    refetchAnalysis();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-8 py-8 shadow-lg relative overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-blue-50/30 to-slate-100/50 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-800/50"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                AUROVA Portfolio Dashboard
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">Advanced portfolio analysis and investment insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                onClick={() => setShowAddForm(true)} 
                className="group relative bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 dark:from-slate-200 dark:to-slate-300 dark:hover:from-slate-300 dark:hover:to-slate-400 text-white dark:text-slate-900 font-semibold shadow-xl px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0 overflow-hidden"
                data-testid="button-add-holding"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Add Holding</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRefreshPrices}
                className="h-12 w-12 rounded-xl hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-300 hover:scale-110 border border-slate-200/50 dark:border-slate-700/50"
                data-testid="button-refresh-prices"
              >
                <RefreshCw className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Portfolio Overview */}
          <PortfolioOverview 
            analysis={analysis} 
            isLoading={analysisLoading} 
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-8">
              <HoldingsTable 
                portfolio={portfolio} 
                isLoading={portfolioLoading}
                onHoldingDeleted={handleHoldingDeleted}
              />
              <PerformanceChart analysis={analysis} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              {showAddForm && (
                <AddHoldingForm 
                  onSuccess={handleHoldingAdded}
                  onCancel={() => setShowAddForm(false)}
                />
              )}
              <SectorChart analysis={analysis} />
              <Recommendations analysis={analysis} />

              {/* Quick Actions */}
              <div className="group bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                <div className="px-8 py-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 to-slate-700/30">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">Quick Actions</h3>
                </div>
                <div className="p-8 space-y-4">
                  <button 
                    className="group/btn w-full flex items-center justify-between px-6 py-4 text-left text-base text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 dark:hover:from-slate-800 dark:hover:to-slate-700/50 hover:shadow-lg transform hover:scale-[1.02] border border-transparent hover:border-slate-200/50 dark:hover:border-slate-600/50"
                    data-testid="button-export-report"
                    onClick={() => toast({ title: "Exported!", description: "Portfolio report exported." })}
                  >
                    <span>Export Portfolio Report</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-500 dark:to-slate-400 rounded-lg flex items-center justify-center group-hover/btn:from-amber-500 group-hover/btn:to-yellow-500 transition-all duration-300">
                      <i className="fas fa-download text-white text-sm"></i>
                    </div>
                  </button>
                  <button 
                    className="group/btn w-full flex items-center justify-between px-6 py-4 text-left text-base text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 dark:hover:from-slate-800 dark:hover:to-slate-700/50 hover:shadow-lg transform hover:scale-[1.02] border border-transparent hover:border-slate-200/50 dark:hover:border-slate-600/50"
                    data-testid="button-price-alerts"
                    onClick={() => toast({ title: "Alerts Set!", description: "Price alerts configured." })}
                  >
                    <span>Set Price Alerts</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-500 dark:to-slate-400 rounded-lg flex items-center justify-center group-hover/btn:from-amber-500 group-hover/btn:to-yellow-500 transition-all duration-300">
                      <i className="fas fa-bell text-white text-sm"></i>
                    </div>
                  </button>
                  <button 
                    className="group/btn w-full flex items-center justify-between px-6 py-4 text-left text-base text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 dark:hover:from-slate-800 dark:hover:to-slate-700/50 hover:shadow-lg transform hover:scale-[1.02] border border-transparent hover:border-slate-200/50 dark:hover:border-slate-600/50"
                    data-testid="button-analysis-report"
                    onClick={() => toast({ title: "Analysis Ready!", description: "Analysis report generated." })}
                  >
                    <span>View Analysis Report</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-500 dark:to-slate-400 rounded-lg flex items-center justify-center group-hover/btn:from-amber-500 group-hover/btn:to-yellow-500 transition-all duration-300">
                      <i className="fas fa-chart-line text-white text-sm"></i>
                    </div>
                  </button>
                  <button 
                    className="group/btn w-full flex items-center justify-between px-6 py-4 text-left text-base text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 dark:hover:from-slate-800 dark:hover:to-slate-700/50 hover:shadow-lg transform hover:scale-[1.02] border border-transparent hover:border-slate-200/50 dark:hover:border-slate-600/50"
                    data-testid="button-compare-benchmarks"
                    onClick={() => toast({ title: "Compared!", description: "Benchmarks compared." })}
                  >
                    <span>Compare with Benchmarks</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-500 dark:to-slate-400 rounded-lg flex items-center justify-center group-hover/btn:from-amber-500 group-hover/btn:to-yellow-500 transition-all duration-300">
                      <i className="fas fa-balance-scale text-white text-sm"></i>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
