import ClientGroup from "./client-group.js";
import EndpointGroup from "./endpoint-group.js";

const groupClasses = {
  receiver: EndpointGroup,
  transmitter: EndpointGroup,
};

class ClientGroups {
  constructor() {
    this.clientGroups = [];
    this.clientGroupMap = {};
    this.clientTypes = [];
    this.clientIdMap = {};
  }

  addGroup(clientType) {
    const groupClass =
      typeof groupClasses[clientType] === "function"
        ? groupClasses[clientType]
        : ClientGroup;
    const newClientGroup = new groupClass(clientType);
    this.clientGroups.push(newClientGroup);
    this.clientGroupMap[clientType] = newClientGroup;
    this.clientTypes.push(clientType);
  }

  addClient(client) {
    const id = client.getId();
    if (this.includesClient(id))
      throw new Error(`Client with id ${id} in client groups already exists.`);
    const clientType = client.getClientType();
    if (!this.includes(clientType)) {
      this.addGroup(clientType);
    }
    const clientGroup = this.getGroup(clientType);
    clientGroup.addClient(client);
    this.clientIdMap[id] = clientGroup;
    return client;
  }

  getGroup(clientType) {
    return this.clientGroupMap[clientType];
  }

  getGroups() {
    return this.clientGroups;
  }

  getGroupsObject() {
    return this.clientTypes.reduce((acc, clientType) => {
      acc[clientType] = this.getGroup(clientType).getClientObjects();
      return acc;
    }, {});
  }

  includes(clientType) {
    return this.clientTypes.includes(clientType);
  }

  includesClient(clientId) {
    return Object.keys(this.clientIdMap).includes(clientId + "");
  }

  debugReport() {
    console.log("Client Groups Report");
    console.log("====================");
    this.clientGroups.forEach((cg) => {
      console.log(
        `"${cg.clientType}" : (${cg.clients.length}) ${JSON.stringify(
          cg.clients.map((i) => i.id)
        )}`
      );
    });
  }
}

export default ClientGroups;
