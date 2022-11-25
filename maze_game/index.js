const canvas = {
	width: window.innerWidth,
	height: window.innerHeight
};
const cells = {
	horizontal: 40,
	vertical: 30
};
const unitLengthX = canvas.width / cells.horizontal;
const unitLengthY = canvas.height / cells.vertical;
const wallWidth = 2, borderWidth = 5;

const {Engine, Render, Runner, World, Bodies, Body, Events, Composite} = Matter;
const engine = Engine.create();
const {world} = engine;
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		wireframes: false,
		width: canvas.width,
		height: canvas.height
	}
});

Render.run(render);
Runner.run(Runner.create(), engine);

// borders of the canvas
const borders = [
	Bodies.rectangle(canvas.width / 2, 0, canvas.width, borderWidth, {isStatic: true}),				// Top wall
	Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width, borderWidth, {isStatic: true}),	// Bottom wall
	Bodies.rectangle(0, canvas.height / 2, borderWidth, canvas.height, {isStatic: true}),			// Left Wall
	Bodies.rectangle(canvas.width, canvas.height / 2, borderWidth, canvas.height, {isStatic: true})	// Right Wall
];
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
var ball, goal;	// Player Ball and Final destination of the ball
var grid, horizontals, verticals;

generateMaze();

function generateMaze(){
	ball = Bodies.circle(
		unitLengthX / 2,
		unitLengthY / 2,
		ballRadius,
		{
			label: 'ball',
			render: {
				fillStyle: 'blue'
			}
		}
	);
	goal = Bodies.rectangle(
		canvas.width - unitLengthX / 2,
		canvas.height - unitLengthY / 2,
		unitLengthX * .7,
		unitLengthY * .7,
		{
			label: 'goal',
			render: {
				fillStyle: 'green'
			}
		}
	);
	World.add(world, ball);
	World.add(world, goal);
	World.add(world, borders);

	engine.world.gravity.y = 0;

	grid = Array(cells.vertical)
	.fill(null)
	.map(() => Array(cells.horizontal).fill(false));	// false means its not visited

	/*
		verticals represent vertical borders between grid cells while
		horizontals represent horizontal borders
		true represents openning between the grid cells
		false represents blocked wall
	*/
	verticals = Array(cells.vertical)
		.fill(null)
		.map(() => Array(cells.horizontal - 1).fill(false));

	horizontals = Array(cells.vertical - 1)
		.fill(null)
		.map(() => Array(cells.horizontal).fill(false));

	const startingCell = {
		row: Math.floor(Math.random() * cells.vertical),
		column: Math.floor(Math.random() * cells.horizontal)
	};
	world.bodies.forEach(body => {
		if(body.label === 'wall'){
			Body.setStatic(body, false);
		}
	})

	stepThroughCell(startingCell.row, startingCell.column);

	horizontals.forEach((row, rowIndex) => {
		row.forEach((open, columnIndex) => {
			if(open){
				return;
			}

			const wall = Bodies.rectangle(
				columnIndex * unitLengthX + unitLengthX / 2,
				rowIndex * unitLengthY + unitLengthY,
				unitLengthX,
				wallWidth,
				{
					label: 'wall',
					isStatic: true,
					render: {
						fillStyle: 'red'
					}
				}
			);
			World.add(world, wall);
		});
	});
	verticals.forEach((row, rowIndex) => {
		row.forEach((open, columnIndex) => {
			if(open){
				return;
			}

			const wall = Bodies.rectangle(
				columnIndex * unitLengthX + unitLengthX,
				rowIndex * unitLengthY + unitLengthY / 2,
				wallWidth,
				unitLengthY,
				{
					label: 'wall',
					isStatic: true,
					render: {
						fillStyle: 'red'
					}
				}
			);
			World.add(world, wall);
		});
	});
}


function shuffle(arr){			// Randomize elements inside an array
	let counter = arr.length;

	while(counter > 0){
		const index = Math.floor(Math.random() * counter);
		counter--;
		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}
	return arr;
}
function stepThroughCell(row, column){
	// if already visited, then return
	if(grid[row][column]){
		return;
	}

	// Mark this cell as being visited
	grid[row][column] = true;

	// Assemble randomly-ordered list of neighbors
	const neighbors = shuffle([
		[row - 1, column, 'up'],
		[row, column + 1, 'right'],
		[row + 1, column, 'down'],
		[row, column - 1, 'left']
	]);

	// For each neighbor
	for(let neighbor of neighbors){
		const [nextRow, nextColumn, direction] = neighbor;

		if(nextRow < 0 || nextRow >= cells.vertical || nextColumn < 0 || nextColumn >= cells.horizontal){	// if neighbor is out of bounds
			continue;
		}
		
		if(grid[nextRow][nextColumn]){	// if neighbor is already visited, continue to next neighbor
			continue;
		}

		// Remove a wall from horizontals/verticals array
		if(direction === 'left'){
			verticals[row][column-1] = true;
		}
		else if(direction === 'right'){
			verticals[row][column] = true;
		}
		else if(direction === 'up'){
			horizontals[row-1][column] = true;
		}
		else{
			horizontals[row][column] = true;
		}

		// Visit that next cell
		stepThroughCell(nextRow, nextColumn);
	}
}

document.addEventListener('keydown', event => {
	const {x, y} = ball.velocity;

	if(event.key === 'w' || event.key === 'ArrowUp'){
		Body.setVelocity(ball, {x, y: y - 5});
	}

	if(event.key === 's' || event.key === 'ArrowDown'){
		Body.setVelocity(ball, {x, y: y + 5});
	}

	if(event.key === 'a' || event.key === 'ArrowLeft'){
		Body.setVelocity(ball, {x: x - 5, y: y});
	}

	if(event.key === 'd' || event.key === 'ArrowRight'){
		Body.setVelocity(ball, {x: x + 5, y: y});
	}
});

const winnerBanner = document.querySelector('.winner');
const btnReplay = document.querySelector('#btn-replay');

btnReplay.addEventListener('click', _ => {
	winnerBanner.classList.add('hidden');
	Composite.clear(world);
	generateMaze();
});

// Win condition
Events.on(engine, 'collisionStart', event => {
	const labels = ['ball', 'goal'];

	event.pairs.forEach(collision => {
		if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)){
			winnerBanner.classList.remove('hidden');
			world.gravity.y = 1;
			world.bodies.forEach(body => {
				if(body.label === 'wall'){
					Body.setStatic(body, false);
				}
			});
		}
	});
});