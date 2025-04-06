import { gameConfig, STAR_SPAWN_RATE, STARS_PER_LEVEL, POWER_UP_TYPES } from './config.js';
import { 
    initHelicopter, 
    updateHelicopter, 
    updateStars, 
    checkCollisions, 
    createStarParticles,
    activatePowerUp,
    levelUp,
    getGameState,
    setScore,
    setStarsCollected,
    spawnStar
} from './objects.js';
import { InputHandler } from './input.js';
import { SoundManager } from './sound.js';
import { UIManager } from './ui.js';
import { Tutorial } from './tutorial.js';

class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.gameRunning = false;
        this.isFirstPlay = true;

        this.inputHandler = new InputHandler(this.canvas);
        this.soundManager = new SoundManager();
        this.uiManager = new UIManager(this.canvas, this.ctx);
        this.tutorial = new Tutorial(this.canvas, () => this.startGame());

        this.initGame();
    }

    initGame() {
        initHelicopter(this.canvas);

        if (this.isFirstPlay) {
            setTimeout(() => this.tutorial.show(), 500);
        } else {
            this.startGame();
        }
    }

    startGame() {
        this.gameRunning = true;
        this.isFirstPlay = false;

        if (gameConfig.sound) {
            this.soundManager.toggleBackgroundMusic(true);
        }

        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameRunning) {
            requestAnimationFrame(() => this.gameLoop());
            return;
        }

        const inputState = this.inputHandler.getInputState();
        const gameState = getGameState();

        // Update game objects
        updateHelicopter(
            inputState.moveUp,
            inputState.moveDown,
            inputState.isPointerDown,
            inputState.pointerY,
            this.canvas
        );

        // Spawn new stars based on level
        if (gameState.frameCount % STAR_SPAWN_RATE === 0) {
            spawnStar(this.canvas, gameState.level);
        }

        updateStars(this.canvas, gameConfig);

        // Check collisions
        checkCollisions(
            this.canvas,
            (star) => this.handleStarCollect(star),
            (powerUp) => this.handlePowerUpCollect(powerUp)
        );

        // Draw everything
        this.uiManager.clearCanvas();
        this.uiManager.drawHelicopter(gameState.helicopter, gameState.frameCount);
        gameState.stars.forEach(star => this.uiManager.drawStar(star));
        gameState.powerUps.forEach(powerUp => this.uiManager.drawPowerUp(powerUp));
        this.uiManager.drawParticles(gameState.particles);
        this.uiManager.drawActivePowerUps(gameState.activePowerUps);
        this.uiManager.updateScore(gameState.score, gameState.level, gameState.starsCollected, STARS_PER_LEVEL);

        // Next frame
        requestAnimationFrame(() => this.gameLoop());
    }

    handleStarCollect(star) {
        const gameState = getGameState();
        const points = gameState.activePowerUps["DOUBLE_POINTS"] ? 2 : 1;
        
        setScore(gameState.score + points);
        setStarsCollected(gameState.starsCollected + points);

        createStarParticles(star.x + star.size / 2, star.y + star.size / 2);
        this.soundManager.playSound("collect");
        this.uiManager.showFloatingText(`+${points}`, star.x, star.y);

        if (gameState.starsCollected >= STARS_PER_LEVEL) {
            this.handleLevelUp();
        }
    }

    handlePowerUpCollect(powerUp) {
        const message = activatePowerUp(powerUp.type);
        createStarParticles(
            powerUp.x + powerUp.size / 2,
            powerUp.y + powerUp.size / 2,
            POWER_UP_TYPES[powerUp.type].color
        );
        this.soundManager.playSound("powerup");
        this.uiManager.showFloatingText(message, this.canvas.width / 2, this.canvas.height / 2, 36);
    }

    handleLevelUp() {
        const newLevel = levelUp();
        this.soundManager.playSound("levelup");
        this.uiManager.showFloatingText(
            `Level ${newLevel}!`,
            this.canvas.width / 2,
            this.canvas.height / 2,
            48
        );

        // Particle celebration
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            createStarParticles(x, y);
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 