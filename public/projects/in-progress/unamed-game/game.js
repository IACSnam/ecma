const activeGameDrawings = [];
const activeMobs = [];
var imageData;
var x_translate = 0;
var y_translate = 0;

const assetData = {
    user:"sprites/",
    blocks:{
        "dirt":"dirt.png",
        "grass":"grass.png",
        "redbrick":"red-brick.png",
        "spikes":"spike.png"
    },
    mobs:{
        "krunk":"krunk.png"
    },
    coins:"coin.png",
    end:"end.png"
}

function init_images(){
    //will load image data
    var dirt_image = new Image();
    dirt_image.src = "assets/blocks/"+assetData.blocks.dirt;
    var grass_image = new Image();
    grass_image.src = "assets/blocks/"+assetData.blocks.grass;
    var redbrick_image = new Image();
    redbrick_image.src = "assets/blocks/"+assetData.blocks.redbrick;
    var spike_image = new Image();
    spike_image.src = "assets/blocks/"+assetData.blocks.spikes;
    imageData = {
        "dirt" : dirt_image,
        "grass" : grass_image,
        "redbrick" : redbrick_image,
        "spikes" : spike_image
    }
}

function addbackground(backgroundfile){
    var backgroundData = new Image();
    backgroundData.src = backgroundfile;
    backgroundData.onload = () => background_ctx.drawImage(backgroundData,0,0,1280*x_factor,720*y_factor);
}

function level_constructor(levelData,user_sprite){
    addbackground(levelData["background"]);
    Object.keys(levelData.blocks).forEach(element => {//i got this from stack overflow: https://stackoverflow.com/questions/8312459/iterate-through-object-properties
        for(let i=0; i<levelData.blocks[element].x.length; i++){//iterates through each block object
            const x_range = levelData.blocks[element].x[i];
            const y_range = levelData.blocks[element].y[i];
            for(let x=x_range[0];x<(x_range[1]+1);x++){//iterates through the ranges and draws blocks
                for(let y=y_range[0];y<(y_range[1]+1);y++){
                    if(!levelData.blocks[element].lethal){
                        var drawing = game.addDrawing(
                            function({ctx}){
                                //properly draw blocks
                                ctx.drawImage(imageData[element],
                                    (x*64*x_factor)+x_translate,
                                    game_canvas.height-((y+1)*64*y_factor)+y_translate,
                                    64*x_factor,64*y_factor
                                );
                            }
                        )
                    }
                    else{
                        var drawing = game.addDrawing(
                            function({ctx}){
                                //properly draw block
                                ctx.drawImage(imageData[element],
                                    (x*64*x_factor)+x_translate,
                                    game_canvas.height-((y+1)*64*y_factor)+y_translate,
                                    64*x_factor,64*y_factor
                                );
                                //check if user has stepped on trap
                            }  
                        ); 
                    }
                    activeGameDrawings.push(drawing);
                }
            }
        }
    });
    Object.keys(levelData.mobs).forEach(element => {
        for(let i=0; i<levelData.mobs[element].x.length; i++){
            var mob = new Enemy(
                {
                    src : "assets/sprites/mobiles/"+assetData.mobs[element],
                    x : (levelData.mobs[element].x[i]*64*x_factor) + x_translate,
                    y : game_canvas.height - (levelData.mobs[element].y[i]+1)*64*y_factor + y_translate,
                    frameWidth : 32,
                    frameHeight : 32,
                    targetWidth : 64*x_factor,
                    targetHeight : 64*y_factor,
                    animate : true,
                    frameRate : 10,
                    update : function({stepTime}){
                        //make mob move
                        this.x = this.x + ((stepTime*this.velocity)/100)*x_factor;
                        if (this.x < levelData.mobs[element].movement[i][0]){
                            this.x = levelData.mobs[element].x[i]*64*x_factor + x_translate 
                                - levelData.mobs[element].movement[i][0]*64*x_factor;
                            this.velocity = this.velocity*(-1);
                            this.frameSequence = [3,4]
                        }
                        if (this.x > levelData.mobs[element].movement[i][1]){
                            this.x = levelData.mobs[element].x[i]*64*x_factor + x_translate
                                + levelData.mobs[element].x[i]*64*x_factor;
                            this.velocity = this.velocity*(-1);
                            this.frameSequence = [1,2]; 
                        }
                        //check if user is dead or mob is dead
                    }
                }
            );
            if (levelData.mobs[element].movement[i][0]!=levelData.mobs[element].movement[i][1]){
                mob.velocity = -1;
                mob.frameSequence = [1,2];
            }
            else{
                mob.frameSequence = [0];
            }
            activeMobs.push(mob);
            mob_drawing = game.addDrawing(mob);
            mob.drawing_id = mob_drawing;
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