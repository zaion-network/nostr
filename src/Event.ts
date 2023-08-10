// import { Nostr } from "../Nostr";
import { Nostr } from "./Nostr";
import type { Messages } from "./Messages";

declare module "./Event" {
  type serialized<T> = Nostr.BasicTypes.serialized<T>;
  type RecommendedRelayURL = Nostr.BasicTypes.RecommendedRelayURL;
  type UnixTimestampInSec = Nostr.BasicTypes.UnixTimestampInSec;
  type signature = Nostr.BasicTypes.signature;
  // type subscription_id = Max64Char;
  type kind40EventId = Event.id;
  type kind42EventId = Event.id;
  type rootMessage = [
    (typeof Nostr.Nip_001.nip_001.tags)[0]["name"],
    kind40EventId,
    RecommendedRelayURL,
    typeof Nostr.Tags.markers.root
  ][];
  type replyMessage = [
    (typeof Nostr.Nip_001.nip_001.tags)[0]["name"],
    kind42EventId,
    RecommendedRelayURL,
    typeof Nostr.Tags.markers.reply
  ][];
  type hideMessage = [
    (typeof Nostr.Nip_001.nip_001.tags)[0]["name"],
    kind42EventId
  ];
  type muteUser = [
    (typeof Nostr.Nip_001.nip_001.tags)[0]["name"],
    Event.pubkey
  ];
  namespace Event {
    type id = Nostr.BasicTypes.id;
    type pubkey = Nostr.BasicTypes.pubkey;
    type created_at = number;
    type kind = number;
    type tags = string[];
    type content = string;
    type subscription_id = Nostr.BasicTypes.Max64Char;
    type kin40EventId = id;
    type kin42EventId = id;
    type rootMessage = ["e", kin40EventId, RecommendedRelayURL, "root"][];
    type replyMessage = ["e", kin42EventId, RecommendedRelayURL, "reply"][];
    type hideMessage = ["e", kin42EventId];
    type muteUser = ["e", pubkey];
    type username = string;
    /**
     * URL (e.g., wss://somerelay.com)
     */
    type relayUrl = string;
    type plainText = string;
    type emptyString = string;
    type SerializableEvent = [
      number,
      Event.pubkey,
      Event.created_at,
      Event.kind,
      Event.tags,
      Event.content
    ];

    interface GenericEvent<
      K extends number,
      C extends string,
      T extends (
        | [
            (typeof Nostr.Nip_001.nip_001.tags)[0]["name"],
            Event.id,
            RecommendedRelayURL
          ]
        | [
            (typeof Nostr.Nip_001.nip_001.tags)[1]["name"],
            Event.pubkey,
            RecommendedRelayURL
          ]
        | rootMessage
        | replyMessage
        | hideMessage
        | muteUser
      )[] = (
        | [
            (typeof Nostr.Nip_001.nip_001.tags)[0]["name"],
            Event.pubkey,
            RecommendedRelayURL
          ]
        | [
            (typeof Nostr.Nip_001.nip_001.tags)[1]["name"],
            Event.pubkey,
            RecommendedRelayURL
          ]
        | rootMessage
        | replyMessage
        | hideMessage
        | muteUser
      )[]
    > {
      id: Event.id;
      pubkey: Event.pubkey;
      created_at: UnixTimestampInSec;
      kind: K;
      tags: T;
      content: C;
      sig: signature;
    }

    type AnyEvent = GenericEvent<any, any>;

    interface Event<
      K extends number,
      C extends string,
      T extends (
        | ["e", id, RecommendedRelayURL]
        | ["p", pubkey, RecommendedRelayURL]
        | rootMessage
        | replyMessage
        | hideMessage
        | muteUser
      )[] = (
        | ["e", id, RecommendedRelayURL]
        | ["p", pubkey, RecommendedRelayURL]
        | rootMessage
        | replyMessage
        | hideMessage
        | muteUser
      )[]
    > {
      id: id;
      pubkey: pubkey;
      created_at: UnixTimestampInSec;
      kind: K;
      tags: T;
      content: C;
      sig: signature;
    }

