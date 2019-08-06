// Gulp utilities
const {src, dest, watch} = require("gulp");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const path = require("path");
const browserify = require("browserify");
const babelify = require("babelify");
const through = require("through2");

// Error handling
const {head, clean} = require("./utils");
const notifier = require('node-notifier');

// JavaScript
const uglify = require("gulp-uglify-es").default;
const babelDefaultTargets = require("./babel-default-targets");

function makeBrowserifyTask(options) {
	const opt = Object.assign({}, {
		src: "src/js/endpoint.js",
		dest: "dist",
		outputName: "app",
		minify: true,
		babelPresetOptions: {
			targets: babelDefaultTargets,
		},
	}, options);

	const srcDir = path.resolve(opt.src, '..');

	const build_jsb = function() {
		let task = src(opt.src, {base: srcDir})
		.pipe(sourcemaps.init())
		.pipe(rename(`${opt.outputName}.js`))
		.pipe(through.obj((file, encode, callback) => {
			browserify(file.path)
			.transform(babelify, {
				presets: [["@babel/preset-env", opt.babelPresetOptions]],
			})
			.bundle((err, res) => {
				if (err) {
					console.log(err.message);
					console.log(err.stack);

					notifier.notify({
						title: "Browserify しっぱい!!",
						message: error.toString().PIPE(clean()).PIPE(head(3)),
					});
					return;
				}
				file.contents = res;
				callback(null, file);
			});
		}));

		if (opt.minify) {
			task = task
			.pipe(uglify())
			.pipe(rename(`${opt.outputName}.min.js`));
		}

		return task
		.pipe(sourcemaps.write("./"))
		.pipe(dest(opt.dest));
	}

	const watch_jsb = function() {
		return watch([`${srcDir}/**/*.js`], build_jsb);
	}

	return [build_jsb, watch_jsb];
}

module.exports = {
	makeBrowserifyTask,
};
