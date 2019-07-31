// Gulp
const path = require("path");
const {src, dest, watch, parallel} = require("gulp");
const rename = require("gulp-rename");

// Making webfonts
const imagemin = require("gulp-imagemin");
const iconfont = require("gulp-iconfont");
const consolidate = require("gulp-consolidate");

function makeIconfontTask(options) {
	const opt = Object.assign({}, {
		src: "src/icons",
		dest: "dist",
		temp: "var/icons",
		fontName: "icon",
		fontHeight: 1024,
		prependUnicode: true,
		startCodepoint: 0xF001,
		css: Object.assign({}, {
			dest: "dist",
			template: "tasks/iconfont/template.{html,css,styl,less}",
			className: "icon",
			fontPath: "",
		}, options.css || {}),
	}, options);

	const build_iconfont = function() {
		return src(`${opt.src}/**/*.svg`, {base: opt.src})
		.pipe(imagemin([
			imagemin.svgo({
				plugins: [
					{removeViewBox: false},
				],
			}),
		]))
		.pipe(dest(opt.temp))
		.pipe(iconfont({
			fontName: opt.fontName,
			fontHeight: opt.fontHeight,
			formats: ["woff", "woff2"],
			prependUnicode: opt.prependUnicode,
			startUnicode: opt.startCodepoint,
		}))
		.on("glyphs", (glyphs, options) => {
			console.log(`glyphs = ${glyphs.length}`);
			// CSS
			src(opt.css.template)
			.pipe(consolidate("lodash", {
				fontName: opt.fontName,
				fontPath: opt.css.fontPath,
				className: opt.css.className,
				glyphs,
			}))
			.pipe(rename({ basename: opt.fontName }))
			.pipe(dest(opt.css.dest));
		})
		.pipe(dest(opt.dest));
	};

	const watch_iconfont = function() {
		return watch([`${opt.src}/**/*.svg`], build_iconfont);
	};

	return [build_iconfont, watch_iconfont];
}

module.exports = {
	makeIconfontTask,
};
