const https = require("https");
const credentials = require("./https-credentials").credentials;
var wsServer = require("./ws-server").wsServer;

const express = require("express");

const app = express();

const appPath = ".";

app.use(express.static(appPath));

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(5501);

httpsServer.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
