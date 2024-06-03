import { config } from "dotenv";

config();

const env = process.env;

export function getEnv(envVar) {
  return env[envVar];
}
