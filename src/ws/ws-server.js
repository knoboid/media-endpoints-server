import { WebSocketServer } from "ws";
import {
  messageHandlers,
  closedHandlers,
} from "./messaging/message-handlers/message-handlers.js";
import ClientModel from "../clients-model/index.js";

const clientModel = new ClientModel();

let clientCounter = 0;

export const wsServer = new WebSocketServer({ noServer: true });

wsServer.on("connection", (webSocket, req) => {
  console.log("connected");
  const clientId = clientCounter;
  let messageCounter = 0;
  let clientType;
  webSocket.send(JSON.stringify({ type: "clientId", payload: { clientId } }));

  webSocket.on("message", (message) => {
    const {
      clientType: clientType_,
      type,
      payload,
    } = JSON.parse(message.toString());
    if (clientType_) {
      clientType = clientType_;
    }
    messageHandlers({
      webSocket,
      clientId,
      clientModel,
      messageCounter,
      clientType,
      type,
      payload,
      message,
    });
    messageCounter++;
  });

  webSocket.on("close", () => {
    closedHandlers({ clientType, clientId, clientModel });
  });

  clientCounter++;
});
