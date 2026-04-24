import * as Phaser from 'phaser';
import { GameObject, type GameObjectConfig } from './GameObject';
import { BASKET_CONFIG } from '../constants/GameObjects.ts';
import { PHYSICS_CONFIG } from '../constants/Physics.ts';
import { ASSET_CONFIG } from '../constants/Assets.ts';


export class Basket extends GameObject {
    private moveSpeed: number;
    private targetX: number | null = null;

    constructor(scene: Phaser.Scene, moveSpeed: number) {
        const config: GameObjectConfig = {
            x: BASKET_CONFIG.START_X,
            y: BASKET_CONFIG.START_Y,
            width: BASKET_CONFIG.WIDTH,
            height: BASKET_CONFIG.HEIGHT,
            color: BASKET_CONFIG.COLOR,
            textureKey: ASSET_CONFIG.BASKET.textureKey || undefined,
        };

        super(scene, config);
        this.moveSpeed = moveSpeed;
        this.setupPhysics();
    }

    private setupPhysics(): void {
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setBounce(PHYSICS_CONFIG.BOUNCE);
        body.setDrag(PHYSICS_CONFIG.FRICTION);
    }

    public moveLeft(): void {
        this.targetX = null;
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(-this.moveSpeed);
    }

    public moveRight(): void {
        this.targetX = null;
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(this.moveSpeed);
    }

    public stop(): void {
        this.targetX = null;
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(0);
    }

    /** Sets a target X position; the basket will move toward it at `moveSpeed`. */
    public setTargetX(x: number): void {
        const halfW = this.config.width / 2;
        const worldW = this.scene.physics.world.bounds.width;
        this.targetX = Phaser.Math.Clamp(x, halfW, worldW - halfW);
    }

    public update(): void {
        if (this.targetX === null) return;

        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        const dx = this.targetX - this.sprite.x;
        // Stop when close enough that one frame at moveSpeed would overshoot.
        const epsilon = Math.max(1, (this.moveSpeed * (this.scene.game.loop.delta ?? 16)) / 1000);

        if (Math.abs(dx) <= epsilon) {
            this.sprite.setX(this.targetX);
            body.setVelocityX(0);
            this.targetX = null;
            return;
        }

        body.setVelocityX(dx > 0 ? this.moveSpeed : -this.moveSpeed);
    }
}
