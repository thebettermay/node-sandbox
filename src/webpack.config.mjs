import path from "path";

export default {
  mode: "development",
  entry: "./index.ts",
  externals: {
    "pg-native": "commonjs pg-native",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.mjs",
    path: path.resolve(path.dirname(new URL(import.meta.url).pathname), "dist"),
    module: true,
    environment: {
      module: true,
    },
  },
  experiments: {
    outputModule: true,
  },
};
