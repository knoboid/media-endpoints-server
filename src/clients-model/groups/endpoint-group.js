import ClientGroup from "./client-group.js";

/**
 * Maintains a list of Endpoint objects of the same clientType
 */
class EndpontGroup extends ClientGroup {
  constructor(clientType) {
    super(clientType);
  }

  canConnect(clientId) {
    if (!this.includes(clientId))
      return {
        result: false,
        reason: `${clientId}: no such ${this.clientType}`,
      };

    const client = this.getClient(clientId);
    if (client.isEngaged()) {
      return {
        result: false,
        reason: `${this.clientType} '${clientId}' is engaged`,
      };
    }
    return { result: true };
  }

  connect(clientId, otherPartyId, connectionId) {
    const client = this.getClient(clientId);
    client.setConnection(otherPartyId, connectionId);
  }

  disconnect(clientId) {
    const client = this.getClient(clientId);
    client.disconnect();
  }
}

export default EndpontGroup;
