const activeGameDrawings = [];
const activeMobs = [];
const activeHandlers = [];
var imageData;
var player;
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
    //draw background
    addbackground(levelData["background"]);
    //draw blocks
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
                                //check player so they don't sink
                                if(player.x>=(x*64*x_factor)+x_translate && player.x<=((x+1)*64*x_factor)+x_translate){
                                    if(player.y>game_canvas.height-((y+2)*64*y_factor)+y_translate){
                                        player.y = game_canvas.height-((y+2)*64*y_factor)+y_translate;
                                        //check frameSequence and fix after a jump
                                        if(player.justjumped == false){
                                            if(player.jumps > 0){
                                                if(player.frameSequence[0] == [1]){
                                                    player.frameSequence = [0];
                                                }
                                                else{
                                                    player.frameSequence = [2]
                                                }
                                            }
                                            player.jumps = 0;
                                        }
                                        player.justjumped = false;
                                    }
                                }
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
    //create mobs
    Object.keys(levelData.mobs).forEach(element => {
        for(let i=0; i<levelData.mobs[element].x.length; i++){
            var mob = new Sprite(
                {
                    src : "assets/sprites/mobiles/"+assetData.mobs[element],
                    x : (levelData.mobs[element].x[i]*64*x_factor) + x_translate,
                    y : game_canvas.height - (levelData.mobs[element].y[i]+1)*64*y_factor + y_translate,
                    frameWidth : 32,
                    frameHeight : 32,
                    targetWidth : 64*x_factor,
                    targetHeight : 64*y_factor,
                    animate : true,
                    frameRate : 8,
                    update : function({stepTime}){
                        //make mob move
                        this.x += ((stepTime*this.velocity)/20)*x_factor;
                        if (this.x < (levelData.mobs[element].x[i]*64*x_factor) + x_translate - levelData.mobs[element].movement[i][0]*64*x_factor){
                            this.x = levelData.mobs[element].x[i]*64*x_factor + x_translate 
                                - levelData.mobs[element].movement[i][0]*64*x_factor;
                            this.velocity = this.velocity*(-1);
                            this.frameSequence = [3,4]
                        }
                        if (this.x > (levelData.mobs[element].x[i]*64*x_factor) + x_translate + levelData.mobs[element].movement[i][1]*64*x_factor){
                            this.x = levelData.mobs[element].x[i]*64*x_factor + x_translate
                                + levelData.mobs[element].movement[i][1]*64*x_factor;
                            this.velocity = this.velocity*(-1);
                            this.frameSequence = [1,2]; 
                        }
                        //check if user/mob is dead
                        if (player.x>=this.x && player.x<=3*(this.x+this.targetWidth)/4){
                            //if user is dead
                            if (player.y<=this.y && player.y>=this.y-this.targetHeight/2){
                                console.log("player dead");
                            }
                            //if mob is dead
                            else if (player.y<this.y-this.targetHeight/2 && player.y>=this.y-this.targetHeight){
                                if(this.dead == false){
                                    console.log("mob dead");
                                    this.dead = true;
                                    this.velocity = 0;
                                    this.frameSequence = [5];
                                    setTimeout(function(){
                                        game.removeDrawing(this.drawing_id);
                                        for(let i=0;i<activeGameDrawings.length;i++){
                                            if (this.drawing_id == activeGameDrawings[i]){
                                                activeGameDrawings.splice(i,1);
                                            }
                                        }
                                        for(let i=0;i<activeMobs.length;i++){
                                            if (this.drawing_id == activeMobs[i].drawing_id){
                                                activeMobs.splice(i,1);
                                            }
                                        }
                                    },100);
                                }
                            }
                        }
                    }
                }
            );
            mob.dead = false;
            if (levelData.mobs[element].movement[i][0]!=levelData.mobs[element].movement[i][1]){
                mob.velocity = -1;
                mob.frameSequence = [1,2];
            }
            else{
                mob.velocity = 0;
                mob.frameSequence = [0];
            }
            mob_drawing = game.addDrawing(mob);
            mob.drawing_id = mob_drawing;
            activeMobs.push(mob);
        }
    });
    //spawn coins
    for(let i=0; i<levelData.coins.x.length; i++){
        var coin = new Sprite(
            {
                src : "assets/misc/" + assetData.coins,
                x : levelData.coins.x[i]*64*x_factor + x_translate,
                y : game_canvas.height - (levelData.coins.y[i]+1)*64*y_factor + y_translate,
                frameWidth : 32,
                frameHeight : 32,
                targetWidth : 64*x_factor,
                targetHeight : 64*y_factor,
                animate : true,
                frameRate : 10,
                update : function(){
                    if(this.active == true){
                        if (player.x+this.targetWidth/2>=this.x && player.x+this.targetWidth/2<=this.x+this.targetWidth){
                            if (player.y-this.targetHeight/2<=this.y+this.targetHeight && player.y-this.targetHeight/2>=this.y){
                                this.active = false;
                                game.removeDrawing(this.drawing_id);
                                for(let i=0; i<activeGameDrawings.length; i++){
                                    if(activeGameDrawings[i]==this.drawing_id){
                                        activeGameDrawings.splice(i,1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        );
        coin.active = true;
        var coin_drawing = game.addDrawing(coin);
        coin.drawing_id = coin_drawing;
        activeGameDrawings.push(coin_drawing);
    }
    //create end
    var end = new Sprite(
        {
            src : "assets/misc/" + assetData.end,
            x : levelData.end.x*64*x_factor + x_translate,
            y : game_canvas.height - (levelData.end.y+1)*64*x_factor + y_translate,
            frameWidth : 32,
            frameHeight : 32,
            targetWidth : 64*x_factor,
            targetHeight : 64*y_factor,
            frameSequence : [0],
            update : function(){
                //check if user is at the end & end game
                if(player.x+this.targetWidth/2>=this.x && player.x+this.targetWidth/2<=this.x+this.targetWidth){
                    if(player.y+this.targetHeight/2<=this.y+this.targetHeight && player.y+this.targetHeight/2>=this.y){
                        this.frameSequence = [1];
                        //endgame
                    }
                }
            }
        }
    );
    var end_drawing = game.addDrawing(end);
    end.drawing_id = end_drawing;
    activeGameDrawings.push(end_drawing);
    //create player
    player = new Sprite(
        {
            src : "assets/sprites/user/" + user_sprite,
            x : levelData.spawn.x*64*x_factor,
            y : game_canvas.height - (levelData.spawn.y+1)*64*y_factor,
            frameWidth : 32,
            frameHeight : 32,
            targetWidth : 64*x_factor,
            targetHeight : 64*y_factor,
            frameSequence : [0],
            frameRate : 8,
            update : function({stepTime}){
                if(this.moved==false){
                    if(this.frameSequence.length > 1){
                        this.frameSequence.pop();
                    }
                }
                this.y += -(this.y_vel*64*y_factor)*(stepTime/1000);
                this.x += (this.x_vel*64*x_factor)*(stepTime/1000);
                this.y_vel = -5*64*y_factor*stepTime/1000;
                this.x_vel = 0;
                this.moved = false;
            }
        }    
    );
    player.jumps = 0;
    player.y_vel = 0;
    player.x_vel = 0;
    player.moved = false;
    player.coins = 0;
    var player_drawing = game.addDrawing(player);
    player.drawing_id = player_drawing;
    activeGameDrawings.push(player_drawing);
}

function addGameHandlers(){
    /*var jumpHandler = game.addHandler('keyup',
        function({event}){
            //jump
            if([' ','w','ArrowUp'].includes(event.key)){
                if(player.jumps < 2){
                    player.y_vel = 4*64*y_factor;
                    player.jumps += 1;
                    if (player.frameSequence[0] == 0){
                        player.frameSequence = [1]
                    }
                    else {
                        player.frameSequence = [3]
                    }
                }
                console.log('jump');
            }
        }
    );*/
    //activeHandlers.push(jumpHandler);
    var movementHandler = game.addHandler('keydown',
        function({event}){
            //move right
            if(['d','ArrowRight'].includes(event.key)){
                player.x_vel = 3;
                player.frameSequence = [0,1];
                player.moved = true;
            }
            //move left
            if(['a','ArrowLeft'].includes(event.key)){
                player.x_vel = -3;
                player.frameSequence = [2,3];
                player.moved = true;
            }
            //jump
            if([' ','w','ArrowUp'].includes(event.key)){
                if(player.jumps < 2){
                    player.y_vel = 4*64*y_factor;
                    player.jumps += 1;
                    player.justjumped = true;
                    if (player.frameSequence[0] == 0 || player.frameSequence[0] == 1){
                        player.frameSequence = [1];
                    }
                    else {
                        player.frameSequence = [3];
                    }
                }
                console.log('jump');
            }
        }
    );
}

function main_game(level=0,user_sprite='blue-person.png'){
    var levelData = levels[level];
    init_images();
    var level = level_constructor(levelData,user_sprite);
    addGameHandlers();
}

function menu(){
    game.addHandler("click",
        function({x,y}){
            console.log(x+","+y);
        }    
    );
    main_game();
}