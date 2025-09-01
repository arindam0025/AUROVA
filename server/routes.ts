import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabaseStorage } from "./supabase-storage";
import { insertHoldingSchema, insertPortfolioSchema, type PortfolioAnalysis } from "@shared/schema";
import { z } from "zod";

// Alpha Vantage API integration for AUROVA portfolio analysis
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || process.env.VITE_ALPHA_VANTAGE_API_KEY || "demo";

async function fetchStockData(symbol: string) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    if (data["Error Message"] || data["Note"]) {
      throw new Error(data["Error Message"] || data["Note"] || "API limit reached");
    }

    const quote = data["Global Quote"];
    if (!quote) {
      throw new Error("Invalid symbol or no data available");
    }

    return {
      symbol: quote["01. symbol"],
      currentPrice: parseFloat(quote["05. price"]),
      changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
    };
  } catch (error) {
    // Fallback with mock data for demo purposes when API fails
    console.warn(`Stock API failed for ${symbol}, using fallback data:`, error);
    const mockPrices: Record<string, number> = {
      AAPL: 175.43,
      MSFT: 385.20,
      GOOGL: 2680.30,
      AMZN: 3200.00,
      TSLA: 800.00,
      NVDA: 450.00,
    };
    
    return {
      symbol: symbol.toUpperCase(),
      currentPrice: mockPrices[symbol.toUpperCase()] || 100.00,
      changePercent: (Math.random() - 0.5) * 10, // Random change between -5% and 5%
    };
  }
}

async function fetchCompanyInfo(symbol: string) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    if (data["Error Message"] || data["Note"]) {
      throw new Error(data["Error Message"] || data["Note"] || "API limit reached");
    }

    return {
      companyName: data["Name"] || `${symbol} Corp`,
      sector: data["Sector"] || "Technology",
      marketCap: data["MarketCapitalization"] ? parseFloat(data["MarketCapitalization"]) : null,
      peRatio: data["PERatio"] && data["PERatio"] !== "None" ? parseFloat(data["PERatio"]) : null,
    };
  } catch (error) {
    // Fallback company data
    const mockCompanies: Record<string, any> = {
      AAPL: { companyName: "Apple Inc.", sector: "Technology" },
      MSFT: { companyName: "Microsoft Corporation", sector: "Technology" },
      GOOGL: { companyName: "Alphabet Inc.", sector: "Technology" },
      AMZN: { companyName: "Amazon.com Inc.", sector: "Consumer Discretionary" },
      TSLA: { companyName: "Tesla Inc.", sector: "Consumer Discretionary" },
      NVDA: { companyName: "NVIDIA Corporation", sector: "Technology" },
    };
    
    return mockCompanies[symbol.toUpperCase()] || {
      companyName: `${symbol} Corporation`,
      sector: "Technology",
      marketCap: null,
      peRatio: null,
    };
  }
}

