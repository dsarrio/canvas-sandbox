import { Effect, EffectOptions } from "../engine/Effect";
import { RenderContext } from "../engine/RenderContext";

export class PlaceholderEffect implements Effect {

    private _ctx!: CanvasRenderingContext2D;

    readonly gui: null = null;

    async init(options: EffectOptions) {
        this._ctx = options.domCanvas.getContext('2d')!;
    }
    
    dispose(): void { }

    render(rc: RenderContext) {
        const ctx = this._ctx;
        const { width, height } = ctx.canvas;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        ctx.font = '20px monospace';
        ctx.fillStyle = '#fff';
        const text = 'No effect registered...';
        const textHOffset = ctx.measureText(text).width / 2;
        for (var i = 0; i < text.length; ++i) {
            const textVOffset = Math.max(0, Math.sin(i/5 - rc.time * 4) - 0.8 ) * 90;
            ctx.fillText(
                text[i].padStart(i + 1),
                width / 2 - textHOffset,
                height / 2 - textVOffset,
            );
        }
    }
}
