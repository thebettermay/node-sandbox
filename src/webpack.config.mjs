import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const mainConfig = {
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
    path: path.resolve(__dirname, "dist"),
    module: true,
    environment: {
      module: true,
    },
  },
  experiments: {
    outputModule: true,
  },
};

const workerConfig = {
  mode: "development",
  entry: "./workers/factorial.ts", // Path to your worker file
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
    filename: "factorial.mjs",
    path: path.resolve(__dirname, "dist/workers"),
    module: true,
    environment: {
      module: true,
    },
  },
  experiments: {
    outputModule: true,
  },
};

// Export both configurations as an array
export default [mainConfig, workerConfig];