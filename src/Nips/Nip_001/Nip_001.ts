import { nipTitles, Nip } from "../../Nips";
import { KindDefinition, kinds } from "../../Kinds";
import {
  TagDefinition,
  tagNames,
  newTagDescriptions,
  otherParameters,
} from "../../Tags";
import {
  ClientMessageDefinition,
  RelayMessageDefinition,
  commonMessageTypes,
  relayMessageTypes,
  clientMessageTypes,
  relayMessageDescriptions,
  clientMessageDescriptions,
} from "../../Messages";

declare module "../../Nostr" {
  namespace Nostr {
    export import Nip_001 = _001;
    namespace Nips {
      interface nipTitles {
        ["001"]: "Basic protocol flow description";
      }
    }
    namespace Tags {
      interface tagNames {
        e: "e";
        p: "p";
      }
      interface newTagDescriptions {
        e: "event id (hex)";
        p: "pubkey (hex)";
      }
    }
    namespace Kinds {
      interface kinds {
        metadata: "Metadata";
        short_note: "Short Text Note";
        recommend_relay: "Recommended Relay";
      }
    }
    namespace Messages {
      interface commonMessageTypes {
        auth: "AUTH";
        event: "EVENT";
        count: "COUNT"; // da trovare in quale NIP va
      }
      interface clientMessageTypes {
        close: "CLOSE";
        req: "REQ";
      }
      interface clientMessageDescriptions {
        AUTH: "used to send authentication events";
        CLOSE: "used to stop previous subscriptions";
        COUNT: "used to request event counts";
        EVENT: "used to publish events";
        REQ: "used to request events and subscribe to new updates";
      }
      interface relayMessageTypes {
        eose: "EOSE";
        notice: "NOTICE";
        ok: "OK";
      }
      interface relayMessageDescriptions {
        AUTH: "used to send authentication challenges";
        COUNT: "used to send requested event counts to clients";
        EOSE: "used to notify clients all stored events have been";
        EVENT: "used to send events requested to clients";
        NOTICE: "used to send human-readable messages to clients";
        OK: "used to notify clients if an EVENT was successful";
      }
    }
    namespace BasicTypes {
      type Bytes32Hex<T extends string> = T;
      type Bytes64Hex<T extends string> = T;
      type Byte32LoCaseHex<T extends string> = T;
      type Sha<T extends string> = T;
      type RecommendedRelayURL = string;
      type Max64Char = string;
      type UnixTimestampInSec = number;
      type signature = Bytes64Hex<Sha<serialized<{}>>>;
      type range<L extends number, H extends number> = [L, H];
      type id = Byte32LoCaseHex<Sha<serialized<{}>>>;
      type pubkey = Byte32LoCaseHex<string>;

      type Event = {};
      type serialized<T> = T extends object ? string : never;
    }
  }

  // extensions of basic types

  // type Max64Char = string;
  // type created_at = number;
  // type kind = number;
  // type tags = string[];
  // type content = string;
}

