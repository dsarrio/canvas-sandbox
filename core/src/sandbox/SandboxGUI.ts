import { TpTabSelectEvent } from '@tweakpane/core';
import { Pane, SliderApi, TabPageApi, TpChangeEvent } from 'tweakpane';
import { Sandbox } from './Sandbox';

const LOCAL_STORAGE_TAB_KEY = 'csb::tab';

export class SandboxGUI {

    private _sandbox: Sandbox;
    private _root: Pane;
    private _domPausedIcon: HTMLElement;

    timeSpeedFactor: number;
    canvasWidth: number = 600;
    canvasHeight: number = 450;
    pauseOnBlur: boolean = false;

    constructor(sandbox: Sandbox, domContainer: HTMLElement) {
        this._sandbox = sandbox;
        this._domPausedIcon = document.getElementById('icon-paused')!;

        this.timeSpeedFactor = this._sandbox.engine.timeSpeedFactor;

        this._root = new Pane({ container: domContainer });

        const tab = this._root.addTab({
            pages: [
                { title: 'Time' },
                { title: 'Canvas' },
                { title: 'Stats' },
                { title: 'Settings' },
                { title: 'Export' },
            ],
        });
    
        tab.on('select', (event: TpTabSelectEvent) => {
            localStorage.setItem(LOCAL_STORAGE_TAB_KEY, event.index.toString());
        })

        this.addFolderTime(tab.pages[0]);
        this.addFolderCanvas(tab.pages[1]);
        this.addFolderStats(tab.pages[2]);
        this.addFolderSettings(tab.pages[3]);
        this.addFolderExport(tab.pages[4]);

        const lastTab = localStorage.getItem(LOCAL_STORAGE_TAB_KEY);
        if (lastTab) {
            tab.pages[parseInt(lastTab)].selected = true;
        }
    }

    get root(): Pane { return this._root }

    dispose(): void { this._root.dispose }

    private onCanvasSizeChanged(event: TpChangeEvent<number>) {
        if (event.last) {
            const domCanvas = this._sandbox.domCanvas;
            if (domCanvas) {
                domCanvas.width = this.canvasWidth;
                domCanvas.height = this.canvasHeight;
            }
        }
    }

    private addFolderCanvas(folder: TabPageApi) {
        folder
            .addInput(this, 'canvasWidth', { min: 0, max: 3840, step: 1, label: 'Width' })
            .on('change', this.onCanvasSizeChanged.bind(this));

        folder
            .addInput(this, 'canvasHeight', { min: 0, max: 2160, step: 1, label: 'Height' })
            .on('change', this.onCanvasSizeChanged.bind(this));

        folder
            .addButton({ title: 'Fullscreen (F)' })
            .on('click', () => this._sandbox.fullScreenController.enterFullscreen());
    }

    private addFolderStats(folder: TabPageApi) {
        folder.addMonitor(this._sandbox.engine, 'fps', { label: 'FPS' });
        folder.addMonitor(this._sandbox.engine, 'fps', { view: 'graph', lineCount: 1, min: 0, max: 240, label: '' });
        folder.addInput(this._sandbox.engine, 'fpsLimit', { min: 0, max: 240, step: 1, label: 'Limit', format: (v: number) => v === 0 ? 'off' : v });
    }

    private addFolderTime(folder: TabPageApi) {
        const timeMonitor = folder.addMonitor(this._sandbox.engine, 'time', {
            label: 'Elapsed time (seconds)',
            format: (value: number) => (value / 1000).toFixed(2),
            interval: 50,
        });

        const replaySlider = folder.addBlade({
            view: 'slider',
            label: 'Replay',
            min: 0,
            max: 0,
            value: 0,
            format: (v: number) => (v / 1000).toFixed(2),
        }) as SliderApi;

        replaySlider.on('change', () =>  {
            if (this._sandbox.engine.time != replaySlider.value) {
                this._sandbox.engine.time = replaySlider.value / 1000;
            };
        });

        timeMonitor.on('update', () => {
            replaySlider.maxValue = Math.max(replaySlider.maxValue, this._sandbox.engine.time);
            replaySlider.value = this._sandbox.engine.time;
        })

        folder.addInput(this, 'timeSpeedFactor', { min: 0, max: 30, step: 0.25, label: 'Speed factor' }).on('change', () => {
            this._sandbox.engine.timeSpeedFactor = this.timeSpeedFactor;
        });

        const btnPlayPause = folder.addButton({ title: 'Pause (SPACEBAR)' });
        const fnTogglePause = (paused: boolean) => {
            this._sandbox.engine.paused = paused;
            btnPlayPause.title = (this._sandbox.engine.paused ? 'Resume' : 'Pause') + ' (SPACEBAR)';
            this._domPausedIcon.style.display = paused ? 'block' : 'none';
        }
        window.addEventListener('blur', () => { if (this.pauseOnBlur) fnTogglePause(true) });
        window.addEventListener('focus', () => { if (this.pauseOnBlur) fnTogglePause(false) });
        btnPlayPause.on('click', () => fnTogglePause(!this._sandbox.engine.paused));
        document.documentElement.addEventListener('keypress', (event: KeyboardEvent) => {
            if (event.key == ' ') fnTogglePause(!this._sandbox.engine.paused);
        });
    }

    private addFolderSettings(folder: TabPageApi) {
        folder.addInput(this, 'pauseOnBlur', { label: 'Play only with focus' });
    }

    private addFolderExport(folder: TabPageApi) {

        folder.addButton({ title: 'Copy to clipboard' }).on('click', () => { this._sandbox.captureSnapshot(true) });
        folder.addButton({ title: 'Download PNG' }).on('click', () => { this._sandbox.captureSnapshot() });

        folder.addSeparator();

        const btnStartRecording = folder.addButton({ title: 'Start video recording' });
        const btnStopRecording = folder.addButton({ title: 'Stop', hidden: true });

        btnStartRecording.on('click', () => {
            this._sandbox.startRecording();
            btnStartRecording.hidden = true;
            btnStopRecording.hidden = false;
        });

        btnStopRecording.on('click', () => {
            this._sandbox.stopRecording();
            btnStartRecording.hidden = false;
            btnStopRecording.hidden = true;
        });

    }

}
