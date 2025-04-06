import { 
    HELICOPTER_WIDTH, 
    HELICOPTER_HEIGHT, 
    HELICOPTER_SPEED,
    STAR_SIZE, 
    STAR_SPEED, 
    characters,
    POWER_UP_TYPES
} from './config.js';

// Game state
let helicopter = {
    x: 50,
    y: 0, // Will be set in initGame
    width: HELICOPTER_WIDTH,
    height: HELICOPTER_HEIGHT,
    velocityY: 0,
    color: "#f5a300",
    character: "Sunny",
};

let stars = [];
let powerUps = [];
let particles = [];
let activePowerUps = {};

// Game progress
let score = 0;
let level = 1;
let frameCount = 0;
let starsCollected = 0;

// Initialize helicopter position
export function initHelicopter(canvas) {
    helicopter.y = canvas.height / 2 - HELICOPTER_HEIGHT / 2;
}

// Helicopter update
export function updateHelicopter(inputUp, inputDown, isPointerDown, pointerY, canvas) {
    if (isPointerDown && pointerY !== null) {
        const targetY = pointerY - helicopter.height / 2;
        if (Math.abs(helicopter.y - targetY) < HELICOPTER_SPEED) {
            helicopter.y = targetY;
        } else if (helicopter.y < targetY) {
            helicopter.y += HELICOPTER_SPEED;
        } else {
            helicopter.y -= HELICOPTER_SPEED;
        }
    } else if (inputUp) {
        helicopter.velocityY = -HELICOPTER_SPEED;
        helicopter.y += helicopter.velocityY;
    } else if (inputDown) {
        helicopter.velocityY = HELICOPTER_SPEED;
        helicopter.y += helicopter.velocityY;
    } else {
        helicopter.velocityY = 0;
    }

    // Prevent going off-screen
    if (helicopter.y < 0) {
        helicopter.y = 0;
    }
    if (helicopter.y + helicopter.height > canvas.height) {
        helicopter.y = canvas.height - helicopter.height;
    }
}

// Star management
export function spawnStar(canvas, level) {
    const x = canvas.width; // Start from right edge
    const y = Math.random() * (canvas.height - STAR_SIZE); // Random height
    const speed = STAR_SPEED * (1 + (level - 1) * 0.1);
    
    stars.push({
        x,
        y,
        size: STAR_SIZE,
        speed,
        collected: false
    });
}

// Power-up management
export function spawnPowerUp(canvas, level) {
    const types = Object.keys(POWER_UP_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];

    const powerUp = {
        x: canvas.width,
        y: Math.random() * (canvas.height - STAR_SIZE),
        size: STAR_SIZE,
        speed: STAR_SPEED + level * 0.1,
        type: type,
    };
    powerUps.push(powerUp);
}

// Update game objects
export function updateStars(canvas, gameConfig) {
    frameCount++;

    // Update star positions
    for (let i = stars.length - 1; i >= 0; i--) {
        stars[i].x -= stars[i].speed * (gameConfig.speed / 3);

        // Apply magnet effect if active
        if (activePowerUps["MAGNET"]) {
            const dx = helicopter.x + helicopter.width / 2 - (stars[i].x + stars[i].size / 2);
            const dy = helicopter.y + helicopter.height / 2 - (stars[i].y + stars[i].size / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                stars[i].x += dx * 0.05;
                stars[i].y += dy * 0.05;
            }
        }

        if (stars[i].x + stars[i].size < 0) {
            stars.splice(i, 1);
        }
    }

    // Update power-up positions
    for (let i = powerUps.length - 1; i >= 0; i--) {
        powerUps[i].x -= powerUps[i].speed * (gameConfig.speed / 3);
        if (powerUps[i].x + powerUps[i].size < 0) {
            powerUps.splice(i, 1);
        }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].alpha -= 0.02;

        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    // Update power-up timers
    for (const [type, timer] of Object.entries(activePowerUps)) {
        activePowerUps[type] -= 1;
        if (activePowerUps[type] <= 0) {
            delete activePowerUps[type];
        }
    }
}

// Particle effects
export function createStarParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;

        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 5 + 2,
            color: color || "#FFD700",
            alpha: 1,
        });
    }
}

// Collision detection
export function checkCollisions(canvas, onStarCollect, onPowerUpCollect) {
    const PADDING = 15;

    // Check star collisions
    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        if (
            helicopter.x < star.x + star.size - PADDING &&
            helicopter.x + helicopter.width > star.x + PADDING &&
            helicopter.y < star.y + star.size - PADDING &&
            helicopter.y + helicopter.height > star.y + PADDING
        ) {
            stars.splice(i, 1);
            onStarCollect(star);
        }
    }

    // Check power-up collisions
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        if (
            helicopter.x < powerUp.x + powerUp.size - PADDING &&
            helicopter.x + helicopter.width > powerUp.x + PADDING &&
            helicopter.y < powerUp.y + powerUp.size - PADDING &&
            helicopter.y + helicopter.height > powerUp.y + PADDING
        ) {
            powerUps.splice(i, 1);
            onPowerUpCollect(powerUp);
        }
    }
}

// Power-up activation
export function activatePowerUp(type) {
    const duration = POWER_UP_TYPES[type].duration;
    
    if (activePowerUps[type]) {
        activePowerUps[type] = Math.min(activePowerUps[type] + duration, 1200);
    } else {
        activePowerUps[type] = duration;
    }

    return POWER_UP_TYPES[type].message;
}

// Level up
export function levelUp() {
    level++;
    starsCollected = 0;
    return level;
}

// Character selection
export function selectCharacter(index) {
    helicopter.color = characters[index].color;
    helicopter.character = characters[index].name;
    return characters[index];
}

// Getters for game state
export function getGameState() {
    return {
        helicopter,
        stars,
        powerUps,
        particles,
        activePowerUps,
        score,
        level,
        frameCount,
        starsCollected
    };
}

// Setters for game state
export function setScore(newScore) {
    score = newScore;
}

export function setStarsCollected(newStarsCollected) {
    starsCollected = newStarsCollected;
} 