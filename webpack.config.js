const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const WorkboxPlugin = require('workbox-webpack-plugin');
//import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin';
// const  ServiceWorkerWebpackPlugin =  require('serviceworker-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    // index: './src/scripts/main.js',
    app: './src/scripts/app.js'
  },

  devServer: {
    contentBase: './public',
    publicPath: '/',
    inline: true,
    // compress: true,
    port: 9000,
    hot: true
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.(css|s[ac]ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')
                // require('cssnano')({
                //     preset: 'default',
                // })
              ],
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public')
  },

  plugins: [
    new CleanWebpackPlugin(['public']),
    new HtmlWebpackPlugin({
      title: 'PH Customer',
      template: 'src/app.html',
      inject: true,
      chunks: ['app']
    }), // this is to generate index.html file by template as app.html.
    // new HtmlWebpackPlugin({
    //   // Also generate a test.html
    //   inject: false,
    //   filename: 'app.html',
    //   template: 'src/app.html',
    //   title: 'Customer App',
    //   mViewPort: `width=device-width, initial-scale=1.0`,
    //   chunks: ['app'],
    //   files: {
    //     css: ['custom.css'],
    //     js: ['index', 'app'],
    //     chunks: {
    //       main: {
    //         entry: 'app',
    //         css: 'css'
    //       }
    //     }
    //   }
    // }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/view/*.html',
        to: '',
        toType: 'dir',
        transformPath(targetPath, absolutePath) {
          //remove src at the beginning
          return targetPath.substring(4);
        }
      }
    ]),
    // new CopyWebpackPlugin([
    //   {
    //     from: 'src/css/*.css',
    //     to: '',
    //     toType: 'dir',
    //     transformPath(targetPath, absolutePath) {
    //       //remove src at the beginning
    //       return targetPath.substring(4);
    //     }
    //   }
    // ]),
    // new CopyWebpackPlugin([
    //   { from: 'src/manifest.json', to: '',toType:'dir',
    //   transformPath (targetPath, absolutePath) {
    //       //remove src at the beginning
    //     return targetPath.substring(4);
    //   }
    //   }
    // ]),

    // new ServiceWorkerWebpackPlugin({
    //   entry: path.join(__dirname, 'src/sw.js'),
    // }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
