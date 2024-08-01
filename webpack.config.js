const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/browser/index.js",
  output: {
    filename: "dilithium.min.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "module",
    },
    module: true,
  },
  experiments: {
    outputModule: true,
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
  target: ["web", "es2015"],
};
