import { RgbaColorObject, RgbColorObject } from "@tweakpane/core";
import { Pane } from "tweakpane";

export interface TuningHelperOptions {
    gui: Pane;
}

export class TuningHelper {

    scale1: number = 0;
    scale2: number = 0;
    scale3: number = 0;
    scale4: number = 0;
    scale5: number = 0;
    toggle1: boolean = false;
    toggle2: boolean = false;
    toggle3: boolean = false;
    colorHex: string = '#000000';
    colorRGB: RgbColorObject = { r: 0, g: 128, b: 255 };
    colorRGBA: RgbaColorObject = { r: 0, g: 128, b: 255, a: 0.3 };

    constructor(options: TuningHelperOptions) {
        const uiHelpers = options.gui.addFolder({ title: 'Helper - Tuning', expanded: false });
        uiHelpers.addInput(this, 'scale1', { min: -500,  max: 500, presetKey: 'tuning-helper.scale1' });
        uiHelpers.addInput(this, 'scale2', { min: -500,  max: 500, presetKey: 'tuning-helper.scale2'  });
        uiHelpers.addInput(this, 'scale3', { min: -500,  max: 500, presetKey: 'tuning-helper.scale3'  });
        uiHelpers.addInput(this, 'scale4', { min: -500,  max: 500, presetKey: 'tuning-helper.scale4'  });
        uiHelpers.addInput(this, 'scale5', { min: -500,  max: 500, presetKey: 'tuning-helper.scale5'  });
        uiHelpers.addInput(this, 'toggle1', { presetKey: 'tuning-helper.toggle1' });
        uiHelpers.addInput(this, 'toggle2', { presetKey: 'tuning-helper.toggle2' });
        uiHelpers.addInput(this, 'toggle3', { presetKey: 'tuning-helper.toggle3' });
        uiHelpers.addInput(this, 'colorHex', { presetKey: 'tuning-helper.colorHex' });
        uiHelpers.addInput(this, 'colorRGB', { presetKey: 'tuning-helper.colorRGB' });
        uiHelpers.addInput(this, 'colorRGBA', { presetKey: 'tuning-helper.colorRGBA' });
    }

}
