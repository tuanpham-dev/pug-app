const gulp = require('gulp')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const beautify = require('gulp-jsbeautifier')
const changed = require('gulp-changed')
const log = require('fancy-log')
const plumber = require('gulp-plumber')
const browserSync = require('browser-sync').create()
const _ = require('lodash')

const errorHandler = (err) => {
	log(err)
	this.emit('end')
}

// Pug
gulp.task('pug', () => {
	return gulp.src('src/pug/*.pug')
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(pug({
			locals: {
				_: _,
				config: {}
			}
		}))
		.pipe(beautify({indent_with_tabs: true}))
		.pipe(changed('dist', {
			extension: '.html',
			hasChanged: changed.compareSha1Digest
		}))
		.pipe(gulp.dest('dist'))
})

// Sass
gulp.task('sass', () => {
	return gulp.src('src/sass/**/*.scss')
		.pipe(plumber({errorHandler: errorHandler}))
		.pipe(sass())
		.pipe(autoprefixer('last 2 version'))
		.pipe(beautify({indent_wiath_tabs: true}))
		.pipe(changed('dist/css', {
			extension: '.css',
			hasChanged: changed.compareSha1Digest
		}))
		.pipe(gulp.dest('dist/css'))
})

// Watch
gulp.task('watch:pug', () => {
	return gulp.watch('src/pug/**/*.pug', gulp.series('pug'))
})

gulp.task('watch:sass', () => {
	return gulp.watch('src/sass/**/*.sass', gulp.series('sass'))
})

gulp.task('watch', gulp.series(gulp.parallel('pug', 'sass'), gulp.parallel('watch:pug', 'watch:sass')));

// Browser Sync
gulp.task('initServer', () => {
	return browserSync.init({
		ui: false,
		server: {
			baseDir: './dist',
			directory: true,
			routes: {
				'/images': 'src/images',
				'/js': 'src/js'
			}
		},
		reloadDelay: 1000,
		files: ['dist/**/*.html', 'dist/**/*.css', 'dist/**/*.js'],
		browser: 'chrome',
		ghostMode: false,
		open: 'external'
	})
})

gulp.task('serve', gulp.parallel('watch', 'initServer'))

gulp.task('default', gulp.series('serve'))
