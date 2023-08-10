import * as N from "./Nostr";

export namespace Nostr {
  export const oo = 2;
  export const Kinds = N.Kinds;
  export const Messages = N.Messages;
  export const Nips = N.Nips;
  export const Tags = N.Tags;
  export const n = N;
  export const nips = {
    ["001"]: N.nips["001"].nip_001,
    ["002"]: N.nips["002"].nip_002,
    ["003"]: N.nips["003"].nip_003,
    ["004"]: N.nips["004"].nip_004,
    ["005"]: N.nips["005"].nip_005,
  };
}
