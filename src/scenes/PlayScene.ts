//import Phaser from "phaser";
import { PRELOAD_CONFIG } from "..";
import { Player } from "../entities/Player";
import { SpriteWithDynamicBody } from "../types";
import { GameScene } from "./GameScene";

class PlayScene extends GameScene{

    player: Player;
    ground: Phaser.GameObjects.TileSprite;
    obstacles: Phaser.Physics.Arcade.Group;

    startTrigger: SpriteWithDynamicBody;

    gameOverContainer: Phaser.GameObjects.Container;
    gameOverText: Phaser.GameObjects.Image;
    restartText: Phaser.GameObjects.Image;

    spawnInterval: number = 1500;
    spawnTime: number = 0;
    gameSpeed: number = 5;

    constructor(){
        super('PlayScene');
    };

    create(){
        this.createEnvironment();
        this.createPlayer();

        this.obstacles = this.physics.add.group();
        
        this.gameOverText = this.add.image(0, 0, 'game-over');
        this.restartText = this.add.image(0, 80, 'restart');
        this.gameOverContainer = this.add
            .container(this.gameWidth / 2, (this.gameHeight / 2) - 50)
            .add([this.gameOverText, this.restartText]);
        
        this.startTrigger = this.physics.add.sprite(0, 10, null).setOrigin(0, 1).setAlpha(0);
        
        this.physics.add.collider(this.obstacles, this.player, () => {
            this.isGameRunning = false;
            this.physics.pause();
            this.player.die();
            this.spawnTime = 0;
            this.gameSpeed = 0;
        })
        
        this.physics.add.overlap(this.startTrigger, this.player, () => {
            if(this.startTrigger.y === 10){
             this.startTrigger.body.reset(0, this.gameHeight);
             return;
            };
            this.startTrigger.body.reset(9999, 9999);
            const rollOutEvent = this.time.addEvent({
                delay: 1000 / 60,
                loop: true,
                callback: () => {
                    this.player.playRunAnimation();
                    this.player.setVelocityX(80);
                    this.ground.width += (17 * 2);
                    if(this.ground.width >= this.gameWidth){
                        rollOutEvent.remove();
                        this.ground.width = this.gameWidth;
                        this.player.setVelocityX(0);
                        this.isGameRunning = true;
                    }
                },
            })
        })
    };

    update(time: number, delta: number): void {
        if(!this.isGameRunning) return;
        this.spawnTime += delta;
        if(this.spawnTime > this.spawnInterval){
            this.spawnObstacle();
            this.spawnTime = 0;
        }
        Phaser.Actions.IncX(this.obstacles.getChildren() as Phaser.GameObjects.Sprite[], -this.gameSpeed);
        this.obstacles.getChildren().forEach( (obstacles: SpriteWithDynamicBody) => {
            if(obstacles.getBounds().right < 0){
                this.obstacles.remove(obstacles);
            }
        })
        this.ground.tilePositionX += this.gameSpeed;
    };

    // --Custom methods--

    createPlayer(){
        this.player = new Player(this, 0, this.gameHeight, 'dino-run');
    };

    createEnvironment(){
        this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1)
    };

    spawnObstacle(){
        const obstacleNumber = Math.floor(Math.random() * PRELOAD_CONFIG.cactusesCount) + 1;
        const distance = Phaser.Math.Between(600, 900);
        this.obstacles
            .create(distance, this.gameHeight, `obstacle-${obstacleNumber}`)
            .setOrigin(0, 1)
            .setImmovable(true)
    };
    
};

export default PlayScene;