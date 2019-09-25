const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const glob = require("glob-all");
const PurifyCSS = require("purifycss-webpack");
const path = require("path");

module.exports = {
  mode: "production",
  plugins: [
    new ExtractTextPlugin({
      filename: "[name].min.css",
      allChunks: false // 只包括初始化css, 不包括异步加载的CSS
    }),
     //-- CSS Tree Shaking
     new PurifyCSS({
      paths: glob.sync([
        // 要做CSS Tree Shaking的路径文件
        path.resolve(__dirname,"..","*.html"), // 请注意，我们同样需要对 html 文件进行 tree shaking
        path.resolve(__dirname, "..","src/*.js")
      ])
    }),
    //-- 每次打包先清空dist文件
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname, "../"),
      verbose: true
    })
  ]
}