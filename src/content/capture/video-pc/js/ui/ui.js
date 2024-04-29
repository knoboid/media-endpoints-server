// reciever
const rightVideo = document.getElementById("rightVideo");
const responderIDElement = document.querySelector("#responder-id");
const recieverHangupButton = document.querySelector("#reciever-hangup");

export function setRecieverID(responderID) {
  responderIDElement.innerHTML = responderID;
}

rightVideo.onloadedmetadata = () => {
  console.log(
    `Remote video videoWidth: ${rightVideo.videoWidth}px,  videoHeight: ${rightVideo.videoHeight}px`
  );
};

export class RecieverUIEvents extends EventTarget {
  constructor() {
    super();
    this.recieverHangupButton = recieverHangupButton;

    this.recieverHangupButton.onclick = () => {
      this.dispatchEvent(new Event("reciever-hangup"));
    };
  }
}

export const recieverUIEvents = new RecieverUIEvents(recieverHangupButton);
