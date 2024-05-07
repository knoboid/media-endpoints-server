const User = require("./user");

class Users {
  constructor() {
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
      record.receivers = user.recievers;
      record.transmitterCount = user.transmitters.length;
      record.recieverCount = user.recievers.length;
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
    this.broadcast("updateUsers", this.getUsersTable());
  }

  addTransmitter(clientId, transmitterId) {
    const user = this.getUser(clientId);
    user.addTransmitter(transmitterId);
    this.broadcastUpdate();
  }

  addReciever(clientId, recieverId) {
    const user = this.getUser(clientId);
    user.addReciever(recieverId);
    this.broadcastUpdate();
  }
}

module.exports = Users;
