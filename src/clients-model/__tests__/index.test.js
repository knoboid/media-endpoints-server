import ClientModel, { createReceiver, createTransmitter } from "../index.js";

describe("create-receiver.js", () => {
  test("createReceiver", () => {
    const cleintModel = new ClientModel();
    const r1 = cleintModel.createReceiver(1, "ws1");
    const r2 = cleintModel.createReceiver(2, "ws2");
    expect(r1.getWebSocket()).toBe("ws1");
    expect(r2.getWebSocket()).toBe("ws2");
    expect(r1.getClientType()).toBe("receiver");
    expect(r2.getClientType()).toBe("receiver");
    expect(r1.isReceiver()).toBeTruthy();
    expect(r2.isReceiver()).toBeTruthy();
    expect(r1.isTransmitter()).toBeFalsy();
    expect(r2.isTransmitter()).toBeFalsy();
    expect(r1.getId()).not.toBe(r2.getId());
  });
});

describe("create-receiver.js", () => {
  test("createTransmitter", () => {
    const cleintModel = new ClientModel();
    const r1 = cleintModel.createTransmitter(1, "ws1");
    const r2 = cleintModel.createTransmitter(2, "ws2");
    expect(r1.getWebSocket()).toBe("ws1");
    expect(r2.getWebSocket()).toBe("ws2");
    expect(r1.getClientType()).toBe("transmitter");
    expect(r2.getClientType()).toBe("transmitter");
    expect(r1.isReceiver()).toBeFalsy();
    expect(r2.isReceiver()).toBeFalsy();
    expect(r1.isTransmitter()).toBeTruthy();
    expect(r2.isTransmitter()).toBeTruthy();
    expect(r1.getId()).not.toBe(r2.getId());
  });
});
