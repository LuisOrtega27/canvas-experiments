'use strict';

const lienzo = document.querySelector('#lienzo');

let coords = {
	x: 0,
	y: 0,
};

let context = lienzo.getContext('2d');
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
