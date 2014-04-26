function buildGrid(rows, cols) {
	var grid = document.getElementById('grid');
	for (var i = 0; i < rows; i++) {
		var newRow = document.createElement('div');
		newRow.classList.add('row', 'clearfix');
		for (var j = 0; j < cols; j++) {
			/* Build cell */
			var newCell = document.createElement('div');
			newCell.classList.add('cell');
			newRow.appendChild(newCell);
			attachDragEventsOnDroppableElement(newCell);

			/* Build tile */
			if(i!=rows-1 || j!=cols-1){
				// except last cell
				var newTile = document.createElement('div');
				newTile.innerHTML = i * 4 + j + 1;
				newTile.classList.add('tile');
				newTile.id='tile-' + i + '-' + j;
				newTile.setAttribute('draggable', 'true');

				newCell.appendChild(newTile);

				attachDragEventsOnDraggableElement(newTile);
			}
		}
		grid.appendChild(newRow);
	}
};

function attachDragEventsOnDraggableElement(el) {
	el.addEventListener('dragstart', function(e) {
    	e.dataTransfer.setData('tileId', this.id);
	});
}

function attachDragEventsOnDroppableElement(el) {
	el.addEventListener('dragenter', function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		this.classList.add('over');
	});
	el.addEventListener('dragover', function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		this.classList.add('over');
	});
	el.addEventListener('dragleave', function(e) {
		this.classList.remove('over');
	});
	el.addEventListener('drop', function(e) {
		this.classList.remove('over');
		console.log(this);
		var tile = document.getElementById(e.dataTransfer.getData('tileId'));
		moveTile(tile,this);
	});
};

function moveTile(el, dest) {
	console.log(el);
	console.log(dest);

	/* Clear cell */
	while (dest.firstChild) {
		dest.removeChild(dest.firstChild);
	}
	dest.appendChild(el);
};

function findDraggableElement() {
	var cells = document.getElementsByClassName('cell');	
	for (var i = 0, len = cells.length; i < len; i++) {
		if(!cells[i].firstChild){
			//empty
			console.log('cell empty', cells[i]);
		}
	}
};

/* Anonymous init function */
(function () {
	buildGrid(conf.grid.rows, conf.grid.cols);
	findDraggableElement();
})();