/**
 * Deterministic color generator for globe regions
 * Generates unique green-ish hues based on a key string
 */

// Simple hash function for deterministic color generation
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Generate a glow color for a region key
 * Keeps hue in green range (110-160)
 * Varies saturation and lightness for uniqueness
 */
export function getGlowColor(key: string): string {
    const hash = hashString(key);

    // Hue: 110-160 (green to cyan-green range)
    const hue = 110 + (hash % 50);

    // Saturation: 70-100%
    const saturation = 70 + (hash % 30);

    // Lightness: 45-65%
    const lightness = 45 + ((hash >> 8) % 20);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get a glow color with specified alpha
 */
export function getGlowColorWithAlpha(key: string, alpha: number): string {
    const hash = hashString(key);

    const hue = 110 + (hash % 50);
    const saturation = 70 + (hash % 30);
    const lightness = 45 + ((hash >> 8) % 20);

    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

/**
 * Get a dimmer version of the glow color (for non-active states)
 */
export function getDimGlowColor(key: string): string {
    const hash = hashString(key);

    const hue = 110 + (hash % 50);
    const saturation = 40 + (hash % 20);
    const lightness = 25 + ((hash >> 8) % 15);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Generate particle color for a region
 */
export function getParticleColor(key: string): string {
    const hash = hashString(key);

    const hue = 115 + (hash % 40);
    const saturation = 80 + (hash % 20);
    const lightness = 55 + ((hash >> 4) % 15);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Convert HSL to RGB hex color for Three.js compatibility
 */
export function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Get a hex color for Three.js materials
 */
export function getGlowColorHex(key: string): string {
    const hash = hashString(key);

    const hue = 110 + (hash % 50);
    const saturation = 70 + (hash % 30);
    const lightness = 45 + ((hash >> 8) % 20);

    return hslToHex(hue, saturation, lightness);
}
