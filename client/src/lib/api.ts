export interface StockQuote {
  symbol: string;
  companyName: string;
  currentPrice: number;
  changePercent: number;
  sector?: string;
}

export interface ValidationResult {
  valid: boolean;
  symbol?: string;
  companyName?: string;
  currentPrice?: number;
  sector?: string;
  message?: string;
}

export class StockAPI {
  private static instance: StockAPI;
  private cache: Map<string, { data: StockQuote; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static getInstance(): StockAPI {
    if (!StockAPI.instance) {
      StockAPI.instance = new StockAPI();
    }
    return StockAPI.instance;
  }

  async validateSymbol(symbol: string): Promise<ValidationResult> {
    try {
      const response = await fetch(`/api/validate-symbol/${symbol.toUpperCase()}`);
      return await response.json();
    } catch (error) {
      return {
        valid: false,
        message: "Error validating symbol",
      };
    }
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const validation = await this.validateSymbol(symbol);
      if (!validation.valid) {
        return null;
      }

      const quote: StockQuote = {
        symbol: validation.symbol!,
        companyName: validation.companyName!,
        currentPrice: validation.currentPrice!,
        changePercent: 0, // Will be provided by the API
        sector: validation.sector,
      };

      this.cache.set(symbol, { data: quote, timestamp: Date.now() });
      return quote;
    } catch (error) {
      return null;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const stockAPI = StockAPI.getInstance();
