const path = require('path');
const webpack = require('webpack');
const envPath = path.resolve(__dirname, '.env');
const envVars = require('dotenv').config({ path: envPath }).parsed || {};
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(envVars),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/assets'),
          to: path.resolve(__dirname, 'dist/assets'),
        },
      ],
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
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[hash][ext][query]',
        },
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 3001,
    open: true,
    historyApiFallback: true,
    hot: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
