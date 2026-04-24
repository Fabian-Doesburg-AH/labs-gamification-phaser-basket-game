import * as Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { GAME_CONFIG } from './constants/GameConfig';
import { PHYSICS_CONFIG } from './constants/Physics';

export function createGame(parent: HTMLElement): Phaser.Game {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: GAME_CONFIG.WIDTH,
        height: GAME_CONFIG.HEIGHT,
        backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
        parent,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: GAME_CONFIG.WIDTH,
            height: GAME_CONFIG.HEIGHT,
        },
        input: {
            activePointers: 1,
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { x: 0, y: PHYSICS_CONFIG.GRAVITY_Y },
                debug: false,
            },
        },
        scene: [GameScene],
    };

    return new Phaser.Game(config);
}

