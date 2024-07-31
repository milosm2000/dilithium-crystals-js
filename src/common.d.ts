export interface DilithiumParams {
  CRYPTO_PUBLICKEYBYTES: number;
  CRYPTO_SECRETKEYBYTES: number;
  CRYPTO_BYTES: number;
}

export const DILITHIUM_PARAMS: DilithiumParams[];

export interface KeyPair {
  result: number;
  publicKey?: Uint8Array;
  privateKey?: Uint8Array;
}

export interface SignatureResult {
  result: number;
  signature: Uint8Array;
  signatureLength: number;
}

export interface VerificationResult {
  result: number;
  signatureLength: number;
  expectedSignatureSize: number;
  messageLength: number;
  publicKeyLength: number;
  expectedPublicKeySize: number;
  kind: number;
}

export interface DilithiumModule {
  _malloc(size: number): number;
  _free(ptr: number): void;
  HEAPU8: Uint8Array;
  ccall(ident: string, returnType: string, argTypes: string[], args: any[]): any;
  setValue(ptr: number, value: number, type: string): void;
  getValue(ptr: number, type: string): number;
}

export function generateKeys(
  dilithium: DilithiumModule, 
  kind: number, 
  seed?: Uint8Array
): KeyPair;

export function sign(
  dilithium: DilithiumModule, 
  message: Uint8Array, 
  privateKey: Uint8Array, 
  kind: number
): SignatureResult;

export function verify(
  dilithium: DilithiumModule, 
  signature: Uint8Array, 
  message: Uint8Array, 
  publicKey: Uint8Array, 
  kind: number
): VerificationResult;
