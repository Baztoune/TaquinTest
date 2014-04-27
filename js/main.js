var game;

(function(){
	/*Start game*/
	game = new Game();
	game.init();
	var button = document.getElementById('shuffle-button');
	button.addEventListener('click',function(){
		game.shuffle();
	});
})();

/* Returns a random integer between min and max */
var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Play a random youtube video from the "videos" list provided in conf */
var playRandomVideo = function(){
	var index = getRandomInt(0,conf.videos.length-1);

	/* Build youtube player */
	var ytContainer = document.getElementById('youtubePlayerContainer');
	var ytPlayer = document.createElement('iframe');
	var ytVideoId = conf.videos[index].split('?v=')[1]; // get the video id
	ytPlayer.setAttribute('allowfullscreen', true);
	ytPlayer.setAttribute('frameborder', 0);
	ytPlayer.setAttribute('width', 500);
	ytPlayer.setAttribute('height', 300);
	ytPlayer.src='http://www.youtube.com/embed/'+ytVideoId+'?html5=1&autohide=1';

	ytContainer.appendChild(ytPlayer);

	/* Show modal */
	document.getElementsByClassName('modal')[0].style.display='block';
	document.getElementsByClassName('overlay')[0].style.display='block';
	document.getElementsByClassName('overlay')[0].addEventListener('click', closeVideo);
};

/* Destroy the player and hide the modal */
var closeVideo = function(){
	/* Destroy youtube player*/
	document.getElementById('youtubePlayerContainer').innerHTML = ''; // clear

	/* Hide modal*/
	document.getElementsByClassName('modal')[0].style.display='none';
	document.getElementsByClassName('overlay')[0].style.display='none';
};

/* Opens a random page from the "pages" list provided in conf */
var openRandomPage = function(){
	var index = getRandomInt(0,conf.pages.length-1);
	window.open(conf.pages[index],'_blank');
}
