import { parseEnv } from "znv";
import z from "zod";

function getConfig() {
  const config = parseEnv(process.env, {
    DATABASE_URL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    NEXTAUTH_SECRET: z.string(),
    NODE_ENV: z.enum(["development", "production"]),
  });

  return {
    ...config,
    isDev: config.NODE_ENV == "development",
    isProd: config.NODE_ENV == "production",
  };
}

export type Config = ReturnType<typeof getConfig>;

export const config: Config = getConfig();
