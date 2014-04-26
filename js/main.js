/*
 * Game object
 */
function Game() {
	this.grid = new Grid(conf.rows, conf.cols);
	var draggedTile = null;
}


Game.prototype.init = function init() {
	console.debug('starting the game');
	this.buildView();
};

Game.prototype.shuffle = function shuffle() {
	
};

Game.prototype.detectGameSolved = function detectGameEnd() {
	var game = this;

	game.grid.cells.forEach(function(row){
		row.forEach(function(cell){
			if(cell.tile){
				// if the cell has a tile
				if(cell.x!=cell.tile.x || cell.y!=cell.tile.y){
					// is it the good one? if not, quit
					return;
				}
			}
		});
	});

	alert('We have a winner here!');
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
				newTile.innerHTML = cell.x * 4 + cell.y + 1;
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
    	e.dataTransfer.setData('tileId', this.id);
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

/*
 * Grid object
 */
function Grid(rows, cols) {
	this.cells = [];

	for (var i = 0; i < rows; i++) {
		var row = [];
		for (var j = 0; j < cols; j++) {
			var cell = new Cell(i, j);
			if(!cell.isLast()) {
				// except last cell
				cell.tile = new Tile(cell);
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
		console.debug('yep, can drop');
		return true;
	}
	console.debug(dstCell.isAdjacentTo(srcCell));
	console.debug(dstCell.isEmpty());
	console.debug('nop, can\'t drop');
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


/*
 * Tile object
 */
function Tile(cell) {
	this.cell = cell;
}
Tile.prototype.getDomElement = function getDomElement() {
	return this.cell.getDomElement().firstChild;
};
Tile.prototype.moveTo = function moveTo(cell) {
	console.debug('tile will be moved from ',this.cell);
	cell.getDomElement().appendChild(this.getDomElement());
	this.cell.clear();
	this.cell=cell;
	this.cell.tile=this;

	console.debug('tile moved to',this.cell );
};

/* Anonymous init function */
(function () {
	var game = new Game();
	game.init();
})();