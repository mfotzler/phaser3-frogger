import Phaser from 'phaser';
import {Frog} from "../entities/Frog";
import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;
import {Truck} from "../entities/Truck";
import {Car} from "../entities/Car";
import {Log} from "../entities/Log";
import StaticBody = Phaser.Physics.Arcade.StaticBody;
import Rectangle = Phaser.GameObjects.Rectangle;
import Body = Phaser.Physics.Arcade.Body;

export default class FroggerGame extends Phaser.Scene {
    private frog?: Frog;
    private trucks?: Phaser.GameObjects.Group;
    private cars?: Phaser.GameObjects.Group;
    private logGroups: Phaser.GameObjects.Group[] = [];
    private scoreZones?: Phaser.GameObjects.Group;
    private deathZones?: Phaser.GameObjects.Group;
    private waterArea?: Rectangle;
    private spawnDelay:number = 2000;
    private logSpawnDelay:number = 4000;
    private isPlayingMusic:boolean = false;
    private score: number = 0;
    private scoreText?: Phaser.GameObjects.Text;
    private lives: number = 3;
    private livesText?: Phaser.GameObjects.Text;
    private gameOverText?: Phaser.GameObjects.Text;

    private frogLayer?: Phaser.GameObjects.Layer;
    private logLayer?: Phaser.GameObjects.Layer;


    private laneYValues:number[] = [256, 384, 512, 640, 768];
    private waterLanesYBegin:number = 1024;

    constructor() {
        super('GameScene');
    }

    preload():void {
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/level1.json');
        this.load.image('frog', 'assets/frog.png');
        this.load.image('car-kun', 'assets/car-kun.png');
        this.load.image('truck-kun', 'assets/truck-kun.png');
        this.load.image('log', 'assets/log.png');
        this.load.audio('bgm', 'assets/bgm.ogg');
    }

    create():void {
        this.initializeText();
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

    private die():void {
        this.lives = this.lives > 0 ? this.lives-1 : 0;
        if(this.lives <= 0) {
            this.gameOverText?.setVisible(true);
            this.frog?.setVisible(false);
            this.frog?.setActive(false);
        } else {
            this.respawnFrog();
        }
        this.livesText?.setText(`Lives: ${this.lives}`);
    }

    private initializeEntities():void {
        this.waterArea = this.add.rectangle(0, this.waterLanesYBegin - (6*125), this.game.config.width as number, (5 * 128) - 20, 0xff0000, 0.0);
        this.waterArea.setOrigin(0,0);
        this.physics.add.existing(this.waterArea, false);

        this.frog = new Frog(this, 0, this.game.config.height as number - 128);
        (this.frog.body as Body).setCollideWorldBounds(true);
        this.frogLayer = this.add.layer();
        this.frogLayer.depth = 10;
        this.frogLayer.add(this.frog);
        this.respawnFrog();

        this.physics.add.overlap(this.frog!, this.waterArea!, () => {
            const isOnLog = this.physics.overlap(this.frog!, this.logGroups.flatMap(logGroup => logGroup.getChildren()));
            if(!isOnLog)
                this.die();
        });
        this.initializeScoreZones();
        this.initializeDeathZones();
        this.initializeTrucks();
        this.initializeCars();
        this.initializeLogs();
    }

    private initializeCars() {
        this.cars = this.physics.add.group({
            classType: Car,
            maxSize: 30,
            runChildUpdate: true,
        });
        this.physics.add.collider(this.frog!, this.cars!, () => {
            this.die();
        });
        this.time.addEvent({
            delay: this.spawnDelay,
            startAt: this.spawnDelay / 2,
            loop: true,
            callback: () => this.spawnCar()
        });
    }

    private initializeTrucks() {
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
            this.die();
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

    private initializeLogs() {
        this.logLayer = this.add.layer();
        this.logLayer.depth = 5;
        for(let i = 0; i < 5; i++) {
            const group = this.physics.add.group({
                classType: Log,
                maxSize: 30,
                runChildUpdate: true,
            });
            this.logGroups.push(group);
            this.time.addEvent({
                delay: Phaser.Math.Between(0, 1000),
                callback: () => this.spawnLog(this.waterLanesYBegin + (i * 128), group, i % 2 == 0)
            });
            this.physics.add.overlap(this.frog!, group, (o1, o2) => {
                this.frog!.x += (o2 as Log) .isMovingLeft ? -Log.LOG_SPEED : Log.LOG_SPEED
            });
        }
    }

    private spawnLog(laneY:number, group:Phaser.GameObjects.Group, isMovingLeft: boolean):void {
        const y = this.game.config.height as number - laneY;
        const x = isMovingLeft ? this.game.config.width as number + 100 : -100;
        const log = group.get(x, y) as Log;
        this.logLayer?.add(log);
        log.isMovingLeft = isMovingLeft;
        if(log) {
            log.setActive(true);
            log.setVisible(true);
        }

        this.time.addEvent({
            delay: Phaser.Math.Between(this.logSpawnDelay - 1000, this.logSpawnDelay + 1000),
            callback: () => this.spawnLog(laneY, group, isMovingLeft)
        });
    }

    private resetScoreZones() {
        this.scoreZones?.getChildren().forEach((zone, i) => {
            zone.setActive(true);
            (zone as Frog).setVisible(false);
        });
    }

    private initializeScoreZones() {
        this.scoreZones = this.physics.add.group({
            classType: Frog,
            maxSize: 5,
            runChildUpdate: true,
        });
        this.physics.add.collider(this.frog!, this.scoreZones!, (o1, o2) => {
            if(!o2.active) {
                this.die();
                return;
            }

            this.score += 200;
            o2.setActive(false);
            (o2 as Frog).setVisible(true);
            this.respawnFrog();
            this.scoreText!.setText(`Score: ${this.score}`);

            if(this.scoreZones?.getChildren().every(zone => !zone.active)) {
                this.resetScoreZones();
            }
        });

        for(let i = 0; i < 5; i++) {
            const y = 128;
            const zone = this.scoreZones!.get(i * 256, y) as Frog;
            zone.setSize(128, 128);

            if(zone) {
                zone.setActive(true);
                zone.setVisible(false);
            }
        }
    }

    private respawnFrog() {
        this.frog!.x = 4*128;
        this.frog!.y = this.game.config.height as number - 128;
    }

    private initializeText() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '32px', color: '#ffffff'});
        this.scoreText.depth = 20;
        this.livesText = this.add.text(16, 64, 'Lives: 3', {fontSize: '32px', color: '#ffffff'});
        this.livesText.depth = 20;

        this.gameOverText = this.add.text(this.game.config.width as number / 2, this.game.config.height as number / 2 - 40, 'Game Over', {fontSize: '72px', color: '#ffffff'});
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.depth = 20;
        this.gameOverText.setVisible(false);
    }

    private initializeDeathZones() {
        this.deathZones = this.physics.add.group({
            classType: Rectangle,
            maxSize: 5,
            runChildUpdate: true,
        });
        this.physics.add.collider(this.frog!, this.deathZones!, () => {
            this.die();
        });

        for(let i = 0; i < 4; i++) {
            const width = 85;
            const y = 128
            const zone = this.deathZones!.get(i * 256 + 150, y) as Rectangle;
            zone.setSize(width, 128);
            zone.setFillStyle(0xff0000, 0.0);
            zone.setActive(true);
        }
    }
}
