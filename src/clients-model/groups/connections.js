class Connections {
  constructor(clientGroups) {
    if (!clientGroups.includes("transmitter")) {
      clientGroups.addGroup("transmitter");
    }
    if (!clientGroups.includes("receiver")) {
      clientGroups.addGroup("receiver");
    }

    this.transmitterGroup = clientGroups.getGroup("transmitter");
    this.receiverGroup = clientGroups.getGroup("receiver");

    this.nextId = 1;
    this.connections = {};
  }

  attempt(transmitterId, receiverId) {
    const canTransmitterConnect =
      this.transmitterGroup.canConnect(transmitterId);
    if (!canTransmitterConnect.result) return canTransmitterConnect;

    const canReceiverConnect = this.receiverGroup.canConnect(receiverId);
    if (!canReceiverConnect.result) return canReceiverConnect;

    const connectionId = this.connect(transmitterId, receiverId);
    return { result: true, connectionId };
  }

  connect(transmitterId, receiverId) {
    const newId = this.nextId;
    this.transmitterGroup.connect(transmitterId, receiverId, newId);
    this.receiverGroup.connect(receiverId, transmitterId, newId);
    this.connections[newId] = { transmitterId, receiverId };
    this.nextId++;
    return newId;
  }

  disconnectTransmitter(transmitterId) {
    if (!this.transmitterGroup.includes(transmitterId)) return false;
    const transmitter = this.transmitterGroup.getClient(transmitterId);
    if (!transmitter.isEngaged()) return false;
    const connectionId = transmitter.connectionId;
    this.disconnect(connectionId);
  }

  disconnectReceiver(receiverId) {
    if (!this.receiverGroup.includes(receiverId)) return false;
    const receiver = this.receiverGroup.getClient(receiverId);
    if (!receiver.isEngaged()) return false;
    const connectionId = receiver.connectionId;
    this.disconnect(connectionId);
  }

  disconnect(connectionId) {
    const { transmitterId, receiverId } = this.connections[connectionId];
    this.transmitterGroup.disconnect(transmitterId);
    this.receiverGroup.disconnect(receiverId);
    delete this.connections[connectionId];
  }

  connectionCount() {
    return Object.keys(this.connections).length;
  }

  getData() {
    const connections = Object.values(this.connections).map((c) => {
      return { transmitterID: c.transmitterId, receiverID: c.receiverId };
    });
    return {
      transmitters: this.transmitterGroup.getClients().map((c) => {
        return { id: c.id, name: c.name, status: c.status() };
      }),
      receivers: this.receiverGroup.getClients().map((c) => {
        return { id: c.id, name: c.name, status: c.status() };
      }),
      connections,
    };
  }

  debugReport() {
    console.log("Connections Report");
    console.log("====================");
    let cg = this.transmitterGroup;
    console.log(
      `"${cg.clientType}" : (${cg.clients.length}) ${JSON.stringify(
        cg.clients.map((i) => i.id)
      )}`
    );
    cg = this.receiverGroup;
    console.log(
      `"${cg.clientType}" : (${cg.clients.length}) ${JSON.stringify(
        cg.clients.map((i) => i.id)
      )}`
    );
  }
}

export default Connections;
