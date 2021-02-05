/*
 * @Author: tangdaoyong
 * @Date: 2021-01-11 15:08:07
 * @LastEditors: tangdaoyong
 * @LastEditTime: 2021-01-11 19:05:03
 * @Description: file content
 */
var path = require('path');
var webpack = require('webpack');

// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// 入口
const ENTRYPATH = path.resolve(__dirname, './src/index.tsx');
// 出口
const OUTPUTPATH = path.resolve(__dirname, './dist');

module.exports = {
    entry: {
        app: ENTRYPATH
    },
    devtool: 'inline-source-map',
    plugins: [
        // 为了避免webpack因为生成众多的scss.d.ts而导致速度变慢
        // new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({ // 处理 html，配置多个会生成多个 html
            title: 'iOS与JS交互', // html的标题
            filename: './index.html', // 生成的 html 文件
            template: './public/index.html', // 使用的 html 模版
            favicon: '', // html页面图标
            inject: 'body', // script标签的未知，body,head,true(同body),false
            hash: true, // 给js生成hash值
            showErrors: true, // 显示错误信息
            minify: { // 压缩HTML文件
                minifyJS: true,  // 压缩内联js
                minifyCSS: true, // 压缩内联css
                removeComments: true, // 移除HTML中的注释
                removeCommentsFromCDATA: true, // 从脚本和样式删除的注释
                removeRedundantAttributes: true, // 删除多余的属性
                collapseWhitespace: true // 删除空白符与换行符
            }
        }),
        // new ForkTsCheckerWebpackPlugin()
    ],
    resolve: {
        extensions: ['*', '.tsx', '.ts', '.js', '.jsx', '.scss'],
        alias: {
            services: path.resolve(__dirname, 'src/services/')
        }
    },
    output: {
        path: OUTPUTPATH,      // 出口路径
        filename: '[name].bundle.js'
    },
    module: { // 加载器
        rules: [// 规则
            {
                test: /\.js|jsx$/,            // 匹配文件
                exclude: /node_modules/,      // 排除文件夹
                use: [
                    { loader: 'babel-loader' }, // babel 加载器
                    { loader: 'eslint-loader',  // eslint 加载器
                        options: {                // eslint 选项
                            enforce: 'pre',         // 在加载前执行
                            fix: true,              // 自动修复
                            include: [path.resolve(__dirname, 'src')], // 指定检查的目录
                            formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                        }
                    }
                ]
            },
            {
                test: /\.(ts|tsx)$/,
                use: [{
                    loader: 'babel-loader'
                }, {
                    loader: 'ts-loader',
                    options: {// disable type checker - we will use it in fork plugin
                        transpileOnly: true
                    }
                }],
                include: /src/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/, // 匹配 css 文件
                include: /src/,
                use: [
                    "style-loader",
                    {
                      loader: "@teamsupercell/typings-for-css-modules-loader",
                      options: {
                        // pass all the options for `css-loader` to `css-loader`, eg.
                        namedExport: true,
                        modules: true
                      }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.s(a|c)ss$/,
                include: /src/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: '@teamsupercell/typings-for-css-modules-loader',// typings-for-css-modules-loader让我们可以像使用js模块一样引入css和scss文件。
                    options: {
                        formatter: 'prettier'
                    }
                }, {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[local]_[hash:base64:5]'
                        },
                        sourceMap: true,
                        importLoaders: 2
                    }
                }, {
                    loader: 'sass-loader'
                }, {
                    loader: 'postcss-loader'
                }]
            }
        ]
    },
    devServer: { // 配置 webpack-dev-server
        host: 'localhost',
        port: 3000,
        open: true,
        contentBase: OUTPUTPATH,
        historyApiFallback: true, // 该选项的作用所有的404都连接到index.html
        compress: true // 压缩
    }
}