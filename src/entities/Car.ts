import Sprite = Phaser.GameObjects.Sprite;

export class Car extends Sprite {
    private static readonly CAR_SPEED = 8;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'car-kun');
        this.setTexture('car-kun');
        this.setOrigin(0, 0);
        this.setScale(1, 1);
        this.setInteractive();
        this.scene.add.existing(this);
    }

    update(time: number, delta: number):void {
        this.x += Car.CAR_SPEED

        if (this.x > (this.scene.game.config.width as number)) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}