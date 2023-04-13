import { Engine } from "../engine/Engine";
import { FullscreenController } from "../engine/FullScreenController";
import { EffectConstructor } from "../engine/Effect";
import { ListApi, Pane, TpChangeEvent } from "tweakpane";
import { SandboxGUI } from "./SandboxGUI";
import { PlaceholderEffect } from "./PlaceholderEffect";
import slugify from "slugify";

import '../../styles/sandbox.scss'
import { EffectInventory } from "../../../src/inventory";


interface Preset {
    sandbox: { [key: string]: unknown },
    effect?: { [key: string]: unknown },
}

const LOCAL_STORAGE_TAB_KEY = 'csb::effect';
const LOCAL_STORAGE_PRESET_KEY_PREFIX = 'csb::preset::';

interface RegisteredEffect {
    name: string,
    key: string,
    ctor: EffectConstructor,
}

export class Sandbox {

    effects: Array<RegisteredEffect> = [ ];
    domCanvas?: HTMLCanvasElement;
    engine: Engine;
    fullScreenController: FullscreenController;

    private _effectSelector: ListApi<number>;
    private _selectedEffectSlug?: string;
    private _sandboxGUI: SandboxGUI;

    private _domEffectGuiContainer: HTMLElement;
    private _domEffectCanvasContainer: HTMLElement;

    private _mediaRecorder?: MediaRecorder;

    constructor() {
        this._domEffectGuiContainer = document.getElementById('gui-effect')!;
        this._domEffectCanvasContainer = document.getElementById('canvas_container')!;

        this.engine = new Engine();
        this.engine.start();

        this._sandboxGUI = new SandboxGUI(this, document.getElementById('gui-sandbox')!);

        const pane =  new Pane({
            container: document.getElementById('gui-effect-selector')!,
        });
        this._effectSelector = pane.addBlade({ view: 'list', label: 'Effect', options: [], value: '' }) as ListApi<any>;
        this._effectSelector.on('change', (event: TpChangeEvent<any>) => {
            const reg = this.effects[event.value];
            this.loadEffect(reg.ctor, reg.key);
        });

        this.fullScreenController = new FullscreenController({
            domElement: document.documentElement,
        });

        window.addEventListener('unload', () => {
            this.savePreset();
            this.engine.effect?.dispose();
        });
    }

    registerEffect(effectConstructor: EffectConstructor, name: string) {
        this.effects.push({
            name,
            key: slugify(name, { lower: true }),
            ctor: effectConstructor,
        });

        this._effectSelector.options = this.effects.map((reg, idx) => {
            return { text: reg.name, value: idx }
        });
    }

    run() {
        if (this.effects.length == 0) {
            this.loadEffect(PlaceholderEffect, 'placeholder');
            return;
        }

        var effectToLoad: number | null = null;

        const urlParams = new URLSearchParams(window.location.search);
        const paramEffect = urlParams.get('fx');
        if (paramEffect) {
            const idx = this.effects.findIndex((v) => v.key === paramEffect);
            if (idx > -1) effectToLoad = idx;
        }

        if (effectToLoad === null) {
            const lastEffect = localStorage.getItem(LOCAL_STORAGE_TAB_KEY);
            if (lastEffect) {
                const idx = this.effects.findIndex((v) => v.key === lastEffect);
                if (idx > -1) effectToLoad = idx;
            }    
        }

        this._effectSelector.controller_.valueController.value.setRawValue(effectToLoad || 0);
    }

    private loadEffect(effectConstructor: EffectConstructor, effectSlug: string) {
        this.engine.stop();
        
        const url = new URL(window.location.href);
        url.searchParams.set('fx', effectSlug);
        window.history.replaceState('', '', url); 

        // clear previous effect
        if (this.engine.effect) {
            const currEffect = this.engine.effect;

            // remove canvas and gui
            this.domCanvas?.remove();
            currEffect.gui?.element.remove();

            // save settings
            this.savePreset();

            // unload effect
            delete this.engine.effect;
            currEffect.dispose();
            this.engine.time = 0;
        }

        // create effect
        const newEffect = new effectConstructor();
        this.engine.effect = newEffect;
        this._selectedEffectSlug = effectSlug;

        // display gui if there is one, and load preset
        if (newEffect.gui) {
            this._domEffectGuiContainer.appendChild(newEffect.gui.element);
        }
        const key = `${LOCAL_STORAGE_PRESET_KEY_PREFIX}${this._selectedEffectSlug}`;
//        this.loadPreset(key);

        // create canvas
        this.domCanvas = document.createElement('canvas');
        this.domCanvas.width = this._sandboxGUI.canvasWidth;
        this.domCanvas.height = this._sandboxGUI.canvasHeight;
        this._domEffectCanvasContainer.appendChild(this.domCanvas);        

        this.fullScreenController.domCanvas = this.domCanvas;

        // initialize effect
        newEffect.init({ domCanvas: this.domCanvas }).then(() => {
            this.loadPreset(key);

            if (document.hasFocus() || !this._sandboxGUI.pauseOnBlur) this.engine.start();
            else {
                setTimeout(() => { this.engine.render() }, 250);
            }
        });

        localStorage.setItem(LOCAL_STORAGE_TAB_KEY, effectSlug);
    }

    savePreset() {
        if (this.engine.effect) {
            const key = `${LOCAL_STORAGE_PRESET_KEY_PREFIX}${this._selectedEffectSlug}`;

            const preset: Preset = {
                sandbox: this._sandboxGUI.root.exportPreset(),
                effect: this.engine.effect?.gui?.exportPreset(),
            };
            console.debug('[sandbox] Saving preset', key);
            localStorage.setItem(key, JSON.stringify(preset));
        }
    }

    loadPreset(key: string) {
        console.debug('[sandbox] Loading preset', key);
        const savedPreset = localStorage.getItem(key);
        if (savedPreset) {
            const preset: Preset = JSON.parse(savedPreset);
            const effectGUI = this.engine.effect?.gui;
            if (effectGUI && preset.effect) {
                effectGUI.importPreset(preset.effect);
            }
            this._sandboxGUI.root.importPreset(preset.sandbox);
        }
    }

    captureSnapshot(toClipboard: boolean = false) {
        if (!this.domCanvas) return;

        if (toClipboard) {
            this.domCanvas.toBlob((blob: Blob | null) => {
                if (blob) {
                    navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                }
            });
        } else {
            const imageUrl = this.domCanvas.toDataURL('image/png');
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = imageUrl;
            a.download = 'snapshot.png';
            a.click();
        }
    }

    startRecording() {
        if (!this.domCanvas) return;

        const stream = this.domCanvas.captureStream(30);
        this._mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 5 * 1024 * 1024 });
        const data: Blob[] = [];
        this._mediaRecorder.ondataavailable = (event: BlobEvent) => { data.push(event.data) }
        this._mediaRecorder.onstop = (_event: Event) => {
            const blob = new Blob(data, { 'type': 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = 'record.webm';
            a.click();
            window.URL.revokeObjectURL(url);
        }
        this._mediaRecorder.start();
    }

    stopRecording() {
        if (this._mediaRecorder) {
            this._mediaRecorder.stop();
        }
    }
}

const sandbox = new Sandbox;
for (var item of EffectInventory) {
    sandbox.registerEffect(item[0], item[1]);
}
sandbox.run();
