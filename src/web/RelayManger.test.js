import { RelayManager } from "../dist/RelayManager.js";
console.log("eccomi");
const relay = new RelayManager();
relay.addEventListener(RelayManager.events.socketOpened, data => {
  console.log("socket opened");
  console.log(data.detail);
  const manager = data.detail;
  manager.initListeners();
});
relay.addEventListener(RelayManager.events.socketClosed, () => {
  console.log("socket closed");
});
relay.addEventListener(RelayManager.events.listenerSetUp, options => {
  console.log("listeners setup");
  const { get, put } = options.detail;
  const tnl_chat =
    "d6b49c39cd99e892bb745348504574c11c399a8e2d86cbe3bb182f45e0af8fae";
  get(RelayManager.getTypes.groupChat, {
    chatId: tnl_chat,
    limit: 10,
    messageHandler: data => {
      console.log(data);
    },
  });

  setTimeout(() => {
    relay.close();
  }, 3000);
});
relay.initSocket(RelayManager.relays.damus);
