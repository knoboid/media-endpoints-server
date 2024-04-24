class Clients {
  constructor() {
    this.clients = {};
  }

  getClient(id) {
    return this.clients[id].client;
  }

  getStatus(id) {
    return this.clients[id].status;
  }

  addClient(id, client, status) {
    this.clients[id] = { client, status };
  }

  getList() {
    return Object.keys(this.clients).map((id) => {
      const client = this.clients[id];
      return { id, status: client.status };
    });
  }

  getClients() {
    return Object.values(this.clients).map((obj) => obj.client);
  }

  remove(id) {
    delete this.clients[id];
  }

  setStatus(id, status) {
    const client = (this.clients[id].status = status);
  }

  setOtherParty(id, otherPartyID) {
    this.clients[id].otherPartyID = otherPartyID;
  }

  getOtherParty(id) {
    return this.clients[id].otherPartyID ? this.clients[id].otherPartyID : null;
  }
}

module.exports = Clients;
