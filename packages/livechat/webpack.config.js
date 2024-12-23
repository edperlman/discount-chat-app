"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const webpack_1 = __importDefault(require("webpack"));
require("webpack-dev-server");
// Helper to use absolute paths in the webpack config
const _ = (p) => path_1.default.resolve(__dirname, p);
const common = (args) => ({
    stats: 'errors-warnings',
    mode: args.mode,
    devtool: args.mode === 'production' ? 'source-map' : 'eval',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
        },
    },
    optimization: {
        sideEffects: false,
        splitChunks: {
            chunks: 'all',
        },
        emitOnErrors: false,
    },
});
const config = (_env, args) => [
    Object.assign(Object.assign({}, common(args)), { entry: {
            bundle: ['core-js', 'regenerator-runtime/runtime', _('./src/entry')],
            polyfills: _('./src/polyfills'),
        }, output: {
            path: _('./dist'),
            publicPath: args.mode === 'production' ? 'livechat/' : '/',
            filename: args.mode === 'production' ? '[name].[chunkhash:5].js' : '[name].js',
            chunkFilename: '[name].chunk.[chunkhash:5].js',
        }, module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: [/\/node_modules\/core-js\//],
                    type: 'javascript/auto',
                    use: ['babel-loader'],
                },
                {
                    test: /\.tsx?$/,
                    use: 'babel-loader',
                    exclude: ['/node_modules/'],
                },
                {
                    test: /\.svg$/,
                    use: [require.resolve('./svg-component-loader'), 'svg-loader', 'image-webpack-loader'],
                },
                {
                    test: /\.s?css$/,
                    exclude: [_('./src/components'), _('./src/routes')],
                    use: [
                        args.mode === 'production' ? mini_css_extract_plugin_1.default.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.s?css$/,
                    include: [_('./src/components'), _('./src/routes')],
                    use: [
                        args.mode === 'production' ? mini_css_extract_plugin_1.default.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[local]__[hash:base64:5]',
                                },
                                importLoaders: 1,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    enforce: 'pre',
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    fiber: false,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff2?|ttf|eot|jpe?g|png|webp|gif|mp4|mov|ogg|webm)(\?.*)?$/i,
                    loader: args.mode === 'production' ? 'file-loader' : 'url-loader',
                },
            ],
        }, plugins: [
            new mini_css_extract_plugin_1.default({
                filename: args.mode === 'production' ? '[name].[contenthash:5].css' : '[name].css',
                chunkFilename: args.mode === 'production' ? '[name].chunk.[contenthash:5].css' : '[name].chunk.css',
            }),
            new webpack_1.default.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(args.mode === 'production' ? 'production' : 'development'),
            }),
            new html_webpack_plugin_1.default({
                title: 'Livechat - Rocket.Chat',
                chunks: ['polyfills', 'vendor', 'bundle'],
                chunksSortMode: 'manual',
            }),
        ], devServer: {
            hot: true,
            port: 8080,
            host: '0.0.0.0',
            allowedHosts: 'all',
            open: true,
            devMiddleware: {
                publicPath: args.mode === 'production' ? 'livechat/' : '/',
                stats: 'normal',
            },
            client: {
                logging: 'verbose',
            },
            static: {
                directory: _('./src'),
                publicPath: args.mode === 'production' ? 'livechat/' : '/',
                watch: {
                    ignored: [_('./dist'), _('./node_modules')],
                },
            },
        } }),
    Object.assign(Object.assign({}, common(args)), { entry: {
            'rocketchat-livechat.min': _('./src/widget.ts'),
        }, output: {
            path: _('./dist'),
            publicPath: args.mode === 'production' ? 'livechat/' : '/',
            filename: '[name].js',
        }, module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'babel-loader',
                    exclude: ['/node_modules/'],
                },
            ],
        } }),
];
exports.default = config;
