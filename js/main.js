
function buildGrid(width, height){
	var grid = document.getElementById('grid');
	for(var i = 0; i < width; i++){
		var newRow = document.createElement('div');
	    newRow.setAttribute('class','row clearfix');
		for(var j = 0; j < height; j++){
	    	var newCell = document.createElement('div');
	    	newCell.setAttribute('class','cell');
	    	newCell.innerHTML = i*4 + j + 1;
	    	newRow.appendChild(newCell);
	    }
		grid.appendChild(newRow);
	}
};


buildGrid(conf.grid.width, conf.grid.height);