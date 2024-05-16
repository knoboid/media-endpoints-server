const User = require("./user");

class PayloadEvent extends Event {
  constructor(name, data) {
    super(name);
    this.data = data;
  }
}

class Users extends EventTarget {
  constructor() {
    super();
    this.users = {};
  }

  removeUser(clientId) {
    delete this.users[clientId];
    this.broadcastUpdate();
  }

  addUser(clientId, client) {
    const user = new User(clientId, client);
    this.users[clientId] = user;
    this.broadcastUpdate();
  }

  getUser(clientId) {
    return this.users[clientId];
  }

  getUsers() {
    return Object.values(this.users);
  }

  getUsersTable() {
    return this.getUsers().map((user) => {
      const record = {};
      record.id = user.clientId;
      record.transmitters = user.transmitters;
      record.receivers = user.receivers;
      record.transmitterCount = user.transmitters.length;
      record.receiverCount = user.receivers.length;
      record.username = user.username;
      return record;
    });
  }

  broadcast(type, payload) {
    this.getUsers().forEach((user) => {
      const clientSocket = user.getSocket();
      clientSocket.send(
        JSON.stringify({
          type,
          payload,
        })
      );
    });
  }

  broadcastUpdate() {
    this.dispatchEvent(new PayloadEvent("updateUsers", this.getUsersTable()));
    this.broadcast("updateUsers", this.getUsersTable());
  }

  addTransmitter(clientId, transmitterId) {
    const user = this.getUser(clientId);
    user.addTransmitter(transmitterId);
    this.broadcastUpdate();
  }

  addReciever(clientId, receiverId) {
    const user = this.getUser(clientId);
    user.addReciever(receiverId);
    this.broadcastUpdate();
  }

  userOwnsTransmitter(clientId, transmitterId) {
    return this.getUser(clientId).ownsTransmitter(transmitterId);
  }

  setUsername(clientId, username) {
    const user = this.getUser(clientId);
    user.setUsername(username);
    this.broadcastUpdate();
  }
}

module.exports = Users;
