# Saikyo-gulp

The strongest gulpfile.js I thought for small websites or applications.

Saikyo-gulp can:

- **Compile CSS**:
	- Preprocessors: Stylus, Less, Sass, SCSS
	- Minify
- **Compile JavaScript**:
	- Concat and minify Vanilla JS files
	- Browserify
	- Babel
- **Minify images**:
	- Minify JPEG, PNG, GIF, SVG
	- Lossy compression of PNG 24/32
	- Make WebP from JPEG, PNG
- **Make icon fonts**:
	- Input: SVGs
	- Output: woff, woff2, CSS, CSS preprocessor templates

## Install

Copy package.json, package.json and tasks directory to your project.

And run

```
npm install
```

Or

```
yarn install
```

## Build Settings

See gulpfile.js of this project.

Use expose method of tasks/utils to expose Gulp tasks.

```JavaScript
const {expose} = require("./tasks/utils");
const [taskA, watch_taskA] = ...;
const [taskB, watch_taskB] = ...;
const taskC = ...;

module.exports = expose({
	taskA,
	taskB,
	taskC,
	dev: series(parallel(taskA, taskB, taskC), parallel(watch_taskA, watch_taskB)),
});
```

## Build and Watch

Just run gulp command with task name.

```
gulp taskName
```

## Examples

### Use CSS Preprocessors

```JavaScript
const {makeCssTask} = require("./tasks/css");

// Stylus
const [stylus, watch_stylus] = makeCssTask({
	src: "src/stylus",
	dest: "dest",
	outputName: "styles",
	lang: "sytl",
});

// Less
const [less, watch_less] = makeCssTask({
	src: "src/less",
	dest: "dest",
	outputName: "styles",
	lang: "less",
});

// SCSS
const [scss, watch_scss] = makeCssTask({
	src: "src/scss",
	dest: "dest",
	outputName: "public",
	lang: "scss",
});
```

Turn off minifying:

```JavaScript
const {makeCssTask} = require("./tasks/css");

const [stylus, watch_stylus] = makeCssTask({
	src: "src/stylus",
	dest: "dest",
	outputName: "styles",
	lang: "sytl",
	minify: false,
});
```

If you use JavaScript-style escaping in Less, use javascriptEnabled option:

```JavaScript
const lessOptions = {
	javascriptEnabled: true,
};

const [less, watch_less] = makeCssTask({
	src: "src/less",
	dest: "dest",
	outputName: "styles",
	lang: "less",
	options: lessOptions,
});
```

### Simply Concat and Minify JavaScript

Make source list file **package.txt** in **src** directory:

```
foo.js
bar.js
foobar.js
```

The file contains *.js relative path names in the directory;

```JavaScript
const mkJsTask = require("./tasks/js");

const [js, watch_js] = makeJsTask({
	src: "src/js",
	dest: "dest",
	outputName: "small-script",
	// minify: true (default)
});
```

### Concat JavaScript with Browserify

Set endpoint to **src** option:

```JavaScript
const makeBrowserifyTask = require("./tasks/browserify");

const [js, watch_js] = makeBrowserifyTask({
	src: "src/js/endpoint.js",
	dest: "dest",
	outputName: "middle-script",
	// minify: true (default)
	// babelPresetOptions: { targets: babelDefaultTargets } (default)
	// browserifyOptions: {} (default)
});
```
