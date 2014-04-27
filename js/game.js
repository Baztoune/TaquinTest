/*
 * Game object
 */
function Game() {
	this.grid = new Grid(conf.rows, conf.cols);
	var draggedTile = null;

	this.init();
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

/* Play a random youtube video from the "videos" list provided in conf */
Game.prototype.playRandomVideo = function playRandomVideo(){
	var index = getRandomInt(0,conf.videos.length-1);

	/* Build youtube player */
	var ytContainer = document.getElementById('youtubePlayerContainer');
	var ytPlayer = document.createElement('iframe');
	var ytVideoId = conf.videos[index].split('?v=')[1]; // get the video id
	ytPlayer.setAttribute('allowfullscreen', true);
	ytPlayer.setAttribute('frameborder', 0);
	ytPlayer.setAttribute('width', 500);
	ytPlayer.setAttribute('height', 300);
	ytPlayer.src='http://www.youtube.com/embed/'+ytVideoId+'?html5=1&autohide=1';

	ytContainer.appendChild(ytPlayer);

	/* Show modal */
	document.getElementsByClassName('modal')[0].style.display='block';
	document.getElementsByClassName('overlay')[0].style.display='block';
	document.getElementsByClassName('overlay')[0].addEventListener('click', this.closeVideo);
};

/* Destroy the player and hide the modal */
Game.prototype.closeVideo = function closeVideo(){
	/* Destroy youtube player*/
	document.getElementById('youtubePlayerContainer').innerHTML = ''; // clear

	/* Hide modal*/
	document.getElementsByClassName('modal')[0].style.display='none';
	document.getElementsByClassName('overlay')[0].style.display='none';
};

/* Opens a random page from the "pages" list provided in conf */
Game.prototype.openRandomPage = function openRandomPage(){
	var index = getRandomInt(0,conf.pages.length-1);
	window.open(conf.pages[index],'_blank');
};
