import { startServer } from "./index.js";
import { credentials } from "./security/https-credentials.js";

startServer(undefined, credentials);
