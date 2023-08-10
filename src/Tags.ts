import { Nostr } from "./Nostr";

declare module "./Tags" {
  type id = Nostr.BasicTypes.id;
  type pubkey = Nostr.BasicTypes.pubkey;
  type RecommendedRelayURL = Nostr.BasicTypes.RecommendedRelayURL;
  type e = Nostr.Tags.tagNames["e"];
  type p = Nostr.Tags.tagNames["p"];
  namespace Tags {
    type AnyTag = TagDefinition<any, any, any, any, any>;
    interface tagNames {
      [k: string]: string;
    }
    interface newTagDescriptions {
      [k: string]: string | undefined;
    }
    namespace TagDefinition {
      interface Contract<
        N extends (typeof tagNames)[string],
        D extends (typeof newTagDescriptions)[string],
        F extends `${D}`,
        O extends otherParameters,
        I extends number
      > {
        name: N;
        description: D;
        other_parameters: O[];
        nip: Nostr.Nips.Nip<I, any>;
        addTagToNip<I extends number>(nip: Nostr.Nips.Nip<I, any>): this;
      }
    }
  }
}

export namespace Tags {
  export const tagNames: tagNames = { e: "e", p: "p" };
  export const newTagDescriptions: newTagDescriptions = {
    e: "event id (hex)",
    p: "pubkey (hex)",
  };
  // export enum tagNames {
  //   a = "a",
  //   alt = "alt",
  //   d = "d",
  //   e = "e",
  //   g = "g",
  //   i = "i",
  //   l = "l",
  //   L = "L",
  //   p = "p",
  //   r = "r",
  //   t = "t",
  //   amount = "amount",
  //   bolt11 = "bolt11",
  //   challenge = "challenge",
  //   contentWarning = "content-warning",
  //   delegation = "delegation",
  //   badgeDesc = "description",
  //   invoiceDesc = "description",
  //   emoji = "emoji",
  //   expiration = "expiration",
  //   image = "image",
  //   lnurl = "lnurl",
  //   name = "name",
  //   nonce = "nonce",
  //   preimage = "preimage",
  //   published_at = "published_at",
  //   relay = "relay",
  //   relays = "relays",
  //   subject = "subject",
  //   summary = "summary",
  //   thumb = "thumb",
  //   title = "title",
  //   zap = "zap",
  // }

  // export enum tagDescriptions {
  //   "a" = "coordinates to an event",
  //   "alt" = "Alt tag",
  //   "d" = "identifier",
  //   "e" = "event id (hex)",
  //   "g" = "geohash",
  //   "i" = "identity",
  //   "l" = "label, label namespace",
  //   "L" = "label namespace",
  //   "p" = "pubkey (hex)",
  //   "r" = "a reference (URL, etc)",
  //   "t" = "hashtag",
  //   "amount" = "millisats",
  //   "bolt11" = "`bolt11` invoice",
  //   "challenge" = "challenge string",
  //   "content-warning" = "reason",
  //   "delegation" = "pubkey, conditions, delegation ",
  //   "description_b" = "badge description",
  //   "description_i" = "invoice description",
  //   "emoji" = "shortcode",
  //   "expiration" = "unix timestamp (string)",
  //   "image" = "image URL",
  //   "lnurl" = "`bech32` encoded `lnurl`",
  //   "name" = "badge name",
  //   "nonce" = "random",
  //   "preimage" = "hash of `bolt11` invoice",
  //   "published_at" = "unix timestamp (string)",
  //   "relay" = "relay url",
  //   "relays" = "relay list",
  //   "subject" = "subject",
  //   "summary" = "article summary",
  //   "thumb" = "badge thumbnail",
  //   "title" = "article title",
  //   "zap" = "profile name",
  // }

  export enum otherParameters {
    relay_url = "relay URL",
    marker = "marker",
    proof = "proof",
    annotations = "annotations",
    image_url = "image URL",
    dimensions = "dimensions in pixels",
    type_of_value = "type of value",
  }

  export enum markers {
    root = "root",
    reply = "reply",
    mention = "mention",
  }
}
export const tagNames = Tags.tagNames;
export const newTagDescriptions = Tags.newTagDescriptions;
export const otherParameters = Tags.otherParameters;

export interface TagDefinition<
  N extends (typeof Tags.tagNames)[string],
  D extends (typeof Tags.newTagDescriptions)[string],
  F extends `${D}`,
  O extends Tags.otherParameters,
  I extends number
> extends Tags.TagDefinition.Contract<N, D, F, O, I> {}
export class TagDefinition<
  N extends (typeof Tags.tagNames)[string],
  D extends (typeof Tags.newTagDescriptions)[string],
  F extends `${D}`,
  O extends Tags.otherParameters,
  I extends number
> implements Tags.TagDefinition.Contract<N, D, F, O, I>
{
  constructor(
    public name: N,
    public description: D,
    public other_parameters: O[],
    nip: Nostr.Nips.Nip<I, any>
  ) {
    nip.addTag(this);
  }
  addTagToNip<I extends number>(nip: Nostr.Nips.Nip<I, any>): this {
    nip.addTag(this);
    return this;
  }
  get fieldName(): F {
    return `#${this.name}` as F;
  }
}
