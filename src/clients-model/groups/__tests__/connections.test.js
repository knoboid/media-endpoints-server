import Endpoint from "../../client/Endpoint.js";
import Connections from "../connections.js";
import ClientGroups from "../client-groups.js";

describe("connections", () => {
  describe("Connections", () => {
    describe("constructor", () => {
      it(`accepts a ClientGroups object and creates receiver and transmitter 
                                  client-groups if they don't exist`, () => {
        const groups = new ClientGroups();
        new Connections(groups);
        expect(groups.includes("receiver")).toBe(true);
        expect(groups.includes("transmitter")).toBe(true);
      });
    });

    describe("attempt", () => {
      it(`rejects invalid connection attempts giving a reason`, () => {
        const groups = new ClientGroups();
        const connections = new Connections(groups);
        let result = connections.attempt(1, 2);
        expect(result.result).toBe(false);
        expect(result.reason).toBe("1: no such transmitter");
        const t1 = new Endpoint(1, "transmitter", "wst1");
        groups.addClient(t1);
        result = connections.attempt(1, 2);
        expect(result.result).toBe(false);
        expect(result.reason).toBe("2: no such receiver");
        const r2 = new Endpoint(2, "receiver", "wsr2");
        groups.addClient(r2);

        result = connections.attempt(1, 2);
        expect(result.result).toBe(true);

        const t3 = new Endpoint(3, "transmitter", "wst3");
        groups.addClient(t3);
        result = connections.attempt(3, 2);
        expect(result.result).toBe(false);
        expect(result.reason).toBe("receiver '2' is engaged");
      });

      it("rejects", () => {
        const groups = new ClientGroups();
        const connections = new Connections(groups);
        const t1 = new Endpoint(1, "transmitter", "wst1");
        let result = connections.attempt(1, 1);
        expect(result.result).toBe(false);
      });

      it("affects the endpont state on succuss", () => {
        const groups = new ClientGroups();
        const connections = new Connections(groups);
        const t1 = new Endpoint(1, "transmitter", "wst1");
        groups.addClient(t1);
        const r1 = new Endpoint(2, "receiver", "wsr1");
        groups.addClient(r1);
        expect(t1.isEngaged()).toBe(false);
        expect(r1.isEngaged()).toBe(false);
        const attemptConnection = connections.attempt(1, 2);
        expect(attemptConnection.result).toBe(true);
        expect(attemptConnection.connectionId).toBe(1);
        expect(t1.isEngaged()).toBe(true);
        expect(r1.isEngaged()).toBe(true);
        expect(t1.otherParty).toBe(2);
        expect(r1.otherParty).toBe(1);
        expect(t1.connectionId).toBe(1);
        expect(r1.connectionId).toBe(1);
        expect(connections.connectionCount()).toBe(1);
        connections.disconnectTransmitter(1);
        expect(t1.isEngaged()).toBe(false);
        expect(r1.isEngaged()).toBe(false);
        expect(connections.connectionCount()).toBe(0);
      });
    });
  });
});
