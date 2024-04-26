const ws = require("ws");
const Clients = require("./clients");
let clientCounter = 0;

const callers = new Clients();
const responders = new Clients();

const wsServer = new ws.Server({ noServer: true });

function broadcastRespondersUpdate(respondersList) {
  callers.getClients().forEach((client) => {
    client.send(
      JSON.stringify({
        type: "updateResponders",
        payload: { responders: respondersList },
      })
    );
  });
}

wsServer.on("connection", (client, req) => {
  const initialRequest = req;
  const clientId = clientCounter;
  let messageCounter = 0;
  let clientType;

  client.send(clientId);

  client.on("message", (message) => {
    // console.log(`Got message  '${messageCounter}' for client '${clientId}'`);
    const object = JSON.parse(message.toString());
    switch (messageCounter) {
      case 0:
        const { id } = object;
        clientType = object.clientType;
        if (isNaN(id)) throw new TypeError("Expected a number");
        if (id !== clientId)
          throw new Error(`Expect id of ${clientId}, instead got ${id}`);
        if (clientType === "caller") {
          console.log(`Registering caller ${clientId}`);
          callers.addClient(clientId, client, "available");
        } else if (clientType === "responder") {
          console.log(`Registering responder ${clientId}`);
          responders.addClient(clientId, client, "available");
          broadcastRespondersUpdate(responders.getList());
        }
        break;

      default:
        const { type, payload } = object;
        switch (type) {
          case "info":
            client.send(
              JSON.stringify({ type, payload: { client, initialRequest } })
            );
            break;
          case "getResponders":
            client.send(
              JSON.stringify({
                type: "updateResponders",
                payload: { responders: responders.getList() },
              })
            );
            break;
          case "initiateCall":
            /* first contact from a caller wishing to make a call */
            const { responderID } = payload;
            console.log(
              `Preparing to initiate call  between ${clientId} and ${responderID}`
            );
            const isResponderAvailable =
              responders.getStatus(responderID) === "available";
            const isCallerAvailable =
              callers.getStatus(clientId) === "available";
            if (isResponderAvailable && isCallerAvailable) {
              console.log("Responder is available");
              client.send(
                JSON.stringify({
                  type: "initiateCallSuccess",
                  payload: { responderID },
                })
              );
              const responder = responders.getClient(responderID);
              responder.send(
                JSON.stringify({
                  type: "initiateResponse",
                  payload: { callerID: clientId },
                })
              );
              responders.setStatus(responderID, "busy");
              callers.setStatus(clientId, "busy");
              callers.setOtherParty(clientId, responderID);
              responders.setOtherParty(responderID, clientId);
              broadcastRespondersUpdate(responders.getList());
            } else {
              console.log("Responder is NOT available");
              client.send(
                JSON.stringify({
                  type: "initiateCallFailure",
                  payload: { responderID },
                })
              );
            }
            break;

          case "fromCaller":
            console.log("Handling fromCaller");
            const responderId = callers.getOtherParty(clientId);
            console.log(responderId);
            const responder = responders.getClient(responderId);
            responder.send(JSON.stringify({ type, payload }));
            break;

          case "fromResponder":
            console.log("Handling fromResponder");
            const callerID = responders.getOtherParty(clientId);
            console.log(callerID);
            const caller = callers.getClient(callerID);
            caller.send(JSON.stringify({ type, payload }));
            break;

          case "terminated":
            console.log("Handling terminated");
            if (clientType === "caller") {
              const responderId = callers.getOtherParty(clientId);
              callers.setStatus(clientId, "available");
              callers.removeOtherParty(clientId);
              responders.setStatus(responderId, "available");
              responders.removeOtherParty(responderId);
              const responder = responders.getClient(responderId);
              responder.send(JSON.stringify({ type: "terminated" }));
            } else if (clientType === "responder") {
              const callerId = responders.getOtherParty(clientId);
              responders.setStatus(clientId, "available");
              responders.removeOtherParty(clientId);
              callers.setStatus(callerId, "available");
              callers.removeOtherParty(callerId);
              const caller = callers.getClient(callerId);
              caller.send(JSON.stringify({ type: "terminated" }));
            }
            broadcastRespondersUpdate(responders.getList());
            break;

          default:
            console.log(`UNHANDLED WS TYPE ${type}`);
            break;
        }
        break;
    }
    messageCounter++;
  });

  client.on("close", () => {
    console.log(`Closing connection to ${clientType} with id: ${clientId}`);
    // TODO tidy up with any other parties
    if (clientType === "caller") {
      const responderId = callers.getOtherParty(clientId);
      if (responderId !== null) {
        callers.setStatus(clientId, "available");
        callers.removeOtherParty(clientId);
        responders.setStatus(responderId, "available");
        responders.removeOtherParty(responderId);
        const responder = responders.getClient(responderId);
        responder.send(JSON.stringify({ type: "terminated" }));
      }

      callers.remove(clientId);
    } else if (clientType === "responder") {
      const callerId = responders.getOtherParty(clientId);
      if (callerId !== null) {
        responders.setStatus(clientId, "available");
        responders.removeOtherParty(clientId);
        callers.setStatus(callerId, "available");
        callers.removeOtherParty(callerId);
        const caller = callers.getClient(callerId);
        caller.send(JSON.stringify({ type: "terminated" }));
      }

      responders.remove(clientId);
    }
    broadcastRespondersUpdate(responders.getList());
  });

  clientCounter++;
});

exports.wsServer = wsServer;
