class AudioManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmOscillator = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    setMuted(muted) {
        this.muted = muted;
        if (this.ctx) {
            if (muted) {
                this.ctx.suspend();
            } else {
                this.ctx.resume();
            }
        }
    }

    playTone(freq, type, duration, startTime = 0) {
        if (this.muted || !this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }

    playClick() {
        this.init();
        this.playTone(400, 'square', 0.1);
    }

    playCorrect() {
        this.init();
        // Ding ding!
        this.playTone(600, 'square', 0.1, 0);
        this.playTone(800, 'square', 0.2, 0.1);
    }

    playWrong() {
        this.init();
        // Buzz...
        this.playTone(150, 'sawtooth', 0.3);
    }

    playWin() {
        this.init();
        // Fanfare
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            this.playTone(freq, 'square', 0.2, i * 0.15);
        });
    }
}

export const audioManager = new AudioManager();
