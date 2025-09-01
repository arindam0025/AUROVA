import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ivvgbsulgmiywobqhgfe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dmdic3VsZ21peXdvYnFoZ2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzI2NDAsImV4cCI6MjA3MjMwODY0MH0.Ux2rGpjJl8F6LEolIbLlLgE4v0gVMVE8gsGWEwfE53I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on your schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          password: string;
          created_at?: string;
        };
        Insert: {
          id?: string;
          username: string;
          password: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password?: string;
          created_at?: string;
        };
      };
      portfolios: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      holdings: {
        Row: {
          id: string;
          portfolio_id: string;
          symbol: string;
          company_name?: string;
          shares: string;
          purchase_price: string;
          purchase_date: string;
          current_price?: string;
          sector?: string;
          last_updated?: string;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          symbol: string;
          company_name?: string;
          shares: string;
          purchase_price: string;
          purchase_date: string;
          current_price?: string;
          sector?: string;
          last_updated?: string;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          symbol?: string;
          company_name?: string;
          shares?: string;
          purchase_price?: string;
          purchase_date?: string;
          current_price?: string;
          sector?: string;
          last_updated?: string;
        };
      };
      stock_data: {
        Row: {
          symbol: string;
          company_name: string;
          current_price: string;
          change_percent?: string;
          sector?: string;
          market_cap?: string;
          pe_ratio?: string;
          last_updated?: string;
        };
        Insert: {
          symbol: string;
          company_name: string;
          current_price: string;
          change_percent?: string;
          sector?: string;
          market_cap?: string;
          pe_ratio?: string;
          last_updated?: string;
        };
        Update: {
          symbol?: string;
          company_name?: string;
          current_price?: string;
          change_percent?: string;
          sector?: string;
          market_cap?: string;
          pe_ratio?: string;
          last_updated?: string;
        };
      };
    };
  };
}
