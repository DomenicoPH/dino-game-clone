export class Player extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene: Phaser.Scene, x: number, y: number, key: string){

        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();

    }

    init(){

        this
        .setOrigin(0, 1)
        .setGravityY(5000)
        .setCollideWorldBounds(true)
        .setBodySize(44, 92)

    }
}