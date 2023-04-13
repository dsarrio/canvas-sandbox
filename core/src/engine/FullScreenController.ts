
interface Rectangle {
    width: number;
    height: number;
}

export class FullscreenController {

    domElement: HTMLElement;
    domCanvas?: HTMLCanvasElement;

    private domCanvasSize: Rectangle = { width: -1, height: -1 };

    constructor(options: { domElement: HTMLElement, domCanvas?: HTMLCanvasElement }) {
        this.domCanvas = options.domCanvas;
        this.saveCurrentCanvasSize();

        this.domElement = options.domElement;
        this.domElement.addEventListener('keypress', this.onKeyPress.bind(this));
        this.domElement.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
    }

    private saveCurrentCanvasSize() {
        if (this.domCanvas) {
            this.domCanvasSize.width = this.domCanvas.width || this.domCanvas.clientWidth;
            this.domCanvasSize.height = this.domCanvas.height || this.domCanvas.clientHeight;
        }
    }

    get isFullscreen(): boolean { return document.fullscreenElement == this.domElement; }

    async enterFullscreen() {
        if (this.isFullscreen) return;

        this.saveCurrentCanvasSize();

        // save screen size now because when fullscreen is effective browsers
        // substract console height from screen size height.
        const fullscreenWidth = screen.width;
        const fullscreenHeight = screen.height;

        return this.domElement.requestFullscreen().then(() => {
            if (this.domCanvas) {
                this.domCanvas.width = fullscreenWidth;
                this.domCanvas.height = fullscreenHeight;
            }
        });
    }

    async exitFullScreen() {
        if (!this.isFullscreen) return;
        return document.exitFullscreen();
    }

    private onFullscreenChange() {
        // restore canvas size when leaving fullscreen mode
        if (!this.isFullscreen && this.domCanvas) {
            this.domCanvas.width = this.domCanvasSize.width;
            this.domCanvas.height = this.domCanvasSize.height;
        }
        this.domElement.classList.toggle('fullscreen', this.isFullscreen);
    }

    private onKeyPress(event: KeyboardEvent) {
        if (event.key == 'f') {
            this.enterFullscreen();
        }
    }

}
