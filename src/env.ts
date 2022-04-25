import dotenv from "dotenv";

dotenv.config();

export interface Env {
  NODE_ENV: "development" | "production" | "test";
  HOST: string;
  PORT: string;
  LOG_LEVEL: "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "silent";
  RIOT_API_KEY: string;
}

export const env: Env = {
  NODE_ENV: process.env.NODE_ENV as Env["NODE_ENV"],
  HOST: process.env.HOST || "0.0.0.0",
  PORT: process.env.PORT || "8080",
  LOG_LEVEL: process.env.LOG_LEVEL as Env["LOG_LEVEL"],
  RIOT_API_KEY: process.env.RIOT_API_KEY as Env["RIOT_API_KEY"],
};
