'use strict';

const containers = document.querySelectorAll('.canvas-container');

containers.forEach((item) => {
	console.log();

	let canvas = item.querySelector('canvas');

	canvas.width = item.clientWidth;
	canvas.height = 340;
});
