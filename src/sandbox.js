import * as THREE from 'three';

export const FX = [];

export class EffectInputs {

    constructor() {}

    _effectInputs_init({ canvas }) {
        this.canvas = canvas;
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMoved(e));
        this.canvas.addEventListener('click', (e) => this.onMouseClicked(e));
    }

    _onMouseMoved(event) {
        if (this.onMouseMoved) {      
            const canvas_rect = this.canvas.getBoundingClientRect();      
            this.onMouseMoved({
                uv: {
                    u: (event.clientX - canvas_rect.left) / canvas_rect.width,
                    v: (event.clientY - canvas_rect.top) / canvas_rect.height,
                },
                position: {
                    x: event.clientX - canvas_rect.left,
                    y: event.clientY - canvas_rect.top,
                },
                event,
            });
        }
    }

    _onMouseClicked(event) {
        if (this.onMouseClicked) {
            const canvas_rect = this.canvas.getBoundingClientRect();      
            this.onMouseClicked({
                uv: {
                    u: (event.clientX - canvas_rect.left) / canvas_rect.width,
                    v: (event.clientY - canvas_rect.top) / canvas_rect.height,
                },
                position: {
                    x: event.clientX - canvas_rect.left,
                    y: event.clientY - canvas_rect.top,
                },
                event,
            });
        }
    }
}

export class Effect3D extends EffectInputs {

    constructor({width, height, gui, guiBuilder}) {
        super();
        
        // setup canvas
        const domCanvasContainer = document.getElementById('canvas_container');
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        domCanvasContainer.appendChild(this.canvas);

        // add menu helpers
        this.gui = { ...gui,
            scene: {
                showAxes: true,
                background: '#444',
            },
        };

        const uiScene = guiBuilder.addFolder('3D Scene');
        guiBuilder.remember(this.gui.scene);
        uiScene.add(this.gui.scene, 'showAxes');
        uiScene.addColor(this.gui.scene, 'background');

        // init ThreeJS
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(width, height);

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100000,
        )
        this.camera.position.z = 2

        // configure scene
        this.scene.background = new THREE.Color(this.gui.scene.background);
        this.axesHelper = new THREE.AxesHelper( 1 );
        this.scene.add( this.axesHelper );
    }

    _init() {
        if (this.init) {
            this.init({
                canvas: this.canvas,
                renderer: this.renderer,
                scene: this.scene,
                camera: this.camera
            });
        }
    }

    _onResize({width, height}) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.renderer.setSize(width, height);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        if (this.onResize) {
            this.onResize({width, height});
        }
    }

    _render({time}) {
        this.scene.background.set(this.gui.scene.background);
        this.axesHelper.visible = this.gui.scene.showAxes;
        
        if (this.render) {
            this.render({time});
        }
        this.renderer.render(this.scene, this.camera)
    }

    _destroy() {
        this.canvas.remove();
    }
}

export class Effect2D extends EffectInputs {

    constructor({width, height, gui, guiBuilder}) {
        super();

        // setup 2d canvas
        const domCanvasContainer = document.getElementById('canvas_container');
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        domCanvasContainer.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // initialize inputs handlers
        this._effectInputs_init({ canvas: this.canvas });

        // add menu helpers
        this.gui = { ...gui,
            grid: {
                show: false,
                hsize: 50,
                vsize: 50,
                alpha: 0.10,
            },
            polarHud: {
                show: false,
                section_angle: Math.PI/4,
                section_count: 4,
                radius: 300,
                alpha: 0.30,
                showText: true,
            },
        };

        const uiGrid = guiBuilder.addFolder('Grid');
        guiBuilder.remember(this.gui.grid);
        uiGrid.add(this.gui.grid, 'show');
        uiGrid.add(this.gui.grid, 'hsize', 0, 500, 1);
        uiGrid.add(this.gui.grid, 'vsize', 0, 500, 1);
        uiGrid.add(this.gui.grid, 'alpha', 0, 1, 0.01);

        const uiPolarHud = guiBuilder.addFolder('Polar hud');
        guiBuilder.remember(this.gui.polarHud);
        uiPolarHud.add(this.gui.polarHud, 'show');
        uiPolarHud.add(this.gui.polarHud, 'section_angle', 0, Math.PI, 0.001);
        uiPolarHud.add(this.gui.polarHud, 'section_count', 1, 50, 1);
        uiPolarHud.add(this.gui.polarHud, 'radius', 0, 1000, 1);
        uiPolarHud.add(this.gui.polarHud, 'alpha', 0, 1, 0.01);
        uiPolarHud.add(this.gui.polarHud, 'showText').name('text');
    }

    _init() {
        if (this.init) {
            this.init({ctx: this.ctx})
        }
    }

