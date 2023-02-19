import Sprite = Phaser.GameObjects.Sprite;

export class Log extends Sprite {
    private static readonly LOG_SPEED = 4;
    isMovingLeft: boolean = true;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'log');
        this.setTexture('log');
        this.setOrigin(0, 0);
        this.setScale(1, 1);
        this.setInteractive();
        this.scene.add.existing(this);
    }

    update(time: number, delta: number):void {
        if(this.isMovingLeft)
            this.x -= Log.LOG_SPEED
        else
            this.x += Log.LOG_SPEED

        if (this.x < -this.width || this.x > (this.scene.game.config.width as number) + 500) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}