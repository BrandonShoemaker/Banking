const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
    entry: {
        main: './public/js/index.js'
    },
    output: {
        path: path.resolve(__dirname, '/dist'),
        filename: '[name].bundle.js'
    },
    plugins: [
        new BundleAnalyzerPlugin(
            {
                analyzerMode: "static"
            }
        ),
        new WebpackPwaManifest({
            name: "Your Bank Financing",
            short_name: "Banking",
            description: "An app that allows you to view your deposits and withdrawls through a clean graph.",
            start_url: "./index.html",
            background_color: "#000000",
            theme_color: "#ffffff",
            fingerprints: false,
            inject: false,
            icons: [{
              src: path.resolve("public/icons/icon-512x512.png"),
              sizes: [96, 128, 192, 256, 384, 512],
              destination: path.join("assets", "icons")
            }]
          })
    ],
    module: {
        rules: [
            {
                test: /\.jpg$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name(file){
                                return "[path][name].[ext]";
                            },
                            publicPath: function(url){
                                return url.replace('../', '/assets/');
                            }
                        }
                    },
                    {
                        loader: 'image-webpack-loader'
                    }
                ]
            }
        ]
    },
    mode: 'development'
};