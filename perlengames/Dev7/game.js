"use strict"; // Do NOT remove this directive!

var Colors = {
	red:PS.makeRGB(189, 31, 0),
	orange:PS.makeRGB(249, 103, 6),
	yellow:PS.makeRGB(245, 171, 10),
	lgrey:PS.makeRGB(180, 182, 182),
	grey:PS.makeRGB(108, 132, 137),
	white:PS.makeRGB(217, 218, 218),
	purple:PS.makeRGB(46, 39, 91),
	blue:PS.makeRGB(49, 44, 128),
	sky:PS.makeRGB(103, 165, 211),
	magenta:PS.makeRGB(175, 59, 147),
	green:PS.makeRGB(40, 102, 78),
	dgreen:PS.makeRGB(16, 67, 57),
	black:PS.makeRGB(15, 15, 15),
	skin:PS.makeRGB(200, 159, 111) 
};

var fireCollected = 0;
var gameOver = false;

var playerPos = "top";
var playerCoord = {
	bot:{x:1, y:12},
	top:{x:1, y:28}
};

var teleporting = false;
var teleportFrame = 0;
var teleportID;

var hasMirror = true;
var mirrorPos = "not";
var mirrorType = "sky";
var mirrorCoord = {
	top:{x:9,y:12},
	bot:{x:9,y:28}
};

var dragonCoord = {
	top:{x:23, y:7},
	bot:{x:23, y:23}
};
var chanceFire = 5;
var d1firing = false; // dragon 1 firing
var d1fstep = 0; // dragon 1 firing step
var d2firing = false;
var d2fstep = 0;
var dragonID;
var fireID;

var fireballPositions = [];
var fireballID;

// draws a horizontal line in color of length
// returns the next x after line
// use length 1 for a single pixel/bead
function DrawLine(x, y, length, color){
	for(let i = 0; i < length; i++){
		if(x+i >= 0)
			PS.color(x+i,y,color);
	}
	return x+length;
}

// x and y represent bottom left point
function DrawDragon(x, y, mouth){
	var curX = x;
	var curY = y;
	if(mouth == "closed"){
		curX = DrawLine(curX, curY, 5, Colors.dgreen);
		curX = DrawLine(curX, curY, 2, Colors.green);
		curX = DrawLine(curX, curY, 2, Colors.dgreen);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 3, Colors.dgreen);
		curX = DrawLine(curX, curY, 5, Colors.green);
		curX = DrawLine(curX, curY, 1, Colors.dgreen);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.black);
		curX = DrawLine(curX, curY, 1, Colors.dgreen);
		curX = DrawLine(curX, curY, 1, Colors.black);
		curX = DrawLine(curX, curY, 5, Colors.green);
		curX = DrawLine(curX, curY, 1, Colors.dgreen);

		curX = x;
		curY--;

		curX += 3;
		curX = DrawLine(curX, curY, 1, Colors.black);
		curX = DrawLine(curX, curY, 1, Colors.green);
		curX = DrawLine(curX, curY, 1, Colors.black);
		curX = DrawLine(curX, curY, 2, Colors.green);

		curX = x;
		curY--;

		curX += 3;
		curX = DrawLine(curX, curY, 5, Colors.green);

		curX = x;
		curY--;

		curX += 4;
		curX = DrawLine(curX, curY, 1, Colors.dgreen);
		curX += 2;
		curX = DrawLine(curX, curY, 1, Colors.green);
	}
	else if(mouth == "open"){
		curX = DrawLine(curX, curY, 3, Colors.dgreen);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 3, Colors.sky);
		curX = DrawLine(curX, curY, 2, Colors.dgreen);
		curX = DrawLine(curX, curY, 2, Colors.green);
		curX = DrawLine(curX, curY, 2, Colors.dgreen);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 3, Colors.dgreen);
		curX = DrawLine(curX, curY, 5, Colors.green);
		curX = DrawLine(curX, curY, 1, Colors.dgreen);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.black);
		curX = DrawLine(curX, curY, 1, Colors.dgreen);
		curX = DrawLine(curX, curY, 1, Colors.black);
		curX = DrawLine(curX, curY, 5, Colors.green);
		curX = DrawLine(curX, curY, 1, Colors.dgreen);

		curX = x;
		curY--;
		curX += 3;

		curX = DrawLine(curX, curY, 1, Colors.black);
		curX = DrawLine(curX, curY, 1, Colors.green);
		curX = DrawLine(curX, curY, 1, Colors.black);
		curX = DrawLine(curX, curY, 2, Colors.green);

		curX = x;
		curY--;
		curX += 3;

		curX = DrawLine(curX, curY, 5, Colors.green);

		curX = x;
		curY--;
		curX += 4;

		curX = DrawLine(curX, curY, 1, Colors.dgreen);
		curX += 2;
		curX = DrawLine(curX, curY, 1, Colors.green);
	}
}

function DrawWizard(x,y){
	var curX = x;
	var curY = y;

	curX = DrawLine(curX, curY, 3, Colors.purple);
	curX = DrawLine(curX, curY, 3, Colors.blue);
	curX = DrawLine(curX, curY, 2, Colors.purple);

	curX = x;
	curY--;
	curX += 1;

	curX = DrawLine(curX, curY, 4, Colors.purple);
	curX = DrawLine(curX, curY, 1, Colors.lgrey); 
	curX = DrawLine(curX, curY, 1, Colors.purple); 

	curX = x;
	curY--;
	curX += 1;

	curX = DrawLine(curX, curY, 1, Colors.sky);
	curX = DrawLine(curX, curY, 1, Colors.purple);
	curX = DrawLine(curX, curY, 1, Colors.skin);
	curX = DrawLine(curX, curY, 1, Colors.purple);
	curX = DrawLine(curX, curY, 1, Colors.blue);
	curX = DrawLine(curX, curY, 1, Colors.purple);
	curX = DrawLine(curX, curY, 1, Colors.sky);
	curX = DrawLine(curX, curY, 1, Colors.skin);

	curX = x;
	curY--;
	curX += 2;

	curX = DrawLine(curX, curY, 1, Colors.skin);
	curX = DrawLine(curX, curY, 2, Colors.purple);
	curX = DrawLine(curX, curY, 1, Colors.blue);
	curX = DrawLine(curX, curY, 1, Colors.purple);
	curX = DrawLine(curX, curY, 1, Colors.skin);

	curX = x;
	curY--;
	curX += 2;

	curX = DrawLine(curX, curY, 3, Colors.purple);
	curX = DrawLine(curX, curY, 3, Colors.white);
	curX = DrawLine(curX, curY, 1, Colors.sky);

	curX = x;
	curY--;
	curX += 3;

	curX = DrawLine(curX, curY, 1, Colors.purple);
	curX = DrawLine(curX, curY, 1, Colors.skin);
	curX = DrawLine(curX, curY, 3, Colors.white);

	curX = x;
	curY--;
	curX += 4;

	curX = DrawLine(curX, curY, 1, Colors.skin);
	curX = DrawLine(curX, curY, 1, Colors.black);
	curX = DrawLine(curX, curY, 1, Colors.skin);
	curX = DrawLine(curX, curY, 1, Colors.black);
	curX = DrawLine(curX, curY, 1, Colors.sky);

	curX = x;
	curY--;
	curX += 3;

	curX = DrawLine(curX, curY, 6, Colors.blue);

	curX = x;
	curY--;
	curX += 4;

	curX = DrawLine(curX, curY, 4, Colors.blue);
	curX = DrawLine(curX, curY, 1, Colors.sky);

	curX = x;
	curY--;
	curX += 2;

	curX = DrawLine(curX, curY, 1, Colors.blue);
	curX = DrawLine(curX, curY, 1, Colors.sky);
	curX = DrawLine(curX, curY, 3, Colors.blue);
	
	curX = x;
	curY--;
	curX += 3;

	curX = DrawLine(curX, curY, 2, Colors.blue);
	curX = DrawLine(curX, curY, 2, Colors.sky);
}

function DrawWizardLines(x,y,state){
	var curX = x;
	var curY = y;

	if(state == 0){
		DrawLine(curX, curY, 8, Colors.magenta);
		curY -= 2;
		curX = x+1;
		DrawLine(curX, curY, 8, Colors.magenta);
		curY -= 2;
		curX = x+2;
		DrawLine(curX, curY, 7, Colors.magenta);
		curY -= 2;
		curX = x+4;
		DrawLine(curX, curY, 5, Colors.magenta);
		curY -= 2;
		curX = x+4;
		DrawLine(curX, curY, 5, Colors.magenta);
		curY -= 2;
		curX = x+3;
		DrawLine(curX, curY, 4, Colors.magenta);
	}
	else if(state == 1){
		DrawLine(curX, curY, 8, Colors.white);
		curY--;
		curX = x+1;
		DrawLine(curX, curY, 6, Colors.magenta);
		curY--;
		curX = x+1;
		DrawLine(curX, curY, 8, Colors.sky);
		curY--;
		curX = x+2;
		DrawLine(curX, curY, 6, Colors.magenta);
		curY--;
		curX = x+2;
		DrawLine(curX, curY, 7, Colors.sky);
		curY--;
		curX = x+3;
		DrawLine(curX, curY, 5, Colors.magenta);
		curY--;
		curX = x+4;
		DrawLine(curX, curY, 5, Colors.sky);
		curY--;
		curX = x+3;
		DrawLine(curX, curY, 6, Colors.magenta);
		curY--;
		curX = x+4;
		DrawLine(curX, curY, 5, Colors.sky);
		curY--;
		curX = x+2;
		DrawLine(curX, curY, 5, Colors.magenta);
		curY--;
		curX = x+2;
		DrawLine(curX, curY, 5, Colors.sky);
	}
	else if(state == 2){
		DrawLine(curX, curY, 8, Colors.white);
		curY--;
		curX = x+1;
		DrawLine(curX, curY, 6, Colors.sky);
		curY--;
		curX = x+1;
		DrawLine(curX, curY, 8, Colors.sky);
		curY--;
		curX = x+2;
		DrawLine(curX, curY, 6, Colors.sky);
		curY--;
		curX = x+2;
		DrawLine(curX, curY, 7, Colors.sky);
		curY--;
		curX = x+3;
		DrawLine(curX, curY, 5, Colors.sky);
		curY--;
		curX = x+4;
		DrawLine(curX, curY, 5, Colors.sky);
		curY--;
		curX = x+3;
		DrawLine(curX, curY, 6, Colors.sky);
		curY--;
		curX = x+4;
		DrawLine(curX, curY, 5, Colors.sky);
		curY--;
		curX = x+2;
		DrawLine(curX, curY, 5, Colors.sky);
		curY--;
		curX = x+4;
		DrawLine(curX, curY, 3, Colors.sky);
	}
}

function DrawCloud(x,y){
	var curX = x;
	var curY = y;

	curX = DrawLine(curX, curY, 1, Colors.white);
	curX += 1;
	curX = DrawLine(curX, curY, 3, Colors.white);
	curX += 3;
	curX = DrawLine(curX, curY, 2, Colors.white);
	curX += 2;
	curX = DrawLine(curX, curY, 2, Colors.white);
	
	curX = x;
	curY--;

	DrawLine(curX, curY, 15, Colors.white);

	curX = x;
	curY--;

	DrawLine(curX, curY, 16, Colors.white);

	curX = x;
	curY--;

	DrawLine(curX, curY, 15, Colors.white);
}

function DrawMirror(x, y, state){
	var curX = x;
	var curY = y;

	if(state == "sky"){
		curX += 1;
		DrawLine(curX, curY, 3, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 1, Colors.white);
		curX = DrawLine(curX, curY, 2, Colors.sky);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 2, Colors.white);
		curX = DrawLine(curX, curY, 1, Colors.sky);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 1, Colors.white);
		curX = DrawLine(curX, curY, 2, Colors.sky);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 3, Colors.sky);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 3, Colors.sky);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 2, Colors.sky);
		curX = DrawLine(curX, curY, 1, Colors.white);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 1, Colors.sky);
		curX = DrawLine(curX, curY, 2, Colors.white);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 2, Colors.sky);
		curX = DrawLine(curX, curY, 1, Colors.white);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 3, Colors.sky);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;
		curX += 1;
		DrawLine(curX, curY, 3, Colors.grey);

	}
	else if(state == "fire"){
		curX += 1;
		DrawLine(curX, curY, 3, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 1, Colors.red);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 1, Colors.red);
		curX = DrawLine(curX, curY, 1, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.red);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 3, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 2, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;

		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 2, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;
		
		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 2, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;
		
		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 2, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;
		
		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 1, Colors.yellow);
		curX = DrawLine(curX, curY, 2, Colors.orange);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;
		
		curX = DrawLine(curX, curY, 1, Colors.grey);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 1, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.red);
		curX = DrawLine(curX, curY, 1, Colors.grey);

		curX = x;
		curY--;
		curX += 1;

		curX = DrawLine(curX, curY, 3, Colors.grey);
	}
}

function DrawFireball(x,y,state){
	var curX = x;
	var curY = y;
	if(state == "right"){
		curX += 2;
		curX = DrawLine(curX, curY, 3, Colors.orange);

		curY--;
		curX = x;
		curX += 1;
		curX = DrawLine(curX, curY, 1, Colors.red);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 3, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.orange);

		curY--;
		curX = x;
		curX = DrawLine(curX, curY, 1, Colors.red);
		curX = DrawLine(curX, curY, 2, Colors.orange);
		curX = DrawLine(curX, curY, 3, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.orange);

		curY--;
		curX = x;
		curX += 1;
		curX = DrawLine(curX, curY, 1, Colors.red);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 3, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.orange);

		curY--;
		curX = x;
		curX += 2;
		curX = DrawLine(curX, curY, 3, Colors.orange);

	}
	else if(state == "left"){
		curX += 1;
		DrawLine(curX, curY, 3, Colors.orange);

		curY--;
		curX = x;
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 3, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 1, Colors.red);

		curY--;
		curX = x;
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 3, Colors.yellow);
		curX = DrawLine(curX, curY, 2, Colors.orange);
		curX = DrawLine(curX, curY, 1, Colors.red);

		curY--;
		curX = x;
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 3, Colors.yellow);
		curX = DrawLine(curX, curY, 1, Colors.orange);
		curX = DrawLine(curX, curY, 1, Colors.red);

		curY--;
		curX = x;
		curX += 1;
		DrawLine(curX, curY, 3, Colors.orange);
	}
}

PS.init = function( system, options ) {
	PS.gridSize( 32, 32 );
	PS.color(PS.ALL, PS.ALL, Colors.sky);
	PS.border(PS.ALL, PS.ALL, 0);

	PS.statusText( "Fire collected: " + fireCollected );

	DrawCloud(0, 31);
	DrawCloud(0, 15);

	DrawDragon(dragonCoord.top.x,dragonCoord.top.y,"closed");
	DrawDragon(dragonCoord.bot.x,dragonCoord.bot.y,"closed");
	
	DrawWizard(1, 12);

	dragonID = PS.timerStart( 60, updateDragons );
	teleportID = PS.timerStart( 10, teleportPlayer );
	fireID = PS.timerStart( 15, fireDragon );
	fireballID = PS.timerStart( 15, updateFireballs );
};

PS.keyDown = function( key, shift, ctrl, options ) {
	if(!gameOver){
		if(key == PS.KEY_ARROW_UP && playerPos == "bot" && !teleporting){
			teleporting = true;
		}
		if(key == PS.KEY_ARROW_DOWN && playerPos == "top" && !teleporting){
			teleporting = true;
		}
		if(key == PS.KEY_ARROW_RIGHT){
			if(hasMirror){
				// spawn mirror in front
				if(playerPos == "top")
					DrawMirror(9,12,mirrorType);
				else if(playerPos == "bot")
					DrawMirror(9,28,mirrorType);
	
				hasMirror = false;
				mirrorPos = playerPos;
			}
		}
		if(key == PS.KEY_ARROW_LEFT){
			if(playerPos == mirrorPos){
				// retract mirror
				var localX;
				var localY;
				if(mirrorPos == "top"){
					localX = mirrorCoord.top.x;
					localY = mirrorCoord.top.y;
				}
				else if(mirrorPos == "bot"){
					localX = mirrorCoord.bot.x;
					localY = mirrorCoord.bot.y;
				}
				DrawLine(localX, localY, 4, Colors.white);
				for(let col = localY-1; col > localY - 11; col--){
					for(let row = localX; row < localX + 5; row++){
						PS.color(row,col,Colors.sky);
					}
				}
				if(playerPos == "top")
					DrawWizard(playerCoord.bot.x, playerCoord.bot.y);
				else if(playerPos == "bot")
					DrawWizard(playerCoord.top.x, playerCoord.top.y);
	
				mirrorPos = "not";
				if(mirrorType == "fire"){
					fireCollected++;
					PS.statusText( "Fire collected: " + fireCollected );
					mirrorType = "sky";
				}
				hasMirror = true;
			}
		}
	}
};

