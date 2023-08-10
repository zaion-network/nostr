declare module "./RelayManager" {
  type sub_id = string;
  type chat_id = string;
  type emit_details = [sub_id, EventData];
  interface GenericCallback<T, E, R> {
    (this: T, ev: E): R;
  }
  interface Callback<T extends Array<any>> {
    (...args: T): void;
  }
  interface CustomEventCallback<T> {
    (ev: CustomEvent<T>): void;
  }
  interface initListenersOps {
    message?: () => {};
    close?: () => void;
    error?: () => {};
  }
  interface Methods {
    get: RelayManager<WebSocket>["get"];
    put: RelayManager<WebSocket>["put"];
  }
  type CustomEventCbArgs<E, T> = [E, CustomEventCallback<T>];
  interface GetOptions {
    chatId: chat_id;
    limit: number;
    messageHandler: (data: EventData & { isLive: boolean }) => boolean;
  }

  interface OpenHandler extends GenericCallback<WebSocket, Event, any> {}
  interface ErrorHandler extends GenericCallback<WebSocket, Event, any> {}
  interface CloseHandler extends GenericCallback<WebSocket, CloseEvent, any> {}
  interface MessageHandler
    extends GenericCallback<WebSocket, MessageEvent<any>, any> {}
  namespace RelayManager {
    interface Filter {
      kinds: number[];
      limit: number;
      [tags.e]: string[];
    }
  }
  interface EventData {
    id: string;
    pubkey: string;
    created_at: string;
    kind: string;
    tags: string[][];
    content: string;
    sig: string;
  }
}

export interface RelayManager<S extends WebSocket | undefined>
  extends EventTarget {
  emit(
    eventName: RelayManager.events.socketOpened,
    manager: RelayManager<WebSocket>
  ): boolean;
  emit(eventName: RelayManager.events.listenerSetUp, options: Methods): boolean;
  emit(eventName: RelayManager.events.getRequest, socket: undefined): boolean;
  emit(
    eventName: RelayManager.events,
    socket?:
      | WebSocket
      | RelayManager<WebSocket>
      | this["initListeners"]
      | Methods
  ): boolean;
  addEventListener(
    ...args: CustomEventCbArgs<
      RelayManager.events.socketOpened,
      RelayManager<WebSocket>
    >
  ): this;
  addEventListener(eventName: RelayManager.events.socketClosed): this;
  addEventListener(
    ...args: CustomEventCbArgs<RelayManager.events.listenerSetUp, Methods>
  ): this;
  addEventListener(
    ...args: CustomEventCbArgs<RelayManager.events.eose, emit_details>
  ): this;
  addEventListener(
    ...args: CustomEventCbArgs<RelayManager.events.event, emit_details>
  ): this;
  addEventListener(
    ...args: CustomEventCbArgs<RelayManager.events.notice, emit_details>
  ): this;
  addEventListener(
    ...args: CustomEventCbArgs<RelayManager.events.getRequest, any>
  ): this;
  addEventListener(
    ...args: CustomEventCbArgs<RelayManager.events.getGrChatReq, any>
  ): this;
  addEventListener(
    ...args: CustomEventCbArgs<RelayManager.events.putRequest, any>
  ): this;
  addEventListener(
    eventName: RelayManager.events,
    cb: EventListenerOrEventListenerObject | null | ((ev: CustomEvent) => void)
  ): this;
}

