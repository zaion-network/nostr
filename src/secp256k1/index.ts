// import { signAsync, verify as nobleverify, Signature } from "@noble/secp256k1";
import { schnorr } from "@noble/curves/secp256k1";
export const sign = schnorr.sign;
export const verify = schnorr.verify;
