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
            <p className="text-gray-500" data-testid="text-no-holdings">
              No holdings in your portfolio yet. Add some stocks to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Holdings</CardTitle>
        <p className="text-sm text-gray-500">Your active portfolio positions</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolio.holdings.map((holding) => {
                const { gainLoss, gainLossPercent, marketValue } = calculateGainLoss(holding);
                const isPositive = gainLoss >= 0;
                
                return (
                  <tr key={holding.id} className="hover:bg-gray-50" data-testid={`row-holding-${holding.symbol}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-primary text-xs font-bold">{holding.symbol}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900" data-testid={`text-symbol-${holding.symbol}`}>
                            {holding.symbol}
                          </div>
                          <div className="text-sm text-gray-500" data-testid={`text-company-${holding.symbol}`}>
                            {holding.companyName || holding.stockData?.companyName || `${holding.symbol} Corp`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-shares-${holding.symbol}`}>
                      {parseFloat(holding.shares).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-cost-${holding.symbol}`}>
                      {formatCurrency(holding.purchasePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-price-${holding.symbol}`}>
                      {formatCurrency(holding.currentPrice || holding.stockData?.currentPrice || holding.purchasePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-value-${holding.symbol}`}>
                      {formatCurrency(marketValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`} data-testid={`text-gain-${holding.symbol}`}>
                        {formatPercent(gainLoss)} ({formatPercent(gainLossPercent, true)})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary/80 mr-2"
                        data-testid={`button-edit-${holding.symbol}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteHolding(holding.id, holding.symbol)}
                        data-testid={`button-delete-${holding.symbol}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
