// Gulp
const {src, dest, watch, parallel} = require("gulp");
const changed = require("gulp-changed");

// Error handling
const {head} = require("./utils");
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');

// imagemin + pngquant
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const webp = require("gulp-webp");

function makeImageTask(options) {
	const opt = Object.assign({}, {
		src: "src/img",
		dest: "dist/img",
		quality: [0.5, 0.9],
		ext: "png,jpg,gif,svg",
		speed: 1,
	}, options);

	const normalBuildTask = function() {
		return src(`${opt.src}/**/*.{${opt.ext}}`, {base: opt.src})
		.pipe(changed(opt.dest))
		.pipe(imagemin([
			pngquant({
				quality: opt.quality,
				speed: opt.speed,
			}),
		]))
		.pipe(dest(opt.dest));
	};

	const webpBuildTask = function() {
		return src(`${opt.src}/**/*.jpg`, {base: opt.src})
		.pipe(changed(opt.dest, {extension: ".webp"}))
		.pipe(webp())
		.pipe(dest(opt.dest));
	};

	const buildTask = /\bjpg\b/.test(opt.ext) ? parallel(normalBuildTask, webpBuildTask) : normalBuildTask;

	const watchTask = function() {
		return watch([`${opt.src}/**/*.{${opt.ext}}`], buildTask);
	};

	return [buildTask, watchTask];
}

module.exports = {
	makeImageTask,
};
