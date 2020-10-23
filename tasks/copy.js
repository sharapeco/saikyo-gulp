// Gulp
const { src, dest, watch } = require('gulp')

function makeCopyTask (options) {
	const opt = Object.assign({}, {
		src: 'src',
		dest: 'dist',
	}, options)

	const copy = function () {
		let task = src([`${opt.src}/**/*`], { base: opt.src })

		if (Array.isArray(opt.dest)) {
			opt.dest.forEach(d => {
				task = task.pipe(dest(d))
			})
		} else {
			task = taks.pipe(dest(opt.dest))
		}
		return task
	}

	const watch_copy = function () {
		return watch([`${opt.src}/**/*`], copy)
	}

	return [copy, watch_copy]
}

module.exports = {
	makeCopyTask
}
