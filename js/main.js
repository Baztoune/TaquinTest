var game;

/* Returns a random integer between min and max */
var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

(function(){
	/*Start game*/
	game = new Game();

	var playButton = document.getElementById('play-button');
	playButton.addEventListener('click',function(){
		game.playerName = document.getElementById('player-name').value;
		game.init();
	});

	var shuffleButton = document.getElementById('shuffle-button');
	shuffleButton.addEventListener('click',function(){
		game.shuffle();
	});
})();
