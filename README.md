# dilithium-crystals-js

dilithium-crystals-js is a JavaScript implementation of the Dilithium post-quantum cryptographic signature scheme. This package provides a unified API for both Node.js and browser environments, offering robust quantum-resistant digital signatures. It includes TypeScript declarations (.d.ts files) for improved IDE support, type checking, and autocompletion.

## Features

- Implements Dilithium, a lattice-based digital signature scheme
- Supports all four parameter sets of Dilithium
- Works in both Node.js and browser environments
- Easy-to-use API for key generation, signing, and verification

## Installation

You can install the package using npm:

```bash
npm install dilithium-crystals-js
```

## Usage

### Node.js

In a Node.js environment, you can use the package as follows:

```javascript
const Dilithium = require("dilithium-crystals-js");

Dilithium.then((dilithium) => {
  // Generate keys
  const kind = 2; // Dilithium2
  const { publicKey, privateKey } = dilithium.generateKeys(kind);

  // Sign a message
  const message = Buffer.from("Hello, Dilithium!");
  const { signature } = dilithium.sign(message, privateKey, kind);

  // Verify the signature
  const verificationResult = dilithium.verify(
    signature,
    message,
    publicKey,
    kind
  );

  console.log(
    "Verification result:",
    verificationResult.result === 0 ? "Valid" : "Invalid"
  );
});
```

### Browser

For browser environments, include the minified script in your HTML

```javascript
import { createDilithium } from "./node_modules/dilithium-crystals-js/dist/dilithium.min.js";

async function main() {
  let dilithium = await createDilithium();

  console.log("Dilithium initialized:", dilithium);

  // Generate keys

  const kind = 2; // Dilithium2
  const { publicKey, privateKey } = dilithium.generateKeys(kind);

  // Sign a message
  const message = new TextEncoder().encode("Hello, Dilithium!");
  const { signature } = dilithium.sign(message, privateKey, kind);

  // Verify the signature
  const verificationResult = dilithium.verify(
    signature,
    message,
    publicKey,
    kind
  );

  console.log(
    "Verification result:",
    verificationResult.result === 0 ? "Valid" : "Invalid"
  );
}

main();
```

Note: Make sure to properly configure your build process to handle ES6 modules and to include the WASM file in your public directory.

## API Reference

### `dilithium.generateKeys(kind, seed?)`

Generates a new key pair.

- **kind**: Number (0-3) specifying the Dilithium parameter set.
- **seed** (optional): A seed for deterministic key generation.

**Returns**: `{ publicKey, privateKey }`

### `dilithium.sign(message, privateKey, kind)`

Signs a message.

- **message**: `Uint8Array` or `Buffer` containing the message to sign.
- **privateKey**: The private key generated by `generateKeys`.
- **kind**: Number (0-3) specifying the Dilithium parameter set.

**Returns**: `{ signature, signatureLength }`

### `dilithium.verify(signature, message, publicKey, kind)`

Verifies a signature.

- **signature**: The signature to verify.
- **message**: The original message that was signed.
- **publicKey**: The public key corresponding to the private key used for signing.
- **kind**: Number (0-3) specifying the Dilithium parameter set.

**Returns**: An object containing the verification result and other metadata.

## Dilithium Parameter Sets

dilithium-crystals-js supports all four parameter sets of the Dilithium signature scheme:

- **0**: Dilithium2 (NIST security level 2)
- **1**: Dilithium3 (NIST security level 3)
- **2**: Dilithium5 (NIST security level 5)
- **3**: Dilithium2-AES (NIST security level 2, AES variant)

Choose the appropriate parameter set based on your security requirements.

## Contributing

Contributions to dilithium-crystals-js are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Commit your changes with clear, descriptive commit messages
4. Push your branch and submit a pull request

Please ensure your code adheres to the existing style and includes appropriate test coverage.

If you encounter any issues or have questions about dilithium-crystals-js, please file an issue on the GitHub repository.

## Acknowledgments
