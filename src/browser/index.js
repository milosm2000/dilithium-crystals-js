import dilithiumFactory from "../../dilithium.js";
import { DILITHIUM_PARAMS, generateKeys, sign, verify } from "../common";

// Function to fetch the WebAssembly file
async function fetchWasm() {
  console.log(
    `fetching wasm from /node_modules/dilithium-crystals-js/dilithium.wasm`
  );
  const response = await fetch(
    "/node_modules/dilithium-crystals-js/dilithium.wasm"
  );
  return await response.arrayBuffer();
}

// Create the Dilithium object
const createDilithium = () =>
  fetchWasm()
    .then((wasmBinary) =>
      dilithiumFactory({
        wasmBinary,
        locateFile: (path) => {
          if (path.endsWith(".wasm")) {
            return "/node_modules/dilithium-crystals-js/dilithium.wasm";
          }
          return path;
        },
      })
    )
    .then((dilithium) => ({
      generateKeys: (kind, seed) => generateKeys(dilithium, kind, seed),
      sign: (message, privateKey, kind) =>
        sign(dilithium, message, privateKey, kind),
      verify: (signature, message, publicKey, kind) =>
        verify(dilithium, signature, message, publicKey, kind),
      DILITHIUM_PARAMS,
    }));

export { createDilithium };
