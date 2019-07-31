// Import
const {watch, series, parallel} = require("gulp");
const {expose} = require("./tasks/utils");
const {makeCssTask} = require("./tasks/css");
const {makeJsTask} = require("./tasks/js");
const {makeImageTask} = require("./tasks/image");

// Destination
const destDir = "dist";

// CSS
const [pcss, watch_pcss] = makeCssTask({
	src: "src/css-public",
	dest: `${destDir}/css`,
	outputName: "public",
	// lang: styl (default), scss, less
	// minify: true (default), false
});

// JavaScript
const [pjs, watch_pjs] = makeJsTask({
	src: "src/js-public",
	dest: `${destDir}/js`,
	outputName: "public",
	// minify: true (default), false
	// babelPresetOptions: {...}
});
const watch_js = function() {
	return watch([
		"src/js-public/package.txt",
		"src/js-public/**/*.js",
		"src/js-lib/**/*.js",
	], parallel(pjs, webpjs));
};

// WebP 対応かどうか調べる JS
const [webpjs, watch_webpjs] = makeJsTask({
	src: "src/js-lib/webp",
	dest: `${destDir}/js`,
	outputName: "webp",
});

// Images
const [pimg, watch_pimg] = makeImageTask({
	src: "src/img",
	dest: `${destDir}/img`,
	// jpegq: 0 to 1
	// pngq: [min, max] (0 to 1)
	// ext: "png,jpg,gif,svg"
	// speed: 1
});

// Icon font (for compatibility)
const [icon, watch_icon] = makeIconfontTask({
	src: "src/icons",
	dest: `${destDir}/fonts`,
	fontName: "icon",
	css: {
		dest: `${destDir}/css`,
		className: "icon",
		fontPath: "../fonts",
	},
});

// Expose
module.exports = expose({
	pimg,
	pcss,
	pjs,
	webpjs,
	icon,
	dev: series(parallel(pcss, pimg, pjs, webpjs), parallel(watch_pcss, watch_pimg, watch_js)),
});
