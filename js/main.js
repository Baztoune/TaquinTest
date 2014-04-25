
function buildGrid(rows, cols){
	var grid = document.getElementById('grid');
	for(var i = 0; i < rows; i++){
		var newRow = document.createElement('div');
	    newRow.setAttribute('class','row clearfix');
		for(var j = 0; j < cols; j++){
	    	var newCell = document.createElement('div');
	    	newCell.setAttribute('class','cell cell-' + i + '-' + j);
	    	newCell.innerHTML = i*4 + j + 1;
	    	newRow.appendChild(newCell);
	    }
		grid.appendChild(newRow);
	}
};


buildGrid(conf.grid.rows, conf.grid.cols);