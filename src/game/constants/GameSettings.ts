export const GAME_SETTINGS = {
    BASKET_SPEED: 800,
    FRUIT_SPAWN_RATE: 1000,
    FRUIT_FALL_SPEED: 150,
    INITIAL_SCORE: 0,
    GAME_DURATION: 60000,

    /** Difficulty scaling — tweak these to change how fast the game ramps up */
    DIFFICULTY: {
        SCALE_INTERVAL:    6666,
        SPAWN_RATE_SCALE:  0.80,
        SPAWN_RATE_MIN:    300,
        FALL_SPEED_SCALE:  1.15,
        FALL_SPEED_MAX:    700,
    },
} as const;
