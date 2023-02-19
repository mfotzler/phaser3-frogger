import Phaser from 'phaser';
import {Frog} from "../entities/Frog";
import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;
import {Truck} from "../entities/Truck";
import {Car} from "../entities/Car";

export default class FroggerGame extends Phaser.Scene {
    private frog?: Frog;
    private trucks?: Phaser.GameObjects.Group;
    private cars?: Phaser.GameObjects.Group;
    private spawnDelay:number = 2000;
    private isPlayingMusic:boolean = false;

    private laneYValues:number[] = [256, 384, 512, 640, 768];

    constructor() {
        super('GameScene');
    }

    preload():void {
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/level1.json');
        this.load.image('frog', 'assets/frog.png');
        this.load.image('car-kun', 'assets/car-kun.png');
        this.load.image('truck-kun', 'assets/truck-kun.png');
        this.load.audio('bgm', 'assets/bgm.ogg');
    }

    create():void {
        this.initializeMusic();
        this.initializeMapAndCameras();
        this.initializeEntities();
        this.addFrogInputListeners();
    }

    private initializeMusic():void {
        const bgm = this.sound.add('bgm');
        this.input.keyboard.on('keydown-M', () => {
            if (this.isPlayingMusic) {
                bgm.stop();
                this.isPlayingMusic = false;
            } else {
                bgm.play({
                    loop: true
                });
                this.isPlayingMusic = true;
            }
        })
    }

    update(time: number, delta: number):void {
    }

    addFrogInputListeners():void {
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

    private initializeEntities():void {
        this.frog = new Frog(this, 0, this.game.config.height as number - 128);
        this.trucks = this.physics.add.group({
            classType: Truck,
            maxSize: 30,
            runChildUpdate: true,
        });
        this.time.addEvent({
            delay: this.spawnDelay,
            loop: true,
            callback: () => this.spawnTruck()
        });
        this.physics.add.collider(this.frog!, this.trucks!, () => {
            this.frog!.x = 0;
            this.frog!.y = this.game.config.height as number - 128;
        });

        this.cars = this.physics.add.group({
            classType: Car,
            maxSize: 30,
            runChildUpdate: true,
        });
        this.physics.add.collider(this.frog!, this.cars!, () => {
            this.frog!.x = 0;
            this.frog!.y = this.game.config.height as number - 128;
        });
        this.time.addEvent({
            delay: this.spawnDelay,
            startAt: this.spawnDelay / 2,
            loop: true,
            callback: () => this.spawnCar()
        });
    }

    private initializeMapAndCameras():void {
        const map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('spritesheet', 'tiles');
        const layer = map.createLayer(0, tileset, 0, 130);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    private spawnTruck():void {
        const randomLane = Phaser.Math.Between(0, 4);
        const y = this.game.config.height as number - this.laneYValues[randomLane];
        const truck = this.trucks!.get(-300, y) as Phaser.GameObjects.Sprite;
        if(truck) {
            truck.setActive(true);
            truck.setVisible(true);
        }
    }

    private spawnCar():void {
        const randomLane = Phaser.Math.Between(0, 4);
        const y = this.game.config.height as number - this.laneYValues[randomLane];
        const car = this.cars!.get(-300, y) as Phaser.GameObjects.Sprite;
        if(car) {
            car.setActive(true);
            car.setVisible(true);
        }
    }
}
