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
            <div className="text-center text-gray-500">
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
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthColor = (score: string) => {
    if (score.startsWith('A')) return 'text-green-600';
    if (score.startsWith('B')) return 'text-blue-600';
    if (score.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Total Portfolio Value */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="text-total-value">
                {formatCurrency(analysis.totalValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Wallet className="text-primary w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-sm font-medium ${analysis.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.totalReturn >= 0 ? '↗' : '↘'} {formatPercent(analysis.totalReturnPercent)}
            </span>
            <span className="text-gray-500 text-sm ml-2">vs. cost basis</span>
          </div>
        </CardContent>
      </Card>

      {/* Today's Change */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Change</p>
              <p className={`text-3xl font-bold ${analysis.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="text-daily-change">
                {formatCurrency(analysis.dailyChange)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${analysis.dailyChange >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <TrendingUp className={`w-6 h-6 ${analysis.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-sm font-medium ${analysis.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.dailyChange >= 0 ? '↗' : '↘'} {formatPercent(analysis.dailyChangePercent)}
            </span>
            <span className="text-gray-500 text-sm ml-2">from yesterday</span>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Health */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Portfolio Health</p>
              <p className={`text-3xl font-bold ${getHealthColor(analysis.healthScore)}`} data-testid="text-health-score">
                {analysis.healthScore}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Heart className="text-green-600 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">
              {analysis.sectorAllocation.length >= 3 ? 'Good Diversification' : 'Needs Diversification'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Risk Level */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Level</p>
              <p className={`text-3xl font-bold ${getRiskColor(analysis.riskLevel).split(' ')[0]}`} data-testid="text-risk-level">
                {analysis.riskLevel}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRiskColor(analysis.riskLevel).split(' ')[1]}`}>
              <Shield className={`w-6 h-6 ${getRiskColor(analysis.riskLevel).split(' ')[0]}`} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    analysis.riskLevel === 'Low' ? 'bg-green-600' :
                    analysis.riskLevel === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${(analysis.riskScore / 10) * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-500 text-sm ml-2">{analysis.riskScore.toFixed(1)}/10</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