    interface Metadata {
      name: username;
      about: string;
      picture: string;
    }

    interface SetMetadata
      extends Event<
        (typeof Nostr.Nip_001)["nip_001"]["kinds"][0]["kind"],
        serialized<Metadata>
      > {}

    interface TextNote
      extends Event<
        (typeof Nostr.Nip_001)["nip_001"]["kinds"][1]["kind"],
        serialized<plainText>
      > {}
    interface RecommendedServer
      extends Event<
        (typeof Nostr.Nip_001)["nip_001"]["kinds"][2]["kind"],
        serialized<relayUrl>
      > {}

    namespace ClientToRelay {
      // <filters> is a JSON object that determines what
      // events will be sent in that subscription, it can
      // have the following attributes:
      // {
      //   "ids": <a list of event ids or prefixes>,
      //   "authors": <a list of pubkeys or prefixes, the pubkey of an event must be one of these>,
      //   "kinds": <a list of a kind numbers>,
      //   "#e": <a list of event ids that are referenced in an "e" tag>,
      //   "#p": <a list of pubkeys that are referenced in a "p" tag>,
      //   "since": <an integer unix timestamp in seconds, events must be newer than this to pass>,
      //   "until": <an integer unix timestamp in seconds, events must be older than this to pass>,
      //   "limit": <maximum number of events to be returned in the initial query>
      // }
      interface Filter {
        ids: id[];
        authors: pubkey[];
        kinds: kind[];
        ["#e"]: id[];
        ["#p"]: pubkey[];
        since: UnixTimestampInSec;
        until: UnixTimestampInSec;
        limit: number;
      }

      type ClientEvent = [
        Messages.commonMessageTypes["event"],
        Event<any, any>
      ];
      type Req = [
        Messages.clientMessageTypes["req"],
        subscription_id,
        Partial<Filter>
      ];
      type Close = [Messages.clientMessageTypes["close"], subscription_id];
    }

    namespace RelayToClient {
      /**
       * ["EVENT", <subscription_id>, <event JSON as defined
       * above>], used to send events requested by clients.
       */
      type RelayEvent = [
        Messages.commonMessageTypes["event"],
        subscription_id,
        Event<any, any>
      ];

      /**
       * ["EOSE", <subscription_id>], used to indicate the
       * end of stored events and the beginning of events
       * newly received in real-time.
       */
      type RealTimeEvent = [
        Messages.relayMessageTypes["eose"],
        subscription_id,
        Event<any, any>
      ];

      /**
       * ["NOTICE", \<message>], used to send human-readable
       * error messages or other things to clients.
       */
      type Notice = [Messages.relayMessageTypes["notice"], string];
    }

    // interface ContactList
    //   extends Event<
    //     typeof kindsList.contactList,
    //     serialized<emptyString>,
    //     ["p", Bytes32PubKey, RecommendedRelayURL][]
    //   > {}

    // export namespace PublicChat {
    //   interface Create
    //     extends Event<
    //       typeof kindsList.publicChat.create,
    //       serialized<Metadata>
    //     > {}

    //   type channelCreateEventId = Bytes32HexIdOfEvent;
    //   interface SetMetadata
    //     extends Event<
    //       typeof kindsList.publicChat.metadata,
    //       serialized<Metadata>,
    //       ["e", channelCreateEventId, RecommendedRelayURL][]
    //     > {}

    //   type content = string;
    //   interface Message
    //     extends Event<
    //       typeof kindsList.publicChat.message,
    //       serialized<content>,
    //       (rootMessage | replyMessage)[]
    //     > {}

    //   interface Reason {
    //     reason: string;
    //   }
    //   interface Hide
    //     extends Event<
    //       typeof kindsList.publicChat.hideMessage,
    //       serialized<Reason>,
    //       hideMessage[]
    //     > {}

    //   interface MuteUser
    //     extends Event<
    //       typeof kindsList.publicChat.muteUser,
    //       serialized<Reason>,
    //       muteUser[]
    //     > {}
    // }
  }
}

export class Event {}
export namespace Event {}
