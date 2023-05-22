{
	const canvas1Container = document.querySelector('.container1');

	const canvas1 = document.querySelector('#canvas1');

	canvas1.width = canvas1Container.clientWidth;
	canvas1.height = 350;

	let context = canvas1.getContext('2d');

	/**------------------------Box animation-------------------------- */

	let boXDimentions = {
		w: 18,
		h: 18,
	};

	let limits = {
		top: 0,
		bottom: canvas1.clientHeight - boXDimentions.h,
		rigth: canvas1.clientWidth - boXDimentions.w,
		left: 0,
	};

	let xVector = 0;
	let yVector = 0;

	let horizontalContact = false;
	let verticalContact = false;

	const changeBoxColor = () => {
		let rand0 = Math.floor(Math.random() * 255);
		let rand1 = Math.floor(Math.random() * 255);
		let rand2 = Math.floor(Math.random() * 255);

		context.fillStyle = `rgba(${rand0}, ${rand1}, ${rand2}, .1)`;
	};

	const startDisplay = () => {
		context.fillRect(
			xVector,
			yVector,
			boXDimentions.w,
			boXDimentions.h
		);

		// Horizontal bouncing -------------------
		if (xVector >= limits.rigth) {
			horizontalContact = true;
			changeBoxColor();
		}
		if (xVector <= limits.left) {
			horizontalContact = false;
			changeBoxColor();
		}
		if (horizontalContact) xVector -= 10;
		else xVector += 10;
		// ---------------------------------------

		// Vertical bouncing ---------------------
		if (yVector >= limits.bottom) {
			verticalContact = true;
			changeBoxColor();
		}
		if (yVector <= limits.top) {
			verticalContact = false;
			changeBoxColor();
		}

		if (verticalContact) yVector -= 10;
		else yVector += 10;
	};

	let interval = null;

	const initBtn = document.querySelector(`#initBtn`);

	const init = () => {
		interval = setInterval(startDisplay, 1);

		initBtn.value = `stop`;

		initBtn.addEventListener(`click`, end);
		initBtn.removeEventListener(`click`, init);
		context.fillStyle = '#28e3';
	};

	const end = () => {
		initBtn.value = `start`;
		clearInterval(interval);
		initBtn.addEventListener(`click`, init);
		initBtn.removeEventListener(`click`, end);
	};

	initBtn.addEventListener(`click`, init);
}
