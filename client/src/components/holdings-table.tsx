import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PortfolioWithHoldings } from "@shared/schema";

interface HoldingsTableProps {
  portfolio?: PortfolioWithHoldings;
  isLoading: boolean;
  onHoldingDeleted: () => void;
}

export default function HoldingsTable({ portfolio, isLoading, onHoldingDeleted }: HoldingsTableProps) {
  const { toast } = useToast();

  const handleDeleteHolding = async (holdingId: string, symbol: string) => {
    try {
      await apiRequest("DELETE", `/api/holdings/${holdingId}`);
      toast({
        title: "Success",
        description: `${symbol} removed from portfolio`,
      });
      onHoldingDeleted();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove holding",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: string | number | null) => {
    if (!value) return "$0.00";
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const formatPercent = (gainLoss: number, isPercent: boolean = false) => {
    const value = isPercent ? gainLoss : gainLoss;
    const sign = value >= 0 ? '+' : '';
    return isPercent ? `${sign}${value.toFixed(2)}%` : `${sign}${formatCurrency(value)}`;
  };

  const calculateGainLoss = (holding: any) => {
    const shares = parseFloat(holding.shares);
    const purchasePrice = parseFloat(holding.purchasePrice);
    const currentPrice = holding.currentPrice ? parseFloat(holding.currentPrice) : purchasePrice;
    
    const costBasis = shares * purchasePrice;
    const marketValue = shares * currentPrice;
    const gainLoss = marketValue - costBasis;
    const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
    
    return { gainLoss, gainLossPercent, marketValue };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-slate-500" data-testid="text-no-holdings">
              No holdings in your portfolio yet. Add some stocks to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-blue-50/20 dark:from-slate-800/30 dark:to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative z-10 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 to-slate-700/30 border-b border-slate-200/50 dark:border-slate-600/50">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Current Holdings
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 p-0">
        <div className="overflow-hidden rounded-b-xl">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-100/50 to-blue-100/30 dark:from-slate-800/50 dark:to-slate-700/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-600/50">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-600/50">Shares</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-600/50">Purchase Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-600/50">Current Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-600/50">Gain/Loss</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-600/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((holding, index) => {
                const { gainLoss, gainLossPercent, marketValue } = calculateGainLoss(holding);
                const isPositive = gainLoss >= 0;
                
                return (
                  <tr 
                    key={holding.id} 
                    className="group/row hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-blue-50/60 dark:hover:from-slate-800/80 dark:hover:to-slate-700/60 transition-all duration-300 border-b border-slate-100/50 dark:border-slate-700/50 last:border-b-0"
                    data-testid={`holding-row-${holding.symbol}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 group-hover/row:from-amber-100 group-hover/row:to-yellow-200 dark:group-hover/row:from-amber-700 dark:group-hover/row:to-yellow-600 rounded-lg flex items-center justify-center transition-all duration-300 transform group-hover/row:scale-110">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/row:text-amber-700 dark:group-hover/row:text-amber-300 transition-colors duration-300">
                            {holding.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover/row:text-slate-800 dark:group-hover/row:text-slate-200 transition-colors duration-300">
                            {holding.symbol}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 group-hover/row:text-slate-700 dark:group-hover/row:text-slate-300 transition-colors duration-300">
                            {holding.companyName || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{holding.shares}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{formatCurrency(holding.purchasePrice)}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{formatCurrency(holding.currentPrice)}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercent(gainLoss, false)}
                        </div>
                        <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {formatPercent(gainLossPercent, true)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200 hover:scale-110"
                          data-testid={`button-edit-${holding.symbol}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteHolding(holding.id, holding.symbol)}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-110"
                          data-testid={`button-delete-${holding.symbol}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
