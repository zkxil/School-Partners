const { merge } = require('webpack-merge'); // webpack-merge v5 用法
const common = require('./webpack.common.js');
const TerserPlugin = require("terser-webpack-plugin"); // 替代 UglifyJsPlugin
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 替代 OptimizeCSSAssetsPlugin

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,       // 并行压缩
        terserOptions: {
          ecma: 2015,         // 支持 ES6+
          compress: true,
          output: {
            comments: false,  // 去掉注释
          },
        },
        extractComments: false, // 不生成 LICENSE.txt
      }),
      new CssMinimizerPlugin({}) // 压缩 CSS
    ],
  }
});
