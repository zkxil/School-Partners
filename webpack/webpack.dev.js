const { merge } = require('webpack-merge'); // Webpack 5 推荐写法
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  devtool: 'eval-cheap-module-source-map', // 开发模式推荐的 Source Map
  devServer: {
    static: {
      // 注意：这里改成和 webpack.common.js 的 output.path 保持一致
      directory: path.resolve(__dirname, '../output'),
    },
    compress: true,          // 启用 gzip 压缩
    port: 8082,              // 指定端口
    hot: true,               // 开启 HMR
    historyApiFallback: true, // SPA 路由支持
    proxy: {
      '/api': {
        target: 'http://localhost:4000/',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false,
      },
    }
  },
  mode: 'development'
});