    _render({time}) {
        this.ctx.save();
        this.render({
            ctx: this.ctx,
            time,
        });
        this.ctx.restore();
        this._renderPolarHud();
        this._renderGrid();
    }

    _onResize({width, height}) {
        this.canvas.width = width;
        this.canvas.height = height;
        if (this.onResize) {
            this.onResize({width, height});
        }
    }

    _destroy() {
        this.canvas.remove();
    }

    _renderGrid() {
        if (!this.gui.grid.show) return;
        const ctx = this.ctx;
        const Cx = ctx.canvas.width / 2 + 0.5;
        const Cy = ctx.canvas.height / 2 + 0.5;
        ctx.save();
        ctx.translate(Cx, Cy);
        ctx.globalAlpha = this.gui.grid.alpha;

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
            const x = i * this.gui.grid.hsize;
            ctx.moveTo(x, -Cy); ctx.lineTo(x, Cy);
            ctx.moveTo(-x, -Cy); ctx.lineTo(-x, Cy);
        }
        for (var i = 1; i < Cy; i++) {
            const y = i * this.gui.grid.vsize;
            ctx.moveTo(-Cx, y); ctx.lineTo(Cx, y);
            ctx.moveTo(-Cx, -y); ctx.lineTo(Cx, -y);
        }
        ctx.stroke();
        ctx.restore();
    }

    _renderPolarHud() {
        if (!this.gui.polarHud.show) return;
        const ctx = this.ctx;
        const Cx = ctx.canvas.width / 2 + 0.5;
        const Cy = ctx.canvas.height / 2 + 0.5;
        ctx.save();
        ctx.translate(Cx, Cy);
        ctx.globalAlpha = this.gui.polarHud.alpha;

        ctx.fillStyle = '#fff';
        ctx.font = '18px serif';

        const r = this.gui.polarHud.radius;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI*2);
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#fff';
        const s = this.gui.polarHud.section_angle;
        const nb = this.gui.polarHud.section_count * 2;
        for (var j = 0; j < nb + 1; j++) {
            const a = Math.PI + (j-nb/2) * s;
            const v = P(Math.sin(a), Math.cos(a));
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(v.x * 1000, v.y * 1000);
            ctx.stroke();
            ctx.fillRect(v.x*r-5, v.y*r-5, 10, 10);

            if (this.gui.polarHud.showText) {
                const m = ctx.measureText(j);
                ctx.fillText(j, v.x * (r + 25) - m.width / 2, v.y * (r + 25) + (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / 2);    
            }
        }

        ctx.restore();
    }
}

export class Sandbox {
    mouse = { x: 0, y: 0 };

    constructor() {
        // initialize rate limiter
        this.frameDelay = 1000 / 60;
        document.getElementById('fps').addEventListener('input', (e) => {
            this.frameDelay = 1000 / e.target.value;
            this.prevFrame = 0;
        });

        // initialize performances widget
        this.stats = new Stats();
        this.stats.showPanel(0);
        const elt = this.stats.dom;
        elt.style.cssText = 'cursor:pointer; z-index:10000';
        document.getElementById('stats_container').appendChild(elt);

        // connect global events
        window.addEventListener('blur', (e) => { this.onFocusChanged() });
        window.addEventListener('focus', (e) => { this.onFocusChanged() });
        window.addEventListener('keydown', (e) => { this.onKeyDown(e) });

        // initialize time display
        this.timeDisplay = document.getElementById('time');

        // compute rendering sizes
        this.fullscreenSize = {
            width: window.screen.width,
            height: window.screen.height,
        };

        this.windowedSize = { 
            width: window.innerWidth - 450, 
            height: Math.trunc((window.innerWidth - 450) / window.screen.width * window.screen.height),
        };

        // load last or first effect
        const lastRendererName = localStorage.getItem('renderer');
        const fx = FX.find(fx => fx.name == lastRendererName) || FX[0];
        this.changeRenderer(fx);
    }

    changeRenderer(rendererClass) {
        this.reset();
        this.resetGUI({rendererClass});

        document.location.hash = rendererClass.name;

        if (this.renderer) {
            this.renderer._destroy();
        }

        this.renderer = new rendererClass({
            width: this.windowedSize.width,
            height: this.windowedSize.height,
            gui: this.gui,
            guiBuilder: this.guiBuilder,
        });

        this.renderer._init();

        localStorage.setItem('renderer', rendererClass.name);

        const hasFocus = document.hasFocus();
        if (hasFocus || !this.gui.time.autoStop) {
            this.start();
        } else {
            this.stop();
            this.render();
        }
    }

