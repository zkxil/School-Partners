const { merge } = require('webpack-merge'); // Webpack 5 推荐写法
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');

module.exports = merge(common, {
  devtool: 'eval-cheap-module-source-map', // Webpack 5 推荐的 source map
  devServer: {
    // 启用开发服务器

    // static 代替 contentBase，告诉服务器从哪提供内容，只有在想要提供静态文件时才需要
    static: {
      directory: path.resolve(__dirname, '../dist'),
    },

    compress: true,          // 一切服务都启用 gzip 压缩

    // host: 'api.shoogoome.com', // 指定使用一个 host，可用 IP 地址访问
    // host: '127.0.0.1',

    port: 8082,              // 指定端口号，如省略，默认为”8080“
    hot: true,               // 启用模块热替换特性

    // inline 已默认启用，不需要再写 inline: true

    historyApiFallback: true, // 开发单页应用时有用，依赖于 HTML5 history API
    // 设为 true 时所有跳转将指向 index.html

    proxy: {
      '/api': {
        target: 'http://localhost:4000/',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false,
      },
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),  // webpack 内置的热更新插件
  ],
  mode: 'development'
});
