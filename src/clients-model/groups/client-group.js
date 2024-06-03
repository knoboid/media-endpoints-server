/**
 * Maintains a list of WebSocketClient objects of the same clientType
 */
class ClientGroup {
  constructor(clientType) {
    this.clientType = clientType;
    this.clients = [];
    this.clientIds = [];
    this.clientMap = {};
  }

  getClientType() {
    return this.clientType;
  }

  addClient(client) {
    const id = client.getId();
    if (this.clientIds.includes(id))
      throw new Error(
        `Client with id ${id} in client group '${this.clientType}' already exists.`
      );
    this.clients.push(client);
    this.clientIds.push(id);
    this.clientMap[id] = client;
    return client;
  }

  getClient(id) {
    return this.clientMap[id];
  }

  getClients() {
    return this.clients;
  }

  getClientObjects() {
    return this.getClients().map((client) => client.getObject());
  }

  includes(id) {
    return this.clientIds.includes(id);
  }

  removeClient(id) {
    this.clients = this.clients.filter((client) => client.getId() !== id);
    this.clientIds = this.clientIds.filter((clientId) => clientId !== id);
    delete this.clientMap[id];
  }

  getWebSockets() {
    return this.clients.map((client) => client.getWebSocket());
  }
}

export default ClientGroup;
