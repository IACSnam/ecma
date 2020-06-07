class Player extends Sprite {
    constructor(param){
        super(param);
        this.drawing_id = 0;
        this.jumps = 0;
        this.y_vel = 0;
        this.moved = false;
        this.lives = 3;
        this.x_vel = 0;
    }
}
