"use strict"; // Do NOT remove this directive!

/*
Assignment: Make a genuinely soleable puzzle
Game: Escape a procedurally generated maze
Theme: Theseus & the Minotaur
*/

/*
To be coded:

Maze
- 2D Array representing non-filled/filled beads {0, 1}
- Player movement within the maze
- Checking for collisions with walls

Proc Gen
- Maze generation using 2D array

Gameplay Loop
- Placing down "string" behind player
- hold space to go back down string path
- roaming minotaur on the map
- destructing from the middle to the start

Perlenspiel new skills:
- Sprites
	- Player
	- Minotaur
	- Walls/floor MAYBE
- Title screen with quick expo
	- Think what that one dude in the class does
- Sound effects & music MAYBE
	 - See about generating sound through this engine
	 - Generate sound effects

Game Dev new skills:
- Procedural maze generation
- Connecting thread sprites through game dev cheat code
	- Think trains and trails, a tileset that can automatically stitch
- Minotaur decision tree? Lowkey a chase state...
*/

/*
Pseudocode:
	let mazeData = new int[][];
	Camera controller
		Centers player, updates view of maze each frame
	player movement essentially the same as COLLECT
		Start a timer on playerSpeed interval
		Update players position 
			after checking for a colliding wall
	on init generate 1's and 0's based on algorithm
	Thread
		Place every movement where the player was
		Don't collide with (removed when stood over)
		Hold space to quickly run back over its path
	Minotaur AI
		Spawned in the center of each maze
		Roams with an "always right" protocol
			Will go forward if possible, and if not possible turns right
		Unless! The hallway the minotaur is facing, has the player in it
			Then go chase mode towards player trying to keep in sight and hit
			Minotaur faster than player move, but not thread run
		Leaves tracks (hoofs behind every few steps)
	Destructiong
		After minotaur is killed, map goes black 
			starting from middle origin to borders of map
		Reach the entrance of the maze and escape in time
			Win screen
*/

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

var dimension = 11; // size of the perlen window

var mazeSize = 31;
var mazeData; // 2d array of mazeSize, must be odd

var walls; // used for procgen

var playerPositionX = mazeSize / 2;
var playerPositionY = mazeSize / 2;

var minotaurPositionX;
var minotaurPositionY;

var playerVisual = PS.COLOR_RED;
var floorVisual = PS.COLOR_WHITE;
var wallVisual = PS.COLOR_BLACK;
var minoVisual = PS.COLOR_BROWN;

// updater function ID's
var playerMovementID;
var minotaurID;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Functions related to Maze Generation
// initializes 2d array mazeData to be filled with 1's and a border of 2's
function initMaze(){
	// set up 2d array
	mazeData = [];
	for(let i = 0; i < mazeSize; i++){
		mazeData[i] = [];
	}
	// fill with 1's
	for(let x = 0; x < mazeSize; x++){
		for(let y = 0; y < mazeSize; y++){
			mazeData[x][y] = 1;
		}
	}
	// set up borders
	for(let i = 0; i < mazeData.length; i++){ 
		// rows
		mazeData[0][i] = 2;
		mazeData[mazeData.length - 1][i] = 2;
		// cols
		mazeData[i][0] = 2;
		mazeData[i][mazeData.length - 1] = 2;
	}
}

function addWalls(x, y){
	if(mazeData[x][y+1] == 1)
		walls.push([x, y+1, "north"]); // north
	if(mazeData[x][y-1] == 1)
		walls.push([x, y-1, "south"]); // south
	if(mazeData[x+1][y] == 1)
		walls.push([x+1, y, "east"]); // east
	if(mazeData[x-1][y] == 1)
		walls.push([x-1, y, "west"]); // west
}

