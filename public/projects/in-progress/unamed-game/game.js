const activeGameDrawings = [];

const assetData = {
    user:"sprites/",
    blocks:{
        "dirt":"dirt.png",
        "grass":"grass.png",
        "red-brick":"red-brick.png",
        "traps":{
            "spikes":""
        }
    },
    mobs:{
    },
    coins:"",
    end:""
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

function get_levelData(level){
    const levelFilename = "leveldata/level"+String(level)+".js";
    
    return levelData;
}

function main_game(level=0,user_sprite='blue-person.png'){
    var levelData = get_levelData(level);
    var level = level_constructor(levelData,user_sprite);
}

//only for testing
main_game();