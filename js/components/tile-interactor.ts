import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {CursorTarget} from '@wonderlandengine/components';
import {GridGenerator} from './grid-generator.js';

export class TileInteractor extends Component {
    static TypeName = 'tile-interactor';

    key: string = '';

    onActivate(): void {
        this.object.getComponent(CursorTarget).onClick.add(this._onClick);
    }

    onDeactivate(): void {
        this.object.getComponent(CursorTarget).onClick.remove(this._onClick);
    }

    private _onClick = () => {
        GridGenerator.instance.onTileClick(this.key);
    };
}
