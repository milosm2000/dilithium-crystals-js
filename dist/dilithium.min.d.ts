// Re-export everything from common.d.ts

import {
  DilithiumParams,
  KeyPair,
  SignatureResult,
  VerificationResult,
} from "../src/common";

export * from "../src/common";

// Define the DilithiumInterface
export interface DilithiumInterface {
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
}

// Export the createDilithium function
export function createDilithium(): Promise<DilithiumInterface>;

// If you have any browser-specific types or functions, define and export them here
// For example:
export function fetchWasm(): Promise<ArrayBuffer>;
