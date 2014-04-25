function buildGrid(rows, cols) {
	var grid = document.getElementById('grid');
	for (var i = 0; i < rows; i++) {
		var newRow = document.createElement('div');
		newRow.setAttribute('class', 'row clearfix');
		for (var j = 0; j < cols; j++) {
			var newCell = document.createElement('div');
			newCell.classList.add('cell');

			var newTile = document.createElement('div');
			newTile.innerHTML = i * 4 + j + 1;
			newTile.classList.add('tile', 'tile-' + i + '-' + j);
			newTile.setAttribute('draggable', 'true');

			newCell.appendChild(newTile);
			newRow.appendChild(newCell);

			newCell.addEventListener('dragover', function(e) {
				this.classList.add('over');
			});
			newCell.addEventListener('dragleave', function(e) {
				this.classList.remove('over');
				console.log(this);
			});
			newCell.addEventListener('drop', function(e) {
				this.classList.remove('over');
				console.log(this);
			});
		}
		grid.appendChild(newRow);
	}
};


buildGrid(conf.grid.rows, conf.grid.cols);