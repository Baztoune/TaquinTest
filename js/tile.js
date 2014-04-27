/*
 * Tile object
 */
function Tile(x,y) {
	this.x=x;
	this.y=y;
	var cell;
}

/* Get the DOM element binded to this tile object */
Tile.prototype.getDomElement = function getDomElement() {
	return this.cell.getDomElement().firstChild;
};

/* Move the tile DOM element to its destination. Update the model */
Tile.prototype.moveTo = function moveTo(cell, skipSolutionDetection) {
	cell.getDomElement().appendChild(this.getDomElement());
	this.cell.clear();
	this.cell=cell;
	this.cell.tile=this;

	if(!skipSolutionDetection){
		// we skip the detection when we shuffle the grid
		game.detectGameSolved();
	}
};

/* Attach the dragdrop events to the DOM element of the tile */
Tile.prototype.attachDragDropEvents = function attachDragDropEvents() {
	var elt = this.getDomElement();

	elt.addEventListener('dragstart', function(e) {
		// pass the id, so we can get the element on drop
    	e.dataTransfer.setData('Text', this.id);
    	game.draggedTile = this.tileObject;
	}, false);

	elt.addEventListener('dragenter', function(e) {
		// prevent event from propagating (otherwise dragenter target is the tile)
		e.stopPropagation();
	}, false);

	elt.addEventListener('selectstart', function(e){
		// Awesome fix for IE9 
		// http://stackoverflow.com/questions/5500615/internet-explorer-9-drag-and-drop-dnd#comment11341167_8986075
		this.dragDrop(); 
		return false;
	}, false);

	elt.addEventListener('dblclick', function(e) {
		// half of the time, we open a link or a video
		if(getRandomInt(0,100)%2){
			// open youtube popin
			console.log('opening video Pop-in');
			game.playRandomVideo();
		} else {
			// open link in new tab
			console.log('opening website in new tab');
			game.openRandomPage();
		}
	}, false);
};
