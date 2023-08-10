declare module "./Socket" {
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
export namespace Socket {
  enum socketEvents {
    open = "open",
    message = "message",
    upgrade = "upgrade",
    close = "close",
    error = "error",
  }
  export const startSocket = (
    endpoint: string,
    listeners?: {
      close?: (socket: WebSocket) => CloseHandler;
      error?: (socket: WebSocket) => ErrorHandler;
      message?: MessageHandler;
      open?: (socket: WebSocket) => OpenHandler;
    }
  ) => {
    console.log("starting socket..");
    const socket = new WebSocket(endpoint);
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
