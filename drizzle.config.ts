import { defineConfig } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres:aurovva2024@db.ivvgbsulgmiywobqhgfe.supabase.co:5432/postgres",
  },
  verbose: true,
  strict: true,
} satisfies Config;
