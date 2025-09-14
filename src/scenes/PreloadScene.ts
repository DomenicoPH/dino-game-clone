import Phaser from "phaser";

class PreloadScene extends Phaser.Scene{
    constructor(){
        super('PreloadScene');
    }

    preload(){
        this.load.image('ground', 'assets/ground.png');
        this.load.image('dino-idle', 'assets/dino-idle.png');
        this.load.spritesheet('dino-run', 'assets/dino-run.png', { frameWidth: 88, frameHeight: 94 });
    }

    create(){
        this.scene.start('PlayScene');
    }
};

export default PreloadScene;