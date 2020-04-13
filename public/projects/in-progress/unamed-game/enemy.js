class Enemy extends Sprite{
    constructor(param){
        super(param);
        this.velocity = 0;
        this.drawing_id = 0;
    }
}

class gameObject extends Sprite{
    constructor(param){
        super(param);
        this.drawing_id = 0;
    }
}