function teleportPlayer(){
	if(teleporting){
		if(teleportFrame == 0){
			if(playerPos == "bot"){
				DrawWizardLines(playerCoord.top.x, playerCoord.top.y, 0);
				DrawWizardLines(playerCoord.bot.x, playerCoord.bot.y, 1);
			}
			else if(playerPos == "top"){
				DrawWizardLines(playerCoord.bot.x, playerCoord.bot.y, 0);
				DrawWizardLines(playerCoord.top.x, playerCoord.top.y, 1);
			}

			if(mirrorPos == "top")
				DrawMirror(mirrorCoord.top.x, mirrorCoord.top.y, mirrorType);
			else if(mirrorPos == "bot")
				DrawMirror(mirrorCoord.bot.x, mirrorCoord.bot.y, mirrorType);

			teleportFrame++;
		}
		else if(teleportFrame == 1){
			if(playerPos == "bot"){
				DrawWizardLines(playerCoord.top.x, playerCoord.top.y, 1);
				DrawWizard(playerCoord.bot.x, playerCoord.bot.y);
				DrawWizardLines(playerCoord.bot.x, playerCoord.bot.y, 0);
				playerPos = "top";
			}
			else if(playerPos == "top"){
				DrawWizardLines(playerCoord.bot.x, playerCoord.bot.y, 1);
				DrawWizard(playerCoord.top.x, playerCoord.top.y);
				DrawWizardLines(playerCoord.top.x, playerCoord.top.y, 0);
				playerPos = "bot";
			}

			if(mirrorPos == "top")
				DrawMirror(mirrorCoord.top.x, mirrorCoord.top.y, mirrorType);
			else if(mirrorPos == "bot")
				DrawMirror(mirrorCoord.bot.x, mirrorCoord.bot.y, mirrorType);

			teleportFrame++;
		}
		else if(teleportFrame == 2){
			if(playerPos == "top"){
				DrawWizardLines(playerCoord.top.x, playerCoord.top.y, 2);
				DrawWizard(playerCoord.bot.x, playerCoord.bot.y, 0);
			}
			else if(playerPos == "bot"){
				DrawWizardLines(playerCoord.bot.x, playerCoord.bot.y, 2);
				DrawWizard(playerCoord.top.x, playerCoord.top.y, 0);

			}

			if(mirrorPos == "top")
				DrawMirror(mirrorCoord.top.x, mirrorCoord.top.y, mirrorType);
			else if(mirrorPos == "bot")
				DrawMirror(mirrorCoord.bot.x, mirrorCoord.bot.y, mirrorType);

			teleportFrame = 0;
			teleporting = false;
		}
	}
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateDragons(){
	if(!gameOver){
		var r = getRandomInt(0, 100);

		if(fireballPositions.length == 0 && !d1firing && !d2firing){
			r = 0;
		}
	
		if(r <= chanceFire){
			var fiftyfifty = getRandomInt(0, 1);
	
			if(fiftyfifty == 0 && !d1firing)
				d1firing = true;
			else if(fiftyfifty == 1 && !d2firing)
				d2firing = true;
		}
	}
}

function updateFireballs(){
	for(let i = 0; i < fireballPositions.length; i++){
		DrawLine(fireballPositions[i].x+1, fireballPositions[i].y+2, 6, Colors.sky);
		DrawLine(fireballPositions[i].x+1, fireballPositions[i].y+1, 6, Colors.sky);
		DrawLine(fireballPositions[i].x+1, fireballPositions[i].y, 7, Colors.sky);
		DrawLine(fireballPositions[i].x+1, fireballPositions[i].y-1, 6, Colors.sky);
		DrawLine(fireballPositions[i].x+1, fireballPositions[i].y-2, 6, Colors.sky);
		DrawFireball(fireballPositions[i].x, fireballPositions[i].y+2, "left");

		if(fireballPositions[i].t >= 4 && fireballPositions[i].t <= 9){
			// collides with mirror
			if(mirrorPos == fireballPositions[i].tb){
				mirrorType = "fire";
				DrawLine(fireballPositions[i].x+1, fireballPositions[i].y+2, 6, Colors.sky);
				DrawLine(fireballPositions[i].x+1, fireballPositions[i].y+1, 7, Colors.sky);
				DrawLine(fireballPositions[i].x+1, fireballPositions[i].y, 8, Colors.sky);
				DrawLine(fireballPositions[i].x+1, fireballPositions[i].y-1, 7, Colors.sky);
				DrawLine(fireballPositions[i].x+1, fireballPositions[i].y-2, 6, Colors.sky);

				if(mirrorPos == "top"){
					DrawMirror(mirrorCoord.top.x, mirrorCoord.top.y, mirrorType);
				}
				else if(mirrorPos == "bot"){
					DrawMirror(mirrorCoord.bot.x, mirrorCoord.bot.y, mirrorType);
				}

				fireballPositions.splice(i, 1);
				break;
			}
		}

		if(fireballPositions[i].t >= 9 && fireballPositions[i].t <= 23 && playerPos == fireballPositions[i].tb){
			// collides with player
			gameOver = true;
			PS.statusText("GAME OVER");
			fireballPositions.splice(i, 1);
			break;
		}

		if(fireballPositions[i].t > 23){
			fireballPositions.splice(i, 1);
			break;
		}

		fireballPositions[i].t++;
		fireballPositions[i].x--;
	}
}

function fireDragon(){
	if(d1firing){
		if(d1fstep == 0){
			// open mouth
			DrawDragon(dragonCoord.top.x,dragonCoord.top.y+1,"open");
			d1fstep++;
		}
		else if(d1fstep == 1){
			// yellow
			PS.color(dragonCoord.top.x+2, dragonCoord.top.y, Colors.yellow);
			d1fstep++;
		}
		else if(d1fstep == 2){
			// orange
			PS.color(dragonCoord.top.x+1, dragonCoord.top.y, Colors.orange);
			d1fstep++;
		}
		else if(d1fstep == 3){
			// red
			PS.color(dragonCoord.top.x, dragonCoord.top.y, Colors.red);
			d1fstep++;
		}
		else if(d1fstep == 4){
			// fireball
			fireballPositions.push({x:dragonCoord.top.x-6, y:dragonCoord.top.y, t:0, tb:"top"});
			DrawDragon(dragonCoord.top.x, dragonCoord.top.y+1, "open");
			d1fstep++;
		}
		else if(d1fstep == 5){
			// close mouth
			DrawDragon(dragonCoord.top.x, dragonCoord.top.y, "closed");
			DrawLine(dragonCoord.top.x, dragonCoord.top.y+1, 9, Colors.sky);
			d1fstep++;
		}
		else if(d1fstep == 6){
			DrawDragon(dragonCoord.top.x, dragonCoord.top.y, "closed");
			d1firing = false;
			d1fstep = 0;
		}
	}
	if(d2firing){
		if(d2fstep == 0){
			// open mouth
			DrawDragon(dragonCoord.bot.x,dragonCoord.bot.y+1,"open");
			d2fstep++;
		}
		else if(d2fstep == 1){
			// yellow
			PS.color(dragonCoord.bot.x+2, dragonCoord.bot.y, Colors.yellow);
			d2fstep++;
		}
		else if(d2fstep == 2){
			// orange
			PS.color(dragonCoord.bot.x+1, dragonCoord.bot.y, Colors.orange);
			d2fstep++;
		}
		else if(d2fstep == 3){
			// red
			PS.color(dragonCoord.bot.x, dragonCoord.bot.y, Colors.red);
			d2fstep++;
		}
		else if(d2fstep == 4){
			// fireball
			fireballPositions.push({x:dragonCoord.bot.x-6, y:dragonCoord.bot.y, t:0, tb:"bot"});
			DrawDragon(dragonCoord.bot.x, dragonCoord.bot.y+1, "open");
			d2fstep++;
		}
		else if(d2fstep == 5){
			// close mouth
			DrawDragon(dragonCoord.bot.x, dragonCoord.bot.y, "closed");
			DrawLine(dragonCoord.bot.x, dragonCoord.bot.y+1, 9, Colors.sky);
			d2fstep++;
		}
		else if(d2fstep == 6){
			DrawDragon(dragonCoord.bot.x, dragonCoord.bot.y, "closed");
			d2firing = false;
			d2fstep = 0;
		}
	}
}