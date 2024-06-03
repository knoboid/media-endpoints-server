import fs from "fs";
import { getEnv } from "./util.js";

const privateKey = fs.readFileSync(getEnv("SERVER_KEY"), "utf8");
const certificate = fs.readFileSync(getEnv("SERVER_CERT"), "utf8");
const passphrase = getEnv("PASSPHRASE");

export const credentials = {
  key: privateKey,
  cert: certificate,
  passphrase,
};

export function getCredentials() {
  const privateKey = fs.readFileSync(getEnv("SERVER_KEY"), "utf8");
  const certificate = fs.readFileSync(getEnv("SERVER_CERT"), "utf8");
  const passphrase = getEnv("PASSPHRASE");

  return {
    key: privateKey,
    cert: certificate,
    passphrase,
  };
}
