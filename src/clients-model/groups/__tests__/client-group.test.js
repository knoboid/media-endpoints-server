import ClientGroup from "../client-group.js";
import WebSocketClient from "../../client/WebSocketClient.js";

describe("client-group", () => {
  describe("ClientGroup", () => {
    describe("addClient", () => {
      it("only accepts clients with unique ids", () => {
        const cg = new ClientGroup("receiver");
        cg.addClient(new WebSocketClient(1, "receiver", "wsc1"));
        const wsc2 = new WebSocketClient(1, "receiver", "wsc2");
        expect(() => cg.addClient(wsc2)).toThrow(
          "Client with id 1 in client group 'receiver' already exists."
        );
      });
    });

    describe("getClient", () => {
      it("returns a client by id", () => {
        const cg = new ClientGroup("receiver");
        const wsc1 = cg.addClient(new WebSocketClient(11, "receiver", "wsc11"));
        const wsc2 = cg.getClient(11);
        expect(wsc1).toBe(wsc2);
      });
    });

    describe("getClients", () => {
      it("returns the array of clients", () => {
        const cg = new ClientGroup("receiver");
        const wsc1 = cg.addClient(new WebSocketClient(1, "receiver", "wsc1"));
        const wsc2 = cg.addClient(new WebSocketClient(2, "receiver", "wsc2"));
        const wscArray = cg.getClients();
        expect(wscArray[0]).toBe(wsc1);
        expect(wscArray[1]).toBe(wsc2);
      });
    });

    describe("includes", () => {
      it("returns true if a client with an id is in the group", () => {
        const cg = new ClientGroup("receiver");
        const wsc1 = cg.addClient(new WebSocketClient(1, "receiver", "wsc1"));
        const wsc2 = cg.addClient(new WebSocketClient(12, "receiver", "wsc2"));
        expect(cg.includes(1)).toBe(true);
        expect(cg.includes(2)).toBe(false);
        expect(cg.includes(12)).toBe(true);
        expect(cg.includes(13)).toBe(false);
      });
    });

    describe("removeClient", () => {
      it("removes a client by id", () => {
        const cg = new ClientGroup("receiver");
        const wsc1 = cg.addClient(new WebSocketClient(1, "receiver", "wsc1"));
        const wsc2 = cg.addClient(new WebSocketClient(2, "receiver", "wsc2"));
        let clients = cg.getClients();
        expect(cg.getClients().length).toBe(2);
        expect(clients[0]).toBe(wsc1);
        expect(cg.includes(1)).toBe(true);
        cg.removeClient(1);
        clients = cg.getClients();
        expect(clients.length).toBe(1);
        expect(clients[0]).toBe(wsc2);
        expect(cg.includes(1)).toBe(false);
      });
    });

    describe("getWebSockets", () => {
      it("returns the array of all client websockets", () => {
        const cg = new ClientGroup("receiver");
        const wsc1 = cg.addClient(new WebSocketClient(1, "receiver", "wsc1"));
        const wsc2 = cg.addClient(new WebSocketClient(2, "receiver", "wsc2"));
        expect(cg.getWebSockets()).toEqual(["wsc1", "wsc2"]);
      });
    });
  });
});
