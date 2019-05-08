// Import
const {watch, series, parallel} = require("gulp");
const {expose} = require("./tasks/utils");
const {makeCssTask} = require("./tasks/css");
const {makeJsTask} = require("./tasks/js");
const {makeImageTask} = require("./tasks/image");

// Define tasks
const appVersion = "201904";

// 公開ページ CSS
const [pcss, watch_pcss] = makeCssTask({
	src: "src/css-public",
	dest: `dist/assets-${appVersion}/css`,
	outputName: "public",
});

// 追加 CSS (ほかのプリプロセッサも使える)
const [ocss, watch_ocss] = makeCssTask({
	lang: "scss",
	src: "src/css-optional",
	dest: `dist/assets-${appVersion}/css`,
	outputName: "optional",
});

// 公開ページ JS
const [pjs, watch_pjs] = makeJsTask({
	src: "src/js-public",
	dest: `dist/assets-${appVersion}/js`,
	outputName: "public",
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
	dest: `dist/assets-${appVersion}/js`,
	outputName: "webp",
});

// 公開ページ画像
const [pimg, watch_pimg] = makeImageTask({
	src: "src/img",
	dest: `dist/assets-${appVersion}/img`,
});

// Expose
module.exports = expose({
	pimg,
	pcss,
	pjs,
	webpjs,
	dev: series(parallel(pcss, pimg, pjs, webpjs), parallel(watch_pcss, watch_pimg, watch_js)),
});
