import { EffectConstructor } from "../core/src/engine/Effect";
import SampleEffect2D from "./effects/SampleEffect2D";
import SampleEffect3D from "./effects/SampleEffect3D";
import EmptyEffect2D from "./effects/SeedEffect2D";

export const EffectInventory: [EffectConstructor, string][] = [
    [ SampleEffect2D, 'Sample 2D' ],
    [ SampleEffect3D, 'Sample 3D' ],
    [ EmptyEffect2D, 'Empty 2D' ],
]
