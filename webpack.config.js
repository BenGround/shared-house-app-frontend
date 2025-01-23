const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const envPath = path.resolve(__dirname, '.env');
const envVars = require('dotenv').config({ path: envPath }).parsed || {};

module.exports = {
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: '[name].[contenthash].js', 
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', 
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(envVars),
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
      process: 'process/browser',
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      process: require.resolve('process/browser'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 3000,
    open: true,
    hot: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
