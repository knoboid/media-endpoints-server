import { createReceiverConnection } from "./connections/receiver-connection.js";
import { createReceiverWSSignaller } from "./signalling/network/create-ws-signallers.js";

class Receiver {
  constructor(servers, videoElement, code, onready, onhangup) {
    this.servers = servers;
    this.onhangup = onhangup;
    const p2 = "p2";
    this.pc;

    this.nWReceiverSignaller = createReceiverWSSignaller(code);

    this.nWReceiverSignaller.addEventListener("receiverRegistered", (e) => {
      const receiverID = e.data;
      console.log("before onready");
      console.log(e);
      console.log(receiverID);
      // setReceiverID(receiverID);
      onready(receiverID);
    });

    this.nWReceiverSignaller.addEventListener("newConnectionRequest", () => {
      this.receive(videoElement);
    });

    this.nWReceiverSignaller.addEventListener("terminated", (e) => {
      console.log("Receiver terminating");
      console.log(e);
      this.pc.close();
    });

    const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    };
  }

  receive(videoElement) {
    console.log("Receive");
    this.pc = createReceiverConnection(
      this.servers,
      this.p2,
      this.nWReceiverSignaller,
      videoElement
    );
  }
}

export default Receiver;