export class RelayManager<S extends WebSocket | undefined>
  extends EventTarget
  implements RelayManager<S>
{
  #socket: S;
  #send(this: RelayManager<WebSocket>, data: any) {
    this.#socket.send(JSON.stringify(data));
    return true;
  }
  constructor() {
    super();
    this.#socket = undefined as S;
  }
  initSocket(
    url: RelayManager.relays,
    openHandler = (socket: WebSocket) => () =>
      this.emit(RelayManager.events.socketOpened, socket),
    socketInitializer = (): RelayManager<WebSocket> => {
      this.#socket = new WebSocket(url) as S;
      if (!this.#socket)
        throw new Error(`${RelayManager.errors.socketNotOpened}`);
      else {
        const socket = this.#socket;
        this.#socket.addEventListener(
          RelayManager.socketEvents.open,
          openHandler(socket!)
        );
        return this as RelayManager<WebSocket>;
      }
    }
  ): RelayManager<WebSocket> | RelayManager<undefined> {
    return socketInitializer();
  }
  initListeners(
    this: RelayManager<WebSocket>,
    listeners: initListenersOps,
    listenersInitializer = (listeners: initListenersOps) => {
      if (listeners) {
        if (listeners.message) this.#addMsgListener(listeners.message);
        else
          this.#addMsgListener(
            RelayManager.defaultMessageHandler(this.emit.bind(this))
          );
        if (listeners.close) this.#addCloseListener(listeners.close);
        else this.#addCloseListener(RelayManager.defaultCloseHandler(this));
        if (listeners.error) this.#addErrorListener(listeners.error);
        else this.#addErrorListener(RelayManager.defaultErrorHandler);
      } else {
        this.#addMsgListener(
          RelayManager.defaultMessageHandler(this.emit.bind(this))
        );
        this.#addCloseListener(RelayManager.defaultCloseHandler(this));
        this.#addErrorListener(RelayManager.defaultErrorHandler);
      }
    }
  ) {
    listenersInitializer(listeners);
    this.emit(RelayManager.events.listenerSetUp);
  }
  close(
    this: RelayManager<WebSocket>,
    closer = (socket: WebSocket) => socket.close()
  ) {
    closer(this.#socket);
    return true;
  }
  getRequests: Map<string, boolean> = new Map();
  get = (type: RelayManager.getTypes, ops: GetOptions) => {
    if (type === RelayManager.getTypes.groupChat) {
      this.emit(RelayManager.events.getGrChatReq, ops);
      RelayManager.getGroupChatHandler(
        this as RelayManager<WebSocket>,
        this.#send,
        ops
      );
    } else throw new Error(RelayManager.errors.getTypeNotHandled);
    this.emit(RelayManager.events.getRequest);
  };
  put(this: RelayManager<WebSocket>) {
    console.log("not implemented");
  }
  // helpers to add listeners to the internal socket
  #addMsgListener(this: RelayManager<WebSocket>, listener: EventListener) {
    this.#socket.addEventListener(RelayManager.socketEvents.message, listener);
    return this;
  }
  #addCloseListener(this: RelayManager<WebSocket>, listener: EventListener) {
    this.#socket.addEventListener(RelayManager.socketEvents.close, listener);
    return this;
  }
  #addErrorListener(this: RelayManager<WebSocket>, listener: EventListener) {
    this.#socket.addEventListener(RelayManager.socketEvents.error, listener);
    return this;
  }
  emit(
    eventName: RelayManager.events.socketOpened,
    manager: RelayManager<WebSocket>
  ): boolean;
  emit(eventName: RelayManager.events.listenerSetUp, options: Methods): boolean;
  emit(eventName: RelayManager.events.socketClosed): boolean;
  emit(eventName: RelayManager.events.eose, data: emit_details): boolean;
  emit(eventName: RelayManager.events.event, data: emit_details): boolean;
  emit(eventName: RelayManager.events.notice, data: emit_details): boolean;
  emit(eventName: RelayManager.events.getRequest): boolean;
  emit(eventName: RelayManager.events.getGrChatReq, ops: GetOptions): boolean;
  emit(eventName: RelayManager.events.putRequest): boolean;
  emit(
    eventName: RelayManager.events,
    data?:
      | WebSocket
      | emit_details
      | GetOptions
      | RelayManager<WebSocket>
      | this["initListeners"]
      | Methods
  ) {
    const {
      socketClosed,
      listenerSetUp,
      socketOpened,
      eose,
      event,
      getGrChatReq,
      getRequest,
      notice,
      putRequest,
    } = RelayManager.events;
    if (eventName === socketOpened) {
      this.dispatchEvent(this.#makeCustomEvent(socketOpened, this));
      return true;
    } else if (eventName === listenerSetUp) {
      this.dispatchEvent(
        this.#makeCustomEvent(listenerSetUp, { get: this.get, put: this.put })
      );
      return true;
    } else if (eventName === socketClosed) {
      this.dispatchEvent(this.#makeCustomEvent(socketClosed));
      return true;
    } else if (eventName === RelayManager.events.eose) {
      this.dispatchEvent(this.#makeCustomEvent(eose, data));
      return true;
    } else if (eventName === RelayManager.events.event) {
      this.dispatchEvent(this.#makeCustomEvent(event, data));
      return true;
    } else if (eventName === RelayManager.events.notice) {
      this.dispatchEvent(this.#makeCustomEvent(notice, data));
      return true;
    } else if (eventName === RelayManager.events.getRequest) {
      this.dispatchEvent(this.#makeCustomEvent(getRequest));
      return true;
    } else if (eventName === RelayManager.events.getGrChatReq) {
      this.dispatchEvent(this.#makeCustomEvent(getGrChatReq));
      return true;
    } else if (eventName === RelayManager.events.putRequest) {
      this.dispatchEvent(this.#makeCustomEvent(putRequest));
      return true;
    } else return false;
  }
  #makeCustomEvent(ev: RelayManager.events, detail?: any) {
    return new CustomEvent(ev, { detail });
  }
}

export namespace RelayManager {
  export enum tags {
    e = "#e",
  }
  export enum getTypes {
    groupChat = "group-chat",
    dm = "dm",
    note = "note",
  }
  export enum events {
    socketOpened = "socket-opened",
    listenerSetUp = "listeners-set-up",
    socketClosed = "socket-closed",
    getRequest = "get-request",
    getGrChatReq = "get-groupchat-request",
    putRequest = "put-request",
    eose = "got-eose",
    event = "got-event",
    notice = "got-notice",
  }
  export enum commands {
    sendMessage = "send-message",
    close = "close",
  }
  export enum errors {
    socketNotOpened = "there was an error opening the socket",
    messageNotSend = "there was an error sending the message",
    closeFailure = "there was a problem closing the socket",
    getTypeNotHandled = "get type not yet handled",
    gotSocketNotice = "got notice error from socket",
    unknownServerMessage = "received and unknown message from the server",
  }
  export enum logs {
    connectionClosed = "connection closed",
  }
  export enum socketEvents {
    open = "open",
    message = "message",
    upgrade = "upgrade",
    close = "close",
    error = "error",
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

  export const defaultMessageHandler =
    <T extends events>(emit: (ev: T, data: [sub_id, EventData]) => boolean) =>
    (message: any) => {
      const data = JSON.parse(message.data) as [
        serverMessages,
        string,
        EventData
      ];
      const type = data[0];
      if (type === serverMessages.eose)
        emit(events.eose as T, [data[1], data[2]]);
      else if (type === serverMessages.event)
        emit(events.event as T, [data[1], data[2]]);
      else if (type === serverMessages.notice)
        emit(events.notice as T, [data[1], data[2]]);
      else throw new Error(errors.unknownServerMessage);
    };

  export const defaultCloseHandler: (
    self: RelayManager<WebSocket>
  ) => EventListener = (self: RelayManager<WebSocket>) => () => {
    self.emit(RelayManager.events.socketClosed);
    console.log(logs.connectionClosed);
  };

  export const defaultErrorHandler: EventListener = (ev) => console.log(ev);

  export const getGroupChatHandler = (
    self: RelayManager<WebSocket>,
    send: (this: RelayManager<WebSocket>, data: any) => boolean,
    ops: {
      chatId: string;
      limit: number;
      messageHandler: (data: EventData & { isLive: boolean }) => boolean;
    }
  ) => {
    const filter = new RelayManager.Filter({
      [tags.e]: [ops.chatId],
      kinds: [42],
      limit: ops.limit,
    });
    const message = new RelayManager.Request(
      RelayManager.generatestring,
      filter
    );
    const sub_id = message.value[1];
    self.getRequests.set(sub_id, false);
    send.bind(self)(message.value);
    self.addEventListener.bind(self)(events.eose, (data) => {
      self.getRequests.set(data.detail[0], true);
    });
    self.addEventListener.bind(self)(events.notice, () => {
      throw new Error(errors.gotSocketNotice);
    });
    self.addEventListener.bind(self)(events.event, (data) => {
      if (data.detail[0] === sub_id) {
        if (self.getRequests.get(data.detail[0])) {
          ops.messageHandler({ ...data.detail[1], isLive: true });
        } else {
          ops.messageHandler({ ...data.detail[1], isLive: false });
        }
      } else {
        // do nothing
      }
    });
  };

  export const generatestring = () =>
    `${Math.round(Math.random() * 10 ** 16).toString(16)}${Math.round(
      Math.random() * 10 ** 16
    ).toString(16)}`;

  export class Filter implements RelayManager.Filter {
    constructor(prop: Filter) {
      this[tags.e] = prop[tags.e];
      this.limit = prop.limit;
      this.kinds = prop.kinds;
    }
  }

  export class Request {
    value: [clientMessages.request, sub_id, Filter];
    constructor(idGenerator: () => string, filter: Filter) {
      this.value = [clientMessages.request, idGenerator(), filter];
    }
  }
  export class Event {
    value: [clientMessages.event, sub_id, EventData];
    constructor(idGenerator: () => string, data: EventData) {
      this.value = [clientMessages.event, idGenerator(), data];
    }
  }
}
