const activeGameDrawings = [];

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

function addbackground(backgroundfile){
    var backgroundData = new Image;
    backgroundData.src = backgroundfile;
    background_ctx.drawImage(backgroundData,0,0,1280*x_factor,720*y_factor);
}

function level_constructor(levelData,user_sprite){
    addbackground(levelData["background"]);
    levelData["blocks"].foreach(
        function(item){
        }
    );
}

function main_game(level=0,user_sprite='blue-person.png'){
    var levelData = levels[level];
    var level = level_constructor(levelData,user_sprite);
}

function menu(){
    main_game();
}