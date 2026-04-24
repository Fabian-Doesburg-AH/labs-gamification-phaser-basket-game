import fruitImg from '../../assets/fruit.png';
import basketImg from '../../assets/basket.png';
/**
 * Visual asset configuration.
 *
 * To use a custom image for an object:
 *   1. Drop the image into /src/assets/
 *   2. Set textureKey to any unique string (e.g. 'apple')
 *   3. Set imagePath to the src-relative path (e.g. 'src/assets/apple.png')
 *
 * Leave textureKey as '' to keep the default coloured rectangle.
 */
export const ASSET_CONFIG = {
    FRUIT: {
        textureKey: 'fruit',
        imagePath: fruitImg,
    },
    BASKET: {
        textureKey: 'basket',
        imagePath:  basketImg,
    },
};

