import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { Pane } from "tweakpane";
import { Effect, EffectOptions } from '../../core/src/engine/Effect';
import { RenderContext } from '../../core/src/engine/RenderContext';

export default class SeedEffect2D implements Effect {

    gui: Pane;

    private _canvas!: HTMLCanvasElement;
    private _ctx!: CanvasRenderingContext2D;

    constructor() {
        this.gui = new Pane({ title: 'Seed 2D' });
        this.gui.registerPlugin(EssentialsPlugin);
    }

    dispose() { }

    async init(options: EffectOptions) {
        // setup 2d canvas
        this._canvas = options.domCanvas;
        const _ctx = this._canvas.getContext('2d');
        if (!_ctx) throw new Error('Failed to create 2D context');
        this._ctx = _ctx;
    }

    render(_renderContext: RenderContext): void {
        this._ctx.fillStyle = '#000000';
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
}
