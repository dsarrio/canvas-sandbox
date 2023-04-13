import { Effect } from "./Effect";
import { RenderContext } from "./RenderContext";

export class Engine {

    effect?: Effect;
    private currentFrameRequest?: number;

    // timeline
    private _time: number = 0;
    timeSpeedFactor: number = 1;
    private lastFrameTime?: number;
    private _paused: boolean = false;

    // fps limiting
    fpsLimit: number = 0;
    private fpsLimitPreviousFrameId: number = 0;

    // fps computation
    private fpsCounter: number = 0;
    private fpsWindowTime: number = 0;
    private fpsCurrent: number = 0;

    //
    // ctor
    //
    constructor(effect?: Effect) {
        this.effect = effect;
    }

    //
    // Property - fps
    //
    get fps(): number { return this.fpsCurrent; }

    //
    // Property - paused
    //
    get paused(): boolean { return this._paused; }
    set paused(value: boolean) {
        
        this._paused = value;
        if (this._paused) {
            console.debug('[sandbox] paused')
            this.stopRenderLoop();
            delete this.lastFrameTime;
        } else {
            console.debug('[sandbox] resumed')
            this.startRenderLoop();
        }
    }

    //
    // Property - time
    //
    get time(): number { return this._time; }
    set time(seconds: number) {
        this._time = seconds * 1000;
        delete this.lastFrameTime;
        if (this._paused) {
            this.render();            
        }
    }
    
    //
    // Render loop
    //
    start() {
        this.startRenderLoop();        
    }

    stop() {
        this.stopRenderLoop();
        this._time = 0;
        delete this.lastFrameTime;
        this.fpsCounter = 0;
        this.fpsWindowTime = 0;
        this.fpsCurrent = 0;
    }

    private startRenderLoop() {
        if (!this.currentFrameRequest) {
            this.currentFrameRequest = requestAnimationFrame((t) => this.renderLoop(t));
        }
    }

    private stopRenderLoop() {
        if (this.currentFrameRequest) {
            cancelAnimationFrame(this.currentFrameRequest);
            delete this.currentFrameRequest;
        }
    }

    render(renderContext?: RenderContext) {
        this.effect?.render(renderContext || { time: this._time / 1000, deltaTime: 0 });
        this.fpsCounter++;
    }

    private renderLoop(animationFrameTime: number) {
        
        // real delta since last frame
        const elapsedTimeSinceLastFrame = animationFrameTime - (this.lastFrameTime || animationFrameTime);
        this.lastFrameTime = animationFrameTime;
        this.fpsWindowTime += elapsedTimeSinceLastFrame;

        // update effective time
        const effectiveDeltaTime = elapsedTimeSinceLastFrame * this.timeSpeedFactor;
        this._time += effectiveDeltaTime;

        // render according to fps limitation
        var skipRender = false;
        if (this.fpsLimit) {
            const currentFrameId = Math.trunc(animationFrameTime / (1000 / this.fpsLimit));
            if (currentFrameId == this.fpsLimitPreviousFrameId) {
                skipRender = true;
            }
            this.fpsLimitPreviousFrameId = currentFrameId;
        }

        if (!skipRender) {
            this.render({
                time: this._time / 1000,
                deltaTime: effectiveDeltaTime / 1000,
            });
        }

        // compute fps
        if (this.fpsWindowTime > 1000) {
            this.fpsCurrent = Math.round(this.fpsCounter / this.fpsWindowTime * 1000);
            this.fpsWindowTime = 0;
            this.fpsCounter = 0;
        }

        // loop
        if (!this._paused) {
            this.currentFrameRequest = requestAnimationFrame(this.renderLoop.bind(this));
        }
    }
}
