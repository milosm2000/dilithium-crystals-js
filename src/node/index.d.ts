import {
  DilithiumParams,
  KeyPair,
  SignatureResult,
  VerificationResult,
} from "../common";

declare const dilithiumModule: Promise<{
  generateKeys: (kind: number, seed?: Uint8Array) => KeyPair;
  sign: (
    message: Uint8Array,
    privateKey: Uint8Array,
    kind: number
  ) => SignatureResult;
  verify: (
    signature: Uint8Array,
    message: Uint8Array,
    publicKey: Uint8Array,
    kind: number
  ) => VerificationResult;
  DILITHIUM_PARAMS: DilithiumParams[];
  HEAP8: Int8Array;
}>;

export { DilithiumParams, KeyPair, SignatureResult, VerificationResult };

export = dilithiumModule;
