import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {TileTypes} from '../enums/TileTypes.js';

export class Tile extends Component {
    static TypeName = 'tile';

    @property.enum(Object.keys(TileTypes).filter((e) => isNaN(Number(e))))
    tileType: TileTypes;

    start() {}
}
