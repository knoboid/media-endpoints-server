import { createTransmitterConnection } from "./connections/transmitter-connection.js";
import { createTransmitterWSSignaller } from "./signalling/network/create-ws-signallers.js";
import PayloadEvent from "./payload-event.js";

export default class Transmitter extends EventTarget {
  constructor(servers, stream, code, onready) {
    super();
    this.servers = servers;
    this.stream = stream;

    // const rlist = document.querySelector("#rlist");

    // rlist.setData([]);

    this.name = "p1";
    this.pc = null;

    const nWTransmitterSignaller = createTransmitterWSSignaller(code);
    this.nWTransmitterSignaller = nWTransmitterSignaller;

    this.nWTransmitterSignaller.addEventListener("onGotTransmitterID", (e) => {
      this.transmitterID = e.data;
      this.dispatchEvent(
        new PayloadEvent("onGotTransmitterID", this.transmitterID)
      );
      if (onready) {
        onready(this.transmitterID);
      }
    });

    this.nWTransmitterSignaller.addEventListener(
      "onUpdateReceivers",
      (event) => {
        this.dispatchEvent(new PayloadEvent("onUpdateReceivers", event.data));
        const otherReceivers = event.data.filter(
          // (receiver) => Number(receiver.id) !== receiverID
          (receiver) => Number(receiver.id) !== -1
        );
        // rlist.setData(otherReceivers);
      }
    );

    // rlist.addEventListener(
    //   "hangup",
    //   (e) => {
    //     this.hangup();
    //     // console.log("hangup pressed");
    //     // this.tc.pc.close();
    //     // this.nWTransmitterSignaller.send({
    //     //   type: "terminated",
    //     // });
    //   },
    //   { capture: true }
    // );

    this.nWTransmitterSignaller.addEventListener(
      "initiateCallSuccess",
      (event) => {
        console.log("get initiateCallSuccess");
        console.log(event.data);
        this.call();
      }
    );

    this.nWTransmitterSignaller.addEventListener("terminated", (event) => {
      this.pc.close();
    });

    const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    };
  }

  attachStream(stream) {
    this.stream = stream;
  }

  initiateCall(receiverID) {
    this.nWTransmitterSignaller.send({
      type: "initiateCall",
      payload: { receiverID },
    });
  }

  hangup() {
    console.log("Transmitter hangup pressed");
    this.pc.close();
    this.nWTransmitterSignaller.send({
      type: "terminated",
    });
  }

  call() {
    console.log("Starting call");
    this.pc = createTransmitterConnection(
      this.servers,
      this.name,
      this.stream,
      this.nWTransmitterSignaller
    );
  }
}
