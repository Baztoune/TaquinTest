/*
 * Game object
 */
function Game() {
	this.grid = new Grid(conf.rows, conf.cols);
	var draggedTile = null;
}

/* First call, triggers the grid building */
Game.prototype.init = function init() {
	console.log('starting the game');
	this.buildView();
	this.attachDragDropEvents();
};

/* Shuffle the grid */
Game.prototype.shuffle = function shuffle() {
	// to make sure we have a solvable grid, we start with solved grid and make 100 random moves
	// could be optimized
	console.log('shuffle called');
	var game = this;

	for(var i=0;i<conf.shuffleMoves;i++){
		game.randomMove();
	}
};

/* Check if the game is solved by comparing the tiles positions with the cells positions */
Game.prototype.detectGameSolved = function detectGameSolved() {
	var solved = true;

	this.grid.cells.forEach(function(row){
		row.forEach(function(cell){
			if(cell.tile){
				// if the cell has a tile
				if(cell.x!=cell.tile.x || cell.y!=cell.tile.y){
					// is it the good one? if not, quit
					solved=false;
				}
			}
		});
	});

	if(solved){
		alert('We have a winner here! Congrats');
	}
};

/* build the view from the model */
Game.prototype.buildView = function buildView() {
	var cells = this.grid.cells;

	var grid = document.getElementById('grid');
	cells.forEach(function(col) {
		var newRow = document.createElement('div');
		newRow.classList.add('row', 'clearfix');
		col.forEach(function(cell) {
			/* Build cell */
			var newCell = document.createElement('div');
			newCell.classList.add('cell');
			newCell.id='cell-' + cell.x + '-' + cell.y;
			newCell.cellObject=cell;
			newRow.appendChild(newCell);

			/* Build tile */
			if(cell.tile) {
				var style = '';
					style += 'background: url('+conf.imgSrc+') ';
					style += 'no-repeat -'+conf.tileWidth*cell.y+'px -'+conf.tileHeight*cell.x+'px;';

				var newTile = document.createElement('div');
				newTile.classList.add('tile');
				newTile.setAttribute('style',style);
				newTile.id='tile-' + cell.x + '-' + cell.y;
				newTile.setAttribute('draggable', 'true');
				newTile.tileObject=cell.tile;

				newCell.appendChild(newTile);

			}
		});
		grid.appendChild(newRow);
	});
}

/* Calls the attachDragDropEvents on each cell and tile */
Game.prototype.attachDragDropEvents = function attachDragDropEvents(){
	this.grid.cells.forEach(function(col) {
		col.forEach(function(cell) {
			// for every cell, we attach the events
			cell.attachDragDropEvents(this);
			if(cell.tile){
				// if the tile exists, we attach the events
				cell.tile.attachDragDropEvents(this);
			}
		});
	});
}

/* Make a random move */
Game.prototype.randomMove = function randomMove() {
	var emptyCell = this.grid.getEmptyCell();

	// pick a move
	emptyCell.getRandomAdjacentCell().tile.moveTo(emptyCell, true);
}

/*
 * Grid object
 */
function Grid(rows, cols) {
	this.cells = [];

	for (var i = 0; i < rows; i++) {
		var row = [];
		for (var j = 0; j < cols; j++) {
			var cell = new Cell(i, j);
			cell.grid=this;
			if(!cell.isLast()) {
				// except last cell
				cell.tile = new Tile(i,j);
				cell.tile.cell=cell;
			}
			row.push(cell);
		}
		this.cells.push(row);
	}
}

/* Return the only empty cell of the grid */
Grid.prototype.getEmptyCell = function getEmptyCell() {
	var emptyCell;
	this.cells.forEach(function(col) {
		col.forEach(function(cell) {
			if(cell.isEmpty()) {
				emptyCell = cell;
			}
		});
	});
	return emptyCell;
};


/*
 * Cell object
 */
function Cell(x, y) {
	var tile;
	var grid;
	this.x = x;
	this.y = y;
}

/* Test if the cell is the last one of the grid (bottom right) */
Cell.prototype.isLast = function isLast() {
	if(this.x + 1 == conf.rows && this.y + 1 == conf.cols) {
		return true;
	}
};

/* Test if the cell is empty and can accept this tile */
Cell.prototype.acceptDrop = function acceptDrop(tile) {
	var dstCell = this;
	var srcCell = tile.cell;

	if(dstCell.isAdjacentTo(srcCell) && dstCell.isEmpty()) {
		console.log('yep, can drop');
		return true;
	}
	console.log('nop, can\'t drop');
	return false;
};

/* Test if the cell is empty */
Cell.prototype.isEmpty = function isEmpty() {
	if(!this.tile) {
		return true;
	}
	return false;
};

/* Test if the cell has a common border with the other one */
Cell.prototype.isAdjacentTo = function isAdjacentTo(otherCell) {
	var sameRow = this.y==otherCell.y;
	var sameCol = this.x==otherCell.x;
	if(sameRow && Math.abs(this.x-otherCell.x)==1
		|| sameCol && Math.abs(this.y-otherCell.y)==1) {
		return true;
	}
	return false;
};

/* Get the DOM element binded to this cell object */
Cell.prototype.getDomElement = function getDomElement() {
	var elt = document.getElementById('cell-'+this.x+'-'+this.y);
	return elt;
};

