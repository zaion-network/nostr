import {
  generatePrivateKey,
  getPublicKey,
  nip44,
  finishEvent,
} from "nostr-tools";
import { utils } from "@noble/secp256k1";
const { isValidPrivateKey } = utils;

const getConversationKey = nip44.utils.v2.getConversationKey;

interface generateKeyPair {
  (): {
    sk: string;
    pk: string;
  };
}
export function generateKeyPair() {
  const sk = generatePrivateKey();
  if (!isValidPrivateKey(sk))
    throw new Error("there was a problem generating the key");
  const pk = getPublicKey(sk);
  return { sk, pk };
}

interface encrypt {
  (message: string, sk: string): string;
}
export const encrypt: encrypt = function encrypt(message, sk) {
  return nip44.encrypt(getConversationKey(sk, getPublicKey(sk)), message);
};

interface decrypt {
  (message: string, sk: string): string;
}
export const decrypt: decrypt = function (message, sk) {
  return nip44.decrypt(getConversationKey(sk, getPublicKey(sk)), message);
};
