import Sprite = Phaser.GameObjects.Sprite;

export class Truck extends Sprite {
    private static readonly TRUCK_SPEED = 8;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'truck-kun');
        this.setTexture('truck-kun');
        this.setOrigin(0, 0);
        this.setScale(1, 1);
        this.setInteractive();
        this.scene.add.existing(this);
    }

    update(time: number, delta: number) {
        this.x += Truck.TRUCK_SPEED

        if (this.x > (this.scene.game.config.width as number)) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}