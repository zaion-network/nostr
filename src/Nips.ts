import { Nostr } from "./Nostr";

declare module "./Nips" {
  namespace Nips {
    interface Nip<
      I extends number,
      T extends (typeof nipTitles)[keyof typeof nipTitles]
    > extends Nips.Nip.Contract<I, T> {}
    namespace Nip {
      interface Contract<
        I extends number,
        T extends (typeof nipTitles)[keyof typeof nipTitles]
      > {
        id: I;
        kinds: Nostr.Kinds.AnyKind[];
        kindRanges: Nostr.Kinds.AnyKindRange[];
        messageTypes: Nostr.Messages.AnyMessage[];
        tags: Nostr.Tags.AnyTag[];
        title: T;
        addKind(kind: Nostr.Kinds.AnyKind): this;
        addKindRange(kindRange: Nostr.Kinds.AnyKindRange): this;
        addMessage(message: Nostr.Messages.AnyMessage): this;
        addTag(tag: Nostr.Tags.AnyTag): this;
      }
    }
  }
}

export namespace Nips {
  export const name = "nips";
  export const nipTitles: Nips.nipTitles = {
    "001": "Basic protocol flow description",
    "002": "Contact List and Petnames",
    "003": "OpenTimestamps Attestations for Events",
    "004": "EncryptedDirectMessage",
    "005": "MappingNostrkeystoDNS-basedinternetidentifiers",
  };
}

export interface Nip<
  I extends number,
  T extends (typeof Nips.nipTitles)[keyof typeof Nips.nipTitles]
> extends Nips.Nip.Contract<I, T> {}
export class Nip<
  I extends number,
  T extends (typeof Nips.nipTitles)[keyof typeof Nips.nipTitles]
> implements Nips.Nip.Contract<I, T>
{
  constructor(public id: I, public title: T) {
    this.kinds = [];
    this.kindRanges = [];
    this.messageTypes = [];
    this.tags = [];
  }
  addKind(kind: Nostr.Kinds.AnyKind): this {
    this.kinds.push(kind);
    return this;
  }
  addKindRange(kindRange: Nostr.Kinds.AnyKindRange): this {
    this.kindRanges.push(kindRange);
    return this;
  }
  addMessage(message: Nostr.Messages.AnyMessage): this {
    this.messageTypes.push(message);
    return this;
  }
  addTag(tag: Nostr.Tags.AnyTag): this {
    this.tags.push(tag);
    return this;
  }
}
export const nipTitles = Nips.nipTitles;
