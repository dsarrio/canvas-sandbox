import * as THREE from 'three';
import { FX, Effect3D } from 'sandbox';
import { OrbitControls } from '../lib/threejs/addons/OrbitControls.js';

class Default3D extends Effect3D {

    constructor(args) {
        super(args);

        // width, height: canvas size
        // gui: common settings
        // guiBuilder: builder to add specific elements to gui (see https://github.com/dataarts/dat.gui/blob/master/API.md)
        const { width, height, gui, guiBuilder } = args;

        // Sample custom settings        
        //   create data model
        this.mySettings = { wireframe: true, color: '#FFFFFF' };
        //   ensure settings are saved upon reloads
        guiBuilder.remember(this.mySettings);        
        //   create menu entries
        var myFolder = guiBuilder.addFolder('My custom settings');
        myFolder.add(this.mySettings, 'wireframe')
        myFolder.addColor(this.mySettings, 'color');
    }

    init({canvas, renderer, scene, camera}) {

        // Enable mouse controls
        // rotate   : mleft + drag
        // translate: mright + drag
        // zoom     : mwheel
        new OrbitControls(camera, canvas);

        // Create sample cube
        const geometry = new THREE.BoxGeometry()
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(this.mySettings.color),
            wireframe: this.mySettings.wireframe,
        });
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
        this.cube.material.wireframe = this.mySettings.wireframe;
        this.cube.material.color.set(this.mySettings.color);

        this.cube.rotation.y = time / 4;
    }
}

FX.push(Default3D);
