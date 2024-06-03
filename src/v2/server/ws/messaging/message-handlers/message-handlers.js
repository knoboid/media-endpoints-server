import { processMessages } from "@media-endpoints/signalling";

const { serverMessagingManager } = processMessages();

export function messageHandlers(options) {
  serverMessagingManager.handle(options);
}

export function closedHandlers(options) {
  serverMessagingManager.handleClosed(options);
}
