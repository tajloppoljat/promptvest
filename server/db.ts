import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use environment variable or fallback to pre-configured database
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_H6oUOlYXP3dw@ep-lively-fog-a87emop9-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });