import Phaser from 'phaser';

export default class Demo extends Phaser.Scene {
  private controls: Phaser.Cameras.Controls.FixedKeyControl | undefined;
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('tiles', 'assets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/level1.json');
  }

  create() {
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('spritesheet', 'tiles');
    const layer = map.createLayer(0, tileset, 0, 130);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5
    };
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
  }
  update(time:number, delta:number) {
    this.controls?.update(delta);
  }
}
