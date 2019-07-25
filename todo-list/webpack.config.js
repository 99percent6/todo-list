const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
// const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "js/app.[hash].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.module\.s(a|c)ss$/,
        loader: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              camelCase: true,
              sourceMap: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        loader: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        loader: 'postcss-loader',
        options: {
          plugins: [
            autoprefixer()
          ],
          sourceMap: true
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
        type: 'javascript/auto'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: "[id].[hash].css"
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new CopyPlugin([
      { from: 'src/public', to: path.join(__dirname, "/dist") }
    ]),
    new InjectManifest({
      swSrc: './src/serviceWorker.js',
      importWorkboxFrom: 'cdn',
      exclude: [/\.map$/, /asset-manifest\.json$/],
      globPatterns: ['**/*.{html,js,css}'],
    })
    // new WorkboxPlugin.GenerateSW({
    //   globPatterns: ['**/*.{html,js,css}'],
    //   clientsClaim: true,
    //   exclude: [/\.map$/, /asset-manifest\.json$/],
    //   importWorkboxFrom: 'cdn',
    //   navigateFallback: '/index.html',
    //   navigateFallbackBlacklist: [
    //     // Exclude URLs starting with /_, as they're likely an API call
    //     new RegExp('^/_'),
    //     // Exclude URLs containing a dot, as they're likely a resource in
    //     // public/ and not a SPA route
    //     new RegExp('/[^/]+\\.[^/]+$'),
    //   ],
    // })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      })
    ]
    // splitChunks: {
    //   chunks: 'all',
    //   minSize: 100000,
    //   maxSize: 500000,
    //   minChunks: 2,
    //   maxAsyncRequests: 5,
    //   maxInitialRequests: 3,
    //   automaticNameDelimiter: '~',
    //   name: false,
    //   cacheGroups: {
    //     vendors: {
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: -10
    //     },
    //     default: {
    //       minChunks: 2,
    //       priority: -20,
    //       reuseExistingChunk: true
    //     }
    //   }
    // }
  }
};