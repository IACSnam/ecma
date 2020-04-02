function level_constructor(levelData){

}

function get_levelData(level){
    const levelFilename = "leveldata/level"+level+".json";
    const levelFile = open(levelFilename);
    var levelData = JSON.parse();
    levelFile.close();
    return levelData;
}

function main_game(level=0){
    var levelData = get_levelData(level);
}