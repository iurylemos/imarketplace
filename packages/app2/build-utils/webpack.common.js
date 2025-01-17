const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HotModuleReplacementPlugin =
  require("webpack").HotModuleReplacementPlugin;
const deps = require("../package.json").dependencies;

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
      name: "app2", // Name of micro-frontend
      library: { type: "var", name: "app2" },
      filename: "remoteEntry.js", // Name of remote entry file
      exposes: {
        // list of components exposed and source file mapping
        "./App": "./src/App",
      },
      shared: {
        // List of dependencies shared accross micro-frontends
        ...deps,
        react: {
          eager: true,
          import: "react", // the "react" package will be used a provided and fallback module
          shareKey: "react", // under this name the shared module will be placed in the share scope
          shareScope: "legacy", // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
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
    new HtmlWebpackPlugin({
      title: "App 2",
      template: path.resolve(__dirname, "..", "./src/index.html"),
    }),
  ],
  output: {
    path: path.resolve(__dirname, "..", "./dist"),
    filename: "bundle.js",
  },
  devServer: {
    port: 3002,
    static: path.resolve(__dirname, "..", "./dist"),
    hot: false,
    liveReload: true,
  },
};
