export class Frog extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'frog');
        scene.physics.add.existing(this)
        this.setTexture('frog');
        this.setOrigin(0, 0);
        this.setScale(1, 1);
        this.setInteractive();
        this.scene.add.existing(this);
    }
}