const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("../package.json").dependencies;
const HotModuleReplacementPlugin =
  require("webpack").HotModuleReplacementPlugin;

module.exports = {
  entry: path.resolve(__dirname, "..", "./src/index.ts"),
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HotModuleReplacementPlugin(),
    new ModuleFederationPlugin({
      name: "core_ui", // Name of the core-ui micro-frontend
      library: { type: "var", name: "core_ui" },
      remotes: {
        // Remote entry point of other micro-frontend app's
        app1: "app1", // app1
        app2: "app2", // app2
      },
      shared: {
        // List of dependencies shared accross micro-frontends
        ...deps,
        react: {
          eager: true,
        },
        "react-dom": {
          eager: true,
          import: "react-dom", // the "react" package will be used a provided and fallback module
          shareKey: "react-dom", // under this name the shared module will be placed in the share scope
          shareScope: "legacy", // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
        },
      },
    }),
  ],
  output: {
    path: path.resolve(__dirname, "..", "./dist"),
    filename: "bundle.js",
  },
  devServer: {
    port: 3000,
    static: {
      directory: path.resolve(__dirname, "..", "./dist"),
    },
    hot: false,
    liveReload: true,
  },
};
