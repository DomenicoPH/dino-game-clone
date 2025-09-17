//import Phaser from "phaser";
import { PRELOAD_CONFIG } from "..";
import { Player } from "../entities/Player";
import { SpriteWithDynamicBody } from "../types";
import { GameScene } from "./GameScene";

class PlayScene extends GameScene{

    player: Player;
    ground: Phaser.GameObjects.TileSprite;
    obstacles: Phaser.Physics.Arcade.Group;
    clouds: Phaser.GameObjects.Group;

    startTrigger: SpriteWithDynamicBody;

    scoreText: Phaser.GameObjects.Text;
    gameOverText: Phaser.GameObjects.Image;
    restartText: Phaser.GameObjects.Image;
    gameOverContainer: Phaser.GameObjects.Container;

    score: number = 0;
    scoreInterval: number = 50;
    scoreDeltaTime: number = 0;

    spawnInterval: number = 1500;
    spawnTime: number = 0;
    gameSpeed: number = 5;

    constructor(){
        super('PlayScene');
    };

    create(){
        this.createEnvironment();
        this.createPlayer();
        this.createObstacles();
        this.createGameoverContainer();
        this.createAnimations();
        this.createScore();

        this.handleGameStart();
        this.handleObstacleCollisions();
        this.handleGameRestart();
    };

    update(time: number, delta: number): void {
        if(!this.isGameRunning) return;

        this.spawnTime += delta;
        if(this.spawnTime > this.spawnInterval){
            this.spawnObstacle();
            this.spawnTime = 0;
        };

        this.scoreDeltaTime += delta;
        if(this.scoreDeltaTime > this.scoreInterval){
            this.score++;
            console.log(this.score);
            this.scoreDeltaTime = 0;
        }

        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
        Phaser.Actions.IncX(this.clouds.getChildren(), -0.5);

        //Increase score text
        const score = Array.from(String(this.score), Number);
        for(let i = 0; i < 5 - String(this.score).length; i++){
            score.unshift(0);
        }
        this.scoreText.setText(score.join(''));

        //Remove obstacles that are out of the screen
        this.obstacles.getChildren().forEach( (obstacles: SpriteWithDynamicBody) => {
            if(obstacles.getBounds().right < 0){
                this.obstacles.remove(obstacles);
            }
        });

        this.clouds.getChildren().forEach( (cloud: SpriteWithDynamicBody) => {
            if(cloud.getBounds().right < 0){
                cloud.x = this.gameWidth + Phaser.Math.Between(10, 30);
            }
        });

        this.ground.tilePositionX += this.gameSpeed;
    };

    // --Custom methods--

    createPlayer(){
        this.player = new Player(this, 0, this.gameHeight, 'dino-run');
    };

    createEnvironment(){
        this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1)

        this.clouds = this.add.group();
        this.clouds = this.clouds.addMultiple([
            this.add.image(this.gameWidth / 2, 170, 'cloud'),
            this.add.image(this.gameWidth - 80, 80, 'cloud'),
            this.add.image(this.gameWidth / 1.3, 100, 'cloud'),
        ]);
        this.clouds.setAlpha(0);
    };

    createObstacles(){
        this.obstacles = this.physics.add.group();
    };

    createGameoverContainer(){
        this.gameOverText = this.add.image(0, 0, 'game-over');
        this.restartText = this.add.image(0, 80, 'restart').setInteractive();
        this.gameOverContainer = this.add
            .container(this.gameWidth / 2, (this.gameHeight / 2) - 50)
            .add([this.gameOverText, this.restartText])
            .setAlpha(0);
    };

    createAnimations(){
        this.anims.create({
            key: 'enemy-bird-fly',
            frames: this.anims.generateFrameNumbers('enemy-bird'),
            frameRate: 6,
            repeat: -1,
        })
    }

    createScore(){
        this.scoreText = this.add.text(this.gameWidth - 10, 10, '00000', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '535353',
            resolution: 4,
        })
        .setOrigin(1, 0)
        .setAlpha(0)
    }

    spawnObstacle(){
        const obstaclesCount = PRELOAD_CONFIG.cactusesCount + PRELOAD_CONFIG.birdsCount
        const obstacleNumber = Math.floor(Math.random() * obstaclesCount) + 1;
        // const obstacleNumber = 7; // for testing bird obstacle...
        const distance = Phaser.Math.Between(150, 300);
        let obstacle;

        if(obstacleNumber > PRELOAD_CONFIG.cactusesCount){
            const enemyPossibleHeight = [20, 70];
            const enemyHeight = enemyPossibleHeight[Math.floor(Math.random() * 2)];
            obstacle = this.obstacles.create((this.gameWidth + distance), (this.gameHeight - enemyHeight), `enemy-bird`)
                .setBodySize(80, 40)
            obstacle.play('enemy-bird-fly', true);
        } else {
            obstacle = this.obstacles.create((this.gameWidth + distance), this.gameHeight, `obstacle-${obstacleNumber}`)
        }
        
        obstacle.setOrigin(0, 1).setImmovable(true)
    };

    handleGameStart(){
        this.startTrigger = this.physics.add.sprite(0, 10, null).setOrigin(0, 1).setAlpha(0);
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
                        this.clouds.setAlpha(1);
                        this.scoreText.setAlpha(1);
                        this.isGameRunning = true;
                    }
                },
            })
        })
    };

    handleObstacleCollisions(){
        this.physics.add.collider(this.obstacles, this.player, () => {
            this.isGameRunning = false;
            this.physics.pause();
            this.anims.pauseAll();
            this.player.die();
            this.gameOverContainer.setAlpha(1);
            this.spawnTime = 0;
            this.gameSpeed = 5;
            this.scoreDeltaTime = 0;
            this.score = 0;
        })
    };

    handleGameRestart(){
        this.restartText.on('pointerdown', () => {
            this.physics.resume();
            this.player.setVelocityY(0);
            this.obstacles.clear(true, true);
            this.gameOverContainer.setAlpha(0);
            this.anims.resumeAll();
            this.isGameRunning = true;
        })
    };
    
};

export default PlayScene;