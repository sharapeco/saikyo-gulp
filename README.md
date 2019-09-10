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
	- Make WebP from JPEG
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

## Setting of gulpfile.js

See gulpfile.js of this project.

Use expose method of tasks/utils to expose Gulp tasks.

```
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

## Troubleshooting

### (Less) Inline JavaScript is not enabled

Use javascriptEnabled option.

```
const {makeCssTask} = require("./tasks/css");

const lessOptions = {
	javascriptEnabled: true,
};

const [pcss, watch_pcss] = makeCssTask({
	src: "src/public",
	dest: `dist/css`,
	outputName: "public",
	lang: "less",
	options: lessOptions,
});
```
