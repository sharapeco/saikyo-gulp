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

Copy package.json, gulpfile.js and tasks directory to your project.

And run `npm install` or `yarn install`.

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
});
```

#### Options

| Name | Description |
| ---- | ----------- |
| src  | Source files directory. Compiling `${src}/all.(styl|less|scss)` |
| dest | Output directory |
| outputName | Output file name |
| lang | CSS preprocessor name. "styl", "less", "scss" can possible. "styl" is default. |
| minify | True is default |
| header | Add header to output. eg. `/**! Project Name v1.2.3 (C) Foobar Inc. */` |

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
	// minify: true, // default
	// header: '/**! Project Name v1.2.3 (C) Foobar Inc. */',
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
	// header: '/**! Project Name v1.2.3 (C) Foobar Inc. */',
	// babelPresetOptions: { targets: babelDefaultTargets } (default)
	// browserifyOptions: {} (default)
});
```
