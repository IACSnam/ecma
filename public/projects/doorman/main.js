const game_canvas = document.getElementById('game');
const background_canvas = document.getElementById('background');

//sizing canvases
game_canvas.height = window.innerHeight*.95;
game_canvas.width = game_canvas.height*(1280/720)
background_canvas.height = game_canvas.height;
background_canvas.width = game_canvas.width;
var x_factor = game_canvas.width/1280;
var y_factor = game_canvas.height/720;

const levels = [];
//loads level data
function level_loader(){
    const level_list = [level0];
    level_list.forEach(
        function(item){
            levels.push(item);
        }
    );
}

function run(){
    //load level data
    level_loader();
    //initialize gamecanvas object
    game = GameCanvas('game');
    //get context for other canvas
    background_ctx = background_canvas.getContext("2d");
    //start drawing etc
    game.run();
    menu();
    clicktest();
}

//start
run();

//Testing stuff
function clicktest(){
    game.addHandler("click",
        function({x,y}){
            console.log("x:"+x+", y:"+y);
        }
    );
}

function instructions_page(){
    open("./instructions");
}

function about_page(){
    open("./about");
}