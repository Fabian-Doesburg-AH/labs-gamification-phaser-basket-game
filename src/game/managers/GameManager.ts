import * as Phaser from 'phaser';
import { Basket } from '../objects/Basket';
import { ObjectPool } from '../objects/ObjectPool';
import { Fruit } from '../objects/Fruit';
import { InputManager } from './InputManager';
import { ScoreManager } from './ScoreManager';
import { GAME_SETTINGS } from '../constants/GameSettings';
import { FRUIT_CONFIG } from '../constants/GameObjects';
import { GAME_CONFIG } from '../constants/GameConfig';

export class GameManager {
    private scene: Phaser.Scene;
    private basket: Basket;
    private objectPool: ObjectPool;
    private inputManager: InputManager;
    private scoreManager: ScoreManager;

    private spawnTimer: number = 0;
    private gameTimer: number = 0;
    private difficultyTimer: number = 0;
    private isGameActive: boolean = true;

    private currentSpawnRate: number = GAME_SETTINGS.FRUIT_SPAWN_RATE;
    private currentFallSpeed: number = GAME_SETTINGS.FRUIT_FALL_SPEED;

    private gameOverCallback: ((score: number) => void) | null = null;
    private timerCallback: ((remainingMs: number) => void) | null = null;

    constructor(
        scene: Phaser.Scene,
        basket: Basket,
        objectPool: ObjectPool,
        inputManager: InputManager,
        scoreManager: ScoreManager
    ) {
        this.scene = scene;
        this.basket = basket;
        this.objectPool = objectPool;
        this.inputManager = inputManager;
        this.scoreManager = scoreManager;

        this.setupInput();
        this.setupCollisions();
    }

    private setupInput(): void {
        this.inputManager.onInput((direction) => {
            if (!this.isGameActive) return;
            if (direction === 'left') this.basket.moveLeft();
            else if (direction === 'right') this.basket.moveRight();
            else this.basket.stop();
        });

        this.inputManager.onDrag((x) => {
            if (!this.isGameActive) return;
            this.basket.setTargetX(x);
        });
    }

    private setupCollisions(): void {
        for (const fruit of this.objectPool.getPool()) {
            this.scene.physics.add.overlap(
                this.basket.getSprite(),
                fruit.getSprite(),
                () => this.onFruitCaught(fruit)
            );
        }
    }

    private onFruitCaught(fruit: Fruit): void {
        if (!this.isGameActive || !fruit.getActive()) return;
        this.scoreManager.addScore(fruit.getPoints());
        this.objectPool.return(fruit);
    }

    private spawnFruit(): void {
        const fruit = this.objectPool.get();
        if (!fruit) return;
        const x = Phaser.Math.Between(
            FRUIT_CONFIG.WIDTH,
            GAME_CONFIG.WIDTH - FRUIT_CONFIG.WIDTH
        );
        fruit.setPosition(x, FRUIT_CONFIG.SPAWN_Y);
        fruit.setFallSpeed(this.currentFallSpeed);
    }

    private scaleDifficulty(): void {
        const d = GAME_SETTINGS.DIFFICULTY;
        this.currentSpawnRate = Math.max(
            d.SPAWN_RATE_MIN,
            this.currentSpawnRate * d.SPAWN_RATE_SCALE
        );
        this.currentFallSpeed = Math.min(
            d.FALL_SPEED_MAX,
            this.currentFallSpeed * d.FALL_SPEED_SCALE
        );
    }

    public onGameOverEvent(callback: (score: number) => void): void {
        this.gameOverCallback = callback;
    }

    public onTimerUpdate(callback: (remainingMs: number) => void): void {
        this.timerCallback = callback;
    }

    public update(delta: number): void {
        if (!this.isGameActive) return;

        // Difficulty scaling
        this.difficultyTimer += delta;
        if (this.difficultyTimer >= GAME_SETTINGS.DIFFICULTY.SCALE_INTERVAL) {
            this.difficultyTimer = 0;
            this.scaleDifficulty();
        }

        // Fruit spawning
        this.spawnTimer += delta;
        if (this.spawnTimer >= this.currentSpawnRate) {
            this.spawnTimer = 0;
            this.spawnFruit();
        }

        for (const fruit of this.objectPool.getAll()) {
            fruit.update();
            if (!fruit.getActive()) {
                this.objectPool.return(fruit);
            }
        }

        this.gameTimer += delta;
        const remaining = Math.max(0, GAME_SETTINGS.GAME_DURATION - this.gameTimer);
        this.timerCallback?.(remaining);

        if (this.gameTimer >= GAME_SETTINGS.GAME_DURATION) {
            this.endGame();
        }
    }

    private endGame(): void {
        this.isGameActive = false;
        this.basket.stop();
        this.gameOverCallback?.(this.scoreManager.getScore());
    }
}