import * as Phaser from 'phaser';

export interface GameObjectConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    color: number;
    /** Optional texture key loaded in the scene's preload(). Leave undefined to use a coloured rectangle. */
    textureKey?: string;
}

export abstract class GameObject {
    protected sprite: Phaser.Physics.Arcade.Sprite;
    protected scene: Phaser.Scene;
    protected config: GameObjectConfig;

    constructor(scene: Phaser.Scene, config: GameObjectConfig) {
        this.scene = scene;
        this.config = config;
        this.sprite = this.createSprite();
    }

    protected createSprite(): Phaser.Physics.Arcade.Sprite {
        if (this.config.textureKey) {
            const sprite = this.scene.physics.add.sprite(
                this.config.x,
                this.config.y,
                this.config.textureKey
            );
            sprite.setDisplaySize(this.config.width, this.config.height);
            (sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
            return sprite;
        }

        const rect = this.scene.add.rectangle(
            this.config.x,
            this.config.y,
            this.config.width,
            this.config.height,
            this.config.color
        );
        this.scene.physics.add.existing(rect);
        const sprite = rect as unknown as Phaser.Physics.Arcade.Sprite;
        (sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        return sprite;
    }

    public getSprite(): Phaser.Physics.Arcade.Sprite {
        return this.sprite;
    }

    public getX(): number {
        return this.sprite.x;
    }

    public getY(): number {
        return this.sprite.y;
    }

    public setPosition(x: number, y: number): void {
        this.sprite.setPosition(x, y);
    }

    public setVelocity(vx: number, vy: number): void {
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(vx, vy);
    }

    public getVelocity(): Phaser.Math.Vector2 {
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        return new Phaser.Math.Vector2(body.velocity.x, body.velocity.y);
    }

    public destroy(): void {
        this.sprite.destroy();
    }

    public abstract update(): void;
}
