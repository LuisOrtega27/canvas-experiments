'use strict';

const canvasContainer = document.querySelector('#canvas-container1');
const lienzo = document.querySelector('#lienzo');
const colorInput = document.querySelector('#colorInput');
const lineWidthInput = document.querySelector('#lineWidthInput');

const clearLienzo = document.querySelector('#clearLienzo');

lienzo.width = canvasContainer.clientWidth;
lienzo.height = 340;

document
	.getElementById('descargarLienzo')
	.addEventListener('click', function (e) {
		let canvasUrl = lienzo.toDataURL('image/jpeg', 0.5);
		console.log(canvasUrl);
		const createEl = document.createElement('a');
		createEl.href = canvasUrl;
		createEl.download = 'download-this-canvas';
		createEl.click();
		createEl.remove();
	});

colorInput.addEventListener(
	'input',
	() => (strokeColor = colorInput.value)
);

lineWidthInput.addEventListener(
	'input',
	() => (lineWidth = lineWidthInput.value)
);

clearLienzo.addEventListener('click', () => {
	context.clearRect(0, 0, lienzo.clientWidth, lienzo.clientHeight);
});

let lineWidth = 1;

let strokeColor = '#000';

let coords = {
	x: 0,
	y: 0,
};

let context = lienzo.getContext('2d');

context.fillStyle = '#fff';
context.fillRect(0, 0, lienzo.clientWidth, lienzo.clientHeight);

/**-------------------------------------------------------------- */

const handleMouseDown = (e) => {
	lienzo.addEventListener('mousemove', handleMouseMove);
	context.beginPath();
};

const handleMouseMove = (e) => {
	coords = {
		x: e.clientX - e.target.getBoundingClientRect().x,
		y: e.clientY - e.target.getBoundingClientRect().y,
	};

	context.lineWidth = lineWidth;

	context.strokeStyle = strokeColor;

	context.lineTo(coords.x, coords.y);
	context.stroke();
};

const handleMouseEnter = () => {
	lienzo.addEventListener('mousedown', handleMouseDown);
};

lienzo.addEventListener('mouseenter', handleMouseEnter);
lienzo.addEventListener('mouseleave', () => {
	lienzo.removeEventListener('mousemove', handleMouseMove);
});
lienzo.addEventListener('mouseup', () => {
	context.closePath();

	lienzo.removeEventListener('mousemove', handleMouseMove);
});
