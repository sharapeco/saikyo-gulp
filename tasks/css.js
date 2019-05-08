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

const processors = {
	stylus: {
		package: "gulp-stylus",
		ext: "styl",
	},
	less: {
		package: "gulp-less",
		ext: "less",
	},
	sass: {
		package: "gulp-sass",
		ext: "sass",
	},
	scss: {
		package: "gulp-sass",
		ext: "scss",
	},
};

function makeCssTask(options) {
	const opt = Object.assign({}, {
		lang: "stylus",
		src: "src/css",
		dest: "dist",
		outputName: "public",
	}, options);

	if (!processors[opt.lang]) {
		throw new Error("Invalid CSS preprocessor name");
	}
	const processorDesc = processors[opt.lang];
	const processor = require(processorDesc.package);

	const build_css = function() {
		return src(`${opt.src}/all.${processorDesc.ext}`, {base: opt.src})
		.pipe(plumber({
			errorHandler: error => notifier.notify({
				title: `${opt.lang} Error`,
				message: error.toString().PIPE(head(3)),
			}, () => console.log(error.toString()))
		}))
		.pipe(processor())
		.pipe(groupCSSMediaQueries())
		.pipe(cssmin())
		.pipe(rename({basename: opt.outputName}))
		.pipe(dest(opt.dest));
	};

	const watch_css = function() {
		return watch([`${opt.src}/**/*.${processorDesc.ext}`], build_css);
	}

	return [build_css, watch_css];
}

module.exports = {
	makeCssTask,
};
