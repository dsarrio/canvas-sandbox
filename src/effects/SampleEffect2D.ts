import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { Pane } from "tweakpane";
import { Effect, EffectOptions } from "../../core/src/engine/Effect";
import { RenderContext } from "../../core/src/engine/RenderContext";
import { TuningHelper } from "../../core/src/lib/2D/TuningHelper";
import { PolarHudHelper } from "../../core/src/lib/2D/PolarHudHelper";
import { GridHelper } from "../../core/src/lib/2D/GridHelper";

import checkerboardImg from "../resources/checkerboard.png"
import { ResizeEvent } from "../../core/src/engine/ResizeEvent";

export default class SampleEffect2D implements Effect {

    gui: Pane;

    private _canvas!: HTMLCanvasElement;
    private _resizeObserver!: ResizeObserver;
    private _ctx!: CanvasRenderingContext2D;
    private _guiTuning!: TuningHelper;
    private _guiGrid: GridHelper;
    private _guiPolarHud: PolarHudHelper;
    private _guiSettings: { backgroundColor: string } = { backgroundColor: '#000000' };
    private _imgCheckerboard!: HTMLImageElement;

    constructor() {
        this.gui = new Pane({ title: 'Sample 2D' });
        this.gui.registerPlugin(EssentialsPlugin);
        this.gui.addInput(this._guiSettings, 'backgroundColor', { picker: 'inline', label: 'Background'});

        // helpers
        this._guiTuning = new TuningHelper(this);
        this._guiGrid = new GridHelper(this);
        this._guiPolarHud = new PolarHudHelper(this);
    }

    async init(options: EffectOptions) {

        this._resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            const width = entries[0].contentRect.width;
            const height = entries[0].contentRect.height;
            this.onResize({ width, height });
        });
        this._resizeObserver.observe(options.domCanvas);

        // setup 2d canvas
        this._canvas = options.domCanvas;
        const _ctx = this._canvas.getContext('2d');
        if (!_ctx) throw new Error('Failed to create 2D context');
        this._ctx = _ctx;

        this._imgCheckerboard = document.createElement('img');
        this._imgCheckerboard.src = checkerboardImg;
    }

    dispose() {
        this._resizeObserver.disconnect();
    }

    onResize(event: ResizeEvent) {
        this._canvas.width = event.width;
        this._canvas.height = event.height;
    }

    render(rc: RenderContext): void {
        const c = this._ctx;
        const [W, H] = [ c.canvas.width, c.canvas.height ];

        // clear screen
        c.fillStyle = this._guiSettings.backgroundColor;
        c.fillRect(0, 0, W, H);

        // render helpers
        this._guiGrid.render(c);
        this._guiPolarHud.render(c);

        // render checkerboard
        c.save();
        c.translate(W/2, H/2);
        const f = Math.sin(rc.time) * 0.2 + 0.5 + this._guiTuning.scale1 / 500;
        c.scale(f, f)
        c.rotate(rc.time + this._guiTuning.scale2 / 100);
        c.drawImage(this._imgCheckerboard, -100, -100, 200, 200);
        c.restore();
    }
}
