import { Pane } from "tweakpane";

export interface PolarHudHelperOptions {
    sectionAngle?: number;
    sectionCount?: number;
    radius?: number;
    alpha?: number;
    showText?: boolean;
    gui: Pane;
}

export class PolarHudHelper {

    show: boolean = false;

    sectionAngle: number;
    sectionCount: number;
    radius: number;
    alpha: number;
    showText: boolean;

    constructor(options: PolarHudHelperOptions) {
        this.sectionAngle = options?.sectionAngle || (Math.PI / 4);
        this.sectionCount = options?.sectionCount || 4;
        this.radius = options?.radius || 300;
        this.alpha = options?.alpha || 0.30;
        this.showText = options?.showText || true;

        const uiPolarHud = options.gui.addFolder({ title: 'Helper - Polar hud', expanded: false });
        uiPolarHud.addInput(this, 'show', { presetKey: 'polar-hud-helper.show' });
        uiPolarHud.addInput(this, 'sectionAngle', { min: 0, max: Math.PI, step: 0.001, presetKey: 'polar-hud-helper.sectionAngle' });
        uiPolarHud.addInput(this, 'sectionCount', { min: 1, max: 50, step: 1, presetKey: 'polar-hud-helper.sectionCount' });
        uiPolarHud.addInput(this, 'radius', { min: 0, max: 1000, step: 1, presetKey: 'polar-hud-helper.radius' });
        uiPolarHud.addInput(this, 'alpha', { min: 0, max: 1, step: 0.01, presetKey: 'polar-hud-helper.alpha' });
        uiPolarHud.addInput(this, 'showText', { label: 'Show text', presetKey: 'polar-hud-helper.showText' });
    }
    
    render(ctx: CanvasRenderingContext2D) {
        if (!this.show) return;

        const Cx = ctx.canvas.width / 2 + 0.5;
        const Cy = ctx.canvas.height / 2 + 0.5;
        ctx.save();
        ctx.translate(Cx, Cy);
        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = '#fff';
        ctx.font = '18px serif';

        const r = this.radius;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#fff';
        const s = this.sectionAngle;
        const nb = this.sectionCount * 2;
        for (var j = 0; j < nb + 1; j++) {
            const a = Math.PI + (j - nb / 2) * s;
            const vX = Math.sin(a);
            const vY = Math.cos(a);
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(vX * 1000, vY * 1000);
            ctx.stroke();
            ctx.fillRect(vX * r - 5, vY * r - 5, 10, 10);

            if (this.showText) {
                const str = j.toString();
                const m = ctx.measureText(str);
                ctx.fillText(str, vX * (r + 25) - m.width / 2, vY * (r + 25) + (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / 2);
            }
        }

        ctx.restore();
    }

}
