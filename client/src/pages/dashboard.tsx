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
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Portfolio Dashboard</h2>
              <p className="text-sm text-muted-foreground">Monitor and analyze your investment performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                onClick={() => setShowAddForm(true)} 
                className="bg-primary hover:bg-primary/90"
                data-testid="button-add-holding"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Holding
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRefreshPrices}
                data-testid="button-refresh-prices"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Portfolio Overview */}
          <PortfolioOverview 
            analysis={analysis} 
            isLoading={analysisLoading} 
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              <HoldingsTable 
                portfolio={portfolio} 
                isLoading={portfolioLoading}
                onHoldingDeleted={handleHoldingDeleted}
              />
              <PerformanceChart analysis={analysis} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {showAddForm && (
                <AddHoldingForm 
                  onSuccess={handleHoldingAdded}
                  onCancel={() => setShowAddForm(false)}
                />
              )}
              
              <SectorChart analysis={analysis} />
              <Recommendations analysis={analysis} />
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  <button 
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    data-testid="button-export-report"
                  >
                    <span>Export Portfolio Report</span>
                    <i className="fas fa-download text-gray-400"></i>
                  </button>
                  <button 
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    data-testid="button-price-alerts"
                  >
                    <span>Set Price Alerts</span>
                    <i className="fas fa-bell text-gray-400"></i>
                  </button>
                  <button 
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    data-testid="button-analysis-report"
                  >
                    <span>View Analysis Report</span>
                    <i className="fas fa-chart-line text-gray-400"></i>
                  </button>
                  <button 
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    data-testid="button-compare-benchmarks"
                  >
                    <span>Compare with Benchmarks</span>
                    <i className="fas fa-balance-scale text-gray-400"></i>
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
