// Environment Configuration for AUROVA
export const ENV_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: 'https://ivvgbsulgmiywobqhgfe.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dmdic3VsZ21peXdvYnFoZ2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzI2NDAsImV4cCI6MjA3MjMwODY0MH0.Ux2rGpjJl8F6LEolIbLlLgE4v0gVMVE8gsGWEwfE53I',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dmdic3VsZ21peXdvYnFoZ2ZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjczMjY0MCwiZXhwIjoyMDcyMzA4NjQwfQ.PDZjjwFCQvmhniBHX0MG3mSr4K6kMHUkwb8ySNp_5lE',
  
  // Database Connection (replace aurovva2024 with actual password)
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:aurovva2024@db.ivvgbsulgmiywobqhgfe.supabase.co:5432/postgres',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Alpha Vantage API (optional)
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || 'demo'
};
