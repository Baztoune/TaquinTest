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
