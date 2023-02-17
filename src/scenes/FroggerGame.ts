import Phaser from 'phaser';
import {Frog} from "../entities/Frog";
import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;
import {Truck} from "../entities/Truck";

export default class FroggerGame extends Phaser.Scene {
    private frog?: Frog;
    private trucks?: Phaser.GameObjects.Group;
    private spawnDelay:number = 1000;

    private laneYValues:number[] = [256, 384, 512, 640, 768];

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
        this.initializeMapAndCameras();
        this.initializeEntities();
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

    private initializeEntities() {
        this.frog = new Frog(this, 0, this.game.config.height as number - 128);
        this.trucks = this.add.group({
            classType: Truck,
            maxSize: 30,
            runChildUpdate: true
        });
        this.time.addEvent({
            delay: this.spawnDelay,
            loop: true,
            callback: () => this.spawnTruck()
        });
    }

    private initializeMapAndCameras() {
        const map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('spritesheet', 'tiles');
        const layer = map.createLayer(0, tileset, 0, 130);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    private spawnTruck() {
        if (this.trucks && this.trucks.countActive() < 50) {
            const randomLane = Phaser.Math.Between(0, 4);
            const y = this.game.config.height as number - this.laneYValues[randomLane];
            const truck = this.trucks.get(-128, y) as Phaser.GameObjects.Sprite;
            if(truck) {
                truck.setActive(true);
                truck.setVisible(true);
            }
        }
    }
}
