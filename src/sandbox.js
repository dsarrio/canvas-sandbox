
var GUI = undefined;
const FX = [];

class Sandbox {
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

        // setup rendering canvas
        this.canvas = document.getElementById('canvas');
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMoved(e));
        this.canvas.addEventListener('click', (e) => this.onMouseClicked(e));

        this.fullscreenSize = {
            width: window.screen.width,
            height: window.screen.height,
        };

        this.windowedSize = { 
            width: window.innerWidth - 450, 
            height: Math.trunc((window.innerWidth - 450) / window.screen.width * window.screen.height),
        };

        this.canvas.width = this.windowedSize.width;
        this.canvas.height = this.windowedSize.height;
        this.ctx = this.canvas.getContext('2d');

        // load last or first effect
        const lastRendererName = localStorage.getItem('renderer');
        const fx = FX.find(fx => fx.name == lastRendererName) || FX[0];
        this.changeRenderer(fx);
    }

    changeRenderer(rendererClass) {
        this.reset();
        this.resetGUI({rendererClass});

        document.location.hash = rendererClass.name;

        this.renderer = new rendererClass({
            ctx: this.ctx,
            guiBuilder: this.gui,
        });
        localStorage.setItem('renderer', rendererClass.name);

        const hasFocus = document.hasFocus();
        if (hasFocus || !GUI.time.autoStop) {
            this.start();
        } else {
            this.stop();
            this.render();
        }
    }

    resetGUI({rendererClass}) {
        if (this.gui) {
            this.gui.saveToLocalStorageIfPossible();
            this.gui.destroy();
        }

        document.location.hash = rendererClass.name;

        GUI = {
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
            }
        }

        this.gui = new dat.GUI({name: 'foobar', width: 400, hideable: true});
        this.gui.useLocalStorage = true;
        
        const uiEffects = this.gui.addFolder('Select effect');
        for (var fx of FX) {
            const t = fx;
            uiEffects.add({ add: () => { this.changeRenderer(t); }}, 'add').name(t.name);
        }

        const uiGrid = this.gui.addFolder('Grid');
        this.gui.remember(GUI.grid);
        uiGrid.add(GUI.grid, 'show');
        uiGrid.add(GUI.grid, 'hsize', 0, 500, 1);
        uiGrid.add(GUI.grid, 'vsize', 0, 500, 1);
        uiGrid.add(GUI.grid, 'alpha', 0, 1, 0.01);

        const uiPolarHud = this.gui.addFolder('Polar hud');
        this.gui.remember(GUI.polarHud);
        uiPolarHud.add(GUI.polarHud, 'show');
        uiPolarHud.add(GUI.polarHud, 'section_angle', 0, Math.PI, 0.001);
        uiPolarHud.add(GUI.polarHud, 'section_count', 1, 50, 1);
        uiPolarHud.add(GUI.polarHud, 'radius', 0, 1000, 1);
        uiPolarHud.add(GUI.polarHud, 'alpha', 0, 1, 0.01);
        uiPolarHud.add(GUI.polarHud, 'showText').name('text');

        const uiTime = this.gui.addFolder('Time');
        this.gui.remember(GUI.time);
        uiTime.add(GUI.time, 'speed', 0, 20, .25);
        uiTime.add(GUI.time, 'autoStop');
        this.uiTime = uiTime;

        const uiHelpers = this.gui.addFolder('Helpers');
        this.gui.remember(GUI.helpers);
        uiHelpers.add(GUI.helpers, 'scale1', 0, 300);
        uiHelpers.add(GUI.helpers, 'scale2', 0, 300);
        uiHelpers.add(GUI.helpers, 'scale3', 0, 100);
        uiHelpers.add(GUI.helpers, 'scale4', 0, 100);
        uiHelpers.add(GUI.helpers, 'scale5', 0, 100);
        uiHelpers.add(GUI.helpers, 'toggle1');
        uiHelpers.add(GUI.helpers, 'toggle2');
        uiHelpers.add(GUI.helpers, 'toggle3');
        uiHelpers.addColor(GUI.helpers, 'colorHex');
        uiHelpers.addColor(GUI.helpers, 'colorRGB');
        uiHelpers.addColor(GUI.helpers, 'colorRGBA');
        uiHelpers.addColor(GUI.helpers, 'colorHSV');
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
            if (GUI.time.autoStop) {
                this.stop();
            }
        }
    }

    render() {
        this.ctx.save();
        this.renderer.render({
            ctx: this.ctx,
            time: this.elapsedTime / 1000
        });
        this.ctx.restore();
        this.renderPolarHud();
        this.renderGrid();
    }

    draw(currentTime) {
        // delta since last frame
        if (this.lastDrawTime == undefined) {
            this.lastDrawTime = currentTime;
        }
        const dt = currentTime - this.lastDrawTime;
        this.lastDrawTime = currentTime;

        // update elapsed time
        this.elapsedTime += dt * GUI.time.speed;
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
                    this.ctx.W = this.canvas.width = this.fullscreenSize.width;
                    this.ctx.H = this.canvas.height = this.fullscreenSize.height;
                });
            } else {
                document.exitFullscreen();
                this.ctx.W = this.canvas.width = this.windowedSize.width;
                this.ctx.H = this.canvas.height = this.windowedSize.height;
            }
            if (this.renderer.onResize) {
                this.renderer.onResize();
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

    onMouseMoved(event) {
        if (this.renderer.onMouseMoved) {      
            const canvas_rect = this.canvas.getBoundingClientRect();      
            this.renderer.onMouseMoved({
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

    onMouseClicked(event) {
        if (this.renderer.onMouseClicked) {
            const canvas_rect = this.canvas.getBoundingClientRect();      
            this.renderer.onMouseClicked({
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

    renderGrid() {
        if (!GUI.grid.show) return;
        const ctx = this.ctx;
        const Cx = ctx.canvas.width / 2 + 0.5;
        const Cy = ctx.canvas.height / 2 + 0.5;
        ctx.save();
        ctx.translate(Cx, Cy);
        ctx.globalAlpha = GUI.grid.alpha;

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
            const x = i * GUI.grid.hsize;
            ctx.moveTo(x, -Cy); ctx.lineTo(x, Cy);
            ctx.moveTo(-x, -Cy); ctx.lineTo(-x, Cy);
        }
        for (var i = 1; i < Cy; i++) {
            const y = i * GUI.grid.vsize;
            ctx.moveTo(-Cx, y); ctx.lineTo(Cx, y);
            ctx.moveTo(-Cx, -y); ctx.lineTo(Cx, -y);
        }
        ctx.stroke();
        ctx.restore();
    }

    renderPolarHud() {
        if (!GUI.polarHud.show) return;
        const ctx = this.ctx;
        const Cx = ctx.canvas.width / 2 + 0.5;
        const Cy = ctx.canvas.height / 2 + 0.5;
        ctx.save();
        ctx.translate(Cx, Cy);
        ctx.globalAlpha = GUI.polarHud.alpha;

        ctx.fillStyle = '#fff';
        ctx.font = '18px serif';

        const r = GUI.polarHud.radius;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI*2);
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#fff';
        const s = GUI.polarHud.section_angle;
        const nb = GUI.polarHud.section_count * 2;
        for (var j = 0; j < nb + 1; j++) {
            const a = Math.PI + (j-nb/2) * s;
            const v = P(Math.sin(a), Math.cos(a));
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(v.x * 1000, v.y * 1000);
            ctx.stroke();
            ctx.fillRect(v.x*r-5, v.y*r-5, 10, 10);

            if (GUI.polarHud.showText) {
                const m = ctx.measureText(j);
                ctx.fillText(j, v.x * (r + 25) - m.width / 2, v.y * (r + 25) + (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / 2);    
            }
        }

        ctx.restore();
    }
}
