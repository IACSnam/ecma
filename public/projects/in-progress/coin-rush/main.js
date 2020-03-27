var canvas = document.getElementById('game');
canvas.height = window.innerHeight*.95;
canvas.width = canvas.height*(1280/720)
var x_factor = canvas.width/1280;
var y_factor = canvas.height/720;

game = GameCanvas('game');
const ctx = canvas.getContext('2d');

function main_menu(){
    //background
    var background = new Image(); background.src = 'menu_background.png';
    ctx.drawImage(background,0,0,canvas.width,canvas.height);
    //menu
}

main_menu()