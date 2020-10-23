// Gulp
const { src, dest, watch } = require('gulp')
const rename = require('gulp-rename')

// Error handling
const { head, clean } = require('./utils')
const plumber = require('gulp-plumber')
const notifier = require('node-notifier')

// Pug
const pug = require('gulp-pug')

function makePugTask (options) {
	const opt = Object.assign({}, {
		src: ['src/**/*.pug', '!src/**/_*.pug'],
		dest: 'dist',
		name: null,
		ext: '.html',
		options: {}
	}, options)

	const build_pug = function () {
		let task = src(opt.src)
			.pipe(plumber({
				errorHandler: error => notifier.notify({
					title: 'しっぱいしたワン',
					message: error.toString().PIPE(clean()).PIPE(head(3))
				}, () => console.log(error.toString()))
			}))
			.pipe(pug(opt.options))
			.pipe(rename({ extname: opt.ext }))

		if (opt.name != null) {
			task = task.pipe(rename({ basename: opt.name }))
		}

		return task.pipe(dest(opt.dest))
	}

	const watch_pug = function () {
		return watch(opt.src, build_pug)
	}

	return [build_pug, watch_pug]
}

module.exports = {
	makePugTask
}
