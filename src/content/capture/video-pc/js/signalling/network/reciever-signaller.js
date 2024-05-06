import PayloadEvent from "../../payload-event.js";
const clientType = "reciever";

class RecieverSignaller extends EventTarget {
  constructor(url, code) {
    super();
    this.socket = new WebSocket(url);
    let messageCounter = 0;
    // let clientId;

    this.socket.onopen = (e) => {
      console.log("SOCKET OPENED");
    };

    this.socket.onmessage = (message) => {
      switch (messageCounter) {
        case 0:
          const id = Number(message.data);
          if (isNaN(id)) throw new TypeError("Expect a number");
          console.log(`Setting id to ${id}`);
          this.id = id;
          this.socket.send(JSON.stringify({ id, clientType, code }));
          break;

        default:
          const messageObject = JSON.parse(message.data);
          const { type, payload } = messageObject;
          switch (type) {
            case "info":
              console.log(payload);
              break;

            case "recieverRegistered":
              this.dispatchEvent(
                new PayloadEvent("recieverRegistered", this.id)
              );
              break;

            case "newConnectionRequest":
              /* Some else has initiated a call */
              console.log("newConnectionRequest");
              console.log(payload);
              this.dispatchEvent(
                new PayloadEvent("newConnectionRequest", payload)
              );
              break;

            case "fromTransmitter":
              console.log("got fromTransmitter");
              console.log(payload);
              this.dispatchEvent(new PayloadEvent("fromTransmitter", payload));
              break;

            case "terminated":
              console.log("got terminated");
              this.dispatchEvent(new PayloadEvent("terminated"));
              break;

            default:
              console.log(
                `reciever signaller got unhandled message type ${type}`
              );
              break;
          }
          break;
      }
      messageCounter++;
    };
  }

  send(request) {
    this.socket.send(JSON.stringify(request));
  }

  reciever(message) {
    this.send({ type: "fromReciever", payload: message });
  }
}

export default RecieverSignaller;