    resetGUI({rendererClass}) {
        if (this.guiBuilder) {
            this.guiBuilder.saveToLocalStorageIfPossible();
            this.guiBuilder.destroy();
        }

        document.location.hash = rendererClass.name;

        this.gui = {
            time: {
                speed: 1,
                autoStop: true,
            },
            helpers: {
                scale1: 0,
                scale2: 0,
                scale3: 0,
                scale4: 0,
                scale5: 0,
                toggle1: false,
                toggle2: false,
                toggle3: false,
                colorHex: '#FF0000',
                colorRGB: [ 0, 128, 255 ],
                colorRGBA: [ 0, 128, 255, 0.3 ],
                colorHSV: { h: 350, s: 0.9, v: 0.3 },
            },
        }

        this.guiBuilder = new dat.GUI({name: 'foobar', width: 400, hideable: true});
        this.guiBuilder.useLocalStorage = true;
        
        const uiEffects = this.guiBuilder.addFolder('Select effect');
        for (var fx of FX) {
            const t = fx;
            uiEffects.add({ add: () => { this.changeRenderer(t); }}, 'add').name(t.name);
        }

        const uiTime = this.guiBuilder.addFolder('Time');
        this.guiBuilder.remember(this.gui.time);
        uiTime.add(this.gui.time, 'speed', 0, 20, .25);
        uiTime.add(this.gui.time, 'autoStop');
        this.uiTime = uiTime;

        const uiHelpers = this.guiBuilder.addFolder('Helpers');
        this.guiBuilder.remember(this.gui.helpers);
        uiHelpers.add(this.gui.helpers, 'scale1', 0, 300);
        uiHelpers.add(this.gui.helpers, 'scale2', 0, 300);
        uiHelpers.add(this.gui.helpers, 'scale3', 0, 100);
        uiHelpers.add(this.gui.helpers, 'scale4', 0, 100);
        uiHelpers.add(this.gui.helpers, 'scale5', 0, 100);
        uiHelpers.add(this.gui.helpers, 'toggle1');
        uiHelpers.add(this.gui.helpers, 'toggle2');
        uiHelpers.add(this.gui.helpers, 'toggle3');
        uiHelpers.addColor(this.gui.helpers, 'colorHex');
        uiHelpers.addColor(this.gui.helpers, 'colorRGB');
        uiHelpers.addColor(this.gui.helpers, 'colorRGBA');
        uiHelpers.addColor(this.gui.helpers, 'colorHSV');
    }

    reset() {
        this.stop();
        this.elapsedTime = 0;
        this.lastDrawTime = undefined;
        this.prevFrame = 0;
        this.nextFrameDelay = 0;
    }

    start() {
        document.body.classList.remove('paused');
        document.title = 'Demo';
        this.paused = false;
        cancelAnimationFrame(this.frameRequest);
        this.frameRequest = requestAnimationFrame((t) => this.draw(t));
    }

    stop() {
        cancelAnimationFrame(this.frameRequest);
        this.paused = true;
        document.body.classList.add('paused');
        document.title = '[Paused] Demo';
        this.lastDrawTime = undefined;
    }

    onFocusChanged() {
        const hasFocus = document.hasFocus();
        if (hasFocus) {
            this.start();
        }
        
        else { // not focus
            if (this.gui.time.autoStop) {
                this.stop();
            }
        }
    }

    render() {
        this.renderer._render({
            time: this.elapsedTime / 1000
        });
    }

    draw(currentTime) {
        // delta since last frame
        if (this.lastDrawTime == undefined) {
            this.lastDrawTime = currentTime;
        }
        const dt = currentTime - this.lastDrawTime;
        this.lastDrawTime = currentTime;

        // update elapsed time
        this.elapsedTime += dt * this.gui.time.speed;
        const rounded = Math.round(this.elapsedTime / 100);
        this.timeDisplay.innerHTML = '' + rounded/10 + ((rounded % 10 == 0) ? '.0s' : 's');

        // render according to fps limit
        this.frame = (currentTime / this.frameDelay)|0;
        if (this.frame > this.prevFrame) {
            this.prevFrame = this.frame;
            this.stats.begin();
            this.render();
            this.stats.end();
        }
        this.frameRequest = requestAnimationFrame((t) => this.draw(t));
    }

    onKeyDown({key}) {
        console.log(`Key pressed: '${key}'`);

        if (key == ' ') {
            if (this.paused) this.start()
            else this.stop();
        }

        if (key == 'f') {
            document.body.classList.toggle('fullscreen');
            if (document.body.classList.contains('fullscreen')) {
                document.documentElement.requestFullscreen().then(() => {
                    this.renderer._onResize(this.fullscreenSize);
                });
            } else {
                document.exitFullscreen();
                this.renderer._onResize(this.windowedSize);
            }
        }

        if (key === 'r') {
            this.reset();
            this.start();
        }

        if (this.renderer.onKeyDown) {
            this.renderer.onKeyDown({key});
        }
    }

}
