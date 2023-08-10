import WebSocket from "ws";
import { Event } from "./Event";
import { IncomingMessage } from "http";
import { Nostr } from "./Nostr";

const relayTest = () => {
  // URL del server WebSocket
  const eden = "wss://eden.nostr.land";
  const damus = `wss://relay.damus.io`;
  const snort = `wss://relay.snort.social`;
  const author =
    "005be03966ded6393a773e61469698b48a90944f6ce2b055b1d099e2c5fb1756";

  // Crea una nuova istanza del client WebSocket
  const socket = new WebSocket(damus);

  // Gestione degli eventi del client WebSocket
  const handleOpen = () => {
    console.log("Connessione stabilita.");
    const generatestring = () =>
      `${Math.round(Math.random() * 10 ** 16).toString(16)}${Math.round(
        Math.random() * 10 ** 16
      ).toString(16)}`;

    const sub_id = generatestring();
    const filter: Partial<Nostr.Event.ClientToRelay.Filter> = {
      // authors: [author],
      kinds: [1],
      limit: 10,
    };
    const message: Nostr.Event.ClientToRelay.Req = [
      Nostr.Event.clientMessages.request,
      sub_id,
      filter,
    ];
    console.log();
    // Invia un messaggio al server
    socket.send(JSON.stringify(message));
  };

  const handleMessage = (message: WebSocket.RawData) => {
    // Riceve un messaggio dal server
    const data = JSON.parse(message.toString());
    const type = data[0];
    const subid = data[1];
    const event: Nostr.Event.Event<any, any> = data[2];
    enum clientLogMessages {
      event = "Messaggio ricevuto:",
      notice = "Receive an error from relay:",
      eose = "End of stored events, starting live events:",
    }
    // if (type === "EVENT") console.log(clientLogMessages.event, data.content);

    const handleEvent = () => {
      {
        if (event.tags.length)
          console.log(clientLogMessages.event, event.tags, event.content);
      }
    };
    const handleError = () => console.log(clientLogMessages.notice, data);

    const handleEose = () => console.log(clientLogMessages.eose, data);

    let map = new Map();
    map.set(Nostr.Event.serverMessages.event, handleEvent);
    map.set(Nostr.Event.serverMessages.eose, handleEose);
    map.set(Nostr.Event.serverMessages.notice, handleError);
    const action = map.get(type);
    action();
  };

  const handleUpgrade = (e: IncomingMessage) => console.log("received upgrade");

  const handleClose = (code: number, reason: Buffer) => {
    console.log("Connessione chiusa:", code, reason.toString());
  };

  const handleError = (error: Error) => {
    console.error("Errore:", error);
  };

  enum socketEvents {
    open = "open",
    message = "message",
    upgrade = "upgrade",
    close = "close",
    error = "error",
  }

  socket.on("open", handleOpen);
  socket.on("message", handleMessage);
  socket.on("upgrade", handleUpgrade);
  socket.on("close", handleClose);
  socket.on("error", handleError);

  setTimeout(() => {
    socket.close();
  }, 20_000);
};
