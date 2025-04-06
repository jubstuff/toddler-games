export class InputHandler {
    constructor(canvas) {
        this.keys = { ArrowUp: false, ArrowDown: false };
        this.isPointerDown = false;
        this.pointerY = 0;
        this.gamePad = null;

        this.setupKeyboardListeners();
        this.setupPointerListeners(canvas);
    }

    setupKeyboardListeners() {
        window.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                this.keys[e.key] = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                this.keys[e.key] = false;
            }
        });
    }

    setupPointerListeners(canvas) {
        canvas.addEventListener("pointermove", (e) => {
            const rect = canvas.getBoundingClientRect();
            this.pointerY = e.clientY - rect.top;
        });

        canvas.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            this.isPointerDown = true;

            const rect = canvas.getBoundingClientRect();
            this.pointerY = e.clientY - rect.top;
        });

        window.addEventListener("pointerup", () => {
            this.isPointerDown = false;
        });
    }

    getInputState() {
        return {
            moveUp: this.keys.ArrowUp,
            moveDown: this.keys.ArrowDown,
            isPointerDown: this.isPointerDown,
            pointerY: this.pointerY
        };
    }
} 