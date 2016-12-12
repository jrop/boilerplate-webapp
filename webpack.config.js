'use strict'

const glob = require('globby').sync
const path = require('path')
const webpack = require('webpack')
const NotifierPlugin = require('webpack-notifier')
const Visualizer = require('webpack-visualizer-plugin')

const entry = { }
glob([ 'src/public/js/**/*.js', '!**/lib/**/*.js' ])
	.forEach(f => entry[path.relative('src/public/js', f)] = path.resolve(process.cwd(), f)) // eslint-disable-line no-return-assign

const PROD = process.env.NODE_ENV == 'production'
const PROD_PLUGINS = [ new webpack.optimize.UglifyJsPlugin({
	comments: false,
	compress: { warnings: false },
	minimize: true,
}) ]
const DEV_PLUGINS = [ new Visualizer() ]

module.exports = {
	devtool: PROD ? '' : '#source-map',
	entry,
	output: {
		path: `${__dirname}/build/public/js`,
		filename: '[name]',
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel',
			exclude: /node_modules/,
		}],
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			filename: 'common.js',
			minChunks: 2,
		}),
		new NotifierPlugin({
			alwaysNotify: false,
		}),
	].concat(PROD ? PROD_PLUGINS : DEV_PLUGINS),
}
