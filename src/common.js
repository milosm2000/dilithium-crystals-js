const DILITHIUM_PARAMS = [
  {
    CRYPTO_PUBLICKEYBYTES: 896,
    CRYPTO_SECRETKEYBYTES: 2096,
    CRYPTO_BYTES: 1387,
  },
  {
    CRYPTO_PUBLICKEYBYTES: 1184,
    CRYPTO_SECRETKEYBYTES: 2800,
    CRYPTO_BYTES: 2044,
  },
  {
    CRYPTO_PUBLICKEYBYTES: 1472,
    CRYPTO_SECRETKEYBYTES: 3504,
    CRYPTO_BYTES: 2701,
  },
  {
    CRYPTO_PUBLICKEYBYTES: 1760,
    CRYPTO_SECRETKEYBYTES: 3856,
    CRYPTO_BYTES: 3366,
  },
];

function generateKeys(dilithium, kind, seed) {
  if (kind < 0 || kind > 3) {
    return -1;
  }

  const seedSize = seed ? seed.length : 0;
  const seedPtr = seed ? dilithium._malloc(seedSize) : 0;
  if (seed) {
    dilithium.HEAPU8.set(new Uint8Array(seed), seedPtr);
  }

  const privateKeySize = DILITHIUM_PARAMS[kind].CRYPTO_SECRETKEYBYTES;
  const publicKeySize = DILITHIUM_PARAMS[kind].CRYPTO_PUBLICKEYBYTES;

  const publicKeyPtr = dilithium._malloc(publicKeySize);
  const privateKeyPtr = dilithium._malloc(privateKeySize);

  const result = dilithium.ccall(
    "dilithium_keygen",
    "number",
    ["number", "number", "number", "number", "number"],
    [publicKeyPtr, privateKeyPtr, kind, seedPtr, seedSize]
  );

  let publicKey, privateKey;
  if (result === 0) {
    publicKey = new Uint8Array(
      dilithium.HEAPU8.subarray(publicKeyPtr, publicKeyPtr + publicKeySize)
    );
    privateKey = new Uint8Array(
      dilithium.HEAPU8.subarray(privateKeyPtr, privateKeyPtr + privateKeySize)
    );
  }

  if (seedPtr) dilithium._free(seedPtr);
  dilithium._free(publicKeyPtr);
  dilithium._free(privateKeyPtr);

  return { result, publicKey, privateKey };
}
function sign(dilithium, message, privateKey, kind) {
  if (kind < 0 || kind > 3) {
    throw new Error("Invalid Dilithium kind");
  }

  const params = DILITHIUM_PARAMS[kind];
  const cryptoBytes = params.CRYPTO_BYTES;

  // Allocate memory for inputs
  const messageLength = message.length;
  const messagePtr = dilithium._malloc(messageLength);
  dilithium.HEAPU8.set(new Uint8Array(message), messagePtr);

  const privateKeySize = privateKey.length;
  if (privateKeySize !== params.CRYPTO_SECRETKEYBYTES) {
    throw new Error(
      `Invalid private key size. Expected: ${params.CRYPTO_SECRETKEYBYTES}, Provided: ${privateKeySize}`
    );
  }
  const privateKeyPtr = dilithium._malloc(privateKeySize);
  dilithium.HEAPU8.set(new Uint8Array(privateKey), privateKeyPtr);

  // Allocate memory for outputs
  const maxSignatureLength = cryptoBytes + messageLength;
  const signaturePtr = dilithium._malloc(maxSignatureLength);
  const signatureLengthPtr = dilithium._malloc(4); // size_t is 4 bytes
  dilithium.setValue(signatureLengthPtr, maxSignatureLength, "i32");

  // Call the C function
  const result = dilithium.ccall(
    "dilithium_sign",
    "number",
    ["number", "number", "number", "number", "number", "number", "number"],
    [
      signaturePtr,
      signatureLengthPtr,
      messagePtr,
      messageLength,
      privateKeyPtr,
      privateKeySize,
      kind,
    ]
  );

  // Get the actual signature length
  const actualSignatureLength = dilithium.getValue(signatureLengthPtr, "i32");

  // Copy the signature data
  const signatureData = new Uint8Array(
    dilithium.HEAPU8.buffer,
    signaturePtr,
    actualSignatureLength
  );
  const signature = new Uint8Array(signatureData);

  // Free allocated memory
  dilithium._free(messagePtr);
  dilithium._free(privateKeyPtr);
  dilithium._free(signaturePtr);
  dilithium._free(signatureLengthPtr);

  return { result, signature, signatureLength: actualSignatureLength };
}

function verify(dilithium, signature, message, publicKey, kind) {
  console.log("inside verify for kind", kind);
  // Determine the expected sizes based on the Dilithium kind
  const params = DILITHIUM_PARAMS[kind];
  const expectedSignatureSize = params.CRYPTO_BYTES + message.length;
  const expectedPublicKeySize = params.CRYPTO_PUBLICKEYBYTES;
  console.log("inside verify expectedPublicKeySize", expectedPublicKeySize);

  // Validate input sizes
  if (signature.length !== expectedSignatureSize) {
    throw new Error(
      `Invalid signature size. Expected ${expectedSignatureSize}, got ${signature.length}`
    );
  }
  if (publicKey.length !== expectedPublicKeySize) {
    throw new Error(
      `Invalid public key size. Expected ${expectedPublicKeySize}, got ${publicKey.length}`
    );
  }

  // Allocate memory for the signature, message, and public key
  const signaturePtr = dilithium._malloc(expectedSignatureSize);
  const messagePtr = dilithium._malloc(message.length);
  const publicKeyPtr = dilithium._malloc(expectedPublicKeySize);

  // Copy the data to the allocated memory
  dilithium.HEAPU8.set(new Uint8Array(signature), signaturePtr);
  dilithium.HEAPU8.set(new Uint8Array(message), messagePtr);
  dilithium.HEAPU8.set(new Uint8Array(publicKey), publicKeyPtr);

  try {
    const result = dilithium.ccall(
      "dilithium_verify",
      "number",
      ["number", "number", "number", "bigint", "number", "number", "number"],
      [
        signaturePtr,
        expectedSignatureSize,
        messagePtr,
        BigInt(message.length),
        publicKeyPtr,
        expectedPublicKeySize,
        kind,
      ]
    );

    return {
      result,
      signatureLength: signature.length,
      expectedSignatureSize,
      messageLength: message.length,
      publicKeyLength: publicKey.length,
      expectedPublicKeySize,
      kind,
    };
  } finally {
    // Free the allocated memory
    dilithium._free(signaturePtr);
    dilithium._free(messagePtr);
    dilithium._free(publicKeyPtr);
  }
}

module.exports = {
  DILITHIUM_PARAMS,
  generateKeys,
  sign,
  verify,
};
