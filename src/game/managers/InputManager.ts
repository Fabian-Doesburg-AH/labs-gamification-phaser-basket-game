import * as Phaser from 'phaser';

export type InputCallback = (direction: 'left' | 'right' | 'stop') => void;
export type DragCallback = (x: number) => void;

export class InputManager {
    private scene: Phaser.Scene;
    private keys: { [key: string]: Phaser.Input.Keyboard.Key };
    private callback: InputCallback | null = null;
    private dragCallback: DragCallback | null = null;
    private lastDirection: 'left' | 'right' | 'stop' = 'stop';

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

    private setupTouch(): void {
        const emit = (pointer: Phaser.Input.Pointer) => {
            if (!pointer.isDown) return;
            // pointer.x is already in game-space (accounts for Scale.FIT).
            this.dragCallback?.(pointer.x);
        };

        this.scene.input.on('pointerdown', emit);
        this.scene.input.on('pointermove', emit);
    }

    public onInput(callback: InputCallback): void {
        this.callback = callback;
    }

    /** Fires the absolute game-space X of the pointer while dragging. */
    public onDrag(callback: DragCallback): void {
        this.dragCallback = callback;
    }

    public update(): void {
        let direction: 'left' | 'right' | 'stop' = 'stop';

        if (this.keys.left.isDown || this.keys.a.isDown) {
            direction = 'left';
        } else if (this.keys.right.isDown || this.keys.d.isDown) {
            direction = 'right';
        }

        if (direction !== this.lastDirection) {
            this.lastDirection = direction;
            this.callback?.(direction);
        }
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
