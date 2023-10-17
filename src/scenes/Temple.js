import Phaser from 'phaser';
import path from 'path';
import {
  BACKGROUND_TEMPLE_PATH,
  FOREGROUND_TEMPLE_PATH,
  COMPONENT_TEMPLE_PATH,
  UI_PATH,
  PLAYER_SPRITESHEET_PATH,
} from '../utils/mapPath';
import {
  SKY_DEPTH,
  BACKGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  PLAYER_DEPTH,
  FOREGROUND_DEPTH,
} from '../utils/mapDepth';
import { setWorldBoundsAndCamera } from '../utils/setWorldAndCameraBound';
import { OBJECT_SCROLL } from '../utils/mapObjectScroll';
import playerMoveTemple from '../utils/playerMoveTemple';

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

let background;
let foreground;
let components;
let camera;
let player;
let water;
let grounds;
let sky;
let sky2;
let sky3;

let left;
let right;
let up;
let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;

class Temple extends Phaser.Scene {
  constructor() {
    super('Temple');
  }

  loadBackground() {
    //load background
    this.load.image('sky', path.join(BACKGROUND_TEMPLE_PATH, 'skyP01.png'));
    this.load.image('sky2', path.join(BACKGROUND_TEMPLE_PATH, 'skyP02.png'));
    this.load.image('sky3', path.join(BACKGROUND_TEMPLE_PATH, 'skyP03.png'));
    this.load.image('City', path.join(BACKGROUND_TEMPLE_PATH, 'City.png'));
    this.load.image(
      'fuji',
      path.join(BACKGROUND_TEMPLE_PATH, 'Volcano fuji.png')
    );
    this.load.image(
      'bgTree',
      path.join(BACKGROUND_TEMPLE_PATH, 'Background Trees.png')
    );
    this.load.image('bushes', path.join(BACKGROUND_TEMPLE_PATH, 'Bushes.png'));
    this.load.image(
      'peddlerCar',
      path.join(COMPONENT_TEMPLE_PATH, 'Trading Cart.png')
    );
    this.load.image('ground', path.join(COMPONENT_TEMPLE_PATH, 'ground.png'));
    this.load.image(
      'groundShadow',
      path.join(COMPONENT_TEMPLE_PATH, 'platformShadow.png')
    );
  }
  loadForeground() {
    //load foreground
    this.load.image(
      'tree',
      path.join(FOREGROUND_TEMPLE_PATH, 'Sakura Tree.png')
    );
    this.load.spritesheet('water', path.join('assets', 'anim', 'water.png'), {
      frameWidth: 1839,
      frameHeight: 252,
    });
    this.load.spritesheet('sakura', path.join('assets', 'anim', 'sakura.png'), {
      frameWidth: 320,
      frameHeight: 320,
    });
  }
  loadComponents() {
    // load components
    this.load.image('House', path.join(COMPONENT_TEMPLE_PATH, 'House.png'));
    this.load.image('torii', path.join(COMPONENT_TEMPLE_PATH, 'Arc.png'));
  }
  loadPlayer() {
    //load player
    this.load.spritesheet(
      'player',
      path.join(PLAYER_SPRITESHEET_PATH, 'oposum.png'),
      {
        frameWidth: 36,
        frameHeight: 28,
      }
    );
  }
  loadUI() {
    //load button
    this.load.image('left', path.join(UI_PATH, 'left.png'));
    this.load.image('right', path.join(UI_PATH, 'right.png'));
    this.load.image('up', path.join(UI_PATH, 'up.png'));
  }
  preload() {
    this.loadBackground();
    this.loadForeground();
    this.loadComponents();
    this.loadPlayer();
    this.loadUI();
  }

