import * as Phaser from 'phaser';
import { Basket } from '../objects/Basket';
import { ObjectPool } from '../objects/ObjectPool';
import { InputManager } from '../managers/InputManager';
import { ScoreManager } from '../managers/ScoreManager';
import { GameManager } from '../managers/GameManager';
import { GAME_CONFIG } from '../constants/GameConfig';
import { GAME_SETTINGS } from '../constants/GameSettings';
import { TEXT_CONFIG } from '../constants/GameObjects';
import { ASSET_CONFIG } from '../constants/Assets';

export class GameScene extends Phaser.Scene {
    private basket!: Basket;
    private objectPool!: ObjectPool;
    private inputManager!: InputManager;
    private scoreManager!: ScoreManager;
    private gameManager!: GameManager;

    private scoreText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private gameOverText?: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'GameScene' });
    }

    public preload(): void {
        // Load images for any asset slots that have been configured
        if (ASSET_CONFIG.FRUIT.textureKey && ASSET_CONFIG.FRUIT.imagePath) {
            this.load.image(ASSET_CONFIG.FRUIT.textureKey, ASSET_CONFIG.FRUIT.imagePath);
        }
        if (ASSET_CONFIG.BASKET.textureKey && ASSET_CONFIG.BASKET.imagePath) {
            this.load.image(ASSET_CONFIG.BASKET.textureKey, ASSET_CONFIG.BASKET.imagePath);
        }
    }

    public create(): void {
        this.gameOverText = undefined;
        this.physics.world.setBounds(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
        this.basket = new Basket(this, GAME_SETTINGS.BASKET_SPEED);
        this.objectPool = new ObjectPool(this, 20);
        this.inputManager = new InputManager(this);
        this.scoreManager = new ScoreManager(GAME_SETTINGS.INITIAL_SCORE);
        this.gameManager = new GameManager(
            this,
            this.basket,
            this.objectPool,
            this.inputManager,
            this.scoreManager
        );

        this.scoreText = this.add.text(
            TEXT_CONFIG.SCORE_X,
            TEXT_CONFIG.SCORE_Y,
            `Score: ${this.scoreManager.getScore()}`,
            { fontSize: TEXT_CONFIG.SCORE_FONT_SIZE, color: TEXT_CONFIG.SCORE_COLOR }
        );

        this.timerText = this.add.text(
            TEXT_CONFIG.TIMER_X,
            TEXT_CONFIG.TIMER_Y,
            `${Math.ceil(GAME_SETTINGS.GAME_DURATION / 1000)}`,
            { fontSize: TEXT_CONFIG.TIMER_FONT_SIZE, color: TEXT_CONFIG.TIMER_COLOR }
        );

        this.scoreManager.onScoreChanged((score) => {
            this.scoreText.setText(`Score: ${score}`);
        });
        this.gameManager.onTimerUpdate((remainingMs) => {
            this.timerText.setText(`${Math.ceil(remainingMs / 1000)}`);
        });
        this.gameManager.onGameOverEvent((finalScore) => {
            this.showGameOver(finalScore);
        });
    }

    public update(_time: number, delta: number): void {
        this.inputManager.update();
        this.gameManager.update(delta);
        this.basket.update();
    }

    private showGameOver(finalScore: number): void {
        if (this.gameOverText) return;
        this.gameOverText = this.add
            .text(
                GAME_CONFIG.WIDTH / 2,
                GAME_CONFIG.HEIGHT / 2,
                `Game Over\nScore: ${finalScore}\nPress SPACE to restart`,
                {
                    fontSize: TEXT_CONFIG.GAME_OVER_FONT_SIZE,
                    color: TEXT_CONFIG.GAME_OVER_COLOR,
                    align: 'center',
                }
            )
            .setOrigin(0.5);

        this.input.keyboard?.once('keydown-SPACE', () => {
            this.scene.restart();
        });
        this.input.once('pointerdown', () => {
            this.scene.restart();
        });
    }
}