function generateMaze(width, height) {
	// set up filled maze with border
	initMaze();
	// debugMaze();
	
	// initialize wall array
	walls = [];

	// randomize starting cell
	var randX = getRandomInt(2, mazeSize - 3); // avoid borders and walls being on borders w/ -2
	var randY = getRandomInt(2, mazeSize - 3);
	// starting cell
	mazeData[randX][randY] = 0;

	// debugMaze();

	// add starting cell walls to wallList
	addWalls(randX, randY);

	// debugMazeNWalls();
	
	while(walls.length != 0){
		// choose random wall
		var randWallIndex = getRandomInt(0, walls.length - 1);
		// set the random wall
		var wall = walls[randWallIndex];

		// get after cell
		var afterCell;
		switch(wall[2]){
			case "north":
				afterCell = [wall[0], wall[1]+1];
				break;
			case "south":
				afterCell = [wall[0], wall[1]-1];
				break;
			case "east":
				afterCell = [wall[0]+1, wall[1]];
				break;
			case "west":
				afterCell = [wall[0]-1, wall[1]];
				break;
		}

		if(mazeData[afterCell[0]][afterCell[1]] == 1){ // after cell not visited/filled			
			// in the maze, wall is turned into a floor
			mazeData[wall[0]][wall[1]] = 0;
			// so is the aftercell
			mazeData[afterCell[0]][afterCell[1]] = 0;

			// add aftercell's walls to wall list
			addWalls(afterCell[0], afterCell[1]);
		}

		// remove the used wall from walls list
		walls.splice(randWallIndex, 1);

		// debugMazeNWalls();
	}
}

function debugMaze(){
	// visualize the maze
	for(let x = 0; x < mazeSize; x++){
		for(let y = 0; y < mazeSize; y++){
			PS.debug(mazeData[x][y] + " ");
		}
		PS.debug("\n");
	} // will only work when mazeSize == gameWindow dimension

	PS.debug("\n");
}

function debugMazeNWalls(){
	var data = [];
	for(let i = 0; i < mazeSize; i++){
		data[i] = [];
	}

	// visualize the maze and borders
	for(let x = 0; x < mazeSize; x++){
		for(let y = 0; y < mazeSize; y++){
			data[x][y] = mazeData[x][y];
		}
	}

	// visualize the walls
	for(let i = 0; i < walls.length; i++){
		data[walls[i][0]][walls[i][1]] = 3;
	}

	// print all
	for(let x = 0; x < data.length; x++){
		for(let y = 0; y < data.length; y++){
			PS.debug(data[x][y] + " ");
		}

		PS.debug("\n");
	}

	PS.debug("\n");
}

function visualizeMazeInBeads(){
	PS.gridSize(mazeSize, mazeSize);

	for(let y = 0; y < mazeSize; y++){
		for(let x = 0; x < mazeSize; x++){
			switch(mazeData[y][x]){
				case 0:
					PS.color(x, y, floorVisual);
					break;
				case 1:
					PS.color(x, y, wallVisual);
					break;
				case 2:
					PS.color(x, y, wallVisual);
					break;
			}
		}
	}
}

// Perlenspiel Functions
PS.init = function( system, options ) {
	PS.gridSize(dimension, dimension);

	PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE);
	// PS.border(PS.ALL, PS.ALL, 0);

	PS.statusText("GET TO THE GOAL");

	// generate the maze itself
	generateMaze(mazeSize, mazeSize);

	visualizeMazeInBeads();

	PS.border(PS.ALL, PS.ALL, 0);

	// randomly place the minotaur towards the middle of the maze
	minotaurPositionX = mazeSize / 2;
	minotaurPositionY = mazeSize / 2;

	// find a empty space around the middle of the maze
	/*
	while(PS.color(minotaurPositionX, minotaurPositionY) != PS.COLOR_WHITE){
		var rand = Math.random();
		switch(rand){
			case(0 < rand && rand <= 0.25):
				minotaurPositionX += 1;
				break;
			case(0.25 < rand && rand <= 0.5):
				minotaurPositionX -= 1;
				break;
			case(0.5 < rand && rand <= 0.75):
				minotaurPositionY += 1;
				break;
			case(0.75 < rand && rand <= 1):
				minotaurPositionY -= 1;
				break;
		}
	}
	*/

	// spawn the minotaur
	// PS.color( minotaurPositionX, minotaurPositionY, minoVisual );

	// start updating functions
	// minotaurID = PS.timerStart( 30, minotaurAI );
};

PS.keyUp = function( key, shift, ctrl, options ) {
	// set up variables
	var offsetX;
	var offsetY;

	// check which direction moving in
	switch(key){
		case PS.KEY_ARROW_RIGHT:
			offsetX + 1;
			break;
		case PS.KEY_ARROW_LEFT:
			offsetX - 1;
			break;
		case PS.KEY_ARROW_UP:
			offsetY + 1;
			break;		
		case PS.KEY_ARROW_DOWN:
			offsetY - 1;
			break;
	}

	if(PS.color(dimension/2 + offsetX, dimension/2 + offsetY) == PS.COLOR_WHITE){
		// direction moving is valid

		// move
		playerPositionX += offsetX;
		playerPositionY += offsetY;

		// revisualize the maze with the new centered player
	}
};

