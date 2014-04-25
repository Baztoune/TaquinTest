var conf = {
	grid : {
		width : 4,
		height : 4
	}
};

function buildGrid(width, height){
	var grid = document.getElementById('grid');
	for(var i = 0; i < width; i++){
		var newRow = document.createElement('div');
	    newRow.setAttribute('class','row');
		for(var j = 0; j < height; j++){
	    	var newCell = document.createElement('div');
	    	newCell.setAttribute('class','cell');
	    	newRow.appendChild(newCell);
	    }
		grid.appendChild(newRow);
	}
};


buildGrid(conf.grid.width, conf.grid.height);