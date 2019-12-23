// Gulp utilities
const {src, dest, watch} = require("gulp");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const header = require("gulp-header");
const browserify = require("browserify");
const babelify = require("babelify");
const through = require("through2");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

// Error handling
const {head, clean} = require("./utils");
const notifier = require("node-notifier");

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
		browserifyOptions: {},
	}, options);

	const build_jsb = function() {
		let task = browserify(opt.src, Object.assign({}, {debug: true}, opt.browserifyOptions))
		.transform(babelify, {
			presets: [["@babel/preset-env", opt.babelPresetOptions]],
			sourceMaps: true,
		})
		.bundle()
		.on("error", function(err) {
			console.log(err.message);
			console.log(err.stack);

			notifier.notify({
				title: "Browserify しっぱい!!",
				message: err.toString().PIPE(clean()).PIPE(head(3)),
			});

			this.emit("end");
		})
		.pipe(source("bundle.js"))
		.pipe(buffer())
		.pipe(rename(`${opt.outputName}.js`))
		.pipe(sourcemaps.init({loadMaps: true}));

		if (opt.header) {
			task = task.pipe(header(opt.header + "\n"));
		}

		if (opt.minify) {
			task = task
			.pipe(uglify({
				output: {
					comments: /^[*]?!/
				}
			}))
			.pipe(rename(`${opt.outputName}.min.js`));
		}

		return task
		.pipe(sourcemaps.write("./"))
		.pipe(dest(opt.dest));
	}

	const srcDir = (() => {
		const srcPath = opt.src.split("/");
		srcPath.pop();
		return srcPath.join("/");
	})();
	const watch_jsb = function() {
		return watch([`${srcDir}/**/*.js`], build_jsb);
	}

	return [build_jsb, watch_jsb];
}

module.exports = {
	makeBrowserifyTask,
};
