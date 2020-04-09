const activeGameDrawings = [];
const activeMobs = [];
const imageData = {}
var x_translate = 0;
var y_translate = 0;

const assetData = {
    user:"sprites/",
    blocks:{
        "dirt":"dirt.png",
        "grass":"grass.png",
        "red-brick":"red-brick.png",
        "traps":{
            "spikes":"spike.png"
        }
    },
    mobs:{
        "krunk":"krunk.png"
    },
    coins:"coin.png",
    end:"end.png"
}

function init_images(){
    //will load image data
}

function addbackground(backgroundfile){
    var backgroundData = new Image();
    backgroundData.src = backgroundfile;
    backgroundData.onload = () => background_ctx.drawImage(backgroundData,0,0,1280*x_factor,720*y_factor);
}

function level_constructor(levelData,user_sprite){
    addbackground(levelData["background"]);
    Object.keys(levelData.blocks).forEach(element => {//i got this from stack overflow: https://stackoverflow.com/questions/8312459/iterate-through-object-properties
        for(let i=0; i<levelData.blocks[element].x.length;i++){//iterates through each block object
            const x_range = levelData.blocks[element].x[i];
            const y_range = levelData.blocks[element].y[i];
            for(let x=x_range[0];x<(x_range[1]+1);x++){//iterates through the ranges and draws blocks
                for(let y=y_range[0];y<(y_range[1]+1);y++){
                    var drawing = game.addDrawing(
                        function({ctx}){
                            //draw proper image
                        }
                    );
                }
            }
        }
    });
}

function main_game(level=0,user_sprite='blue-person.png'){
    var levelData = levels[level];
    init_images();
    var level = level_constructor(levelData,user_sprite);
}

function menu(){
    game.addHandler("click",
        function({x,y}){
            console.log(x+","+y);
        }    
    );
    main_game();
}