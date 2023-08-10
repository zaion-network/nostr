import { Nostr } from "../../Nostr";

type id = Nostr.BasicTypes.id;
type pubkey = Nostr.BasicTypes.pubkey;
type RecommendedRelayURL = Nostr.BasicTypes.RecommendedRelayURL;
type e = Nostr.Tags.tagNames["e"];
type p = Nostr.Tags.tagNames["p"];

declare module Tag {
  namespace Tag {
    export type eventTag = [e, id, RecommendedRelayURL];
    // NIP 10
    // export type eventRootTag = [e, id, RecommendedRelayURL, markers.root];
    // export type eventReplyTag = [e, id, RecommendedRelayURL, markers.reply];
    // export type eventMentionTag = [e, id, RecommendedRelayURL, markers.mention];
    export type profileTag = [p, pubkey, RecommendedRelayURL];
  }
}
