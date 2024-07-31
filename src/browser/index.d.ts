import { DilithiumParams, KeyPair, SignatureResult, VerificationResult } from '../common';

interface DilithiumInterface {
    generateKeys: (kind: number, seed?: Uint8Array) => KeyPair;
    sign: (message: Uint8Array, privateKey: Uint8Array, kind: number) => SignatureResult;
    verify: (signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array, kind: number) => VerificationResult;
    DILITHIUM_PARAMS: DilithiumParams[];
}

export function createDilithium(): Promise<DilithiumInterface>;
