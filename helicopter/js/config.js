// Game configuration (adjustable by parent settings)
export const gameConfig = {
    speed: 3,
    sound: true,
    difficulty: "normal",
};

// Game constants
export const HELICOPTER_WIDTH = 120; // Increased for better visibility
export const HELICOPTER_HEIGHT = 100; // Increased for better visibility
export const HELICOPTER_SPEED = 5; // Reduced for easier control
export const STAR_SIZE = 60; // Increased for better visibility
export const STAR_SPEED = 1;
export const STAR_SPAWN_RATE = 300; // More time between stars
export const STARS_PER_LEVEL = 5; // Fewer stars needed to level up for young kids

// Character definitions
export const characters = [
    { name: "Sunny", color: "#f5a300", unlocked: true, image: "sunny.png" },
    { name: "Blueberry", color: "#4a90e2", unlocked: true, image: "blueberry.png" },
    { name: "Pinky", color: "#E91E63", unlocked: false, image: "pinky.png" },
    { name: "Leafy", color: "#4CAF50", unlocked: false, image: "leafy.png" },
];

// Power-up types and properties
export const POWER_UP_TYPES = {
    MAGNET: {
        color: "#FF00FF",
        icon: "🧲",
        message: "Star Magnet!",
        duration: 600 // 10 seconds at 60fps
    },
    DOUBLE_POINTS: {
        color: "#00FFFF",
        icon: "2️⃣",
        message: "Double Stars!",
        duration: 600
    },
    SHIELD: {
        color: "#FFD700",
        icon: "🛡️",
        message: "Shield Activated!",
        duration: 600
    }
}; 