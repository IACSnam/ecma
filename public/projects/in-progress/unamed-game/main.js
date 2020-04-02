var game_canvas = document.getElementById('game');
var background_canvas = document.getElementById('background');

game_canvas.height = window.innerHeight*.95;
game_canvas.width = game_canvas.height*(1280/720)
background_canvas.height = game_canvas.height;
background_canvas.width = game_canvas.width;
var x_factor = game_canvas.width/1280;
var y_factor = game_canvas.height/720;


