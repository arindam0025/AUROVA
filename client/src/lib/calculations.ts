import type { Holding, StockData, PortfolioAnalysis } from "@shared/schema";

export interface HoldingCalculation {
  holding: Holding;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  costBasis: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface PortfolioCalculation {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercent: number;
  dailyChange: number;
  dailyChangePercent: number;
  holdings: HoldingCalculation[];
}

export class PortfolioCalculator {
  static calculateHolding(holding: Holding, stockData?: StockData): HoldingCalculation {
    const shares = parseFloat(holding.shares);
    const purchasePrice = parseFloat(holding.purchasePrice);
    const currentPrice = stockData 
      ? parseFloat(stockData.currentPrice) 
      : holding.currentPrice 
        ? parseFloat(holding.currentPrice) 
        : purchasePrice;

    const costBasis = shares * purchasePrice;
    const marketValue = shares * currentPrice;
    const gainLoss = marketValue - costBasis;
    const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

    // Calculate daily change
    const changePercent = stockData?.changePercent ? parseFloat(stockData.changePercent) : 0;
    const dayChange = marketValue * (changePercent / 100);
    const dayChangePercent = changePercent;

    return {
      holding,
      shares,
      purchasePrice,
      currentPrice,
      costBasis,
      marketValue,
      gainLoss,
      gainLossPercent,
      dayChange,
      dayChangePercent,
    };
  }

  static calculatePortfolio(holdings: (Holding & { stockData?: StockData })[]): PortfolioCalculation {
    const calculatedHoldings = holdings.map(h => 
      this.calculateHolding(h, h.stockData)
    );

    const totalValue = calculatedHoldings.reduce((sum, h) => sum + h.marketValue, 0);
    const totalCost = calculatedHoldings.reduce((sum, h) => sum + h.costBasis, 0);
    const totalReturn = totalValue - totalCost;
    const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
    
    const dailyChange = calculatedHoldings.reduce((sum, h) => sum + h.dayChange, 0);
    const dailyChangePercent = totalValue > 0 && dailyChange !== 0 
      ? (dailyChange / (totalValue - dailyChange)) * 100 
      : 0;

    return {
      totalValue,
      totalCost,
      totalReturn,
      totalReturnPercent,
      dailyChange,
      dailyChangePercent,
      holdings: calculatedHoldings,
    };
  }

  static calculateSectorAllocation(holdings: HoldingCalculation[], stockData: Map<string, StockData>) {
    const sectorValues: Record<string, number> = {};
    let totalValue = 0;

    holdings.forEach(holding => {
      const data = stockData.get(holding.holding.symbol);
      const sector = data?.sector || holding.holding.sector || 'Other';
      sectorValues[sector] = (sectorValues[sector] || 0) + holding.marketValue;
      totalValue += holding.marketValue;
    });

    return Object.entries(sectorValues).map(([sector, value]) => ({
      sector,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }));
  }

  static calculateRiskScore(
    sectorAllocation: { sector: string; percentage: number }[],
    dailyChangePercent: number,
    holdings: HoldingCalculation[]
  ): { score: number; level: 'Low' | 'Medium' | 'High' } {
    // Diversification factor (0-1, where 1 is best)
    const diversificationScore = Math.min(sectorAllocation.length / 5, 1);
    
    // Concentration risk (0-1, where 0 is best)
    const maxSectorPercent = Math.max(...sectorAllocation.map(s => s.percentage), 0);
    const concentrationRisk = maxSectorPercent / 100;
    
    // Volatility factor (0-1, where 0 is best)
    const volatility = Math.min(Math.abs(dailyChangePercent) / 10, 1);
    
    // Holdings count factor
    const holdingsCountScore = Math.min(holdings.length / 10, 1);
    
    // Calculate overall risk score (0-10)
    const riskScore = ((concentrationRisk * 3) + (volatility * 2) + ((1 - diversificationScore) * 3) + ((1 - holdingsCountScore) * 2)) * 1;
    
    const normalizedScore = Math.max(0, Math.min(10, riskScore));
    
    let level: 'Low' | 'Medium' | 'High';
    if (normalizedScore < 3.5) level = 'Low';
    else if (normalizedScore < 7) level = 'Medium';
    else level = 'High';

    return { score: normalizedScore, level };
  }

  static calculateHealthScore(
    totalReturnPercent: number,
    riskScore: number,
    diversificationScore: number
  ): string {
    let baseScore = 'C';
    
    // Performance component
    if (totalReturnPercent > 20) baseScore = 'A';
    else if (totalReturnPercent > 10) baseScore = 'B';
    else if (totalReturnPercent > 0) baseScore = 'C';
    else if (totalReturnPercent > -10) baseScore = 'D';
    else baseScore = 'F';
    
    // Risk adjustment
    if (riskScore < 3 && diversificationScore > 0.7) {
      baseScore += '+';
    } else if (riskScore > 7 || diversificationScore < 0.3) {
      if (baseScore === 'A') baseScore = 'B';
      else if (baseScore === 'B') baseScore = 'C';
      else if (baseScore === 'C') baseScore = 'D';
    }
    
    return baseScore;
  }

  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  static formatPercent(value: number, showSign: boolean = true): string {
    const sign = showSign && value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }
}
