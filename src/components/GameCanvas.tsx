import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';
import { createGame } from '../game/Game';

export function GameCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (!containerRef.current || gameRef.current) return;
        gameRef.current = createGame(containerRef.current);

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100vw',
                height: '100vh',
                maxWidth: '100%',
                margin: 0,
                display: 'block',
                touchAction: 'none',
                overflow: 'hidden',
            }}
        />
    );
}

