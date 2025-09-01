import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, TrendingUp, Heart, Shield } from "lucide-react";
import type { PortfolioAnalysis } from "@shared/schema";

interface PortfolioOverviewProps {
  analysis?: PortfolioAnalysis;
  isLoading: boolean;
}

export default function PortfolioOverview({ analysis, isLoading }: PortfolioOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-slate-500">
              <p>No portfolio data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getHealthColor = (score: string) => {
    if (score.startsWith('A')) return 'text-green-600';
    if (score.startsWith('B')) return 'text-slate-600';
    if (score.startsWith('C')) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Total Portfolio Value */}
      <Card className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-300/50 dark:hover:border-slate-600/50">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">Total Portfolio Value</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent group-hover:from-slate-800 group-hover:to-slate-600 dark:group-hover:from-slate-200 dark:group-hover:to-slate-400 transition-all duration-300" data-testid="text-total-value">
                {formatCurrency(analysis.totalValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 group-hover:from-amber-100 group-hover:to-yellow-200 dark:group-hover:from-amber-700 dark:group-hover:to-yellow-600 rounded-xl flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
              <Wallet className="text-slate-700 dark:text-slate-300 group-hover:text-amber-700 dark:group-hover:text-amber-300 w-6 h-6 transition-colors duration-300" />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-sm font-medium ${analysis.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.totalReturn >= 0 ? '↗' : '↘'} {formatPercent(analysis.totalReturnPercent)}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">vs. cost basis</span>
          </div>
        </CardContent>
      </Card>

      {/* Today's Change */}
      <Card className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-300/50 dark:hover:border-slate-600/50">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">Today's Change</p>
              <p className={`text-3xl font-bold ${analysis.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="text-daily-change">
                {formatCurrency(analysis.dailyChange)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 ${
              analysis.dailyChange >= 0 ? 'bg-green-50 group-hover:bg-green-100 dark:bg-green-900/50 dark:group-hover:bg-green-800/50' : 'bg-red-50 group-hover:bg-red-100 dark:bg-red-900/50 dark:group-hover:bg-red-800/50'
            }`}>
              <TrendingUp className={`w-6 h-6 ${analysis.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-sm font-medium ${analysis.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.dailyChange >= 0 ? '↗' : '↘'} {formatPercent(analysis.dailyChangePercent)}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">from yesterday</span>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Health */}
      <Card className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-300/50 dark:hover:border-slate-600/50">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">Portfolio Health</p>
              <p className={`text-3xl font-bold ${getHealthColor(analysis.healthScore)}`} data-testid="text-health-score">
                {analysis.healthScore}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 dark:bg-green-900/50 dark:group-hover:bg-green-800/50 rounded-xl flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
              <Heart className="text-green-600 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
              {analysis.sectorAllocation.length >= 3 ? 'Good Diversification' : 'Needs Diversification'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Risk Level */}
      <Card className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-300/50 dark:hover:border-slate-600/50">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">Risk Level</p>
              <p className={`text-3xl font-bold ${getRiskColor(analysis.riskLevel).split(' ')[0]}`} data-testid="text-risk-level">
                {analysis.riskLevel}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 ${getRiskColor(analysis.riskLevel).split(' ')[1]}`}>
              <Shield className={`w-6 h-6 ${getRiskColor(analysis.riskLevel).split(' ')[0]}`} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    analysis.riskLevel === 'Low' ? 'bg-green-600' :
                    analysis.riskLevel === 'Medium' ? 'bg-amber-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${(analysis.riskScore / 10) * 100}%` }}
                ></div>
              </div>
              <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">{analysis.riskScore.toFixed(1)}/10</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
