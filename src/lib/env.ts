import { z } from "zod";
const envSchema = z.object({
  NODE_ENV: z.enum(["development","test","production"]),
  // HMON_DATABASE_URL: z.string().url().optional(), // exemplo p/ depois
});
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  // HMON_DATABASE_URL: process.env.HMON_DATABASE_URL,
});