/* Empty the tile of this cell */
Cell.prototype.clear = function clear() {
	this.tile=null;
};

/* Attach the dragdrop events to the DOM element of the cell */
Cell.prototype.attachDragDropEvents = function attachDragDropEvents() {
	var elt = this.getDomElement();

	elt.addEventListener('dragenter', function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		var dstCell = this.cellObject;

		if(dstCell.acceptDrop(game.draggedTile)) {
			this.classList.add('accept-drop');
		}

		return false;
	}, false);
	elt.addEventListener('dragover', function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		return false;
	}, false);
	elt.addEventListener('dragleave', function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		this.classList.remove('accept-drop');
		return false;
	}, false);
	elt.addEventListener('drop', function(e) {
	    if (e.preventDefault) {
	    	e.preventDefault();
	    }

		if(this.cellObject.acceptDrop(game.draggedTile)) {
			game.draggedTile.moveTo(this.cellObject);
		}

		this.classList.remove('accept-drop');
		game.draggedTile=null;

		return false;
	}, false);
};

/* Return any of the available adjacent cells of this cell*/
Cell.prototype.getRandomAdjacentCell = function getRandomAdjacentCell() {
	var max_x = conf.cols-1 ;
	var max_y = conf.rows-1 ;

	var availableCells = [];
	/* We check for every direction */
	if(this.x-1>=0){
		availableCells.push(game.grid.cells[this.x-1][this.y]);
	}
	if(this.x+1<=max_x){
		availableCells.push(game.grid.cells[this.x+1][this.y]);
	}
	if(this.y-1>=0){
		availableCells.push(game.grid.cells[this.x][this.y-1]);
	}
	if(this.y+1<=max_y){
		availableCells.push(game.grid.cells[this.x][this.y+1]);
	}

	/* return any of the available cells */
	return availableCells[getRandomInt(0,availableCells.length-1)];
};


/*
 * Tile object
 */
function Tile(x,y) {
	this.x=x;
	this.y=y;
	var cell;
}

/* Get the DOM element binded to this tile object */
Tile.prototype.getDomElement = function getDomElement() {
	return this.cell.getDomElement().firstChild;
};

/* Move the tile DOM element to its destination. Update the model */
Tile.prototype.moveTo = function moveTo(cell, skipSolutionDetection) {
	cell.getDomElement().appendChild(this.getDomElement());
	this.cell.clear();
	this.cell=cell;
	this.cell.tile=this;

	if(!skipSolutionDetection){
		// we skip the detection when we shuffle the grid
		game.detectGameSolved();
	}
};

/* Attach the dragdrop events to the DOM element of the tile */
Tile.prototype.attachDragDropEvents = function attachDragDropEvents() {
	var elt = this.getDomElement();

	elt.addEventListener('dragstart', function(e) {
		// pass the id, so we can get the element on drop
    	e.dataTransfer.setData('Text', this.id);
    	game.draggedTile = this.tileObject;
	}, false);

	elt.addEventListener('dragenter', function(e) {
		// prevent event from propagating (otherwise dragenter target is the tile)
		e.stopPropagation();
	}, false);

	elt.addEventListener('selectstart', function(e){
		// Awesome fix for IE9 
		// http://stackoverflow.com/questions/5500615/internet-explorer-9-drag-and-drop-dnd#comment11341167_8986075
		this.dragDrop(); 
		return false;
	}, false);

	elt.addEventListener('dblclick', function(e) {
		// half of the time, we open a link or a video
		if(getRandomInt(0,100)%2){
			// open youtube popin
			console.log('opening video Pop-in');
			showVideo();
		} else {
			// open link in new tab
			console.log('opening website in new tab');
			window.open(conf.linkUrl,'_blank');
		}
	}, false);
};

/* Returns a random integer between min and max */
var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Build the video player and show the modal window */
var showVideo = function(){
	/* Build youtube player */
	var ytContainer = document.getElementById('youtubePlayerContainer');
	var ytPlayer = document.createElement('iframe');
	var ytVideoId = conf.youtubeUrl.split('?v=')[1]; // get the video id
	ytPlayer.setAttribute('allowfullscreen', true);
	ytPlayer.setAttribute('frameborder', 0);
	ytPlayer.setAttribute('width', 500);
	ytPlayer.setAttribute('height', 300);
	ytPlayer.src='http://www.youtube.com/embed/'+ytVideoId+'?html5=1&autohide=1';

	ytContainer.appendChild(ytPlayer);

	/* Show modal */
	document.getElementsByClassName('modal')[0].style.display='block';
	document.getElementsByClassName('overlay')[0].style.display='block';
	document.getElementsByClassName('overlay')[0].addEventListener('click', hideVideo);
};

/* Destroy the player and hide the modal */
var hideVideo = function(){
	/* Destroy youtube player*/
	document.getElementById('youtubePlayerContainer').innerHTML = ''; // clear

	/* Hide modal*/
	document.getElementsByClassName('modal')[0].style.display='none';
	document.getElementsByClassName('overlay')[0].style.display='none';
};


var game;
(function(){
	/*Start game*/
	game = new Game();
	game.init();
	var button = document.getElementById('shuffle-button');
	button.addEventListener('click',function(){
		game.shuffle();
	});
})();

