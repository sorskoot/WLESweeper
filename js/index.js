/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 */

/* wle:auto-imports:start */
import {Cursor} from '@wonderlandengine/components';
import {CursorTarget} from '@wonderlandengine/components';
import {OrbitalCamera} from '@wonderlandengine/components';
import {WasdControlsComponent} from '@wonderlandengine/components';
import {AudioManager} from './components/audio-manager.js';
import {GridGenerator} from './components/grid-generator.js';
import {TileInteractor} from './components/tile-interactor.js';
import {TileSpawner} from './components/tile-spawner.js';
import {Tile} from './components/tile.js';
import {Hud} from './ui/hud.tsx';
import {UiTextures} from './ui/ui-textures.js';
/* wle:auto-imports:end */

export default function(engine) {
/* wle:auto-register:start */
engine.registerComponent(Cursor);
engine.registerComponent(CursorTarget);
engine.registerComponent(OrbitalCamera);
engine.registerComponent(WasdControlsComponent);
engine.registerComponent(AudioManager);
engine.registerComponent(GridGenerator);
engine.registerComponent(TileInteractor);
engine.registerComponent(TileSpawner);
engine.registerComponent(Tile);
engine.registerComponent(Hud);
engine.registerComponent(UiTextures);
/* wle:auto-register:end */
}
