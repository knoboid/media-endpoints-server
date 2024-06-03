import https from "https";
import express from "express";
import { wsServer } from "./ws/ws-server.js";
import { getCredentials } from "./security/https-credentials.js";

function getDefaultsFromServerConfig(serverConfig) {
  if (typeof serverConfig === "undefined") {
    serverConfig = {};
  }
  if (typeof serverConfig.serverRoot === "undefined") {
    serverConfig.serverRoot = "./public";
  }
  if (typeof serverConfig.serverOptions === "undefined") {
    serverConfig.serverOptions = getCredentials();
  }
  return serverConfig;
}

export function startServer(serverConfig) {
  const { serverRoot, serverOptions } =
    getDefaultsFromServerConfig(serverConfig);

  const app = express();

  app.use(express.static(serverRoot));

  const httpsServer = https.createServer(serverOptions, app);

  httpsServer.listen(5502);

  httpsServer.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
      wsServer.emit("connection", socket, request);
    });
  });
}
