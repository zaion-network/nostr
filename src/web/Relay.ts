declare module "./Relay" {
  interface GenericCallback<T, E, R> {
    (this: T, ev: E): R;
  }
  interface Callback<T extends Array<any>> {
    (...args: T): void;
  }

  interface OpenHandler extends GenericCallback<WebSocket, Event, any> {}
  interface ErrorHandler extends GenericCallback<WebSocket, Event, any> {}
  interface CloseHandler extends GenericCallback<WebSocket, CloseEvent, any> {}
  interface MessageHandler
    extends GenericCallback<WebSocket, MessageEvent<any>, any> {}
}

export namespace Relay {
  interface EventData {
    id: string;
    pubkey: string;
    created_at: string;
    kind: string;
    tags: string[][];
    content: string;
    sig: string;
  }
  export interface UIMessage {
    content: string;
    type: "user" | "community";
    from: string;
  }
  export enum relays {
    damus = `wss://relay.damus.io`,
    noslol = "wss://nos.lol/",
  }
  export namespace Socket {
    enum socketEvents {
      open = "open",
      message = "message",
      upgrade = "upgrade",
      close = "close",
      error = "error",
    }
    export const startSocket = (listeners?: {
      close?: (socket: WebSocket) => CloseHandler;
      error?: (socket: WebSocket) => ErrorHandler;
      message?: MessageHandler;
      open?: (socket: WebSocket) => OpenHandler;
    }) => {
      console.log("starting socket..");
      const socket = new WebSocket(Relay.relays.damus);
      socket;
      console.log(socket);
      setTimeout(() => {
        socket.close();
        console.log("socket closed");
      }, 20_000);
      if (listeners) {
        if (listeners.close)
          socket.addEventListener(socketEvents.close, listeners.close(socket));
        if (listeners.error)
          socket.addEventListener(socketEvents.error, listeners.error(socket));
        if (listeners.message)
          socket.addEventListener(socketEvents.message, listeners.message);
        if (listeners.open)
          socket.addEventListener(socketEvents.open, listeners.open(socket));
      }
    };
  }

  export enum clientMessages {
    event = "EVENT",
    request = "REQ",
    close = "CLOSE",
  }

  export enum serverMessages {
    event = "EVENT",
    eose = "EOSE",
    notice = "NOTICE",
  }

  export const openHandler: (socket: WebSocket) => OpenHandler =
    (socket) => (ev) => {
      ev;
      console.log("Connessione stabilita.");
      const generatestring = () =>
        `${Math.round(Math.random() * 10 ** 16).toString(16)}${Math.round(
          Math.random() * 10 ** 16
        ).toString(16)}`;

      const sub_id = generatestring();
      // const filter = {
      //   // authors: [author],
      //   kinds: [1],
      //   limit: 10,
      // };
      const tnl_chat =
        "d6b49c39cd99e892bb745348504574c11c399a8e2d86cbe3bb182f45e0af8fae";
      // const groupMessageFilter = {
      //   kinds: [42],
      //   limit: 10,
      // };
      const tnl_group_chat = {
        kinds: [42],
        limit: 10,
        ["#e"]: [tnl_chat],
      };
      const message = [clientMessages.request, sub_id, tnl_group_chat];
      // Invia un messaggio al server
      socket.send(JSON.stringify(message));
    };

  const isStoredData = { value: true };
  const storedDatas: UIMessage[] = [];
  // const liveDatas: UIMessage[] = [];
  export const messageHandler: (
    printMessage?: (prop: UIMessage[]) => void,
    saveToLocalStorage?: (data: UIMessage[]) => void
  ) => (userkey?: string) => MessageHandler =
    (
      sendmessage
      //, saveToLocalStorage
    ) =>
    (userkey) =>
    (message) => {
      // Riceve un messaggio dal server

      const data = JSON.parse((message as any).data) as [
        keyof typeof serverMessages,
        string,
        EventData
      ];
      const type = data[0];
      // const subid = data[1];
      const event = data[2];
      enum clientLogMessages {
        event = "Messaggio ricevuto:",
        notice = "Receive an error from relay:",
        eose = "End of stored events, starting live events:",
      }
      // if (type === "EVENT") console.log(clientLogMessages.event, data.content);

      const handleEvent = (type: keyof typeof serverMessages) => {
        type;
        if (isStoredData.value) {
          if (userkey === event.pubkey) {
            storedDatas.push({
              content: event.content,
              from: event.pubkey,
              type: "user",
            });
          } else {
            storedDatas.push({
              content: event.content,
              from: event.pubkey,
              type: "community",
            });
          }
        }
        {
          if (event.tags.length) {
          }
          // console.log(clientLogMessages.event, event.tags, event.content);
        }
      };
      const handleError = () => console.log(clientLogMessages.notice, data);

      const handleEose = () => {
        if (sendmessage) sendmessage(storedDatas.reverse());
        isStoredData.value = false;
        console.log(clientLogMessages.eose, data);
      };

      enum serverMessages {
        event = "EVENT",
        eose = "EOSE",
        notice = "NOTICE",
      }

      let map = new Map();
      map.set(serverMessages.event, handleEvent);
      map.set(serverMessages.eose, handleEose);
      map.set(serverMessages.notice, handleError);
      const action = map.get(type);
      action(type);
    };
}
