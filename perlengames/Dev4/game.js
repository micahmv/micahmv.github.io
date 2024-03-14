"use strict"; // Do NOT remove this directive!

var timeKeeperID;
var time = 0;
var playerEnabled = true;

var mazeSize = 7;
var mazeData; // 2d array of mazeSize, must be odd

var walls; // used for procgen

var playerPos; // in maze coord
var goalPos; // in maze coord

var playerVisual = PS.COLOR_RED;
var floorVisual = PS.COLOR_WHITE;
var wallVisual = PS.COLOR_BLACK;
var goalVisual = PS.COLOR_GREEN;

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
	PS.border(PS.ALL, PS.ALL, 0);

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


function spawnAtValidBead(spawned){
	// randomize pos
	var randX = 1; 
	var randY = 1;
	var checkLocation = PS.color(randX, randY);

	while(checkLocation != PS.COLOR_WHITE){
		// avoid borders and walls being on borders w/ -2
		var randX = getRandomInt(2, mazeSize - 3); 
		var randY = getRandomInt(2, mazeSize - 3);

		checkLocation = PS.color(randX, randY);
	}

	// new pos
	PS.color(randX, randY, spawned);

	return {x:randX, y:randY};
}

function timeKeeper(){
	time++;
}

// Perlenspiel Functions
PS.init = function( system, options ) {
	PS.gridSize(mazeSize, mazeSize);

	PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE);

	PS.statusText("GET TO THE GOAL");

	// generate the maze itself
	generateMaze(mazeSize, mazeSize);
	// and visualize it
	visualizeMazeInBeads();

	// add in key pieces
	playerPos = spawnAtValidBead(playerVisual); // player
	goalPos = spawnAtValidBead(goalVisual); // goal

	timeKeeperID = PS.timerStart( 60, timeKeeper );
};

PS.keyUp = function( key, shift, ctrl, options ) {
	if(!playerEnabled)
		return;

	// set up variables
	var offsetX = 0;
	var offsetY = 0;

	// check which direction moving in
	switch(key){
		case PS.KEY_ARROW_RIGHT:
			offsetX += 1;
			break;
		case PS.KEY_ARROW_LEFT:
			offsetX -= 1;
			break;
		case PS.KEY_ARROW_UP:
			offsetY -= 1;
			break;		
		case PS.KEY_ARROW_DOWN:
			offsetY += 1;
			break;
	}

	if(PS.color(playerPos.x + offsetX, playerPos.y + offsetY) == floorVisual){
		// direction moving is valid

		// move
		PS.color(playerPos.x, playerPos.y, floorVisual);
		PS.color(playerPos.x + offsetX, playerPos.y + offsetY, playerVisual);

		playerPos.x += offsetX;
		playerPos.y += offsetY;
	}
	else if(PS.color(playerPos.x + offsetX, playerPos.y + offsetY) == goalVisual){
		if(mazeSize < 31){
			mazeSize += 2;

			// generate the maze itself
			generateMaze(mazeSize, mazeSize);
			// and visualize it
			visualizeMazeInBeads();

			// add in key pieces
			playerPos = spawnAtValidBead(playerVisual); // player
			goalPos = spawnAtValidBead(goalVisual); // goal
		}
		else {
			PS.statusText("YOU SOLVED ALL MAZES IN " + time + "s!");
			playerEnabled = false;
		}
	}
};

