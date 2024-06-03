import ClientGroups from "./groups/client-groups.js";
import Connections from "./groups/connections.js";
import WebSocketClient from "./client/WebSocketClient.js";
import Endpoint from "./client/Endpoint.js";

class ClientModel {
  constructor() {
    console.log("Creating new client model");
    this.clientGroups = new ClientGroups();
    this.connections = new Connections(this.clientGroups);
  }

  createTransmitter(id, webSocket) {
    return this.clientGroups.addClient(
      new Endpoint(id, "transmitter", webSocket)
    );
  }

  createReceiver(id, webSocket) {
    return this.clientGroups.addClient(new Endpoint(id, "receiver", webSocket));
  }

  createDataViewer(id, webSocket) {
    return this.clientGroups.addClient(
      new WebSocketClient(id, "dataViewer", webSocket)
    );
  }

  getClient(clientId) {
    const clientGroup = this.clientGroups.clientIdMap[clientId];
    return clientGroup.getClient(clientId);
  }

  disconnectClient(clientId) {
    const client = this.getClient(clientId);
    if (typeof client.otherParty !== "undefined" && !client.isEngaged()) return;
    const otherPartySocket = this.getClient(client.otherParty).getWebSocket();
    if (client.isTransmitter()) {
      this.connections.disconnectTransmitter(clientId);
    } else if (client.isReceiver()) {
      this.connections.disconnectReceiver(clientId);
    }
    otherPartySocket.send(JSON.stringify({ type: "terminated" }));
  }

  deleteClient(clientId) {
    const client = this.getClient(clientId);
    this.disconnectClient(clientId);
    const clientGroup = this.clientGroups.clientIdMap[clientId];
    return clientGroup.removeClient(clientId);
  }

  getClientGroupWebSockets(clientType) {
    const clientGroup = this.clientGroups.clientGroupMap[clientType];
    return typeof clientGroup === "undefined"
      ? []
      : clientGroup.getWebSockets();
  }

  broadcastToClientGroup(clientType, type, payload) {
    const clientGroupWebSockets = this.getClientGroupWebSockets(clientType);
    clientGroupWebSockets.forEach((webSocket) => {
      webSocket.send(JSON.stringify({ type, payload }));
    });
  }
}

export default ClientModel;
