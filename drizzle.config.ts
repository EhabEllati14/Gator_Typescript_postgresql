import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
  },
} satisfies Config;
