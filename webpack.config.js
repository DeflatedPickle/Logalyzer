const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    target: "node",
    entry: "./src/ts/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: [
                    "html-loader",
                    "pug-html-loader"
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "file-loader?name=[name].css",
                    "extract-loader",
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.tsx?$/,
                use: ["babel-loader", "ts-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.(gif|png)$/,
                loader: "file-loader"
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            template: "./src/pug/index.pug"
        }),
        new MiniCssExtractPlugin({
            filename: "bundle.css"
        })
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
};