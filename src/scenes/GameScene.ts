
export class GameScene extends Phaser.Scene {

    get gameHeight(){ return this.game.config.height as number };
    get gameWidth(){ return this.game.config.width as number };
    isGameRunning: boolean = false;

    constructor(key: string){
        super(key);
    }
}