import { type User, type InsertUser, type Portfolio, type InsertPortfolio, type Holding, type InsertHolding, type StockData, type InsertStockData, type PortfolioWithHoldings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPortfolio(id: string): Promise<Portfolio | undefined>;
  getPortfoliosByUserId(userId: string): Promise<Portfolio[]>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  
  getHolding(id: string): Promise<Holding | undefined>;
  getHoldingsByPortfolioId(portfolioId: string): Promise<Holding[]>;
  createHolding(holding: InsertHolding): Promise<Holding>;
  updateHolding(id: string, updates: Partial<Holding>): Promise<Holding | undefined>;
  deleteHolding(id: string): Promise<boolean>;
  
  getStockData(symbol: string): Promise<StockData | undefined>;
  createOrUpdateStockData(stockData: InsertStockData): Promise<StockData>;
  
  getPortfolioWithHoldings(portfolioId: string): Promise<PortfolioWithHoldings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private portfolios: Map<string, Portfolio>;
  private holdings: Map<string, Holding>;
  private stockData: Map<string, StockData>;

  constructor() {
    this.users = new Map();
    this.portfolios = new Map();
    this.holdings = new Map();
    this.stockData = new Map();
    
    // Create default user and portfolio for development
    this.initializeDefaults();
  }

  private async initializeDefaults() {
    const defaultUser = await this.createUser({
      username: "demo",
      password: "demo123"
    });
    
    const defaultPortfolio = await this.createPortfolio({
      userId: defaultUser.id,
      name: "My Portfolio"
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async getPortfoliosByUserId(userId: string): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(
      (portfolio) => portfolio.userId === userId
    );
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = {
      ...insertPortfolio,
      id,
      createdAt: new Date(),
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async getHolding(id: string): Promise<Holding | undefined> {
    return this.holdings.get(id);
  }

  async getHoldingsByPortfolioId(portfolioId: string): Promise<Holding[]> {
    return Array.from(this.holdings.values()).filter(
      (holding) => holding.portfolioId === portfolioId
    );
  }

  async createHolding(insertHolding: InsertHolding): Promise<Holding> {
    const id = randomUUID();
    const holding: Holding = {
      ...insertHolding,
      id,
      shares: insertHolding.shares.toString(),
      purchasePrice: insertHolding.purchasePrice.toString(),
      currentPrice: null,
      companyName: null,
      sector: null,
      lastUpdated: new Date(),
    };
    this.holdings.set(id, holding);
    return holding;
  }

  async updateHolding(id: string, updates: Partial<Holding>): Promise<Holding | undefined> {
    const existing = this.holdings.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, lastUpdated: new Date() };
    this.holdings.set(id, updated);
    return updated;
  }

  async deleteHolding(id: string): Promise<boolean> {
    return this.holdings.delete(id);
  }

  async getStockData(symbol: string): Promise<StockData | undefined> {
    return this.stockData.get(symbol.toUpperCase());
  }

  async createOrUpdateStockData(insertStockData: InsertStockData): Promise<StockData> {
    const symbol = insertStockData.symbol.toUpperCase();
    const stockData: StockData = {
      ...insertStockData,
      symbol,
      currentPrice: insertStockData.currentPrice.toString(),
      changePercent: insertStockData.changePercent?.toString() || null,
      marketCap: insertStockData.marketCap?.toString() || null,
      peRatio: insertStockData.peRatio?.toString() || null,
      lastUpdated: new Date(),
    };
    this.stockData.set(symbol, stockData);
    return stockData;
  }

  async getPortfolioWithHoldings(portfolioId: string): Promise<PortfolioWithHoldings | undefined> {
    const portfolio = await this.getPortfolio(portfolioId);
    if (!portfolio) return undefined;

    const holdings = await this.getHoldingsByPortfolioId(portfolioId);
    const holdingsWithStock = await Promise.all(
      holdings.map(async (holding) => {
        const stockData = await this.getStockData(holding.symbol);
        return { ...holding, stockData };
      })
    );

    return {
      ...portfolio,
      holdings: holdingsWithStock,
    };
  }
}

export const storage = new MemStorage();
