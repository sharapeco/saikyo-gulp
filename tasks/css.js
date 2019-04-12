// Gulp
const {src, dest, watch} = require("gulp");
const rename = require("gulp-rename");

// Error handling
const {head} = require("./utils");
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');

// Stylus CSS
const stylus = require("gulp-stylus");
const groupCSSMediaQueries = require("gulp-group-css-media-queries");
const cssmin = require("gulp-cssmin");

function makeCssTask(options) {
	const opt = Object.assign({}, {
		src: "src/css/all.styl",
		dest: "dist",
		outputName: "public",
	}, options);

	const buildTask = function() {
		return src(`${opt.src}/all.styl`, {base: opt.src})
		.pipe(plumber({
			errorHandler: error => notifier.notify({
				title: "Stylus しっぱいしたっス",
				message: error.toString().PIPE(head(3)),
			}, () => console.log(error.toString()))
		}))
		.pipe(stylus())
		.pipe(groupCSSMediaQueries())
		.pipe(cssmin())
		.pipe(rename({basename: opt.outputName}))
		.pipe(dest(opt.dest));
	};

	const watchTask = function() {
		return watch([`${opt.src}/**/*.styl`], buildTask);
	}

	return [buildTask, watchTask];
}

module.exports = {
	makeCssTask,
};
