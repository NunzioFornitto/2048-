class HapticEngine {
    constructor() { this.enabled = true; }
    trigger(pattern) {
        if (this.enabled && typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate(pattern); } catch (e) { }
        }
    }
    light() { this.trigger(10); }
    medium() { this.trigger(25); }
    heavy() { this.trigger(50); }
    success() { this.trigger([50, 50, 50]); }
    failure() { this.trigger([50, 100, 50]); }
}
export const haptic = new HapticEngine();
