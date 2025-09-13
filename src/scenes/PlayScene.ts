import Phaser from "phaser";

class PlayScene extends Phaser.Scene{

    get gameHeight(){ return this.game.config.height as number };
    get gameWidth(){ return this.game.config.width as number };

    constructor(){
        super('PlayScene');
    }

    create(){
        this.add
            .tileSprite(0, this.gameHeight, this.gameWidth, 26, 'ground')
            .setOrigin(0, 1)
    }

};

export default PlayScene;