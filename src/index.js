import https from "https";
import express from "express";
import { wsServer } from "./ws/ws-server.js";

export function startServer(serverRoot, serverOptions) {
  if (typeof serverRoot === "undefined") {
    serverRoot = "./src";
  }
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
