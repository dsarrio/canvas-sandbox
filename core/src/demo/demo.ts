
import { ListApi, Pane, TpChangeEvent } from 'tweakpane';
import { EffectInventory } from '../../../src/inventory';
import { Engine } from '../engine/Engine';

import '../../styles/demo.scss';

var canvas: HTMLCanvasElement | null = null;
const guiSelectorContainer = document.getElementById('gui-effect-selector')!;
const guiEffecContainer = document.getElementById('gui-effect')!;

const engine = new Engine();

const loadEffect = (idx: number) => {
    engine.stop();

    if (engine.effect) {
        const oldEffect = engine.effect;
        oldEffect.gui?.element.remove();
        delete engine.effect;
        oldEffect.dispose();
    }

    if (canvas) canvas.remove();
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    const effect = engine.effect = new EffectInventory[idx][0]();
    if (effect.gui) guiEffecContainer.appendChild(effect.gui.element);
    effect.init({ domCanvas: canvas }).then(() => {
        engine.start();
    });
}

const effectsSelectorOptions = EffectInventory.map((item, idx) => { return { text: item[1], value: idx } });
const pane =  new Pane({ container: guiSelectorContainer });
const effectSelector = pane.addBlade({
    view: 'list',
    label: 'Effect',
    options: EffectInventory.map((item, idx) => { return { text: item[1], value: idx } }),
    value: '',
}) as ListApi<any>;
effectSelector.on('change', (event: TpChangeEvent<any>) => loadEffect(event.value));    

if (effectsSelectorOptions.length <= 1) {
    guiSelectorContainer.style.display = 'none';
}

effectSelector.controller_.valueController.value.setRawValue(0);
