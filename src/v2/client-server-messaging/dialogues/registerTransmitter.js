import { broadcastToClientGroup } from "../util.js";

const registerTransmitterMessages = [
  {
    server: false,
    clientType: "transmitter",
    zeroMessage: true,
    handler: ({ type, payload, data, webSocket, dispatch, clientType }) => {
      console.assert(type === "clientId");
      const id = payload.clientId;
      if (isNaN(id)) throw new TypeError("Expect a number");
      console.log(`Setting id to ${id}`);
      data.id = id;
      // TODO redeem codes
      webSocket.send(JSON.stringify({ id, clientType }));
      dispatch("onGotTransmitterID", id);
    },
  },
  {
    server: true,
    clientType: "transmitter",
    zeroMessage: true,
    handler: ({
      clientId,
      webSocket,
      clientGroups: { transmitters, dataViewers },
      connections,
    }) => {
      console.log(`New transmitter: ${clientId}`);
      transmitters.addClient(clientId, webSocket, "available");
      broadcastToClientGroup(
        dataViewers,
        "endpointData",
        connections.getData()
      );
    },
  },
];

export default registerTransmitterMessages;
