const gulp = require('gulp')

const babel = require('gulp-babel')
const del = require('del')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const webpack = require('webpack')

//
// Constants
//
const compiler = webpack(require('./webpack.config.js'))
const errorReporter = () => plumber({errorHandler: notify.onError('Error: <%= error.message %>')})
const WATCHING = process.argv.includes('watch')

//
// Gulp tasks:
//
gulp.task('default', ['css', 'js'])

gulp.task('css', () => gulp.src(['src/public/css/**/*.css', '!**/lib/**/*.*'])
	.pipe(errorReporter())
	.pipe(postcss([require('postcss-import'), require('postcss-cssnext')]))
	.pipe(gulp.dest('build/public/css')))

gulp.task('js', ['js:client', 'js:server'])

gulp.task('js:client', function webpackRunner(_done) {
	const done = err => {
		if (_done.called) return
		_done.called = true
		_done(err)
	}

	function printStats(err, stats) {
		if (err) return done(err)
		// eslint-disable-next-line no-console
		console.log(stats.toString({colors: true, chunks: false, timings: false, version: false}))
		done()
	}

	if (WATCHING && !webpackRunner.run) {
		webpackRunner.run = true
		compiler.watch({}, printStats)
	} else {
		compiler.run(printStats)
	}
})

gulp.task('js:server', () => gulp.src('src/main/**/*.js')
	.pipe(errorReporter())
	.pipe(babel())
	.pipe(gulp.dest('build/main')))

gulp.task('watch', ['default'], function () {
	gulp.watch('src/public/css/**/*.css', ['css'])
	gulp.watch('src/main/**/*.js', ['js:server'])
})

gulp.task('clean', () => del('build'))
