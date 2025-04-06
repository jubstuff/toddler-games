import { gameConfig } from './config.js';
export class SoundManager {
    constructor() {
        this.collectSound = document.getElementById("collectSound");
        this.levelUpSound = document.getElementById("levelUpSound");
        this.bgMusic = document.getElementById("bgMusic");
    }

    playSound(type) {
        if (!gameConfig.sound) return;

        let sound;
        switch (type) {
            case "collect":
                sound = this.collectSound;
                break;
            case "levelup":
                sound = this.levelUpSound;
                break;
            case "powerup":
                sound = this.collectSound; // Reuse collect sound for now
                break;
            case "select":
                sound = this.collectSound; // Reuse collect sound for now
                break;
        }

        if (sound && sound.readyState >= 2) {
            sound.currentTime = 0;
            sound.play().catch((e) => console.log("Sound play failed:", e));
        }
    }

    toggleBackgroundMusic(play) {
        if (play) {
            this.bgMusic.play().catch((e) => console.log("BG music play failed:", e));
        } else {
            this.bgMusic.pause();
        }
    }
} 