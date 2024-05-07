function wsUser({
  client,
  type,
  payload,
  clientId,
  redeemCodes,
  users,
  pendingConnections,
}) {
  let code;
  let uuid;
  switch (type) {
    case "requestTransmitter":
      const { requestUUID } = payload;
      console.log(requestUUID);
      code = redeemCodes.generate(clientId, "registerTransmitter");
      console.log(code);
      client.send(
        JSON.stringify({
          type: "transmitterRegistrationCode",
          payload: { code, requestUUID },
        })
      );
      break;

    case "initiateCallToUser":
      const { tranmitterId } = payload;
      uuid = pendingConnections.add(clientId, tranmitterId, payload.userId);
      if (uuid) {
        const recievingUser = users.getUser(payload.userId);
        code = redeemCodes.generate(recievingUser.clientId, "registerReciever");
        recievingUser.client.send(
          JSON.stringify({
            type: "requestReciever",
            payload: { userId: clientId, code, uuid },
          })
        );
      }
      break;

    case "recieverReady":
      console.log("recieverReady", payload);
      const { userId, recieverId } = payload;
      uuid = payload.uuid;
      pendingConnections.addReceiverId(uuid, recieverId);
      const { transmitterId } = pendingConnections.get(uuid);
      const transmittingUser = users.getUser(payload.userId);
      transmittingUser.client.send(
        JSON.stringify({
          type: "userReady",
          payload: { userId, recieverId, transmitterId, uuid },
        })
      );

      break;

    default:
      console.log(`ws user - unhandled type: ${type}`);
      console.log("payload");
      console.log(payload);
      break;
  }
}

module.exports = wsUser;
