'use strict';

const canvas2 = document.querySelector('#canvas2');

const canvasCenter = {
	x: canvas2.clientWidth / 2,
	y: canvas2.clientHeight / 2,
};

const snakeInput = document.querySelector('#snakeInput');
const ctx = canvas2.getContext('2d');

// controls
const scoreDisplayer = document.querySelector('#scoreDisplayer');

const setAutoColor = document.querySelector('#setAutoColor');

const autoColorOp = document.querySelectorAll('.autoColor');

const snakeColorInput = document.querySelector('#snakeColorInput');

const snakeSpeedInput = document.querySelector('#snakeSpeedInput');
const speedLabel = document.querySelector('#speedLabel');

// establish a central spawn for the snake
const findCanvasCenter = () => {
	if (canvasCenter.x % 10 != 0) {
		for (let i = 0; i < 10; i++) {
			canvasCenter.x++;
			if (canvasCenter.x % 10 === 0) break;
		}
	}

	if (canvasCenter.y % 10 != 0) {
		for (let i = 0; i < 10; i++) {
			canvasCenter.y++;
			if (canvasCenter.y % 10 === 0) break;
		}
	}
};
findCanvasCenter();

let gameConfig = {
	gameLoop: null,
	gameSpeed: 50,
	gridDimentions: 10,
	autoColorOp: null,
	snakeColor: '#000',
	snakeVector: {
		x: canvasCenter.x,
		y: canvasCenter.y,
	},
	snakeKeys: {
		u: 'ArrowUp',
		r: 'ArrowRight',
		d: 'ArrowDown',
		l: 'ArrowLeft',
	},
	currentSnakeKey: '',
	snakeBodyPositions: [],
	foodSpawnArea: null,
	foodColor: '#28e',
	gameScore: 2,
};

snakeSpeedInput.addEventListener('input', () => {
	speedLabel.textContent = snakeSpeedInput.value;
	gameConfig.gameSpeed = snakeSpeedInput.value;

	pauseGame();

	startGame(gameConfig.currentSnakeKey);
});

snakeColorInput.addEventListener('change', () => {
	gameConfig.snakeColor = snakeColorInput.value;
});

autoColorOp.forEach((input) => {
	input.addEventListener('input', () => {
		gameConfig.autoColorOp = input.value;
	});
});

// Esto es solo para que no se haga scroll con las flechas.
canvas2.addEventListener('click', () => {
	snakeInput.focus();
});

const emergencyBox = (x, y) => {
	ctx.fillStyle = '#e22';
	ctx.fillRect(x, y, 10, 10);
};

/******************** LEVEL UP //////////////////////// */

const verifyLevelUp = () => {
	if (
		gameConfig.snakeVector.x === gameConfig.foodSpawnArea.x &&
		gameConfig.snakeVector.y === gameConfig.foodSpawnArea.y
	) {
		gameConfig.gameScore++;

		scoreDisplayer.textContent = gameConfig.gameScore - 2;

		gameConfig.foodSpawnArea = null;
		createFood();
	}
};

/******************** FOOD //////////////////////// */

const createFoodSpawnArea = () => {
	let randomPosX = Math.floor(Math.random() * canvas2.clientWidth);
	let randomPosY = Math.floor(Math.random() * canvas2.clientHeight);

	// X
	if (randomPosX % 10 != 0) {
		for (let i = 0; i < 10; i++) {
			randomPosX++;
			if (randomPosX % 10 === 0) break;
		}
	}

	// Y
	if (randomPosY % 10 != 0) {
		for (let i = 0; i < 10; i++) {
			randomPosY++;
			if (randomPosY % 10 === 0) break;
		}
	}

	if (randomPosX > canvas2.clientWidth) {
		randomPosX -= 10;
	}

	if (randomPosY >= canvas2.clientHeight) {
		randomPosY -= 10;
	}

	gameConfig.snakeBodyPositions.forEach((pos) => {
		if (pos.x === randomPosX && pos.y === randomPosY) {
			return createFoodSpawnArea();
		}
	});

	if (gameConfig.foodSpawnArea === null)
		gameConfig.foodSpawnArea = { x: randomPosX, y: randomPosY };
};

const createFood = () => {
	createFoodSpawnArea();

	ctx.fillStyle = gameConfig.foodColor;

	ctx.fillRect(
		gameConfig.foodSpawnArea.x,
		gameConfig.foodSpawnArea.y,
		gameConfig.gridDimentions,
		gameConfig.gridDimentions
	);
};

/******************** SNAKE //////////////////////// */

// border collisions
const detectBorderCollision = () => {
	if (
		gameConfig.snakeVector.x < 0 ||
		gameConfig.snakeVector.x > canvas2.clientWidth ||
		gameConfig.snakeVector.y < 0 ||
		gameConfig.snakeVector.y > canvas2.clientHeight - 10
	) {
		clearInterval(gameConfig.gameLoop);
	}
};

