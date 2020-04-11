class Enemy extends Sprite{
    constructor(param){
        super(param);
        this.velocity = 0;
        this.prev_x_trans = 0;
        this.prev_y_trans = 0;
        this.drawing_id = 0;
    }
}