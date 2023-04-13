import { Pane } from "tweakpane";

export interface GridHelperOptions {
    hsize?: number;
    vsize?: number;
    alpha?: number;
    gui: Pane;
}

export class GridHelper {

    show: boolean = false;

    hsize: number;
    vsize: number;
    alpha: number;

    constructor(options: GridHelperOptions) {
        this.hsize = options.hsize || 50;
        this.vsize = options.vsize || 50;
        this.alpha = options.alpha || 0.10;

        const uiGrid = options.gui.addFolder({ title: 'Helper - Grid', expanded: false });
        uiGrid.addInput(this, 'show', { presetKey: 'grid-helper.show' });
        uiGrid.addInput(this, 'hsize', { min: 0, max: 500, step: 1, presetKey: 'grid-helper.hsize' });
        uiGrid.addInput(this, 'vsize', { min: 0, max: 500, step: 1, presetKey: 'grid-helper.vsize' });
        uiGrid.addInput(this, 'alpha', { min: 0, max: 1, step: 0.1, presetKey: 'grid-helper.alpha' });
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.show) return;

        const Cx = ctx.canvas.width / 2 + 0.5;
        const Cy = ctx.canvas.height / 2 + 0.5;
        ctx.save();
        ctx.translate(Cx, Cy);
        ctx.globalAlpha = this.alpha;

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00ff00';
        ctx.beginPath();
        ctx.moveTo(0, -Cy); ctx.lineTo(0, Cy);
        ctx.moveTo(-Cx, 0); ctx.lineTo(Cx, 0);
        ctx.stroke();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (var i = 1; i < Cx; i++) {
            const x = i * this.hsize;
            ctx.moveTo(x, -Cy); ctx.lineTo(x, Cy);
            ctx.moveTo(-x, -Cy); ctx.lineTo(-x, Cy);
        }

        for (var i = 1; i < Cy; i++) {
            const y = i * this.vsize;
            ctx.moveTo(-Cx, y); ctx.lineTo(Cx, y);
            ctx.moveTo(-Cx, -y); ctx.lineTo(Cx, -y);
        }

        ctx.stroke();
        ctx.restore();
    }

}
