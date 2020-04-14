class Player extends Sprite {
    constructor(param){
        super(param);
        this.drawing_id = 0;
        this.jumps = 0;
        this.velocity = 0;
        this.moved = false;
        this.lives = 3;
    }
}