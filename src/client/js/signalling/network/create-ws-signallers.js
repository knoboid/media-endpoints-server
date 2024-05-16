import UserWSSignaller from "../../roles/user/user-ws-signaller.js";
import AdminSignaller from "./admin-socket-sgnaller.js";
import TransmitterSignaller from "./transmitter-signaller.js";
import ReceiverSignaller from "./receiver-signaller.js";
// import NameEntrySignaller from "../../ui/name-entry-signaller.js";

// const wss = "wss://localhost:5501";
// const wss = "wss://127.0.0.1:5502";
// const wss = "wss://192.168.43.35:5502";
// const wss = "wss://192.168.43.17:5502";
const wss = "wss://192.168.0.72:5502";
// const wss = "wss://192.168.0.72:5501";

export function createUserWSSignaller() {
  return new UserWSSignaller(wss);
}

export function createAdminWSSignaller() {
  return new AdminSignaller(wss);
}

export function createTransmitterWSSignaller(code) {
  return new TransmitterSignaller(wss, code);
}

export function createReceiverWSSignaller(code) {
  return new ReceiverSignaller(wss, code);
}

// export function createNameEntrySignaller(code) {
//   return new NameEntrySignaller(wss);
// }
