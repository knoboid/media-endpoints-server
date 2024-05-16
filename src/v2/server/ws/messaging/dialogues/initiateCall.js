const initiateCallMessages = [
  {
    server: true,
    clientType: "transmitter",
    type: "initiateCall",
    handler: (options) => {
      const {
        payload,
        clientId,
        clientType,
        webSocket,
        clientGroups,
        connections,
      } = options;
      const { recieverID } = payload;
      const { receivers } = clientGroups;
      if (isNaN(recieverID) || isNaN(clientId)) return;
      console.log("initiateCallMessages");
      if (connections.attempt(clientId, recieverID)) {
        console.log("Reciever is available");
        webSocket.send(
          JSON.stringify({
            type: "initiateCallSuccess",
            payload: { recieverID },
          })
        );
        const reciever = receivers.getWebSocket(recieverID);
        reciever.send(
          JSON.stringify({
            type: "newConnectionRequest",
            payload: { transmitterID: clientId },
          })
        );
        // clientGroups.broadcastRecievers(transmitters);
      } else {
        console.log("Reciever is NOT available");
        webSocket.send(
          JSON.stringify({
            type: "initiateCallFailure",
            payload: { recieverID },
          })
        );
      }
    },
  },
  {
    server: true,
    clientType: "transmitter",
    type: "fromTransmitter",
    handler: ({ clientId, connections, payload }) => {
      const reciever = connections.getOtherPartysSocket(clientId);
      reciever.send(JSON.stringify({ type: "fromTransmitter", payload }));
    },
  },
  {
    server: true,
    clientType: "reciever",
    type: "fromReciever",
    handler: ({ clientId, connections, payload }) => {
      const transmitter = connections.getOtherPartysSocket(clientId);
      transmitter.send(JSON.stringify({ type: "fromReciever", payload }));
    },
  },
  {
    server: true,
    clientType: "transmitter",
    type: "terminated",
    handler: ({ clientId, connections, clientGroups: { receivers } }) => {
      const parties = connections.terminate(clientId);
      const receiver = receivers.getWebSocket(parties.recieverID);
      receiver.send(JSON.stringify({ type: "terminated" }));
      // clientGroups.broadcastRecievers(transmitters);
    },
  },
  {
    server: true,
    clientType: "reciever",
    type: "terminated",
    handler: ({ clientId, connections, clientGroups: { transmitters } }) => {
      const parties = connections.terminate(clientId);
      const transmitter = transmitters.getClient(parties.transmitterID);
      transmitter.send(JSON.stringify({ type: "terminated" }));
      // clientGroups.broadcastRecievers(transmitters);
    },
  },
];

export default initiateCallMessages;
