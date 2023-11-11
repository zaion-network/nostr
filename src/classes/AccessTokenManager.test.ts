import { describe, it, expect, beforeAll } from "bun:test";
import { AccessTokenManager, Token } from "./AccessTokenManager";
import { generateKeyPair } from "../nostr-tools";
import { hexToUtf8 } from "../utils/hexToUtf";

let serverSK: string, serverPK: string, wrongPk: string, token: Token;
const handle1 = "uniqueHandle1";
const handle2 = "uniqueHandle2";

beforeAll(() => {
  const serverKeys1 = generateKeyPair();
  const keys2 = generateKeyPair();
  serverSK = serverKeys1.sk;
  serverPK = serverKeys1.pk;
  wrongPk = keys2.pk;
});

describe(`${AccessTokenManager.name}`, () => {
  it("controlla membri", () => {
    expect(AccessTokenManager).toBeTruthy();
  });
  it("test creaToken", () => {
    const token = AccessTokenManager.creaToken(handle1, serverSK);
    expect(token.signature instanceof Uint8Array).toBeTrue();
  });
  it("testa verifyToken", () => {
    const token = AccessTokenManager.creaToken(handle1, serverSK);
    expect(token.isPositiveVerification).toBeFalse();
    const verifiedToken = AccessTokenManager.verifyToken(
      handle1,
      token,
      serverPK
    );
    expect(token.isPositiveVerification).toBeFalse();
    expect(verifiedToken.isPositiveVerification).toBeTrue();
    const storedtoken = AccessTokenManager.creaToken(handle1, serverSK);
    expect(storedtoken.isPositiveVerification).toBeTrue();
  });
  it("la verifica dovrebbe fallire, perchè il token è stato variato", () => {
    const token = AccessTokenManager.creaToken(handle2, serverSK);
    token.value = Buffer.from(token.value + "1").toString("hex");
    expect(token.isPositiveVerification).toBeFalse();
    const verifiedToken = AccessTokenManager.verifyToken(
      handle2,
      token,
      serverPK
    );
    expect(verifiedToken.isPositiveVerification).toBeFalse();
  });
  it("dovrebbe ritornare la lista di token creati", () => {
    const map = AccessTokenManager.getTokensMap();
    expect(map.size).toEqual(2);
  });
  it("dovrebbe non variare il map che è registrato nello statico della classe", () => {
    const map = AccessTokenManager.getTokensMap();
    map.set("sada", token);
    const map2 = AccessTokenManager.getTokensMap();
    expect(map2.size).toEqual(2);
  });
  it("dovrebbe non verificare il token perchè non è la chiave corretta", () => {
    const token = AccessTokenManager.creaToken(handle2, serverSK);
    const notVerifiedToken = AccessTokenManager.verifyToken(
      handle2,
      token,
      wrongPk
    );
    expect(notVerifiedToken.isPositiveVerification).toBeFalse();
  });
});
