class Client {
  constructor(id, clientType) {
    this.id = id;
    this.clientType = clientType;
  }

  getId() {
    return this.id;
  }

  getClientType() {
    return this.clientType;
  }

  getObject() {
    return { id: this.getId(), clientType: this.getClientType() };
  }
}

export default Client;
