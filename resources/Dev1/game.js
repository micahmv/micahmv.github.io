"use strict"; // Do NOT remove this directive!

var dimension = 16;

var time = 0;
var tutorial = true;
var inBarrel;

var barrelX = 1;
var barrelY = dimension - 1;
var barrelDir = 1;

var playerX;
var playerY;
var playerVelocity = -1;
var playerDisabled = false;


var barrelMovementID;
var playerVerticalID;
var timeKeeperID;

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	PS.gridSize( dimension - 1, dimension + 1 );

	PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.border(PS.ALL, PS.ALL, 0);

	PS.statusText( "SPACE TO LAUNCH" );

	// Banana spawn logic
	for(let y = dimension - 2; y > 0; y--){
		for(let x = 0; x < dimension - 1; x++){
			if(x % 2 != 0 && y % 2 != 0){
				PS.color( x, y, PS.COLOR_YELLOW );
			}
		}
	}

	// Barrel start
	PS.color( barrelX, barrelY, PS.COLOR_ORANGE );
	inBarrel = true;

	// start perFrame
	barrelMovementID = PS.timerStart( 30, barrelMovement );
	playerVerticalID = PS.timerStart( 15, playerVertical );
	timeKeeperID = PS.timerStart( 60, timeKeeper );
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// horizontal movement logic
	if(key == PS.KEY_ARROW_LEFT && !playerDisabled){
		if(!inBarrel && playerX > 0){
			PS.color( playerX, playerY, PS.COLOR_BLACK );
			playerX -= 1;
			PS.color( playerX, playerY, PS.COLOR_RED );

			checkEnterBarrel();
		}
	}
	else if(key == PS.KEY_ARROW_RIGHT && playerX < dimension - 2 && !playerDisabled){
		if(!inBarrel){
			PS.color( playerX, playerY, PS.COLOR_BLACK );
			playerX += 1;
			PS.color( playerX, playerY, PS.COLOR_RED );

			checkEnterBarrel();
		}
	}

	// Launch logic
	if(key == PS.KEY_SPACE && !playerDisabled){
		if(inBarrel){
			inBarrel = false;
			playerX = barrelX;
			playerY = barrelY - 1;
			PS.color( playerX, playerY, PS.COLOR_RED );

			if(tutorial)
				PS.statusText( "ARROW KEYS TO MOVE" );
		}
	}
};

function barrelMovement(){
	// barrel logic
	if(barrelX == 1){
		barrelDir = 1;
	}
	if(barrelX == dimension - 3){
		barrelDir = -1;
	}

	PS.color( barrelX, barrelY, PS.COLOR_BLACK);
	barrelX += barrelDir;
	PS.color( barrelX, barrelY, PS.COLOR_ORANGE );

	checkEnterBarrel();
}

function checkEnterBarrel(){
	// enter back into barrel
	if(playerX == barrelX && playerY == barrelY){
		inBarrel = true;
		playerVelocity = -1;

		if(tutorial){
			PS.statusText("COLLECT");
			tutorial = false;
		}
	}
}

function checkDeath(){
	if(playerY > dimension){
		PS.statusText("GAME OVER, REFRESH TO PLAY AGAIN");
		
		PS.timerStop( barrelMovementID );
		PS.timerStop( playerVerticalID );
		PS.timerStop( timeKeeperID );

		playerDisabled = true;

		return true;
	}

	return false;
}

function playerVertical(){
	// player vertical logic
	if(!inBarrel){
		PS.color( playerX, playerY, PS.COLOR_BLACK );

		if(playerY == 1){
			playerVelocity = 1;

			if(tutorial)
				PS.statusText("LAND IN THE ORANGE LAUNCHER");
		}

		playerY += playerVelocity;

		let dead = checkDeath();

		if(!dead)
			PS.color( playerX, playerY, PS.COLOR_RED );

		checkEnterBarrel();
		checkEnd();
	}
}

function timeKeeper(){
	time++;
}

function checkEnd(){
	for(let y = dimension - 2; y > 0; y--){
		for(let x = 0; x < dimension - 1; x++){
			if(x % 2 != 0 && y % 2 != 0){
				let color = PS.color( x, y );
				
				if(color == 16776960) // COLOR_YELLOW's integer value
					return false;
			}
		}
	}

	PS.timerStop( barrelMovementID );
	PS.timerStop( playerVerticalID );
	PS.timerStop( timeKeeperID );

	PS.statusText("YOU COLLECTED EVERYTHING IN " + time + "s!");
	playerDisabled = true;
}