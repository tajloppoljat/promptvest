import { defineConfig } from "drizzle-kit";

// Use environment variable or fallback to pre-configured database
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_H6oUOlYXP3dw@ep-lively-fog-a87emop9-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
