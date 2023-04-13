import { Pane } from "tweakpane";
import { RenderContext } from "./RenderContext";

export interface Effect {

    /**
     * Returns the effect gui instance. This is optional but if you want to
     * provide a gui you must initialize it within the constructor if you want
     * its settings to be persisted across reloads.
     */
    get gui(): Pane | null;

    /**
     * Async method to initialize the effect along with its dependecies like
     * frameworks, libs, etc.
     */
    init(options: EffectOptions): Promise<void>;

    /**
     * Call when the effect is unloaded, you're responsible to clean
     * resources managed by your effect.
     */
    dispose(): void;

    /**
     * Main render method called for each frame
     */
    render(context: RenderContext): void;
}

export interface EffectOptions {

    /**
     * DOM Canvas element
     */
    domCanvas: HTMLCanvasElement;
}

export interface EffectConstructor {
    new (): Effect;    
}