/**
 * NIP-01
 * ======
 * 
 * // Basic protocol flow description
 * 
 * This NIP defines the basic protocol that should be
 * implemented by everybody. New NIPs may add new optional
 * (or mandatory) fields and messages and features to the
 * structures and flows described here.

 * ## Events and signatures
 * 
 * Each user has a keypair. Signatures, public key, and
 * encodings are done according to the [Schnorr signatures
 * standard for the curve
 * `secp256k1`](https://bips.xyz/340). 

 * The only object type that exists is the `event`, which
 * has the following format on the wire:

 *```json
 * {
 *   "id": <32-bytes lowercase hex-encoded sha256 of the serialized event data>,
 *   "pubkey": <32-bytes lowercase hex-encoded public key of the event creator>,
 *   "created_at": <unix timestamp in seconds>,
 *   "kind": <integer>,
 *   "tags": [
 *     ["e", <32-bytes hex of the id of another event>, <recommended relay URL>],
 *     ["p", <32-bytes hex of a pubkey>, <recommended relay URL>],
 *     ... // other kinds of tags may be included later
 *   ],
 *   "content": <arbitrary string>,
 *   "sig": <64-bytes hex of the signature of the sha256 hash of the serialized
 *  event data, which is the same as the "id" field>
 * ```
 *
 * ## Communication between clients and relays
 * 
 * Relays expose a websocket endpoint to which clients can connect.
 * 
 * ### From client to relay: sending events and creating subscriptions
 * 
 * Clients can send 3 types of messages, which must be JSON
 * arrays, according to the following patterns:
 * 
 * 
 *   * `["EVENT", <event JSON as defined above>]`, used to publish events.
 *   * `["REQ", <subscription_id>, <filters JSON>...]`, used
 *     to request events and subscribe to new updates.
 *   * `["CLOSE", <subscription_id>]`, used to stop previous subscriptions.
 * 
 * `<subscription_id>` is an arbitrary, non-empty string of
 * max length 64 chars, that should be used to represent a
 * subscription.
 * 
 * `<filters>` is a JSON object that determines what events
 * will be sent in that subscription, it can have the
 * following attributes:
 * 
 * ```json
 * {
 *   "ids": <a list of event ids or prefixes>,
 *   "authors": <a list of pubkeys or prefixes, the pubkey of an event must be one of these>,
 *   "kinds": <a list of a kind numbers>,
 *   "#e": <a list of event ids that are referenced in an "e" tag>,
 *   "#p": <a list of pubkeys that are referenced in a "p" tag>,
 *   "since": <an integer unix timestamp in seconds, events must be newer than this to pass>,
 *   "until": <an integer unix timestamp in seconds, events must be older than this to pass>,
 *   "limit": <maximum number of events to be returned in the initial query>
 * }
 * ```

 * Upon receiving a `REQ` message, the relay SHOULD query
 * its internal database and return events that match the
 * filter, then store that  * filter and send again all
 * future events it receives to that same websocket until
 * the websocket is closed. The `CLOSE` event is  * received
 * with the same `<subscription_id>` or a new `REQ` is sent
 * using the same `<subscription_id>`, in which case it
 * should  * overwrite the previous subscription.
 * 
 * Filter attributes containing lists (such as `ids`,
 * `kinds`, or `#e`) are JSON arrays with one or more
 * values.  At least one of the  * array's values must match
 * the relevant field in an event for the condition itself
 * to be considered a match.  For scalar event  * attributes
 * such as `kind`, the attribute from the event must be
 * contained in the filter list.  For tag attributes such as
 * `#e`, where  * an event may have multiple values, the
 * event and filter condition values must have at least one
 * item in common.
 * 
 * The `ids` and `authors` lists contain lowercase
 * hexadecimal strings, which may either be an exact
 * 64-character match, or a prefix of  * the event value.  A
 * prefix match is when the filter string is an exact string
 * prefix of the event value.  The use of prefixes allows  *
 * for more compact filters where a large number of values
 * are queried, and can provide some privacy for clients
 * that may not want to  * disclose the exact authors or
 * events they are searching for.
 * 
 * All conditions of a filter that are specified must match
 * for an event for it to pass the filter, i.e., multiple
 * conditions are  * interpreted as `&&` conditions.
 * 
 * A `REQ` message may contain multiple filters. In this
 * case, events that match any of the filters are to be
 * returned, i.e., multiple  * filters are to be interpreted
 * as `||` conditions.
 * 
 * The `limit` property of a filter is only valid for the
 * initial query and can be ignored afterward. When `limit:
 * n` is present it is  * assumed that the events returned
 * in the initial query will be the latest `n` events. It is
 * safe to return less events than `limit`  * specifies, but
 * it is expected that relays do not return (much) more
 * events than requested so clients don't get unnecessarily
 * * overwhelmed by data.
 * 
 * ### From relay to client: sending events and notices
 * 
 * Relays can send 3 types of messages, which must also be
 * JSON arrays, according to the following patterns:
 * 
 *   * `["EVENT", <subscription_id>, <event JSON as defined above>]`, used to send events requested by clients.
 *   * `["EOSE", <subscription_id>]`, used to indicate the _end of stored events_ and the beginning of events newly received in  * real-time.
 *   * `["NOTICE", <message>]`, used to send human-readable error messages or other things to clients.
 * 
 * This NIP defines no rules for how `NOTICE` messages should be sent or treated.
 * 
 * `EVENT` messages MUST be sent only with a subscription ID
 * related to a subscription previously initiated by the
 * client (using the  * `REQ` message above).
 * 
 * ## Basic Event Kinds
 * 
 *   - `0`: `set_metadata`: the `content` is set to a stringified JSON object `{name: <username>, about: <string>, picture: <url,  * string>}` describing the user who created the event. A relay may delete past `set_metadata` events once it gets a new one for the  * same pubkey.
 *   - `1`: `text_note`: the `content` is set to the **plaintext** content of a note (anything the user wants to say). Content that must  * be parsed, such as Markdown and HTML, should not be used. Clients should also not parse content as those.
 *   - `2`: `recommend_server`: the `content` is set to the URL (e.g., `wss://somerelay.com`) of a relay the event creator wants to  * recommend to its followers.
 * 
 * A relay may choose to treat different message kinds
 * differently, and it may or may not choose to have a
 * default way to handle kinds  * it doesn't know about.
 * 
 * ## Other Notes:
 * 
 * - Clients should not open more than one websocket to each
 *   relay. One channel can support an unlimited number of
 *   subscriptions, so  * clients should do that.
 * - The `tags` array can store a case-sensitive tag name as
 *   the first element of each subarray, plus arbitrary
 *   information afterward  * (always as strings). This NIP
 *   defines `"p"` — meaning "pubkey", which points to a
 *   pubkey of someone that is referred to in the event  *
 *   —, and `"e"` — meaning "event", which points to the id
 *   of an event this event is quoting, replying to or
 *   referring to somehow. See  * [NIP-10](10.md) for a
 *   detailed description of "e" and "p" tags.
 * - The `<recommended relay URL>` item present on the `"e"`
 *   and `"p"` tags is an optional (could be set to `""`)
 *   URL of a relay the  * client could attempt to connect
 *   to fetch the tagged event or other events from a tagged
 *   profile. It MAY be ignored, but it exists to  *
 *   increase censorship resistance and make the spread of
 *   relay addresses more seamless across clients.
 * - Clients should use the created_at field to judge the
 *   age of a metadata event and completely replace older
 *   metadata events with  * newer metadata events
 *   regardless of the order in which they arrive.  Clients
 *   should not merge any filled fields within older
 *   metadata  * events into empty fields of newer metadata
 *   events.
 * - When a websocket is closed by the relay with a status
 *   code 4000 that means the client shouldn't try to
 *   connect again.
 * 
 * }
 * ```
 */
