var game;

/* Returns a random integer between min and max */
var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

(function(){
	/*Start game*/
	game = new Game();

	var button = document.getElementById('shuffle-button');
	button.addEventListener('click',function(){
		game.shuffle();
	});
})();
