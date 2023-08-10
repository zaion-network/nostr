import { BasicTypes as B } from "./BasicTypes";
import { Tags as T } from "./Tags";
import { Nips as N } from "./Nips";
import { Messages as M } from "./Messages";
import { Kinds as K } from "./Kinds";
import { _001 } from "./Nips/Nip_001/Nip_001";
import { _002 } from "./Nips/Nip_002/Nip_002";
import { _003 } from "./Nips/Nip_003/Nip_003";
import { _004 } from "./Nips/Nip_004/Nip_004";
import { _005 } from "./Nips/Nip_005/Nip_005";

// import { Event as E } from "./Nips/Nip_001/Event";

// declare module "./Nostr" {
//   namespace Nostr {
//     interface Kinds {}
//     namespace Kinds {}

//     interface Messages {}
//     namespace Messages {}

//     interface Nips {}
//     namespace Nips {}

//     interface Tags {}
//     namespace Tags {}
//   }
// }

/**
 * Repatch
 *
 * this pattern makes it possible to have all of the extended types available also in the modules.
 */
export namespace Nostr {
  export import BasicTypes = B;
  export import Kinds = K;
  export import Messages = M;
  export import Nips = N;
  export import Tags = T;
}

/**
 * Exports
 * These are the actual values exported as the export import syntax doesnt work properly with rollup.
 */
export const Kinds = K;
export const Messages = M;
export const Nips = N;
export const Tags = T;
export const nips = {
  ["001"]: _001,
  ["002"]: _002,
  ["003"]: _003,
  ["004"]: _004,
  ["005"]: _005,
};
