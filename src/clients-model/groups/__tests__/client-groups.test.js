import ClientGroups from "../client-groups.js";
import WebSocketClient from "../../client/WebSocketClient.js";
import Endpoint from "../../client/Endpoint.js";

describe("client-groups", () => {
  describe("ClientGroups", () => {
    describe("addClient", () => {
      it("only accepts clients with unique ids", () => {
        const groups = new ClientGroups();
        groups.addClient(new WebSocketClient(1, "receiver", "wsc1"));
        const wsc = new WebSocketClient(1, "transmitter", "wsc1");
        expect(() => groups.addClient(wsc)).toThrow(
          "Client with id 1 in client groups already exists."
        );
      });
    });

    describe("getGroup", () => {
      it("returns a ClientGroup object", () => {
        const groups = new ClientGroups();
        const w1 = groups.addClient(new WebSocketClient(1, "receiver", "wsc1"));
        const w2 = groups.addClient(
          new WebSocketClient(2, "transmitter", "wsc2")
        );
        const w3 = groups.addClient(new WebSocketClient(3, "receiver", "wsc2"));
        const receivers = groups.getGroup("receiver");
        const transmitters = groups.getGroup("transmitter");
        expect(receivers.getClients().length).toBe(2);
        expect(transmitters.getClients().length).toBe(1);
      });
    });

    describe("getGroupsObject", () => {
      it("returns a ClientGroup object", () => {
        const groups = new ClientGroups();
        const w1 = groups.addClient(new WebSocketClient(1, "receiver", "wsc1"));
        const w2 = groups.addClient(new Endpoint(2, "transmitter", "wsc2"));
        const w3 = groups.addClient(new WebSocketClient(3, "receiver", "wsc3"));
        const groupsObject = groups.getGroupsObject();
        expect(groupsObject["receiver"].length).toBe(2);
        expect(groupsObject["transmitter"].length).toBe(1);
        expect(groupsObject["receiver"][0]).toEqual({
          id: 1,
          clientType: "receiver",
          webSocket: "wsc1",
        });
        expect(groupsObject["receiver"][1]).toEqual({
          id: 3,
          clientType: "receiver",
          webSocket: "wsc3",
        });
        expect(groupsObject["transmitter"][0]).toEqual({
          id: 2,
          clientType: "transmitter",
          webSocket: "wsc2",
          otherParty: null,
        });
      });
    });
  });
});
