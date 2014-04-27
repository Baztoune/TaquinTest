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