// snake collisions
const detectSnakeCollision = () => {
	let snakeBody = gameConfig.snakeBodyPositions.slice(0, -1);

	snakeBody.forEach((pos) => {
		if (
			pos.x === gameConfig.snakeVector.x &&
			pos.y === gameConfig.snakeVector.y
		) {
			clearInterval(gameConfig.gameLoop);
		}
	});
};

const clearLastSnakePiece = () => {
	// make shure only te last piece is deleted
	if (gameConfig.snakeBodyPositions.length > gameConfig.gameScore) {
		// "delete" actualy just patch the last piece of the snake in the canvas
		ctx.clearRect(
			gameConfig.snakeBodyPositions[0].x,
			gameConfig.snakeBodyPositions[0].y,
			gameConfig.gridDimentions,
			gameConfig.gridDimentions
		);

		// delete the last coordinated piece of the snake
		gameConfig.snakeBodyPositions.shift();
	}
};

const changeSnakeVector = () => {
	if (gameConfig.currentSnakeKey === 'u') {
		gameConfig.snakeVector.y -= 10;
	}
	if (gameConfig.currentSnakeKey === 'r') {
		gameConfig.snakeVector.x += 10;
	}
	if (gameConfig.currentSnakeKey === 'd') {
		gameConfig.snakeVector.y += 10;
	}
	if (gameConfig.currentSnakeKey === 'l') {
		gameConfig.snakeVector.x -= 10;
	}
};

const changeSnakeColor = () => {
	let rand1 = Math.floor(Math.random() * 255);
	let rand2 = Math.floor(Math.random() * 255);
	let rand3 = Math.floor(Math.random() * 255);
	gameConfig.snakeColor = `rgb(${rand1}, ${rand2}, ${rand3})`;
};

const moveSnake = () => {
	setAutoColor.checked &&
		// random color for the snake every box
		gameConfig.autoColorOp === 'r' &&
		changeSnakeColor();

	// change the direction of the snake.
	changeSnakeVector();

	// well, just that, this detects the collision with the border
	detectBorderCollision();

	// Save each coordinated position of the snake's body pieces
	gameConfig.snakeBodyPositions.push({
		x: gameConfig.snakeVector.x,
		y: gameConfig.snakeVector.y,
	});

	// Draw Snake color
	ctx.fillStyle = gameConfig.snakeColor;
	ctx.fillRect(
		gameConfig.snakeVector.x,
		gameConfig.snakeVector.y,
		gameConfig.gridDimentions,
		gameConfig.gridDimentions
	);

	// Draw Snake lines
	ctx.strokeStyle = '#fff';
	ctx.strokeRect(
		gameConfig.snakeVector.x,
		gameConfig.snakeVector.y,
		gameConfig.gridDimentions,
		gameConfig.gridDimentions
	);

	clearLastSnakePiece();

	detectSnakeCollision();

	createFoodSpawnArea();
};

/******************** START, PAUSE AND RESTART //////////////////////// */
const restartGame = () => {
	ctx.fillStyle = '#fff';
	ctx.clearRect(0, 0, canvas2.clientWidth, canvas2.clientHeight);

	ctx.fillStyle = '#28e';
	ctx.fillRect(
		gameConfig.foodSpawnArea.x,
		gameConfig.foodSpawnArea.y,
		gameConfig.gridDimentions,
		gameConfig.gridDimentions
	);

	gameConfig.snakeBodyPositions = gameConfig.snakeBodyPositions.slice(
		-2,
		-1
	);

	gameConfig.gameScore = 2;
	scoreDisplayer.textContent = gameConfig.gameScore - 2;
	gameConfig.snakeVector.x = canvasCenter.x;
	gameConfig.snakeVector.y = canvasCenter.y;

	pauseGame();
	startGame(gameConfig.currentSnakeKey);
};

const pauseGame = () => {
	clearInterval(gameConfig.gameLoop);
	gameConfig.gameLoop = null;
};

const startGame = (code) => {
	// save the last vector
	gameConfig.currentSnakeKey = code;

	// create the first snake food
	if (gameConfig.foodSpawnArea === null) createFood();

	// make shure the interval only starts once
	if (gameConfig.gameLoop === null)
		gameConfig.gameLoop = setInterval(() => {
			moveSnake();
			// verify if snake and food position match
			verifyLevelUp();
		}, gameConfig.gameSpeed);
};

/******************** DETECT KEY INPUT //////////////////////// */

window.addEventListener('keydown', (eve) => {
	/*
    ArrowUp
    ArrowRight
    ArrowDown
    ArrowLeft
    */

	if (eve.code === 'Escape') return pauseGame();

	if (eve.code === 'KeyR') return restartGame();

	// Confirmar la tecla correcta
	for (let code in gameConfig.snakeKeys) {
		if (gameConfig.snakeKeys[code] === eve.code) {
			setAutoColor.checked &&
				// random color for the snake every time it changes directions
				gameConfig.autoColorOp === 'm' &&
				changeSnakeColor();

			startGame(code);

			// console.log(gameConfig.snakeKeys[code] === eve.code);

			return;
		}
	}
});
