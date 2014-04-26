function Game(){
}

Game.prototype.init = function init(){
	this.buildGrid(conf.grid.rows, conf.grid.cols);
	this.findEmptyCell();
};

Game.prototype.buildGrid = function buildGrid(rows, cols) {
	var grid = document.getElementById('grid');
	for (var i = 0; i < rows; i++) {
		var newRow = document.createElement('div');
		newRow.classList.add('row', 'clearfix');
		for (var j = 0; j < cols; j++) {
			/* Build cell */
			var newCell = document.createElement('div');
			newCell.classList.add('cell');
			newRow.appendChild(newCell);
			this.attachDragEventsOnDroppableElement(newCell);

			/* Build tile */
			if(i!=rows-1 || j!=cols-1){
				// except last cell
				var newTile = document.createElement('div');
				newTile.innerHTML = i * 4 + j + 1;
				newTile.classList.add('tile');
				newTile.id='tile-' + i + '-' + j;
				newTile.setAttribute('draggable', 'true');

				newCell.appendChild(newTile);

				this.attachDragEventsOnDraggableElement(newTile);
			}
		}
		grid.appendChild(newRow);
	}
};

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
		console.log(this);
		if(this.classList.contains('accept-drop')){
			game.moveTile(tile,this);
			game.findEmptyCell(); // trigger the empty cell detection
		}
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

Game.prototype.findEmptyCell = function findEmptyCell() {
	var cells = document.getElementsByClassName('cell');	
	for (var i = 0, len = cells.length; i < len; i++) {
		cells[i].classList.remove('accept-drop');
		if(!cells[i].firstChild){
			//empty cell, can accept drop
			cells[i].classList.add('accept-drop');
		}
	}
};

Game.prototype.detectGameEnd = function detectGameEnd() {
	alert('We have a winner here');
}

/* Anonymous init function */
(function () {
	var game = new Game();
	game.init();
})();