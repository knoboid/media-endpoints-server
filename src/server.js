import { startServer } from "./v2/server/index.js";
import { credentials } from "./v2/server/security/https-credentials.js";

startServer(undefined, credentials);
