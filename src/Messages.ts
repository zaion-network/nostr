import { Nostr } from "./Nostr";

declare module "./Messages" {
  namespace Messages {
    interface Record {
      [key: string]: string | undefined;
    }

    interface commonMessageTypes extends Record {}

    interface clientMessageTypes extends Record {}

    interface clientMessageDescriptions extends Record {}

    interface relayMessageTypes extends Record {}

    interface relayMessageDescriptions extends Record {}
    namespace MessageDefinition {
      interface Contract<
        S extends messageSides,
        T extends
          | (typeof commonMessageTypes)[string]
          | (typeof clientMessageTypes)[string]
          | (typeof relayMessageTypes)[string],
        D extends
          | (typeof clientMessageDescriptions)[string]
          | (typeof relayMessageDescriptions)[string],
        I extends number
      > {
        side: S;
        type: T;
        description: D;
        nip: Nostr.Nips.Nip<I, any>;
      }
      namespace ClientMessageDefinition {
        interface Contract<
          T extends
            | (typeof commonMessageTypes)[string]
            | (typeof clientMessageTypes)[string],
          D extends (typeof clientMessageDescriptions)[string],
          I extends number
        > extends MessageDefinition<messageSides.client_relay, T, D, I> {}
      }
      namespace RelayMessageDefinition {
        interface Contract<
          T extends
            | (typeof commonMessageTypes)[string]
            | (typeof relayMessageTypes)[string],
          D extends (typeof relayMessageDescriptions)[string],
          I extends number
        > extends MessageDefinition<messageSides.relay_client, T, D, I> {}
      }
    }

    type AnyMessage = Messages.MessageDefinition.Contract<any, any, any, any>;
  }
}

export namespace Messages {
  export enum messageSides {
    client_relay = "Client to Relay",
    relay_client = "Relay to Client",
  }

  export const commonMessageTypes: commonMessageTypes = {
    auth: "AUTH",
    event: "EVENT",
    count: "COUNT",
  };

  export const clientMessageTypes: clientMessageTypes = {
    req: "REQ",
    close: "CLOSE",
  };

  export const clientMessageDescriptions: clientMessageDescriptions = {
    AUTH: "used to send authentication events",
    CLOSE: "used to stop previous subscriptions",
    EVENT: "used to publish events",
    REQ: "used to request events and subscribe to new updates",
    COUNT: "used to request event counts",
  };

  export const relayMessageTypes: relayMessageTypes = {
    eose: "EOSE",
    notice: "NOTICE",
    ok: "OK",
  };

  export const relayMessageDescriptions: relayMessageDescriptions = {
    AUTH: "used to send authentication challenges",
    COUNT: "used to send requested event counts to clients",
    EOSE: "used to notify clients all stored events have been",
    EVENT: "used to send events requested to clients",
    NOTICE: "used to send human-readable messages to clients",
    OK: "used to notify clients if an EVENT was successful",
  };
}
export const commonMessageTypes = Messages.commonMessageTypes;
export const clientMessageTypes = Messages.clientMessageTypes;
export const relayMessageTypes = Messages.relayMessageTypes;
export const clientMessageDescriptions = Messages.clientMessageDescriptions;
export const relayMessageDescriptions = Messages.relayMessageDescriptions;
export const messageSides = Messages.messageSides;

export interface MessageDefinition<
  S extends Messages.messageSides,
  T extends
    | (typeof commonMessageTypes)[string]
    | (typeof clientMessageTypes)[string]
    | (typeof relayMessageTypes)[string],
  D extends
    | (typeof clientMessageDescriptions)[string]
    | (typeof relayMessageDescriptions)[string],
  I extends number
> extends Messages.MessageDefinition.Contract<S, T, D, I> {}
export class MessageDefinition<
  S extends Messages.messageSides,
  T extends
    | (typeof commonMessageTypes)[string]
    | (typeof clientMessageTypes)[string]
    | (typeof relayMessageTypes)[string],
  D extends
    | (typeof clientMessageDescriptions)[string]
    | (typeof relayMessageDescriptions)[string],
  I extends number
> implements Messages.MessageDefinition.Contract<S, T, D, I>
{
  constructor(
    public side: S,
    public type: T,
    public description: D,
    nip: Nostr.Nips.Nip<I, any>
  ) {
    nip.addMessage(this);
  }
}

export interface ClientMessageDefinition<
  T extends
    | (typeof commonMessageTypes)[string]
    | (typeof clientMessageTypes)[string],
  D extends (typeof clientMessageDescriptions)[string],
  I extends number
> extends Messages.MessageDefinition.ClientMessageDefinition.Contract<
    T,
    D,
    I
  > {}
export class ClientMessageDefinition<
    T extends
      | (typeof commonMessageTypes)[string]
      | (typeof clientMessageTypes)[string],
    D extends (typeof clientMessageDescriptions)[string],
    I extends number
  >
  extends MessageDefinition<Messages.messageSides.client_relay, T, D, I>
  implements
    Messages.MessageDefinition.ClientMessageDefinition.Contract<T, D, I>
{
  constructor(type: T, description: D, nip: Nostr.Nips.Nip<I, any>) {
    super(messageSides.client_relay, type, description, nip);
  }
}

export interface RelayMessageDefinition<
  T extends
    | (typeof commonMessageTypes)[string]
    | (typeof relayMessageTypes)[string],
  D extends (typeof relayMessageDescriptions)[string],
  I extends number
> extends Messages.MessageDefinition.RelayMessageDefinition.Contract<T, D, I> {}
export class RelayMessageDefinition<
    T extends
      | (typeof commonMessageTypes)[string]
      | (typeof relayMessageTypes)[string],
    D extends (typeof relayMessageDescriptions)[string],
    I extends number
  >
  extends MessageDefinition<Messages.messageSides.relay_client, T, D, I>
  implements
    Messages.MessageDefinition.RelayMessageDefinition.Contract<T, D, I>
{
  constructor(type: T, description: D, nip: Nostr.Nips.Nip<I, any>) {
    super(messageSides.relay_client, type, description, nip);
  }
}
