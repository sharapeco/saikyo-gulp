(function() {
	var notSupportedClass = "no-webp";
	var tests = [
		{
			c: "webp",
			s: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",
		},
		{
			c: "webp-alpha",
			s: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQ" +
			"UxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==",
		},
		{
			c: "webp-animation",
			s: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAA" +
			"AQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
		},
		{
			c: "webp-lossless",
			s: "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=",
		},
	];

	function testWebpAsync(callback) {
		var results = [];
		var nextTest = function() {
			if (tests.length === 0) {
				callback(results);
				return;
			}

			var test = tests.shift();
			var image = new Image;
			image.onerror = function() {
				nextTest();
			};
			image.onload = function() {
				if (image.width === 1) {
					results.push(test.c);
				}
				nextTest();
			};
			image.src = test.s;
		};
		nextTest();
	}

	testWebpAsync(function(supports) {
		var html = document.querySelector("html");
		if (!html) {
			console.warn("No html element.");
			return;
		}
		var cl = html.classList;
		if (supports.length === 0) {
			cl.add(notSupportedClass);
			return;
		}
		supports.forEach(function(c) {
			cl.add(c);
		});
	});
})();
