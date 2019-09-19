// Gulp
const {src, dest, watch, parallel} = require("gulp");
const changed = require("gulp-changed");
const rename = require("gulp-rename");

// Error handling
const {head} = require("./utils");
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');

// imagemin + pngquant, svgmin
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const optipng = require("imagemin-optipng");
const webp = require("imagemin-webp");

function makeImageTask(options) {
	const opt = Object.assign({}, {
		src: "src/img",
		dest: "dist/img",
		jpegq: 0.65,
		pngq: [0.5, 0.9],
		webpq: 0.8,
		ext: "png,jpg,gif,svg",
		speed: 1,
	}, options);

	const minify_image = function() {
		return src(`${opt.src}/**/*.{${opt.ext}}`, { base: opt.src })
		.pipe(changed(opt.dest))
		.pipe(imagemin([
			imagemin.gifsicle(),
			mozjpeg({
				quality: 100 * opt.jpegq,
			}),
			pngquant({
				quality: opt.pngq,
				speed: opt.speed,
			}),
			optipng({
				// optimizationLevel: 3,
				// bitDepthReduction: true,
				// colorTypeReduction: true,
				// paletteReduction: true,
			}),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: false },
				],
			}),
		]))
		.pipe(dest(opt.dest));
	};

	const make_webp = function() {
		return src(`${opt.src}/**/*.{jpg,png}`, { base: opt.src })
		.pipe(changed(opt.dest, {extension: ".webp"}))
		.pipe(imagemin([
			webp({
				quality: 100 * opt.webpq,
				metadata: ["icc"],
			})
		]))
		.pipe(rename({ extname: ".webp" }))
		.pipe(dest(opt.dest));
	};

	const tasks = [minify_image];
	if (/\b(?:jpg|png)\b/i.test(opt.ext)) {
		tasks.push(make_webp);
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
