const path = require("path");
const webpack = require("webpack");

// Plugins
const Clean = require("clean-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "state.js",
    path: path.resolve(__dirname, "./dist"),
    library: 'State',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader"
      }
    ]
  },
  plugins: [
    new Clean(["dist"], { root: process.cwd(), verbose: true }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        screw_ie8: true
      },
      sourceMap: false
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
};