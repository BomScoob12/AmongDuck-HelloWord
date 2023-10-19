import Phaser from 'phaser';
import playerMoveTemple from '../utils/playerMoveTemple';
import { setWorldBoundsAndCamera } from '../utils/setWorldAndCameraBound';
import {
  SKY_DEPTH,
  BACKGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  PLAYER_DEPTH,
  FOREGROUND_DEPTH,
} from '../utils/mapDepth';
import { OBJECT_SCROLL } from '../utils/mapObjectScroll';
import { shallowWater, playerDrown } from '../utils/event/drown';

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

let backgrounds;
let water;
let cloundLayer1;
let cloundLayer2;
let platforms;
let components;
let camera;
//slide platform
let platformSlide1;
let platformSlide2;
//gate
let gatePrevious;
let gateNext;
//interaction
let key;
let chess;
let house;
let shallow_water;
//player
let player;

class Delivery2 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Delivery2',
    });
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
  addBackgroundElements(mapWidth, mapHeight) {
    backgrounds = this.add.group();
    let bg = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'background')
      .setOrigin(0, 0)
      .setScale(1.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD - 0.1);
    //mid clound
    cloundLayer1 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer2')
      .setOrigin(0, 0)
      .setScale(1.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD);
    // front
    cloundLayer2 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer1')
      .setOrigin(0, 0)
      .setScale(1.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD2);

    backgrounds.add(bg);
    backgrounds.add(cloundLayer2);
    backgrounds.add(cloundLayer1);
  }
  addForegroundElements(mapWidth, mapHeight) {
    //shalllow water
    shallow_water = shallowWater(
      this,
      0,
      mapHeight - 6,
      mapWidth * 2,
      160,
      BACKGROUND_COMPONENT_DEPTH
    );
    this.physics.add.existing(shallow_water);

    water = this.add
      .tileSprite(0, mapHeight - 150, mapWidth, 200, 'water')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
  }
  //add platforms
  addPlatforms(floorHeight) {
    platforms = this.physics.add.staticGroup();
    let ground = this.add
      .tileSprite(-810, floorHeight, 1383, 218, 'ground-main')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    platformSlide1 = this.physics.add
      .image(573, 1230, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformHouse = this.add
      .image(1294, 1236, 'platform-long3')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to key
    let platformToKey1 = this.add
      .image(2268, 1142, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToKey2 = this.add
      .image(2600, 1032, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    platformSlide2 = this.physics.add
      .image(3066, 893, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToKey3 = this.add
      .image(2804, 582, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    //key on this platform
    let platformToKey4 = this.add
      .image(2270, 458, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to chess
    let platformToChess1 = this.add
      .image(1069, 1068, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToChess2 = this.add
      .image(625, 940, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToChess3 = this.add
      .image(353, 810, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToChess4 = this.add
      .image(84, 717, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //gate on this platform
    let platformGate = this.add
      .image(3418, 360, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(0.8, 1)
      .setDepth(MIDDLEGROUND_DEPTH);

    platforms.add(ground);
    platforms.add(platformHouse);
    platforms.add(platformToKey1);
    platforms.add(platformToKey2);
    platforms.add(platformToKey3);
    platforms.add(platformToKey4);
    platforms.add(platformToChess1);
    platforms.add(platformToChess2);
    platforms.add(platformToChess3);
    platforms.add(platformToChess4);
    platforms.add(platformGate);
    // Set collision boxes for each platform
    platforms.children.iterate((child) => {
      child.body.setSize(child.width, 20).setOffset(0, 0);
    });

    //set move platform
    this.tweens.add({
      targets: platformSlide1,
      x: 1075,
      ease: 'Expo.easeInOut',
      duration: 3500,
      repeat: -1,
      yoyo: true,
    });
    this.tweens.add({
      targets: platformSlide2,
      y: 443,
      ease: 'LINEAR',
      duration: 4000,
      repeat: -1,
      yoyo: true,
    });

    platformSlide1.body.setAllowGravity(false);
    platformSlide1.body.setImmovable(true);
    platformSlide2.body.setAllowGravity(false);
    platformSlide2.body.setImmovable(true);
  }
  //house gate chess key
  addMainComponents() {
    components = this.add.group();
    house = this.add
      .image(1439, 834, 'house2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    gatePrevious = this.add
      .image(52, 1140, 'gate-active')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    gateNext = this.add
      .image(3600, 274, 'gate')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    gateNext.flipX = true;
    chess = this.physics.add
      .sprite(150, 615, 'chess')
      .setOrigin(0, 0)
      .setSize(100, 100)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    key = this.add
      .image(2400, 370, 'key')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    components.add(house);
    components.add(gatePrevious);
    components.add(gateNext);
    components.add(chess);
    components.add(key);
  }
  //add props stone sakura tree logs
  addComponents() {
    this.add
      .image(280, 1120, 'logs')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(310, 880, 'tree')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1179, 990, 'log')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    // chess platform
    this.add
      .image(93, 644, 'brush')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(130, 712, 'vine')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(MIDDLEGROUND_DEPTH + 1).flipX = true;

    this.add
      .image(504, 774, 'grass2')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(676, 834, 'stone-wall')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(662, 870, 'box')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(680, 750, 'lantern')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    //house platforms
    this.add
      .image(1420, 621, 'sakura-tree')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    //path to key
    this.add
      .image(2372, 1090, 'stone')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2637, 930, 'tou')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2872, 576, 'vine')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(MIDDLEGROUND_DEPTH + 1);
    this.add
      .image(2804, 558, 'grass')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2322, 352, 'bench')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
  }
  //player and colider
  addPlayerAndColider(floorHeight) {
    //player
    player = this.physics.add
      .sprite(100, floorHeight - 150, 'player')
      .setCollideWorldBounds(true)
      .setScale(3)
      .setSize(30, 25)
      .setDepth(PLAYER_DEPTH);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, platformSlide1);
    this.physics.add.collider(player, platformSlide2);
  }
  //animation chess
  addAnimations() {
    this.anims.create({
      key: 'chess-rotate',
      frames: this.anims.generateFrameNumbers('chess', {
        start: 21,
        end: 27,
      }),
      frameRate: 3,
      repeat: 0,
    });
  }
  create() {
    //config
    const { width, height } = this.scale;
    // main scale
    const mapWidth = width * 3;
    const mapHeight = height * 2;

    //Dev scale 3840 * 1440
    // const mapWidth = width;
    // const mapHeight = height;

    const floorHeight = mapHeight - 215;

    //binding function
    this.playerMoveTemple = playerMoveTemple;
    this.setWorldBoundsAndCamera = setWorldBoundsAndCamera;

    //setting world and camera
    const returnCamera = this.setWorldBoundsAndCamera(
      mapHeight,
      mapWidth,
      camera
    );
    camera = returnCamera;
    this.setDeviceSpecificControls(height, width, camera);

    this.addAnimations();
    // background
    this.addBackgroundElements(mapWidth, mapHeight);
    // foreground
    this.addForegroundElements(mapWidth, mapHeight);
    // platforms
    this.addPlatforms(floorHeight);
    // main components
    this.addMainComponents();
    // props
    this.addComponents();
    // player
    this.addPlayerAndColider(floorHeight);

    //test animation chess
    this.anims.play('chess-rotate', chess);
  }

  update(delta, time) {
    //testing movement
    this.playerMoveTemple(player, 1000, false, false, null, null, null);
    //camera follow player
    camera.startFollow(player);

    //player drown
    playerDrown(this, player, shallow_water);
  }
}

export default Delivery2;
