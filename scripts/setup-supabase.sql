-- AUROVA Database Setup for Supabase
-- Run this script in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create holdings table
CREATE TABLE IF NOT EXISTS holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    company_name TEXT,
    shares DECIMAL(10,4) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    current_price DECIMAL(10,2),
    sector TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_data table
CREATE TABLE IF NOT EXISTS stock_data (
    symbol TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    change_percent DECIMAL(5,2),
    sector TEXT,
    market_cap DECIMAL(15,2),
    pe_ratio DECIMAL(6,2),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_holdings_portfolio_id ON holdings(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_holdings_symbol ON holdings(symbol);
CREATE INDEX IF NOT EXISTS idx_stock_data_symbol ON stock_data(symbol);

-- Insert demo user and portfolio
INSERT INTO users (username, password) 
VALUES ('demo', 'demo123') 
ON CONFLICT (username) DO NOTHING;

-- Get the demo user ID and create a portfolio
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE username = 'demo';
    
    IF demo_user_id IS NOT NULL THEN
        INSERT INTO portfolios (user_id, name) 
        VALUES (demo_user_id, 'AUROVA Portfolio') 
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Insert sample stock data
INSERT INTO stock_data (symbol, company_name, current_price, sector) VALUES
('AAPL', 'Apple Inc.', 175.43, 'Technology'),
('MSFT', 'Microsoft Corporation', 385.20, 'Technology'),
('GOOGL', 'Alphabet Inc.', 2680.30, 'Technology'),
('AMZN', 'Amazon.com Inc.', 3200.00, 'Consumer Discretionary'),
('TSLA', 'Tesla Inc.', 800.00, 'Consumer Discretionary'),
('NVDA', 'NVIDIA Corporation', 450.00, 'Technology')
ON CONFLICT (symbol) DO UPDATE SET
    current_price = EXCLUDED.current_price,
    sector = EXCLUDED.sector,
    last_updated = NOW();

-- Insert sample holdings for demo user
DO $$
DECLARE
    demo_portfolio_id UUID;
BEGIN
    SELECT p.id INTO demo_portfolio_id 
    FROM portfolios p 
    JOIN users u ON p.user_id = u.id 
    WHERE u.username = 'demo';
    
    IF demo_portfolio_id IS NOT NULL THEN
        INSERT INTO holdings (portfolio_id, symbol, shares, purchase_price, purchase_date, sector) VALUES
        (demo_portfolio_id, 'AAPL', 10, 150.00, NOW() - INTERVAL '30 days', 'Technology'),
        (demo_portfolio_id, 'MSFT', 5, 300.00, NOW() - INTERVAL '45 days', 'Technology'),
        (demo_portfolio_id, 'GOOGL', 2, 2500.00, NOW() - INTERVAL '60 days', 'Technology')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own portfolios" ON portfolios
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own holdings" ON holdings
    FOR SELECT USING (
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id::text = auth.uid()::text
        )
    );

-- Stock data is public (read-only)
CREATE POLICY "Stock data is publicly readable" ON stock_data
    FOR SELECT USING (true);

-- Users can insert/update their own data
CREATE POLICY "Users can insert own portfolios" ON portfolios
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own holdings" ON holdings
    FOR INSERT WITH CHECK (
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id::text = auth.uid()::text
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
