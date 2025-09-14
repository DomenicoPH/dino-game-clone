import Phaser from "phaser";

class PreloadScene extends Phaser.Scene{
    constructor(){
        super('PreloadScene');
    }

    preload(){
        this.load.image('ground', 'assets/ground.png');
        this.load.image('dino-idle', 'assets/dino-idle.png');
        this.load.spritesheet('dino-run', 'assets/dino-run.png', { frameWidth: 88, frameHeight: 94 });

        this.load.image('obstacle-1', 'assets/cactuses_1.png');
        this.load.image('obstacle-2', 'assets/cactuses_2.png');
        this.load.image('obstacle-3', 'assets/cactuses_3.png');
        this.load.image('obstacle-4', 'assets/cactuses_4.png');
        this.load.image('obstacle-5', 'assets/cactuses_5.png');
        this.load.image('obstacle-6', 'assets/cactuses_6.png');
    }

    create(){
        this.scene.start('PlayScene');
    }
};

export default PreloadScene;