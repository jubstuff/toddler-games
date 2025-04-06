export class Tutorial {
    constructor(canvas, onComplete) {
        this.canvas = canvas;
        this.onComplete = onComplete;
        this.overlay = null;
        this.currentStep = 0;
        this.tutorialContent = [
            {
                text: "Welcome to Helicopter Star Adventure!",
                image: null,
            },
            {
                text: "Use the Up and Down arrow keys or touch the screen to move.",
                image: "controls.png",
            },
            {
                text: "Collect stars to earn points and level up!",
                image: "stars.png",
            },
            {
                text: "Watch for special power-ups!",
                image: "powerups.png",
            },
            {
                text: "Let's play!",
                image: null,
            },
        ];
    }

    show() {
        this.overlay = document.createElement("div");
        this.overlay.className = "tutorial-overlay";
        this.showStep();
        document.body.appendChild(this.overlay);
    }

    showStep() {
        this.overlay.innerHTML = "";

        const step = this.tutorialContent[this.currentStep];

        const text = document.createElement("div");
        text.className = "tutorial-text";
        text.textContent = step.text;
        this.overlay.appendChild(text);

        if (step.image) {
            const img = document.createElement("div");
            img.className = "tutorial-image";
            img.textContent = "Image placeholder";
            this.overlay.appendChild(img);
        }

        const button = document.createElement("button");
        button.className = "tutorial-button";
        button.textContent =
            this.currentStep < this.tutorialContent.length - 1 ? "Next" : "Start Game";
        button.addEventListener("click", () => this.handleButtonClick());
        this.overlay.appendChild(button);
    }

    handleButtonClick() {
        this.currentStep++;
        if (this.currentStep < this.tutorialContent.length) {
            this.showStep();
        } else {
            this.complete();
        }
    }

    complete() {
        document.body.removeChild(this.overlay);
        this.onComplete();
    }
} 