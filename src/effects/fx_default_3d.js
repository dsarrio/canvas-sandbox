import * as THREE from 'three';
import { FX, Effect3D } from '../sandbox.js';
import { OrbitControls } from '../lib/threejs/addons/OrbitControls.js';

class Default3D extends Effect3D {

    constructor(args) {
        super(args);

        // width, height: canvas size
        // gui: common settings
        // guiBuilder: builder to add specific elements to gui (see https://github.com/dataarts/dat.gui/blob/master/API.md)
        const { width, height, gui, guiBuilder } = args;

        // Custom settings        
        //   1. create data model
        this.mySettings = { wireframe: false, color: '#FFFFFF' };

        //   2. ensure settings are saved upon reloads
        guiBuilder.remember(this.mySettings);        

        //   3. create menu entries
        var myFolder = guiBuilder.addFolder('My custom settings');
        myFolder.add(this.mySettings, 'wireframe')
        myFolder.addColor(this.mySettings, 'color');
    }

    async init({canvas, renderer, scene, camera}) {
        // Enable mouse controls
        // rotate   : mleft + drag
        // translate: mright + drag
        // zoom     : mwheel
        new OrbitControls(camera, canvas);

        // Create checker material
        const textureLoader = new THREE.TextureLoader;
        const texture = await textureLoader.loadAsync('/assets/checkerboard.jpg');
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(this.mySettings.color),
            wireframe: this.mySettings.wireframe,
            map: texture,
        });

        // Create sample cube
        const geometry = new THREE.BoxGeometry()
        this.cube = new THREE.Mesh(geometry, material);

        // Add cube to scene
        scene.add(this.cube);
    }

    onKeyDown({key}) {
        // value is printed in console when a key is pressed
    }

    /* Method called each render frame, up to */
    /* 60 times per second on a 60hz monitor  */
    render({time}) {

        // apply UI settings
        this.cube.material.wireframe = this.mySettings.wireframe;
        this.cube.material.color.set(this.mySettings.color);

        // animate cube
        this.cube.rotation.y = time / 4;
    }
}

FX.push(Default3D);
