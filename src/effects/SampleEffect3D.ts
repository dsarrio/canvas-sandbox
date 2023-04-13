import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, TextureLoader, WebGLRenderer } from "three";
import { Pane } from "tweakpane";
import { Effect, EffectOptions } from "../../core/src/engine/Effect";
import { RenderContext } from "../../core/src/engine/RenderContext";
import { ResizeEvent } from "../../core/src/engine/ResizeEvent";
import { SceneHelper } from "../../core/src/lib/3D/SceneHelper";

import checkerboardImg from "../resources/checkerboard.png"

export default class SampleEffect3D implements Effect {

    gui: Pane;

    private _renderer!: WebGLRenderer;
    private _scene!: Scene;
    private _camera!: PerspectiveCamera;

    private _sceneHelper!: SceneHelper;
    private _resizeObserver!: ResizeObserver;

    private _cube!: Mesh;

    constructor() {
        this.gui = new Pane({ title: 'Sample 3D' });
    }

    async init(options: EffectOptions) {

        this._resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            const width = entries[0].contentRect.width;
            const height = entries[0].contentRect.height;
            this.onResize({ width, height });
        });
        this._resizeObserver.observe(options.domCanvas);

        // init ThreeJS
        this._renderer = new WebGLRenderer({ canvas: options.domCanvas, antialias: true });
        this._renderer.setSize(options.domCanvas.width, options.domCanvas.height, false);

        // Camera
        const aspectRatio = options.domCanvas.width / options.domCanvas.height;
        this._camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100000);
        this._camera.position.z = 2;
        this._camera.updateProjectionMatrix();

        // Create checker material
        const textureLoader = new TextureLoader;
        const texture = await textureLoader.loadAsync(checkerboardImg);
        const cubeMaterial = new MeshBasicMaterial({ map: texture });

        const textureFlipped = texture.clone();
        textureFlipped.flipY = false;
        const cubeMaterialFlipped = new MeshBasicMaterial({ map: textureFlipped });

        // Create sample cube
        const geometry = new BoxGeometry()
        this._cube = new Mesh(geometry, [cubeMaterial, cubeMaterial, cubeMaterial, cubeMaterial, cubeMaterialFlipped, cubeMaterialFlipped]);

        // Compose scene
        this._scene = new Scene();
        this._scene.add(this._cube);

        this._sceneHelper = new SceneHelper(this);
        await this._sceneHelper.init({
            domCanvas: options.domCanvas,
            camera: this._camera,
            scene: this._scene,
        });
    }

    dispose() {
        this._renderer.dispose();
        this._resizeObserver.disconnect();
    }

    onResize(event: ResizeEvent) {
        this._renderer.setSize(event.width, event.height, false);
        this._camera.aspect = event.width / event.height;
        this._camera.updateProjectionMatrix();
    }

    render(renderContext: RenderContext) {
        this._sceneHelper.update(renderContext);

        // animate cube
        this._cube.rotation.y = renderContext.time / 4;

        // done
        this._renderer.render(this._scene, this._camera);
    }
}
