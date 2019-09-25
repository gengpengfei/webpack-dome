const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");
const productionConfig = require("./webpack.prod.conf.js"); // 引入生产环境配置文件
const developmentConfig = require("./webpack.dev.conf.js"); // 引入开发环境配置文件

/**
 * 根据不同的环境，生成不同的配置
 * @param {String} env "development" or "production"
 */
const generateConfig = env => {
  let styleLoader =
    env === "production"
      ? ExtractTextPlugin.extract({
          // 生产环境：分离、提炼样式文件
          fallback: {
            loader: "style-loader"
          },
          use: [{
            loader: "css-loader",
            options: {
              minimize: true, //-- 开启css压缩
              sourceMap: env === "development" ? true : false // 开发环境：开启source-map（方便加密调试） 正式环境关闭
            }
          }]
        })
      : // 开发环境：页内样式嵌入
      [
        {
          loader: "style-loader",
          options: {
            singleton: true // 处理为单个style标签
          }
        },
        {
          loader: "css-loader",
          options: {
            minimize: true, //-- 开启css压缩
            sourceMap: env === "development" ? true : false // 开发环境：开启source-map
          }
        }
      ]; 
  
  return {
    entry: { app: "./src/app.js" },
    output: {
      publicPath: env === "development" ? "/" : __dirname + "/../dist/",
      path: path.resolve(__dirname, "..", "dist"),
      filename: "[name]-[hash:5].bundle.js",
      chunkFilename: "[name]-[hash:5].chunk.js"
    },
    module: {
      rules: [
        { 
          test: /\.js$/, 
          exclude: /(node_modules)/, 
          use: {
            loader: "babel-loader"
          }
        },
        { 
          test: /\.css$/, 
          use: styleLoader 
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: {
                attrs: ["img:src"]
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                name: "[name]-[hash:5].min.[ext]",
                limit: 1000, // size <= 1KB 小于1kb的图片会被编译成base64格式
                publicPath: "static/",
                outputPath: "static/"
              }
            }
          ]
        },
      ]
    },
    plugins: [
      // 开发环境和生产环境二者均需要的插件
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, "..", "index.html"),
        chunks: ["app"],
        minify: {
          collapseWhitespace: true, //-- 压缩时删除空格和空行
        }
      })
    ]
  };
};

module.exports = env => {
  let config = env === "production" ? productionConfig : developmentConfig;
  return merge(generateConfig(env), config);
};