const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const tsImportPluginFactory = require('ts-import-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  entry: path.join(__dirname, '../src/admin/index.tsx'),
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: './index.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@': resolve('../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(jsx|tsx|js|ts)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [tsImportPluginFactory({
              libraryName: 'antd',
              libraryDirectory: 'es',
              style: "css"
            })]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: { plugins: [] }
            }
          },
          'sass-loader',
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 500 }
        },
        generator: {
          filename: 'images/[name][ext]'
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, '../output'),
    filename: devMode ? '[name].[hash:8].js' : '[name].[chunkhash:8].js',
    chunkFilename: devMode ? '[name].[hash:8].js' : '[name].[chunkhash:8].js',
    clean: true, // Webpack 5 内置清理
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
