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

	var container = document.getElementById('grid-container');
	var containerStyle = 'width:' + conf.cols * conf.cellWidth + 'px;';
	container.setAttribute('style',containerStyle);

	var newGrid = document.getElementById('grid');
	cells.forEach(function(col) {
		var newRow = document.createElement('div');
		newRow.classList.add('row', 'clearfix');
		col.forEach(function(cell) {
			/* Build cell */
			var cellStyle = '';
				cellStyle += 'width:'+conf.cellWidth+'px;';
				cellStyle += 'height:'+conf.cellHeight+'px';
			var newCell = document.createElement('div');
			newCell.classList.add('cell');
			newCell.setAttribute('style',cellStyle);
			newCell.id='cell-' + cell.x + '-' + cell.y;
			newCell.cellObject=cell;
			newRow.appendChild(newCell);

			/* Build tile */
			if(cell.tile) {
				var tileStyle = '';
					tileStyle += 'background: url('+conf.imgSrc+') ';
					tileStyle += 'no-repeat -'+conf.cellWidth*cell.y+'px -'+conf.cellHeight*cell.x+'px;';

				var newTile = document.createElement('div');
				newTile.classList.add('tile');
				newTile.setAttribute('style',tileStyle);
				newTile.id='tile-' + cell.x + '-' + cell.y;
				newTile.setAttribute('draggable', 'true');
				newTile.tileObject=cell.tile;

				newCell.appendChild(newTile);
			}
		});
		newGrid.appendChild(newRow);
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
