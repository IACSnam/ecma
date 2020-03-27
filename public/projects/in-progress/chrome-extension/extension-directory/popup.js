'use strict';

game = GameCanvas('game');
var key_input

const board = [
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0]
]

const colors = ['white','red','yellow']

function background(ctx){
  ctx.fillStyle = 'blue';
  ctx.fillRect(25,100,350,300);
}

function drawboard(ctx,thing){
  for (let x=0;x<thing.length;x++){
    for (let y=0;y<thing[x].length;y++){
      var dot = thing[x][y];
      var color = colors[dot];
      ctx.fillStyle = color;
      var dot_x = 50*(x+1);
      var dot_y = 425-(50*(y+1));
      ctx.beginPath();
      ctx.arc(dot_x,dot_y,20,0,2*Math.PI);
      ctx.fill();
      }
  }
}
game.addDrawing(
  function({ctx}){
    background(ctx);
    drawboard(ctx,board);
    drawboard(ctx,gameboard);
  }
);

var gameboard = [
  [],
  [],
  [],
  [],
  [],
  [],
  []
]

var show_player = game.addDrawing(
  function({ctx}){
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Player '+player+"'s turn ("+colors[player]+")",10,50);
  }
);

function endgame(user){
  console.log(user," wins");
  game.removeDrawing(show_player);
  game.removeHandler('keyup',key_input);
  var scoreboard = game.addDrawing(
    function({ctx}){
      ctx.fillStyle = 'black'; ctx.font = '16px serif'; ctx.textAlign = 'left'; ctx.fillText("Player "+user+" ("+colors[user]+")"+" wins!",10,50);
    }
  );
  var restart_button = game.addDrawing(
    function({ctx}){
      ctx.fillStyle = 'blue'; ctx.fillRect(250,20,100,50);
      ctx.fillStyle = 'white'; ctx.font = '18px serif'; ctx.textAlign = 'center'; ctx.fillText("Restart",300,50);
    }
  );
  var restart_handler = game.addHandler('click',
    function({x,y}){
      if(x>249 && x<351){
        if(y>19 && y<71){
          game.removeDrawing(restart_button); game.removeDrawing(scoreboard);
          game.removeHandler('click',restart_handler);
          game.restoreDrawing(show_player);
          key_input = game.addHandler('keyup',
                            function({event}){
              if(['1','2','3','4','5','6','7'].includes(event.key)){
                var column = Number(event.key);
                main(player,column-1);
              }           
            }
          );
          gameboard = [[],[],[],[],[],[],[]];
          player = 1;
        }
      }
    }
  );
}

var player = 1
function main(user,input){
  if(gameboard[input].length == board[input].length){
    return;
  }
  gameboard[input].push(user);
  if(player==1){player=2;}
  else{player=1;}
  win_check = check(user);
  if(win_check==true){endgame(user);}
}

function check(user){
  //check vertical
  for(let x=0;x<gameboard.length;x++){
    var yes = 0;
    for(let y=0;y<gameboard[x].length;y++){
      if(gameboard[x][y]==user){yes++;}
      else{yes=0;}
      if(yes==4){return true;}
      }
  }
  //check horizontal
  for(let y=0;y<6;y++){
    var yes = 0;
    for(let x=0;x<gameboard.length;x++){
      if(gameboard[x][y]==user){yes++;}
      else{yes=0;}
      if(yes==4){return true;}
    }
  }
  //check diagonal(L->R)
  for(let x=0;x<gameboard.length;x++){
    for(let y=0;y<7;y++){
      var yes = 0;
      var cy = y;
      for(let cx=x;cx<gameboard.length;cx++){
        if(gameboard[cx][cy]==user){yes++;}
        else{yes=0;}
        if(yes==4){return true;}
        cy++;
      }
    }
  }
  //check diagonal(R->L)
  for(let y=5;y>2;y+=-1){
    for(let x=0;x<gameboard.length;x++){
      var yes = 0;
      var cy = y;
      for(let cx=x;cx<gameboard.length;cx++){
        if(gameboard[cx][cy]==user){yes++;}
        else{yes=0;}
        if(yes==4){return true;}
        cy += -1
      }
    }
  }
  return false;
}

key_input = game.addHandler('keyup',
  function({event}){
    if(['1','2','3','4','5','6','7'].includes(event.key)){
      var column = Number(event.key);
      main(player,column-1);
    }
  }
);

game.run()
