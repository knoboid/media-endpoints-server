import Peer from "./peer.js";
import PeerRegistry from "./peer-registrty.js";
import ConnectionRegistry from "./connection-registry.js";
import { createCallerConnection } from "./connections/caller-connection.js";
import { createResponderConnection } from "./connections/responder-connection.js";
import SignallingChannel from "./signalling/same-page/signalling-channel.js";
import CallerSignaller from "./signalling/same-page/caller-signaller.js";
import ResponderSignaller from "./signalling/same-page/responder-signaller.js";

const wss = "wss://localhost:5501";

const leftVideo = document.getElementById("leftVideo");
const rightVideo = document.getElementById("rightVideo");

export function peerConnect(stream) {
  console.log("success");
  leftVideo.srcObject = stream;

  const p1 = "p1";
  const p2 = "p2";

  const signallingChannel = new SignallingChannel();
  const callerSignaller = new CallerSignaller(signallingChannel);
  const responderSignaller = new ResponderSignaller(signallingChannel);

  const peers = new PeerRegistry();
  peers.addPeer(new Peer(p1));
  peers.addPeer(new Peer(p2));
  const connections = new ConnectionRegistry(peers);
  connections.connect(p1, p2);

  let pc1, caller;
  let pc2, responder;
  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };

  let startTime;

  // Video tag capture must be set up after video tracks are enumerated.
  leftVideo.oncanplay = call;
  if (leftVideo.readyState >= 3) {
    // HAVE_FUTURE_DATA
    // Video is already ready to play, call maybeCreateStream in case oncanplay
    // fired before we registered the event handler.
    call();
  }

  leftVideo.play();

  rightVideo.onloadedmetadata = () => {
    console.log(
      `Remote video videoWidth: ${rightVideo.videoWidth}px,  videoHeight: ${rightVideo.videoHeight}px`
    );
  };

  rightVideo.onresize = () => {
    console.log(
      `Remote video size changed to ${rightVideo.videoWidth}x${rightVideo.videoHeight}`
    );
    // We'll use the first onresize callback as an indication that
    // video has started playing out.
    if (startTime) {
      const elapsedTime = window.performance.now() - startTime;
      console.log("Setup time: " + elapsedTime.toFixed(3) + "ms");
      startTime = null;
    }
  };

  function call() {
    console.log("Starting call");
    startTime = window.performance.now();
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    const servers = null;

    caller = createCallerConnection(servers, p1, stream, callerSignaller);
    pc1 = caller;
    peers.setConnection(p1, pc1);
    console.log("Created local peer connection object pc1");

    responder = createResponderConnection(servers, p2, responderSignaller);
    pc2 = responder;
    peers.setConnection(p2, pc2);
    console.log("Created remote peer connection object pc2");
  }
}
