const fs = require("fs");
const path = require("path");
const dilithiumFactory = require("../../dilithium.js");
const { DILITHIUM_PARAMS, generateKeys, sign, verify } = require("../common");

// Read the WebAssembly file
const wasmPath = path.join(__dirname, "../../dilithium.wasm");
const wasmBinary = fs.readFileSync(wasmPath);

// Define a custom locateFile function for Node.js
const nodeLocateFile = (filename) => {
  if (filename.endsWith(".wasm")) {
    return wasmPath;
  }
  return filename;
};

// Initialize the Dilithium module with the WebAssembly binary
const dilithiumModule = dilithiumFactory({
  wasmBinary,
  locateFile: nodeLocateFile,
});

module.exports = dilithiumModule.then((dilithium) => ({
  generateKeys: (kind, seed) => generateKeys(dilithium, kind, seed),
  sign: (message, privateKey, kind) =>
    sign(dilithium, message, privateKey, kind),
  verify: (signature, message, publicKey, kind) =>
    verify(dilithium, signature, message, publicKey, kind),
  DILITHIUM_PARAMS,
  HEAP8: dilithium.HEAP8, // Add this line
}));