  setDeviceSpecificControls(height, width, camera) {
    //camera and control for each device
    if (isMobile || tablet) {
      this.input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === left) {
          isLeftPressed = true;
        }
        if (gameObject === right) {
          isRightPressed = true;
        }
        if (gameObject === up) {
          isUpPressed = true;
        }
      });

      this.input.on('gameobjectup', (pointer, gameObject) => {
        if (gameObject === left) {
          isLeftPressed = false;
        }
        if (gameObject === right) {
          isRightPressed = false;
        }
        if (gameObject === up) {
          isUpPressed = false;
        }
      });

      //get screen width and height
      let screenWidth = window.innerWidth;
      let screenHeight = window.innerHeight;

      //device check
      if (isMobile) {
        //mobile
        if (screenHeight > 720) screenHeight = 720;
        console.log('Mobile view');
        console.log(`Screen Width: ${screenWidth}px`);
        console.log(`Screen Height: ${screenHeight}px`);

        left = this.physics.add
          .sprite(screenWidth / 2 - screenWidth / 3, screenHeight / 1.2, 'left')
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        right = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 8,
            screenHeight / 1.2,
            'right'
          )
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        up = this.physics.add
          .sprite(screenWidth / 2 + screenWidth / 3.5, screenHeight / 1.2, 'up')
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        //Implement mobile camera bounds and viewport
        camera.setViewport(
          width / 2 - screenWidth / 2,
          height / 2 - screenHeight / 2,
          screenWidth,
          screenHeight
        );
        camera.setZoom(1);
      } else if (tablet) {
        //tablet
        if (screenHeight > 720) screenHeight = 720;
        console.log('Tablet view');
        console.log(`Screen Width: ${screenWidth}px`);
        console.log(`Screen Height: ${screenHeight}px`);

        left = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 2.5,
            screenHeight / 1.2,
            'left'
          )
          .setScale(7)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        right = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 3.5,
            screenHeight / 1.2,
            'right'
          )
          .setScale(7)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        up = this.physics.add
          .sprite(screenWidth - screenWidth / 8, screenHeight / 1.2, 'up')
          .setScale(7)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        //Implement tablet camera bounds and viewport
        camera.setViewport(
          width / 2 - screenWidth / 2,
          height / 2 - screenHeight / 2,
          screenWidth,
          height
        );
      }
    } else {
      //default (desktop)
      console.log('desktop');
      camera.setViewport(0, 0, width, height);
    }
  }
  addBackgroundElements(width, height, mapWidth, floorHeight) {
    //clouds
    sky = this.add
      .tileSprite(0, 0, mapWidth, height, 'sky')
      .setOrigin(0, 0)
      .setScale(2.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(0);

    sky2 = this.add
      .tileSprite(0, 10, mapWidth, height, 'sky2')
      .setOrigin(0, 0)
      .setScale(2.6)
      .setAlpha(0.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(0);

    sky3 = this.add
      .tileSprite(0, 20, mapWidth, height, 'sky3')
      .setOrigin(0, 0)
      .setScale(2.6)
      .setAlpha(0.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(0);

    //background
    background = this.add.group();

    let city = this.add
      .tileSprite(0, floorHeight - 200, 550, 200, 'City')
      .setOrigin(0, 0)
      .setScale(1.5)
      .setDepth(BACKGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let fuji = this.add
      .image(mapWidth - 2200, floorHeight - 250, 'fuji')
      .setOrigin(0, 0)
      .setScale(1.5)
      .setDepth(BACKGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let bgTree = this.add
      .tileSprite(0, floorHeight + 20, mapWidth * 2, 180, 'bgTree')
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let brush1 = this.add
      .image(500, floorHeight - 50, 'bushes')
      .setOrigin(0, 0)
      .setScale(2)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let brush2 = this.add
      .image(mapWidth / 2 - 800, floorHeight - 50, 'bushes')
      .setOrigin(0, 0)
      .setScale(2)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);
    brush2.flipX = true;

    let brush3 = this.add
      .image(mapWidth / 2, floorHeight - 50, 'bushes')
      .setOrigin(0, 0)
      .setScale(2)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let peddlerCar = this.add
      .image(700, floorHeight - 40, 'peddlerCar')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    background.add(sky);
    background.add(city);
    background.add(fuji);
    background.add(bgTree);
    background.add(peddlerCar);
    background.add(brush1);
    background.add(brush2);
    background.add(brush3);
  }
  addComponents(width, height, mapWidth, floorHeight) {
    //components background
    components = this.add.group();
    let house = this.add
      .image(mapWidth / 2 - 620, floorHeight - 220, 'House')
      .setOrigin(0, 0)
      .setScale(0.8)
      .setDepth(MIDDLEGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    let torii = this.add
      .image(mapWidth / 2 + 900, floorHeight - 100, 'torii')
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(MIDDLEGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    components.add(house);
    components.add(torii);
  }
  addMiddlegroundAndPlayer(width, height, mapWidth, floorHeight) {
    //player
    player = this.physics.add
      .sprite(300, height - 300, 'player')
      .setCollideWorldBounds(true)
      .setScale(3)
      .setDepth(PLAYER_DEPTH);

    //ground physics
    grounds = this.physics.add.staticGroup();
    let ground = this.add
      .tileSprite(0, floorHeight + 98, mapWidth * 5, 250, 'ground')
      .setOrigin(0, 0)
      .setScale(0.2)
      .setDepth(PLAYER_DEPTH + 2)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    let groundShadow = this.add
      .tileSprite(0, floorHeight + 120, mapWidth * 25, 250, 'groundShadow')
      .setOrigin(0, 0)
      .setScale(0.15)
      .setDepth(PLAYER_DEPTH + 1)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    grounds.add(ground);
    grounds.add(groundShadow);
    this.physics.add.collider(player, grounds);
  }
  addForegroundElements(width, height, mapWidth, floorHeight) {
    //adding water
    water = this.add
      .sprite(0, 450, 'water')
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    water.anims.play('waterAnim', true);

    water = this.add
      .sprite(1840, 450, 'water')
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    water.anims.play('waterAnim', true);

    water = this.add
      .sprite(3680, 450, 'water')
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    water.anims.play('waterAnim', true);

    //foreground
    foreground = this.add.group();

    let tree = this.add
      .tileSprite(0, 300, mapWidth * 4, height * 2, 'tree')
      .setOrigin(0, 0)
      .setScale(0.5)
      .setDepth(FOREGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.FG);

    let xPositions = [0, 450, 1200, 1500, 2300, 2550, 2950]; //TODO apply to every sakura tree the rest of the x positions
    let yPositions = [450, 550, 600, 650, 450, 500, 550]; //TODO apply to every sakura tree the rest of the y positions

    for (let i = 0; i < xPositions.length; i++) {
      let x = xPositions[i];
      let y = yPositions[i];

      // Create a sakura sprite at position (x, y)
      let sakura = this.add
        .sprite(x, y, 'sakura')
        .setOrigin(0, 0)
        .setScale(0.8)
        .setDepth(FOREGROUND_DEPTH)
        .setScrollFactor(OBJECT_SCROLL.FG);

      sakura.anims.play('sakura', true);
      sakura.flipX = true;
    }

    foreground.add(tree);
    foreground.add(water);
  }
  addAnimations() {
    //animations for testing
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    //water animation
    this.anims.create({
      key: 'waterAnim',
      frames: this.anims.generateFrameNumbers('water', {
        start: 0,
        end: 5,
      }),
      frameRate: 5.5,
      repeat: -1,
    });

    //sakura animation
    this.anims.create({
      key: 'sakura',
      frames: this.anims.generateFrameNumbers('sakura', {
        start: 0,
        end: 20,
      }),
      frameRate: 8,
      repeat: -1,
    });
  }

  create() {
    //config
    const { width, height } = this.scale;
    const mapWidth = width * 4;
    const floorHeight = height - 330;
    //binding functions
    this.playerMoveTemple = playerMoveTemple;
    this.setWorldBoundsAndCamera = setWorldBoundsAndCamera;
    //setting world and camera
    const returnCamera = this.setWorldBoundsAndCamera(height, mapWidth, camera);
    camera = returnCamera;
    //setting device specific controls
    this.setDeviceSpecificControls(height, width, camera);

    //adding animations
    this.addAnimations();
    //adding background
    this.addBackgroundElements(width, height, mapWidth, floorHeight);
    //adding house and torii
    this.addComponents(width, height, mapWidth, floorHeight);
    //adding ground and player
    this.addMiddlegroundAndPlayer(width, height, mapWidth, floorHeight);
    //adding foreground
    this.addForegroundElements(width, height, mapWidth, floorHeight);
  }

  update() {
    //player movement
    if (isMobile || tablet) {
      this.playerMoveTemple(
        player,
        500,
        false,
        true,
        isLeftPressed,
        isRightPressed,
        isUpPressed
      );
    } else {
      this.playerMoveTemple(player, 1000, false, false, null, null, null);
    }

    //camera follow player
    camera.startFollow(player);

    //scrolling background
    sky.tilePositionX += 0.015;
    sky2.tilePositionX += 0.05;
    sky3.tilePositionX += 0.1;
  }
}
export default Temple;
