import { encrypt, decrypt } from "../nostr-tools";
import { sign, verify } from "../secp256k1";
import { hexToUtf8 } from "../utils/hexToUtf";
import { serialize } from "../utils/serialize";

export interface TokenMetadata {
  uniqueHandle: string;
  created_at: number;
  expiration: number;
}
export class TokenMetadata {}

export interface Token {}
export class Token implements Token.Contract {
  #isPositiveVerification: boolean = false;
  get isPositiveVerification() {
    return this.#isPositiveVerification;
  }
  verify(pk: string) {
    this.#isPositiveVerification = this.#verifier(
      ...[this.signature, this.value, pk]
    );
    return this;
  }
  constructor(public value: string, public signature: Uint8Array) {}
  #verifier = verify;
}
export namespace Token {
  export interface Contract {
    value: string;
    signature: Uint8Array;
    isPositiveVerification: boolean;
    verify(pk: string): this;
  }
  export interface Verified extends Contract {
    isPositiveVerification: true;
  }
}
export interface AccessTokenManager {}
export class AccessTokenManager implements AccessTokenManager.Contract {
  creaToken(uniqueHandle: string, sk: string): Token {
    return AccessTokenManager.creaToken(uniqueHandle, sk);
  }
  verifyToken(uniqueHandle: string, token: Token, pk: string): Token {
    return AccessTokenManager.verifyToken(uniqueHandle, token, pk);
  }
  parseToken(token: Token, sk: string): TokenMetadata {
    return AccessTokenManager.parseToken(token, sk);
  }
}
export namespace AccessTokenManager {
  export interface Contract {
    creaToken(uniqueHandle: string, sk: string): Token;
    verifyToken(uniqueHandle: string, token: Token, pk: string): Token;
    parseToken(token: Token, sk: string): TokenMetadata;
  }
  const tokensMap = new Map<string, Token>();
  export function getTokensMap() {
    return new Map(tokensMap);
  }
  export function creaToken(uniqueHandle: string, sk: string): Token {
    const cachedToken = tokensMap.get(uniqueHandle);
    if (cachedToken) return cachedToken;
    const created_at = Math.floor(Date.now() / 1000);
    const expiration = created_at + 30 * 24 * 60;
    const tokenMetadata = new TokenMetadata();
    tokenMetadata.uniqueHandle = uniqueHandle;
    tokenMetadata.created_at = created_at;
    tokenMetadata.expiration = expiration;
    const string = serialize(tokenMetadata, "utf8");
    const encrypted = encrypt(string, sk);
    const hex = serialize(encrypted);
    const signed = sign(hex, sk);
    const token = new Token(hex, signed);
    tokensMap.set(uniqueHandle, token);
    return token;
  }
  /**
   * Funzione che verifica e ritorna un NUOVO token. La funzione non muta il token passato.
   * Questo per motivi di sicurezza e di performance.
   * Assicurarsi di inizializzare il token verificato!
   * @param {Token} token il token da verificare
   * @param {string} pk la chiave pubblica con cui verificare il token
   * @returns {Token} Il nuovo token verificato
   */
  export function verifyToken(
    uniqueHandle: string,
    token: Token,
    pk: string
  ): Token {
    const verifiedToken = new Token(token.value, token.signature).verify(pk);
    tokensMap.set(uniqueHandle, verifiedToken);
    return verifiedToken;
  }
  export function parseToken(token: Token, sk: string) {
    if (!token.isPositiveVerification)
      throw new Error("token was not verified");
    const string = hexToUtf8(token.value);
    const decrypted = decrypt(string, sk);
    return JSON.parse(decrypted) as TokenMetadata;
  }
}
