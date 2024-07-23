const path = require("path");
const { DefinePlugin } = require("webpack");

module.exports = {
  mode: "production",
  plugins: [
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
  output: {
    path: path.resolve(__dirname, "..", "./dist"),
    filename: "bundle.js",
    publicPath: "/app1/",
  },
  devtool: "source-map",
};
