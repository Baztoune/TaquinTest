/*
 * Game object
 */
function Game() {
	this.grid = new Grid(conf.rows, conf.cols);
	var draggedTile = null;
}


Game.prototype.init = function init() {
	console.log('starting the game');
	this.buildView();
};

Game.prototype.shuffle = function shuffle() {
	// to make sure we have a solvable grid, we start with solved grid and make 100 random moves
	// could be optimized
	console.log('shuffle called');

	var game = this;
	for(var i=0;i<conf.difficulty;i++){
		game.randomMove();
	}
};

Game.prototype.detectGameSolved = function detectGameSolved() {
	var game = this;
	var solved = true;

	game.grid.cells.forEach(function(row){
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
	var game = this;
	var cells = game.grid.cells;

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
			game.attachDragEventsOnDroppableElement(newCell);

			/* Build tile */
			if(cell.tile) {
				var newTile = document.createElement('div');
				newTile.classList.add('tile');
				newTile.id='tile-' + cell.x + '-' + cell.y;
				newTile.setAttribute('draggable', 'true');
				newTile.tileObject=cell.tile;

				newCell.appendChild(newTile);

				game.attachDragEventsOnDraggableElement(newTile);
			}
		});
		grid.appendChild(newRow);
	});
}

Game.prototype.attachDragEventsOnDraggableElement = function attachDragEventsOnDraggableElement(el) {
	var game = this;
	el.addEventListener('dragstart', function(e) {
		// pass the id, so we can get the element on drop
    	e.dataTransfer.setData('Text', this.id);
    	game.draggedTile = this.tileObject;
	}, false);
	el.addEventListener('dragenter', function(e) {
		e.stopPropagation();
	}, false);
};

Game.prototype.attachDragEventsOnDroppableElement = function attachDragEventsOnDroppableElement(el) {
	var game = this; // cache before event handlers override it

	el.addEventListener('dragenter', function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		var dstCell = this.cellObject;

		if(dstCell.acceptDrop(game.draggedTile)) {
			this.classList.add('accept-drop');
		}

		return false;
	}, false);
	el.addEventListener('dragover', function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		return false;
	}, false);
	el.addEventListener('dragleave', function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		this.classList.remove('accept-drop');
		return false;
	}, false);
	el.addEventListener('drop', function(e) {
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

Game.prototype.moveTile = function moveTile(el, dest) {
	/* Clear cell */
	while (dest.firstChild) {
		dest.removeChild(dest.firstChild);
	}
	dest.appendChild(el);
};

Game.prototype.randomMove = function randomMove() {
	var game = this;
	var grid = game.grid;
	var emptyCell = game.grid.getEmptyCell();

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
Cell.prototype.isLast = function isLast() {
	if(this.x + 1 == conf.rows && this.y + 1 == conf.cols) {
		return true;
	}
};
Cell.prototype.acceptDrop = function acceptDrop(tile) {
	var dstCell = this;
	var srcCell = tile.cell;

	if(dstCell.isAdjacentTo(srcCell) && dstCell.isEmpty()) {
		console.log('yep, can drop');
		return true;
	}
	console.log(dstCell.isAdjacentTo(srcCell));
	console.log(dstCell.isEmpty());
	console.log('nop, can\'t drop');
	return false;
};
Cell.prototype.isEmpty = function isEmpty() {
	if(!this.tile) {
		return true;
	}
	return false;
};
Cell.prototype.isAdjacentTo = function isAdjacentTo(otherCell) {
	var sameRow = this.y==otherCell.y;
	var sameCol = this.x==otherCell.x;
	if(sameRow && Math.abs(this.x-otherCell.x)==1
		|| sameCol && Math.abs(this.y-otherCell.y)==1) {
		return true;
	}
	return false;
};

Cell.prototype.getDomElement = function getDomElement() {
	var elt = document.getElementById('cell-'+this.x+'-'+this.y);
	return elt;
};
Cell.prototype.clear = function clear() {
	this.tile=null;
};
Cell.prototype.getRandomAdjacentCell = function getRandomAdjacentCell() {
	var max_x = conf.cols-1 ;
	var max_y = conf.rows-1 ;
	console.log(this.x,'/',max_x,':',this.y,'/',max_y);

	var availableCells = [];
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

	// return any of the available cells
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
Tile.prototype.getDomElement = function getDomElement() {
	return this.cell.getDomElement().firstChild;
};
Tile.prototype.moveTo = function moveTo(cell, skipSolutionDetection) {
	console.log('tile will be moved from ',this.cell);
	cell.getDomElement().appendChild(this.getDomElement());
	this.cell.clear();
	this.cell=cell;
	this.cell.tile=this;

	if(!skipSolutionDetection){
		game.detectGameSolved();
	}
	console.log('tile moved to',this.cell );
};


/* Returns a random integer between min and max */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*Start game*/
var game = new Game();
game.init();
var button = document.getElementById('shuffle-button');
button.addEventListener('click',function(){
	game.shuffle();
});