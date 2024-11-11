import path from "path";

export default {
  mode: "development", // Change to 'production' for production builds
  entry: "./index.ts", // Your main entry file
  externals: {
    "pg-native": "commonjs pg-native", // Exclude pg-native from the bundle
  },
  target: "node", // Targeting Node.js environment
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Matches .ts and .tsx files
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // Resolve these extensions
  },
  output: {
    filename: "bundle.mjs", // Output file name
    path: path.resolve(path.dirname(new URL(import.meta.url).pathname), "dist"), // Output directory
  },
};
