import dotenv from "dotenv";

dotenv.config();

const required = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  db: {
    host: required("DB_HOST", "localhost"),
    port: Number(process.env.DB_PORT ?? 3306),
    name: required("DB_NAME", "scheduling_system"),
    user: required("DB_USER", "scheduler"),
    password: required("DB_PASSWORD", "scheduler_password")
  },
  jwt: {
    secret: required("JWT_SECRET", "replace-with-a-long-random-secret"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1d"
  },
  slotIntervalMinutes: Number(process.env.SLOT_INTERVAL_MINUTES ?? 30)
};
