// Supabase Configuration for AUROVA
export const SUPABASE_CONFIG = {
  url: 'https://ivvgbsulgmiywobqhgfe.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dmdic3VsZ21peXdvYnFoZ2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzI2NDAsImV4cCI6MjA3MjMwODY0MH0.Ux2rGpjJl8F6LEolIbLlLgE4v0gVMVE8gsGWEwfE53I',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dmdic3VsZ21peXdvYnFoZ2ZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjczMjY0MCwiZXhwIjoyMDcyMzA4NjQwfQ.PDZjjwFCQvmhniBHX0MG3mSr4K6kMHUkwb8ySNp_5lE',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:aurovva2024@db.ivvgbsulgmiywobqhgfe.supabase.co:5432/postgres'
};

// Environment variables needed:
// DATABASE_URL - Replace aurovva2024 with your actual database password
// ALPHA_VANTAGE_API_KEY - Optional, for real-time stock data
