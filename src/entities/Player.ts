import { GameScene } from "../scenes/GameScene";

export class Player extends Phaser.Physics.Arcade.Sprite {

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    scene: GameScene;

    constructor(scene: GameScene, x: number, y: number, key: string){
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    init(){
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this
            .setOrigin(0, 1)
            .setGravityY(5000)
            .setCollideWorldBounds(true)
            .setBodySize(44, 92)
            this.registerAnimations();
    }

    update(){
        const { space } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();
        if(isSpaceJustDown && onFloor){
            this.setVelocityY(-1600);
        }
        if(!this.scene.isGameRunning){
            return;
        }
        if(this.body.deltaAbsY() > 0){
            this.anims.stop();
            this.setTexture('dino-run', 0);
        } else {
            this.playRunAnimation();
        }
    }

    playRunAnimation(){
        this.play('dino-run', true);
    }
    registerAnimations(){
        this.anims.create({
            key: 'dino-run',
            frames: this.anims.generateFrameNames('dino-run', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1,
        })
    }
}