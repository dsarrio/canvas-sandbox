
export interface MouseHelperOptions {
    domElement: HTMLElement;
}

export interface MousePosition {
    x: number;
    y: number;
    centered: { x: number, y: number };
    u: number;
    v: number;
}

export class MouseHelper {

    private _domElement: HTMLElement;

    private _onMouseMovedCallback: (event: MouseEvent) => void;
    private _onMouseClickedCallback: (event: MouseEvent) => void;
    private _onMouseDownCallback: (event: MouseEvent) => void;
    private _onMouseUpCallback: (event: MouseEvent) => void;
    onMouseMoved?: (event: MouseEvent, position: MousePosition) => void;
    onMouseClicked?: (event: MouseEvent, position: MousePosition) => void;
    onMouseDown?: (event: MouseEvent, position: MousePosition) => void;
    onMouseUp?: (event: MouseEvent, position: MousePosition) => void;

    position: { x: number, y: number, centered: { x: number, y: number }, u: number, v: number };

    constructor(options: MouseHelperOptions) {
        this._domElement = options.domElement;

        this.position = {
            x: 0,
            y: 0,
            centered: {
                x: 0,
                y: 0,
            },
            u: 0,
            v: 0
        };

        this._onMouseMovedCallback = this._onMouseMoved.bind(this);
        this._onMouseClickedCallback = this._onMouseClicked.bind(this);
        this._onMouseDownCallback = this._onMouseDown.bind(this);
        this._onMouseUpCallback = this._onMouseUp.bind(this);
        this._domElement.addEventListener('mousemove', this._onMouseMovedCallback);
        this._domElement.addEventListener('click', this._onMouseClickedCallback);
        this._domElement.addEventListener('mousedown', this._onMouseDownCallback);
        this._domElement.addEventListener('mouseup', this._onMouseUpCallback);
    }

    private computePosition(event: MouseEvent): MousePosition {
        const domRectangle = this._domElement.getBoundingClientRect();
        const x = event.clientX - domRectangle.left;
        const y = event.clientY - domRectangle.top;
        const centered = {
            x: x - domRectangle.width / 2,
            y: y - domRectangle.height / 2,
        };
        const u = x / domRectangle.width;
        const v = y / domRectangle.height;
        return { x, y, centered, u, v };
    }

    private _onMouseMoved(event: MouseEvent) {
        this.position = this.computePosition(event);
        if (this.onMouseMoved) {
            this.onMouseMoved(event, this.position);
        }
    }

    private _onMouseClicked(event: MouseEvent) {
        if (this.onMouseClicked) {
            this.onMouseClicked(event, this.computePosition(event));
        }
    }

    private _onMouseDown(event: MouseEvent) {
        if (this.onMouseDown) {
            this.onMouseDown(event, this.computePosition(event));
        }
    }

    private _onMouseUp(event: MouseEvent) {
        if (this.onMouseUp) {
            this.onMouseUp(event, this.computePosition(event));
        }
    }

    dispose() {
        this._domElement.removeEventListener('mousemove', this._onMouseMovedCallback);
        this._domElement.removeEventListener('click', this._onMouseClickedCallback);
        this._domElement.removeEventListener('mousedown', this._onMouseDownCallback);
        this._domElement.removeEventListener('mouseup', this._onMouseUpCallback);
    }
}
