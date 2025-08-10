import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const holdings = pgTable("holdings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: varchar("portfolio_id").notNull(),
  symbol: text("symbol").notNull(),
  companyName: text("company_name"),
  shares: decimal("shares", { precision: 10, scale: 4 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: timestamp("purchase_date").notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  sector: text("sector"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const stockData = pgTable("stock_data", {
  symbol: text("symbol").primaryKey(),
  companyName: text("company_name").notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }),
  sector: text("sector"),
  marketCap: decimal("market_cap", { precision: 15, scale: 2 }),
  peRatio: decimal("pe_ratio", { precision: 6, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
});

export const insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
  currentPrice: true,
  companyName: true,
  sector: true,
  lastUpdated: true,
});

export const insertStockDataSchema = createInsertSchema(stockData).omit({
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertHolding = z.infer<typeof insertHoldingSchema>;
export type Holding = typeof holdings.$inferSelect;
export type InsertStockData = z.infer<typeof insertStockDataSchema>;
export type StockData = typeof stockData.$inferSelect;

// Additional types for API responses
export type PortfolioWithHoldings = Portfolio & {
  holdings: (Holding & { stockData?: StockData })[];
};

export type PortfolioAnalysis = {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercent: number;
  dailyChange: number;
  dailyChangePercent: number;
  healthScore: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  sectorAllocation: { sector: string; percentage: number; value: number }[];
  recommendations: { type: 'warning' | 'success' | 'info'; title: string; message: string }[];
};