function calculatePortfolioAnalysis(portfolio: any): PortfolioAnalysis {
  if (!portfolio.holdings || portfolio.holdings.length === 0) {
    return {
      totalValue: 0,
      totalCost: 0,
      totalReturn: 0,
      totalReturnPercent: 0,
      dailyChange: 0,
      dailyChangePercent: 0,
      healthScore: "N/A",
      riskLevel: "Low",
      riskScore: 0,
      sectorAllocation: [],
      recommendations: [{
        type: "info",
        title: "Add Holdings",
        message: "Start by adding some stocks to your portfolio to see analysis."
      }],
    };
  }

  let totalValue = 0;
  let totalCost = 0;
  let dailyChange = 0;
  const sectorValues: Record<string, number> = {};

  portfolio.holdings.forEach((holding: any) => {
    const shares = parseFloat(holding.shares);
    const purchasePrice = parseFloat(holding.purchasePrice);
    const currentPrice = holding.stockData ? parseFloat(holding.stockData.currentPrice) : purchasePrice;
    const changePercent = holding.stockData ? parseFloat(holding.stockData.changePercent || "0") : 0;
    
    const marketValue = shares * currentPrice;
    const costBasis = shares * purchasePrice;
    const dailyChangeValue = marketValue * (changePercent / 100);
    
    totalValue += marketValue;
    totalCost += costBasis;
    dailyChange += dailyChangeValue;
    
    const sector = holding.stockData?.sector || "Technology";
    sectorValues[sector] = (sectorValues[sector] || 0) + marketValue;
  });

  const totalReturn = totalValue - totalCost;
  const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
  const dailyChangePercent = totalValue > 0 ? (dailyChange / (totalValue - dailyChange)) * 100 : 0;

  // Calculate sector allocation
  const sectorAllocation = Object.entries(sectorValues).map(([sector, value]) => ({
    sector,
    value,
    percentage: (value / totalValue) * 100,
  }));

  // Calculate health score and risk
  const diversificationScore = sectorAllocation.length >= 3 ? 1 : sectorAllocation.length / 3;
  const concentrationRisk = Math.max(...sectorAllocation.map(s => s.percentage)) / 100;
  const volatilityScore = Math.abs(dailyChangePercent) / 5; // Normalize to 0-1 scale
  
  const riskScore = (concentrationRisk + volatilityScore - diversificationScore) * 10;
  const riskLevel: 'Low' | 'Medium' | 'High' = riskScore < 3 ? 'Low' : riskScore < 7 ? 'Medium' : 'High';
  
  // Health score calculation
  let healthScore = "A";
  if (diversificationScore < 0.7 || concentrationRisk > 0.7) healthScore = "B";
  if (diversificationScore < 0.5 || concentrationRisk > 0.8) healthScore = "C";
  if (totalReturnPercent > 10) healthScore += "+";
  else if (totalReturnPercent < -10) healthScore = "D";

  // Generate recommendations
  const recommendations = [];
  
  if (concentrationRisk > 0.6) {
    const dominantSector = sectorAllocation.find(s => s.percentage > 60);
    if (dominantSector) {
      recommendations.push({
        type: "warning" as const,
        title: "High Sector Concentration",
        message: `Your portfolio is ${dominantSector.percentage.toFixed(1)}% ${dominantSector.sector} stocks. Consider diversifying into other sectors.`
      });
    }
  }

  if (totalReturnPercent > 15) {
    recommendations.push({
      type: "success" as const,
      title: "Strong Performance",
      message: `Your portfolio is outperforming with ${totalReturnPercent.toFixed(1)}% returns.`
    });
  }

  if (sectorAllocation.length < 3) {
    recommendations.push({
      type: "info" as const,
      title: "Diversification Opportunity",
      message: "Consider adding stocks from different sectors to reduce risk."
    });
  }

  return {
    totalValue,
    totalCost,
    totalReturn,
    totalReturnPercent,
    dailyChange,
    dailyChangePercent,
    healthScore,
    riskLevel,
    riskScore: Math.max(0, Math.min(10, riskScore)),
    sectorAllocation,
    recommendations,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize demo data on startup
  await supabaseStorage.initializeDemoData();

  // Get default portfolio (first portfolio for demo user)
  app.get("/api/portfolio", async (req, res) => {
    try {
      // Find demo user first
      const demoUser = await supabaseStorage.getUserByUsername("demo");
      if (!demoUser) {
        return res.status(404).json({ message: "Demo user not found" });
      }

      const portfolios = await supabaseStorage.getPortfoliosByUserId(demoUser.id);
      if (portfolios.length === 0) {
        return res.status(404).json({ message: "No portfolio found" });
      }
      
      const portfolio = await supabaseStorage.getPortfolioWithHoldings(portfolios[0].id);
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Get portfolio analysis
  app.get("/api/portfolio/analysis", async (req, res) => {
    try {
      // Find demo user first
      const demoUser = await supabaseStorage.getUserByUsername("demo");
      if (!demoUser) {
        return res.status(404).json({ message: "Demo user not found" });
      }

      const portfolios = await supabaseStorage.getPortfoliosByUserId(demoUser.id);
      if (portfolios.length === 0) {
        return res.status(404).json({ message: "No portfolio found" });
      }
      
      const portfolio = await supabaseStorage.getPortfolioWithHoldings(portfolios[0].id);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      const analysis = calculatePortfolioAnalysis(portfolio);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing portfolio:", error);
      res.status(500).json({ message: "Failed to analyze portfolio" });
    }
  });

  // Add new holding
  app.post("/api/holdings", async (req, res) => {
    try {
      const demoUser = await supabaseStorage.getUserByUsername("demo");
      if (!demoUser) {
        return res.status(404).json({ message: "Demo user not found" });
      }

      const portfolios = await supabaseStorage.getPortfoliosByUserId(demoUser.id);
      if (portfolios.length === 0) {
        return res.status(404).json({ message: "No portfolio found" });
      }

      const data = insertHoldingSchema.parse({
        ...req.body,
        portfolioId: portfolios[0].id,
      });

      // Fetch and store stock data
      try {
        const [stockQuote, companyInfo] = await Promise.all([
          fetchStockData(data.symbol),
          fetchCompanyInfo(data.symbol)
        ]);

        await supabaseStorage.createOrUpdateStockData({
          symbol: stockQuote.symbol,
          companyName: companyInfo.companyName,
          currentPrice: stockQuote.currentPrice.toString(),
          changePercent: stockQuote.changePercent.toString(),
          sector: companyInfo.sector,
          marketCap: companyInfo.marketCap?.toString(),
          peRatio: companyInfo.peRatio?.toString(),
        });
      } catch (error) {
        console.warn("Failed to fetch stock data:", error);
      }

      const holding = await supabaseStorage.createHolding(data);
      
      // Update holding with stock data
      const stockData = await supabaseStorage.getStockData(data.symbol);
      if (stockData) {
        await supabaseStorage.updateHolding(holding.id, {
          currentPrice: stockData.currentPrice,
          companyName: stockData.companyName,
          sector: stockData.sector,
        });
      }

      const updatedHolding = await supabaseStorage.getHolding(holding.id);
      res.json(updatedHolding);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Failed to create holding:", error);
      res.status(500).json({ message: "Failed to create holding" });
    }
  });

  // Update holding
  app.put("/api/holdings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const holding = await supabaseStorage.updateHolding(id, updates);
      if (!holding) {
        return res.status(404).json({ message: "Holding not found" });
      }
      
      res.json(holding);
    } catch (error) {
      console.error("Failed to update holding:", error);
      res.status(500).json({ message: "Failed to update holding" });
    }
  });

  // Delete holding
  app.delete("/api/holdings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await supabaseStorage.deleteHolding(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Holding not found" });
      }
      
      res.json({ message: "Holding deleted successfully" });
    } catch (error) {
      console.error("Failed to delete holding:", error);
      res.status(500).json({ message: "Failed to delete holding" });
    }
  });

  // Refresh stock prices
  app.post("/api/refresh-prices", async (req, res) => {
    try {
      const demoUser = await supabaseStorage.getUserByUsername("demo");
      if (!demoUser) {
        return res.status(404).json({ message: "Demo user not found" });
      }

      const portfolios = await supabaseStorage.getPortfoliosByUserId(demoUser.id);
      if (portfolios.length === 0) {
        return res.status(404).json({ message: "No portfolio found" });
      }

      const holdings = await supabaseStorage.getHoldingsByPortfolioId(portfolios[0].id);
      const symbols = Array.from(new Set(holdings.map(h => h.symbol)));
      
      const updates = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const stockQuote = await fetchStockData(symbol);
            return supabaseStorage.createOrUpdateStockData({
              symbol: stockQuote.symbol,
              companyName: "", // Will be filled from existing data
              currentPrice: stockQuote.currentPrice.toString(),
              changePercent: stockQuote.changePercent.toString(),
              sector: "Technology", // Default
            });
          } catch (error) {
            console.warn(`Failed to update ${symbol}:`, error);
            return null;
          }
        })
      );

      // Update holdings with new prices
      await Promise.all(
        holdings.map(async (holding) => {
          const stockData = await supabaseStorage.getStockData(holding.symbol);
          if (stockData) {
            await supabaseStorage.updateHolding(holding.id, {
              currentPrice: stockData.currentPrice,
            });
          }
        })
      );

      res.json({ message: "Prices updated successfully", updated: updates.filter(Boolean).length });
    } catch (error) {
      console.error("Failed to refresh prices:", error);
      res.status(500).json({ message: "Failed to refresh prices" });
    }
  });

  // Validate stock symbol
  app.get("/api/validate-symbol/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const stockData = await fetchStockData(symbol);
      const companyInfo = await fetchCompanyInfo(symbol);
      
      res.json({
        valid: true,
        symbol: stockData.symbol,
        companyName: companyInfo.companyName,
        currentPrice: stockData.currentPrice,
        sector: companyInfo.sector,
      });
    } catch (error) {
      res.status(400).json({ 
        valid: false, 
        message: error instanceof Error ? error.message : "Invalid symbol" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
