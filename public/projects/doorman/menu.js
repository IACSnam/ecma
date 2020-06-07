const active_buttons = [];

function menu(){
    //draw background
    var background_drawing = new Image();
    background_drawing.src = "assets/backgrounds/sky-background.png";
    background_drawing.onload = function(){
        background_ctx.drawImage(background_drawing,0,0,1280*x_factor,720*y_factor);
        //menu frame
        var menu_frame = new Image();
        menu_frame.src = "assets/menu/menu_frame.png";
        menu_frame.onload = () => background_ctx.drawImage(menu_frame,
            background_canvas.width/5,background_canvas.height/5,.6*background_canvas.width,.6*background_canvas.height);
    }
    //make buttons
    menu_buttons();
}

function menu_buttons(){
    const things = ["New game","Continue","Level select","Instructions","Credits"];
    const actions = {
        "New game" : {
            "img" : "newgameText.png",
            "action" : function(){
                clear();
                main_game();
            }
        },
        "Continue" : {
            "img" : "continueText.png",
            "action" : function(){
                clear();
                continue_game();
            }
        },
        "Level select" : {
            "img" : "levelselectText.png",
            "action" : function(){
                menu_clear();
                level_select();
            }
        },
        "Instructions" : {
            "img" : "instructionsText.png",
            "action" : function(){
                menu_clear();
                display_instructions();
            }
        },
        "Credits" : {
            "img" : "creditsText.png",
            "action" : function(){
                menu_clear(),
                display_credits();
            }
        }
    }
    for(let i = 0; i<things.length; i++){
        var name = things[i];
        var button = new Sprite(
            {
                src : "assets/menu/" + actions[name]["img"],
                x : game_canvas.width/2 - 78*x_factor,
                y : (250 + i*50)*y_factor,
                frameWidth : 136,
                frameHeight : 40,
                targetWidth : 136*x_factor,
                targetHeight : 40*y_factor,
                frameSequence : [0],
                frameRate : 8,
            }
        );
        button.name = name;
        var onclick = game.addHandler("click",
            function({x,y}){
                if(x>button.x && x<button.x+button.targetWidth){
                    if(y>button.y && y<button.y+button.targetHeight){
                        actions[button.name].action();
                        console.log("click "+button.name);
                    }
                }
            }
        );
        button.onclick = onclick;
        var onhover = game.addHandler("mousemove",
            function({x,y}){
                if(x>button.x && x<button.x+button.targetWidth){
                    if(y>button.y && y<button.y+button.targetHeight){
                        button.frameSequence = [1];
                    }
                }
                else{
                    button.frameSequence = [0];
                }
            }
        );
        button.onhover = onhover;
        var drawing = game.addDrawing(button);
        button.drawing = drawing;
        active_buttons.push(button);
    }
}

function clear(){

}

function menu_clear(){

}

function continue_game(){

}

function level_select(){

}

function display_instructions(){

}

function display_credits(){

}