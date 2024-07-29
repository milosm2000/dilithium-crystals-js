const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/browser/index.js",
  output: {
    filename: "dilithium.min.js",
    path: path.resolve(__dirname, "dist"),
    library: "Dilithium",
    libraryTarget: "umd",
    globalObject: "this",
  },
  mode: "production",
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
      crypto: false,
    },
  },
};
