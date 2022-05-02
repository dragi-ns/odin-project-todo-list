const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: {
    main: './src/js/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[id].[contenthash].js',
    clean: true,
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    open: {
      app: {
        name: 'firefox-developer-edition',
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        exclude: /joey\.svg/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash][ext]'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
      ignoreOrder: false
    })
  ]  
};