export namespace _001 {
  export namespace ClientToRelay {
    export enum clientMessages {
      event = "EVENT",
      request = "REQ",
      close = "CLOSE",
    }
    // export type ClientEvent = [clientMessages.event, AnyEvent];
  }

  export const nip_001 = new Nip(1, nipTitles["001"]);

  new KindDefinition(0, kinds.metadata!, nip_001);

  new KindDefinition(1, kinds.short_note!, nip_001);

  new KindDefinition(2, kinds.recommend_relay!, nip_001);

  new TagDefinition(
    tagNames.e,
    newTagDescriptions.e,
    [otherParameters.relay_url, otherParameters.marker],
    nip_001
  );

  new TagDefinition(
    tagNames.p,
    newTagDescriptions.p,
    [otherParameters.relay_url],
    nip_001
  );

  new ClientMessageDefinition(
    clientMessageTypes.close,
    clientMessageDescriptions.CLOSE,
    nip_001
  );

  new ClientMessageDefinition(
    commonMessageTypes.event!,
    clientMessageDescriptions.EVENT,
    nip_001
  );

  new ClientMessageDefinition(
    clientMessageTypes.req,
    clientMessageDescriptions.REQ,
    nip_001
  );

  new RelayMessageDefinition(
    commonMessageTypes.event!,
    relayMessageDescriptions.EVENT,
    nip_001
  );

  new RelayMessageDefinition(
    relayMessageTypes.eose,
    relayMessageDescriptions.EOSE,
    nip_001
  );

  new RelayMessageDefinition(
    relayMessageTypes.notice,
    relayMessageDescriptions.NOTICE,
    nip_001
  );
}
