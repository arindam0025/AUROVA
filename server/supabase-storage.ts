import { createClient } from '@supabase/supabase-js';
import { type User, type InsertUser, type Portfolio, type InsertPortfolio, type Holding, type InsertHolding, type StockData, type InsertStockData, type PortfolioWithHoldings } from "@shared/schema";
import { ENV_CONFIG } from "../config/env";

export const supabase = createClient(ENV_CONFIG.SUPABASE_URL, ENV_CONFIG.SUPABASE_SERVICE_ROLE_KEY);

export class SupabaseStorage {
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Portfolio;
  }

  async getPortfoliosByUserId(userId: string): Promise<Portfolio[]> {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId);
    
    if (error) return [];
    return data as Portfolio[];
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const { data, error } = await supabase
      .from('portfolios')
      .insert(insertPortfolio)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create portfolio: ${error.message}`);
    return data as Portfolio;
  }

  async getHolding(id: string): Promise<Holding | undefined> {
    const { data, error } = await supabase
      .from('holdings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Holding;
  }

  async getHoldingsByPortfolioId(portfolioId: string): Promise<Holding[]> {
    const { data, error } = await supabase
      .from('holdings')
      .select('*')
      .eq('portfolio_id', portfolioId);
    
    if (error) return [];
    return data as Holding[];
  }

  async createHolding(insertHolding: InsertHolding): Promise<Holding> {
    const { data, error } = await supabase
      .from('holdings')
      .insert(insertHolding)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create holding: ${error.message}`);
    return data as Holding;
  }

  async updateHolding(id: string, updates: Partial<Holding>): Promise<Holding | undefined> {
    const { data, error } = await supabase
      .from('holdings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data as Holding;
  }

  async deleteHolding(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('holdings')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  async getStockData(symbol: string): Promise<StockData | undefined> {
    const { data, error } = await supabase
      .from('stock_data')
      .select('*')
      .eq('symbol', symbol.toUpperCase())
      .single();
    
    if (error || !data) return undefined;
    return data as StockData;
  }

  async createOrUpdateStockData(insertStockData: InsertStockData): Promise<StockData> {
    const { data, error } = await supabase
      .from('stock_data')
      .upsert(insertStockData, { onConflict: 'symbol' })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create/update stock data: ${error.message}`);
    return data as StockData;
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

  // Initialize demo data if needed
  async initializeDemoData(): Promise<void> {
    try {
      // Check if demo user exists
      const demoUser = await this.getUserByUsername('demo');
      if (!demoUser) {
        await this.createUser({ username: 'demo', password: 'demo123' });
      }
    } catch (error) {
      console.log('Demo data already initialized or error occurred:', error);
    }
  }
}

export const supabaseStorage = new SupabaseStorage();
