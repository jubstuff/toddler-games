import { characters, POWER_UP_TYPES, gameConfig } from './config.js';
import { selectCharacter } from './objects.js';

export class UIManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.scoreElement = document.getElementById("score");
        this.levelElement = document.getElementById("level");
        this.progressFill = document.getElementById("progressFill");
        this.characterSelect = document.getElementById("characterSelect");
        this.parentButton = document.getElementById("parentButton");
        this.parentPanel = document.getElementById("parentPanel");

        this.setupParentControls();
        this.initCharacterSelect();
    }

    setupParentControls() {
        this.parentButton.addEventListener("click", () => {
            this.parentPanel.style.display =
                this.parentPanel.style.display === "none" ? "block" : "none";
        });

        document.getElementById("difficultySlider").addEventListener("input", (e) => {
            gameConfig.speed = parseInt(e.target.value);
        });

        document.getElementById("soundToggle").addEventListener("change", (e) => {
            gameConfig.sound = e.target.checked;
        });
    }

    initCharacterSelect() {
        characters.forEach((char, index) => {
            const btn = document.createElement("div");
            btn.className = `character-btn ${char.unlocked ? "" : "locked"}`;
            btn.style.backgroundColor = char.color;

            if (char.unlocked) {
                btn.addEventListener("click", () => {
                    this.handleCharacterSelect(index);
                });
            } else {
                btn.addEventListener("click", () => {
                    alert("This character is available in the premium version!");
                });
            }

            this.characterSelect.appendChild(btn);
        });
    }

    handleCharacterSelect(index) {
        const selectedChar = selectCharacter(index);
        
        // Update visual selection
        const btns = document.querySelectorAll(".character-btn");
        btns.forEach((btn, i) => {
            if (i === index) {
                btn.style.border = "4px solid #FF9800";
            } else {
                btn.style.border = "4px solid #333";
            }
        });

        return selectedChar;
    }

    drawHelicopter(helicopter, frameCount) {
        // Main body
        this.ctx.fillStyle = helicopter.color;
        this.ctx.fillRect(
            helicopter.x,
            helicopter.y,
            helicopter.width,
            helicopter.height
        );

        // Eyes
        this.ctx.fillStyle = "#FFF";
        this.ctx.beginPath();
        this.ctx.arc(
            helicopter.x + helicopter.width * 0.8,
            helicopter.y + helicopter.height * 0.3,
            10,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        this.ctx.fillStyle = "#000";
        this.ctx.beginPath();
        this.ctx.arc(
            helicopter.x + helicopter.width * 0.8,
            helicopter.y + helicopter.height * 0.3,
            5,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Smile
        this.ctx.beginPath();
        this.ctx.arc(
            helicopter.x + helicopter.width * 0.7,
            helicopter.y + helicopter.height * 0.6,
            20,
            0,
            Math.PI
        );
        this.ctx.stroke();

        // Rotor
        this.ctx.save();
        this.ctx.translate(helicopter.x + helicopter.width / 2, helicopter.y - 15);
        this.ctx.rotate(frameCount * 0.2);
        this.ctx.fillStyle = "#A9A9A9";
        this.ctx.fillRect(-30, -2, 60, 4);
        this.ctx.restore();

        // Tail
        this.ctx.fillStyle = "#DC143C";
        this.ctx.fillRect(
            helicopter.x - 15,
            helicopter.y + helicopter.height / 2 - 5,
            15,
            10
        );
    }

    drawStar(star) {
        this.ctx.fillStyle = "#FFD700";
        this.ctx.beginPath();

        let rot = (Math.PI / 2) * 3;
        let x = star.x + star.size / 2;
        let y = star.y + star.size / 2;
        let step = Math.PI / 5;
        let outerRadius = star.size / 2;
        let innerRadius = star.size / 4;

        this.ctx.moveTo(x, y - outerRadius);
        for (let i = 0; i < 5; i++) {
            this.ctx.lineTo(
                x + Math.cos(rot) * outerRadius,
                y + Math.sin(rot) * outerRadius
            );
            rot += step;
            this.ctx.lineTo(
                x + Math.cos(rot) * innerRadius,
                y + Math.sin(rot) * innerRadius
            );
            rot += step;
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawPowerUp(powerUp) {
        const powerUpType = POWER_UP_TYPES[powerUp.type];
        
        this.ctx.fillStyle = powerUpType.color;
        this.ctx.beginPath();
        this.ctx.arc(
            powerUp.x + powerUp.size / 2,
            powerUp.y + powerUp.size / 2,
            powerUp.size / 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Icon
        this.ctx.fillStyle = "#FFF";
        this.ctx.font = "24px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(
            powerUpType.icon,
            powerUp.x + powerUp.size / 2,
            powerUp.y + powerUp.size / 2
        );
    }

    drawParticles(particles) {
        particles.forEach((p) => {
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }

    drawActivePowerUps(activePowerUps) {
        const powerUpX = 10;
        let powerUpY = 10;

        for (const [type, timer] of Object.entries(activePowerUps)) {
            const powerUpType = POWER_UP_TYPES[type];

            // Background
            this.ctx.fillStyle = powerUpType.color;
            this.ctx.globalAlpha = 0.7;
            this.ctx.fillRect(powerUpX, powerUpY, 100, 30);
            this.ctx.globalAlpha = 1;

            // Icon and timer
            this.ctx.fillStyle = "#FFF";
            this.ctx.font = "20px Arial";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(
                `${powerUpType.icon} ${Math.ceil(timer / 60)}s`,
                powerUpX + 10,
                powerUpY + 15
            );

            powerUpY += 40;
        }
    }

    updateScore(score, level, starsCollected, STARS_PER_LEVEL) {
        this.scoreElement.textContent = `Stars: ${score}`;
        this.levelElement.textContent = `Level: ${level}`;
        this.progressFill.style.width = `${(starsCollected / STARS_PER_LEVEL) * 100}%`;
    }

    showFloatingText(text, x, y, size = 24) {
        const floatingText = document.createElement("div");
        floatingText.textContent = text;
        floatingText.style.position = "absolute";
        floatingText.style.color = "#FFD700";
        floatingText.style.fontSize = `${size}px`;
        floatingText.style.fontWeight = "bold";
        floatingText.style.textShadow = "2px 2px 0 #000";
        floatingText.style.left = `${this.canvas.offsetLeft + x}px`;
        floatingText.style.top = `${this.canvas.offsetTop + y}px`;
        floatingText.style.transform = "translate(-50%, -50%)";
        floatingText.style.pointerEvents = "none";
        floatingText.style.zIndex = "1000";
        document.body.appendChild(floatingText);

        // Animate
        floatingText.animate(
            [
                { opacity: 1, transform: "translate(-50%, -50%)" },
                { opacity: 0, transform: "translate(-50%, -100px)" },
            ],
            {
                duration: 1000,
                easing: "ease-out",
            }
        );

        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(floatingText);
        }, 1000);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
} 