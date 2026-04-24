import * as Phaser from 'phaser';

export type InputCallback = (direction: 'left' | 'right' | 'stop') => void;

export class InputManager {
    private scene: Phaser.Scene;
    private keys: { [key: string]: Phaser.Input.Keyboard.Key };
    private callback: InputCallback | null = null;
    private lastDirection: 'left' | 'right' | 'stop' = 'stop';
    private touchDirection: 'left' | 'right' | 'stop' = 'stop';

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.keys = this.scene.input.keyboard!.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
        }) as any;

        this.setupTouch();
    }

    private static readonly DRAG_THRESHOLD = 2;
    private lastPointerX: number | null = null;

    private setupTouch(): void {
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.lastPointerX = pointer.x;
            this.touchDirection = 'stop';
        });

        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!pointer.isDown || this.lastPointerX === null) return;
            const dx = pointer.x - this.lastPointerX;
            if (Math.abs(dx) < InputManager.DRAG_THRESHOLD) return;
            this.touchDirection = dx > 0 ? 'right' : 'left';
            this.lastPointerX = pointer.x;
        });

        const endDrag = () => {
            this.lastPointerX = null;
            this.touchDirection = 'stop';
        };
        this.scene.input.on('pointerup', endDrag);
        this.scene.input.on('pointerupoutside', endDrag);
    }

    public onInput(callback: InputCallback): void {
        this.callback = callback;
    }

    public update(): void {
        let direction: 'left' | 'right' | 'stop' = 'stop';

        if (this.keys.left.isDown || this.keys.a.isDown) {
            direction = 'left';
        } else if (this.keys.right.isDown || this.keys.d.isDown) {
            direction = 'right';
        } else if (this.touchDirection !== 'stop') {
            direction = this.touchDirection;
        }

        if (direction !== this.lastDirection) {
            this.lastDirection = direction;
            if (this.callback) {
                this.callback(direction);
            }
        }
        this.touchDirection = 'stop';
    }

    public destroy(): void {
        this.keys.left.destroy();
        this.keys.right.destroy();
        this.keys.a.destroy();
        this.keys.d.destroy();
        this.scene.input.removeAllListeners('pointerdown');
        this.scene.input.removeAllListeners('pointermove');
        this.scene.input.removeAllListeners('pointerup');
        this.scene.input.removeAllListeners('pointerupoutside');
    }
}
