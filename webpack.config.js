const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		main: './src/index.js',
		b64: './bundle.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].[contenthash].js',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|ico|webmanifest|xml)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/[name][ext]',
				},
			},
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
		],
	},
	optimization: {
		minimizer: [`...`, new CssMinimizerPlugin()],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash].css',
		}),
		new HtmlWebpackPlugin({
			template: './index.html',
			filename: 'index.html',
			chunks: ['main'],
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				minifyJS: true,
				minifyCSS: true,
			},
		}),
		new HtmlWebpackPlugin({
			template: './b64/index.html',
			filename: 'b64/index.html',
			chunks: ['b64'],
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				minifyJS: true,
				minifyCSS: true,
			},
		}),
		new CopyPlugin({
			patterns: [
				{ from: 'assets', to: 'assets' },
				{
					from: 'manifest.webmanifest',
					to: 'manifest.webmanifest',
					noErrorOnMissing: true,
				},
			],
		}),
	],
};
