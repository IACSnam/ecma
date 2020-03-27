var canvas = document.getElementById('game');
canvas.height = window.innerHeight*.95;
canvas.width = canvas.height*(1280/720)
var x_factor = canvas.width/1280;
var y_factor = canvas.height/720;

const ctx = canvas.getContext('2d');

function main_menu(){
    //background
    var background = new Image(); background.src = 'menu_background.png';
    ctx.drawImage(background,0,0,canvas.width,canvas.height);
    //menu
    var menu_template = new Image(); menu_template.src = 'menu_frame.png';
    ctx.drawImage(menu_template,canvas.width/3,canvas.height/4,canvas.width/3,canvas.height/2);
    //menu header
    //menu buttons
}

main_menu();

game = GameCanvas('game');
game.addDrawing(
    function({ctx}){
        var background = new Image(); background.src = 'menu_background.png';
        ctx.drawImage(background,0,0,canvas.width,canvas.height);
    }
);
game.run();