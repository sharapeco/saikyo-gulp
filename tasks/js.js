// Gulp utilities
const {src, dest, watch} = require("gulp");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const path = require("path");

// Error handling
const {head, clean} = require("./utils");
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');

// JavaScript
const uglify = require("gulp-uglify-es").default;

function makeJsTask(options) {
	const opt = Object.assign({}, {
		src: "src/js",
		dest: "dist",
		outputName: "public",
		srcList: "package.txt",
		minify: true,
		babelPresetOptions: {
			targets: {
				edge: "17",
				firefox: "60",
				chrome: "67",
				safari: "11.1",
				ie: "11",
			},
		},
	}, options);

	const sourceListFile = path.resolve(opt.src, opt.srcList);

	const build_js = function() {
		const sourceList = getSourceList(sourceListFile).map(file => path.resolve(opt.src, file));
		let task = src(sourceList, {
			base: opt.src,
		})
		.pipe(plumber({
			errorHandler: error => notifier.notify({
				title: "Concat & uglify しっぱいしたブイ",
				message: error.toString().PIPE(clean()).PIPE(head(3)),
			}, () => console.log(error.toString()))
		}))
		.pipe(sourcemaps.init())
		.pipe(concat(`${opt.outputName}.js`))
		.pipe(babel({
			presets: [["@babel/preset-env", opt.babelPresetOptions]],
		}))

		if (opt.minify) {
			task = task
			.pipe(uglify())
			.pipe(rename(`${opt.outputName}.min.js`));
		}

		return task
		.pipe(sourcemaps.write("./"))
		.pipe(dest(opt.dest));
	}

	const watch_js = function() {
		return watch([sourceListFile, `${opt.src}/**/*.js`], build_js);
	}

	return [build_js, watch_js];
}

function getSourceList(sourceListFile) {
	const fs = require("fs");
	const content = fs.readFileSync(sourceListFile, {encoding: "UTF-8"});
	const lines = content.replace(/\r\n?/g, "\n").split("\n");
	return lines
		.map(line => line.trim())
		.filter(line => line.charAt(0) !== "#" && line !== "");
}

module.exports = {
	makeJsTask,
};
