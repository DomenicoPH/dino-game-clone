import Phaser from "phaser";

class PlayScene extends Phaser.Scene{

    get gameHeight(){ return this.game.config.height as number };
    get gameWidth(){ return this.game.config.width as number };

    constructor(){
        super('PlayScene');
    };

    create(){
        this.createEnvironment();
        this.createPlayer();
    };

    createPlayer(){
        this.physics.add.sprite(0, this.gameHeight, 'dino-idle')
        .setOrigin(0, 1)
    }

    createEnvironment(){
        this.add
            .tileSprite(0, this.gameHeight, 88, 26, 'ground')
            .setOrigin(0, 1)
    };

};

export default PlayScene;