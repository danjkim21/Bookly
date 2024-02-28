import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { env } from "@/lib/env.mjs";

export const db = drizzle(sql);
