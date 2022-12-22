import { FX, Effect2D } from 'sandbox';

class Default2D extends Effect2D {

    constructor(args) {
        super(args);

        // Uncomment lines below to create custom settings
        // const { guiBuilder } = args; // builder to add specific elements to gui (see https://github.com/dataarts/dat.gui/blob/master/API.md)
        // // create data model
        // this.mySettings = {
        //     blur: 0.5,
        //     shadowColor: '#0000FF',
        // };
        //
        // // ensure settings are saved upon reloads
        // guiBuilder.remember(this.mySettings);
        //
        // // create menu entries
        // var myFolder = guiBuilder.addFolder('My custom settings');
        // myFolder.add(this.mySettings, 'blur', 0, 1, 0.01)
        // myFolder.addColor(this.mySettings, 'shadowColor');
    }

    init({ctx}) {
        // ctx: canvas's context
    }

    onKeyDown({key}) {
        // value is printed in console when a key is pressed
    }

    onMouseMoved({position, uv, event}) {
        // position.[xy]: in pixels
        // uv.[uv]: in [0..1] range
        // event: raw browser event with button, modifiers, and more.
    }

    onMouseClicked({position, uv, event}) {
        // position.[xy]: in pixels
        // uv.[uv]: in [0..1] range
        // event: raw browser event with button, modifiers, and more.
    }

    /* Method called each render frame, up to */
    /* 60 times per second on a 60hz monitor  */
    render({ctx, time}) {
        // ctx: canvas's context
        // time: seconds as float

        const W = ctx.canvas.width;
        const H = ctx.canvas.height;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#FFF';
        const x = this.gui.helpers.scale1 - 150;
        const y = this.gui.helpers.scale2 - 150;
        ctx.fillRect(W / 2 - 50 + x, H / 2 - 50 + y, 100, 100);
    }
}

FX.push(Default2D);
