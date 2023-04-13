import { ArrowHelper, Camera, Color, Group, Scene, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ButtonApi, FolderApi, Pane } from 'tweakpane';
import { RenderContext } from '../../engine/RenderContext';

export interface SceneHelperOptions {
    enableOrbitControls?: boolean;
    showAxes?: boolean;
    background?: string;

    gui: Pane;
}

export interface SceneHelperInitOptions {
    domCanvas: HTMLCanvasElement;
    camera: Camera;
    scene: Scene;
}

export class SceneHelper {

    private enableOrbitControls: boolean;
    private showAxes: boolean;
    private background: string;

    private scene!: Scene;
    orbitControls!: OrbitControls;
    axesHelper!: Group;
    
    gui: FolderApi;
    private _guiResetBtn: ButtonApi;

    constructor(options: SceneHelperOptions) {

        // ui
        this.enableOrbitControls = options?.enableOrbitControls === undefined ? true : options.enableOrbitControls;
        this.showAxes = options?.showAxes === undefined ? true : options.showAxes ;
        this.background = options?.background || '#999';

        this.gui = options.gui.addFolder({ title: 'Helper - Scene' });
        this.gui.addInput(this as any, 'showAxes', { label: 'Show origin axes', presetKey: 'scene-helper.showAxes' });
        this.gui.addInput(this as any, 'background', { label: 'Background', presetKey: 'scene-helper.background' });
        this.gui.addInput(this as any, 'enableOrbitControls', { label: 'Enable orbit controls', presetKey: 'scene-helper.enableOrbitControls' });
        this._guiResetBtn = this.gui.addButton({ title: 'Reset camera' });
    }

    async init(options: SceneHelperInitOptions) {
        this.scene = options.scene;

        // setup controls
        this.orbitControls = new OrbitControls(options.camera, options.domCanvas);
        this.orbitControls.addEventListener('end', this.saveState.bind(this));
        this.loadState();

        this._guiResetBtn .on('click', () => {
            this.orbitControls.reset();
            this.saveState();
        });

        // add origin axes
        this.axesHelper = new Group;
        this.axesHelper.add(new ArrowHelper(new Vector3(1, 0, 0), new Vector3, 1, 0x7F2020, 0.2, 0.1));
        this.axesHelper.add(new ArrowHelper(new Vector3(0, 1, 0), new Vector3, 1, 0x207F20, 0.2, 0.1));
        this.axesHelper.add(new ArrowHelper(new Vector3(0, 0, 1), new Vector3, 1, 0x20207F, 0.2, 0.1));
        this.scene.add(this.axesHelper);

        // set background
        this.scene.background = new Color(this.background);
    }

    saveState() {
        const orbitState = {
            target: this.orbitControls.target,
            position: this.orbitControls.object.position,
            zoom: (this.orbitControls.object as any).zoom,
        };
        localStorage.setItem('orbitState', JSON.stringify(orbitState));
    }

    loadState() {
        const orbitStateJson = localStorage.getItem('orbitState');
        if (orbitStateJson) {
            const orbitState = JSON.parse(orbitStateJson) as any;
            this.orbitControls.target.set(orbitState.target.x, orbitState.target.y, orbitState.target.z);
            this.orbitControls.object.position.set(orbitState.position.x, orbitState.position.y, orbitState.position.z);
            (this.orbitControls.object as any).zoom = orbitState.zoom;
            this.orbitControls.update();
        }
    }

    update(_rc: RenderContext) {
        this.orbitControls.enabled = this.enableOrbitControls;
        if (this.scene.background === undefined || this.scene.background instanceof Color) {
            this.scene.background.set(this.background);
        }
        this.axesHelper.visible = this.showAxes;
    }
}
