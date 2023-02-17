import Phaser from 'phaser';
import {Frog} from "../entities/Frog";

export default class Demo extends Phaser.Scene {
    private frog?: Frog;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/level1.json');
        this.load.image('frog', 'assets/frog.png');
        this.load.image('car-kun', 'assets/car-kun.png');
        this.load.image('truck-kun', 'assets/truck-kun.png');
    }

    create() {
        const map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('spritesheet', 'tiles');
        const layer = map.createLayer(0, tileset, 0, 130);

        this.frog = new Frog(this, 0, this.game.config.height as number - 128);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.addFrogInputListeners();
    }

    update(time: number, delta: number) {
    }

    addFrogInputListeners() {
        this.input.keyboard.on('keydown-UP', () => {
            if (this.frog)
                this.frog.y -= 128;
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            if (this.frog)
                this.frog.y += 128;
        });
        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.frog)
                this.frog.x -= 128;
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.frog)
                this.frog.x += 128;
        });
    }
}
