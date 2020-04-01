var canvas = document.getElementById('game');
canvas.height = window.innerHeight*.95;
canvas.width = canvas.height*(1280/720)
var x_factor = canvas.width/1280;
var y_factor = canvas.height/720;

const ctx = canvas.getContext('2d');

