function Game(){
	this.grid = new Grid(conf.rows, conf.cols);
}
function Grid(rows, cols){
	this.cells = [];

	for (var i = 0; i < rows; i++) {
		var row = [];
		for (var j = 0; j < cols; j++) {
			var cell = new Cell(i, j);
			if(!cell.isLast()){
				// except last cell
				cell.tile = new Tile();
			}
			row.push(cell);
		}
		this.cells.push(row);
	}
}
function Cell(x, y){
	var tile;
	this.x = x;
	this.y = y;
}
function Tile(){
}

Game.prototype.init = function init(){
	this.updateView();
};

Game.prototype.detectGameEnd = function detectGameEnd() {
	alert('We have a winner here');
};

/*
 * Build the html from the JS model
 */
Game.prototype.updateView = function updateView(){
	var game = this;
	var cells = game.grid.cells;

	var grid = document.getElementById('grid');
	cells.forEach(function(col){
		var newRow = document.createElement('div');
		newRow.classList.add('row', 'clearfix');
		col.forEach(function(cell){
			/* Build cell */
			var newCell = document.createElement('div');
			newCell.classList.add('cell');
			newRow.appendChild(newCell);
			game.attachDragEventsOnDroppableElement(newCell);

			/* Build tile */
			if(cell.tile){
				var newTile = document.createElement('div');
				newTile.innerHTML = cell.x * 4 + cell.y + 1;
				newTile.classList.add('tile');
				newTile.id='tile-' + cell.x + '-' + cell.y;
				newTile.setAttribute('draggable', 'true');

				newCell.appendChild(newTile);

				game.attachDragEventsOnDraggableElement(newTile);
			}
		});
		grid.appendChild(newRow);
	});
}

Game.prototype.attachDragEventsOnDraggableElement = function attachDragEventsOnDraggableElement(el) {
	el.addEventListener('dragstart', function(e) {
		// pass the id, so we can get the element on drop
    	e.dataTransfer.setData('tileId', this.id);
	});
}

Game.prototype.attachDragEventsOnDroppableElement = function attachDragEventsOnDroppableElement(el) {
	var game = this; // cache before event handlers override it

	el.addEventListener('dragenter', function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		this.classList.add('over');
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
		this.classList.remove('over');
		return false;
	}, false);
	el.addEventListener('drop', function(e) {
	    if (event.preventDefault) {
	    	event.preventDefault();
	    }
		this.classList.remove('over');
		var tile = document.getElementById(e.dataTransfer.getData('tileId'));
		game.moveTile(tile,this);
		
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

Grid.prototype.getEmptyCell = function getEmptyCell() {
	var emptyCell;
	this.cells.forEach(function(col){
		col.forEach(function(cell){
			if(cell.isEmpty()){
				emptyCell = cell;
			}
		});
	});
	return emptyCell;
};

Cell.prototype.isLast = function isLast(){
	if(this.x + 1 == conf.rows && this.y + 1 == conf.cols){
		return true;
	}
};
Cell.prototype.isEmpty = function isEmpty(){
	if(!this.tile){
		return true;
	}
};
Cell.prototype.isAdjacentTo = function isAdjacentTo(otherCell){
	var sameRow = cell.y==otherCell.y;
	var sameCol = cell.x==otherCell.x;
	if(sameRow && Math.abs(cell.x-otherCell.x)==1
		|| sameCol && Math.abs(cell.y-otherCell.y)==1){
		return true;
	}
};

/* Anonymous init function */
(function () {
	var game = new Game();
	game.init();
})();