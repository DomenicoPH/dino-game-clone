import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import PlayScene from "./scenes/PlayScene";
import { GameScene } from "./scenes/GameScene";

export const PRELOAD_CONFIG = {
  cactusesCount: 6,
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 340,
  pixelArt: true,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  fps: {
    target: 120,
    forceSetTimeOut: true,
  },
  scene: [PreloadScene, GameScene, PlayScene]
};

new Phaser.Game(config);