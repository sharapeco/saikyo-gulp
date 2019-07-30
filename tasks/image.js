// Gulp
const {src, dest, watch, parallel} = require("gulp");
const changed = require("gulp-changed");

// Error handling
const {head} = require("./utils");
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');

// imagemin + pngquant, svgmin
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const webp = require("gulp-webp");
const svgmin = require("gulp-svgmin");

function makeImageTask(options) {
	const opt = Object.assign({}, {
		src: "src/img",
		dest: "dist/img",
		quality: [0.5, 0.9],
		ext: "png,jpg,gif,svg",
		speed: 1,
	}, options);

	const minify_image = function() {
		const extWithoutSvg = opt.ext.replace(/^svg|,svg\b/ig, "");
		return src(`${opt.src}/**/*.{${extWithoutSvg}}`, {base: opt.src})
		.pipe(changed(opt.dest))
		.pipe(imagemin([
			pngquant({
				quality: opt.quality,
				speed: opt.speed,
			}),
		]))
		.pipe(dest(opt.dest));
	};

	const make_webp = function() {
		return src(`${opt.src}/**/*.jpg`, {base: opt.src})
		.pipe(changed(opt.dest, {extension: ".webp"}))
		.pipe(webp())
		.pipe(dest(opt.dest));
	};

	const make_svg = function() {
		return src(`${opt.src}/**/*.svg`, {base: opt.src})
		.pipe(changed(opt.dest))
		.pipe(svgmin())
		.pipe(dest(opt.dest));
	};

	const tasks = [minify_image];
	if (/\bjpg\b/i.test(opt.ext)) {
		tasks.push(make_webp);
	}
	if (/\bsvg\b/i.test(opt.ext)) {
		tasks.push(make_svg);
	}

	const build_image = parallel.apply(null, tasks);

	const watch_image = function() {
		return watch([`${opt.src}/**/*.{${opt.ext}}`], build_image);
	};

	return [build_image, watch_image];
}

module.exports = {
	makeImageTask,
};
