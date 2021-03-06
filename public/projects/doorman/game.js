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
                                var block_x = x*64*x_factor+x_translate;
                                var block_y = game_canvas.height-((y+1)*64*y_factor)+y_translate;
                                //properly draw blocks
                                ctx.drawImage(imageData[element],
                                    block_x, block_y,
                                    64*x_factor,64*y_factor
                                );
                                //check player so they don't sink
                                if(player.x+(x_factor*32)>=block_x && player.x+(x_factor*32)<=block_x+(64*x_factor)){
                                    if(player.y>block_y-(64*y_factor)){
                                        if(player.y<block_y){
                                            player.y = block_y-(64*y_factor);
                                            player.realy = block_y-(64*y_factor) - y_translate;
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
                                //detects if player collides with blocks so they don't ghost through the blocks
                                if(player.y>=block_y && player.y<=block_y+(64*y_factor)){
                                    if(player.x+64*x_factor>block_x && player.x+64*x_factor<block_x){
                                        player.x = block_x-64*x_factor;
                                    }
                                    if(player.x<block_x+64*x_factor && player.x>block_x){
                                        player.x = block_x+64*x_factor;
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
                                if(player.x >= (x*64*x_factor)+x_translate && player.x < ((x+1)*64*x_factor)+x_translate){
                                    if(player.y <= game_canvas.height-((y+1)*64*y_factor)+y_translate && player.y >= game_canvas.height-((y+2)*64*y_factor)+y_translate){
                                        if(player.dead == false){
                                            death();
                                        }
                                    }
                                }
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
                        if (player.x+(32*x_factor)>=this.x && player.x+(32*x_factor)<=this.x+this.targetWidth){
                            //if user is dead
                            if (player.y<=this.y && player.y>=this.y-this.targetHeight/2){
                                if(this.dead == false && player.dead == false){
                                    console.log("player dead");
                                    player.dead = true;
                                    death();
                                }
                            }
                            //if mob is dead
                            else if (player.y<this.y-this.targetHeight/2 && player.y>=this.y-this.targetHeight){
                                if(this.dead == false){
                                    console.log("mob dead");
                                    this.dead = true;
                                    this.velocity = 0;
                                    this.frameSequence = [5];
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
                                    this.update = function(){};
                                    this.animate = false;
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
            var mob_drawing = game.addDrawing(mob);
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
                frameSequence : [0,1],
                animate : true,
                frameRate : 10,
                update : function(){
                    this.x = levelData.coins.x[i]*64*x_factor + x_translate;
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
                                player.coins += 1;
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
            frameRate : 12,
            update : function({remove}){
                //check if user is at the end & end game
                this.x = levelData.end.x*64*x_factor + x_translate;
                if(end.complete == false){
                    if(player.x+this.targetWidth/2>=this.x && player.x+this.targetWidth/2<=this.x+this.targetWidth){
                        if(player.y+this.targetHeight/2<=this.y+this.targetHeight && player.y+this.targetHeight/2>=this.y){
                            this.frameSequence = [1];
                            levelComplete();
                            end.complete = true;
                            end.toggle();
                        }
                    }
                }
            }
        }
    );
    end.toggle = function(){
        end.update = function(){};
    };
    end.complete = false;
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
                if(this.y > game_canvas.height-(levelData.floor*64*y_factor)){
                    death();
                }
                if(this.moved==false){
                    if(this.frameSequence.length > 1){
                        this.frameSequence.pop();
                    }
                }
                this.realy += -(this.y_vel*64*y_factor)*(stepTime/1000);
                this.realx += (this.x_vel*64*x_factor)*(stepTime/1000);
                updateSidescrolling()
                this.y = this.realy + y_translate;
                this.x = this.realx + x_translate;
                this.y_vel = (-3*64*y_factor)*(stepTime/1000);
            }
        }    
    );
    player.realx = levelData.spawn.x*64*x_factor;
    player.realy = game_canvas.height - (levelData.spawn.y+1)*64*y_factor
    player.jumps = 0;
    player.y_vel = 0;
    player.x_vel = 0;
    player.moved = false;
    player.coins = 0;
    player.dead = false;
    var player_drawing = game.addDrawing(player);
    player.drawing_id = player_drawing;
    activeGameDrawings.push(player_drawing);
}

function addGameHandlers(){
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
    var EndMovementHandler = game.addHandler('keyup',
        function({event}){
            if(['d','ArrowRight','a','ArrowLeft'].includes(event.key)){
                player.moved = false;
                player.x_vel = 0;
            }
        }
    );
}

function updateSidescrolling(){
    /*if(player.realy < game_canvas.height - 6*64*y_factor){
        y_translate = player.realy - (game_canvas.height - 6*64*y_factor);
    }
    else{
        y_translate = 0;
    }
    */
    if(player.realx > 10*64*x_factor){
        x_translate = 10*64*x_factor - player.realx;
    }
    else{
        x_translate = 0;
    }
}

function endgameScoreboard(state){
    var frame = new Image();
    frame.src = "assets/menu/menu_frame.png";
    var message = new Image();
    if(state){
        message.src = "assets/menu/victory.png";
    }
    else{
        message.src = "assets/menu/dead.png";
    }
    var board;
    frame.onload = function(){
        board = game.addDrawing(
            function({ctx}){
              ctx.drawImage(frame,game_canvas.width/4,game_canvas.height/4,game_canvas.width/2,game_canvas.height/2);
              ctx.drawImage(message,game_canvas.width*(1/3),game_canvas.height*(2/5),game_canvas.width*(1/3),game_canvas.height*(1/3));  
            }
        );
    }
    return board;
}

function death(){
    player.update = function(){};
    player.dead = true;
    console.log("dead");
    var board = endgameScoreboard(false);
}

function levelComplete(){
    player.update = function(){};
    console.log("victory");
    var board = endgameScoreboard(true);
}

function main_game(level=0,user_sprite='blue-person.png'){
    var levelData = levels[level];
    init_images();
    var level = level_constructor(levelData,user_sprite);
    addGameHandlers();
}

function endLevel(){

}