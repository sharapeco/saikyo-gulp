// Gulp utilities
const {src, dest, watch} = require("gulp");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const path = require("path");

// Error handling
const {head} = require("./utils");
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
	}, options);

	const sourceListFile = path.resolve(opt.src, opt.srcList);
	const sourceList = getSourceList(sourceListFile);

	const buildTask = function() {
		return src(sourceList.map(file => path.resolve(opt.src, file)), {
			base: opt.src,
		})
		.pipe(plumber({
			errorHandler: error => notifier.notify({
				title: "Concat & uglify しっぱいしたブイ",
				message: error.toString().PIPE(head(3)),
			}, () => console.log(error.toString()))
		}))
		.pipe(sourcemaps.init())
		.pipe(concat(`${opt.outputName}.js`))
		.pipe(uglify())
		.pipe(rename(`${opt.outputName}.min.js`))
		.pipe(sourcemaps.write("./"))
		.pipe(dest(opt.dest));
	}

	const watchTask = function() {
		return watch([sourceListFile, `${opt.src}/**/*.js`], buildTask);
	}

	return [buildTask, watchTask];
}

function getSourceList(sourceListFile) {
	const fs = require("fs");
	const content = fs.readFileSync(sourceListFile, {encoding: "UTF-8"});
	const lines = content.replace(/\r\n?/g, "\n").split("\n");
	return lines
		.map(line => line.trim())
		.filter(line => line !== "");
}

module.exports = {
	makeJsTask,
};
