import dotenv from "dotenv";
dotenv.config();
import { defineConfig, env } from "prisma/config";

// Manual expansion of DATABASE_URL for Prisma CLI if dotenv-expand is not present
let databaseUrl = env("DATABASE_URL") || process.env.DATABASE_URL;

if (databaseUrl && databaseUrl.includes("${DB_USER}")) {
  const { DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;
  databaseUrl = `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "npx ts-node --transpile-only prisma/seed.ts",
  },
});
