import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {TileSpawner} from './tile-spawner.js';
import {Tile} from './tile.js';
import {TileTypes} from '../enums/TileTypes.js';
import {TileInteractor} from './tile-interactor.js';
import {rng, wlUtils} from '@sorskoot/wonderland-components';
import {UserActions} from '../enums/UserActions.js';
import {HudModel} from '../models/HudModel.js';
import {AudioManager} from './audio-manager.js';
import {Sounds} from '../enums/Sounds.js';

class Point2D {
    constructor(
        public x: number,
        public y: number
    ) {}
}

type tileDefinition = {
    obj: Object3D;
    covered: boolean;
    type: TileTypes;
};

export class GridGenerator extends Component {
    static TypeName = 'grid-generator';

    private static _instance: GridGenerator;
    static get instance(): GridGenerator {
        return GridGenerator._instance;
    }

    @property.int(8)
    width = 8;

    @property.int(8)
    height = 8;

    @property.int(8)
    numberOfBombs = 8;

    @property.string()
    baseTile: string;

    @property.string()
    bombTile: string;

    @property.string('tile1')
    number1Tile: string = 'tile1';
    @property.string('tile2')
    number2Tile: string = 'tile2';
    @property.string('tile3')
    number3Tile: string = 'tile3';
    @property.string('tile4')
    number4Tile: string = 'tile4';
    @property.string('tile5')
    number5Tile: string = 'tile5';
    @property.string('tile6')
    number6Tile: string = 'tile6';
    @property.string('tile7')
    number7Tile: string = 'tile7';
    @property.string('tile8')
    number8Tile: string = 'tile8';
    @property.string()
    emptyTile: string;
    @property.string()
    flag: string;

    private _grid: Map<string, tileDefinition> = new Map();

    userAction: UserActions = UserActions.Uncover;

    init() {
        if (GridGenerator._instance) {
            console.error('There can only be one instance of GridGenerator Component');
        }
        GridGenerator._instance = this;
    }

    start() {
        TileSpawner.instance.onPrefabsLoaded.add(() => {
            this.restart();
        });
    }

    update(dt: number) {}

    private _createGrid() {
        this._grid.clear();

        this.object.children.forEach((tile) => {
            tile.destroy();
        });

        let bombsPlaced = 0;
        while (bombsPlaced < this.numberOfBombs) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const currentPoint = new Point2D(x, y);
            if (!this._grid.has(this._toIndex(currentPoint))) {
                const tile = TileSpawner.instance.spawn(this.baseTile, this.object);
                tile.getComponent(TileInteractor).key = this._toIndex(currentPoint);
                tile.setPositionWorld([
                    x - this.width / 2 + 0.5,
                    0,
                    y - this.height / 2 + 0.5,
                ]);
                tile.rotateAxisAngleDegObject([0, 1, 0], rng.getItem([0, 90, 180, 270]));
                this._grid.set(this._toIndex(currentPoint), {
                    obj: tile,
                    covered: true,
                    type: TileTypes.Bomb,
                });
                bombsPlaced++;
            }
        }

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const currentPoint = new Point2D(i, j);
                if (!this._grid.has(this._toIndex(currentPoint))) {
                    // So there's no bomb here, we need to spawn a tile
                    // Check surrounding tiles
                    let bombCount = 0;
                    for (let x = -1; x <= 1; x++) {
                        for (let y = -1; y <= 1; y++) {
                            if (x == 0 && y == 0) continue;
                            const checkPoint = new Point2D(i + x, j + y);
                            if (this._grid.has(this._toIndex(checkPoint))) {
                                if (
                                    this._grid.get(this._toIndex(checkPoint)).type ===
                                    TileTypes.Bomb
                                ) {
                                    bombCount++;
                                }
                            }
                        }
                    }

                    let tileType: TileTypes = TileTypes.Empty;
                    switch (bombCount) {
                        case 1:
                            tileType = TileTypes.Number1;
                            break;
                        case 2:
                            tileType = TileTypes.Number2;
                            break;
                        case 3:
                            tileType = TileTypes.Number3;
                            break;
                        case 4:
                            tileType = TileTypes.Number4;
                            break;
                        case 5:
                            tileType = TileTypes.Number5;
                            break;
                        case 6:
                            tileType = TileTypes.Number6;
                            break;
                        case 7:
                            tileType = TileTypes.Number7;
                            break;
                        case 8:
                            tileType = TileTypes.Number8;
                            break;
                    }
                    const tile = TileSpawner.instance.spawn(this.baseTile, this.object);
                    tile.getComponent(TileInteractor).key = this._toIndex(currentPoint);
                    tile.setPositionWorld([
                        i - this.width / 2 + 0.5,
                        0,
                        j - this.height / 2 + 0.5,
                    ]);
                    tile.rotateAxisAngleDegObject(
                        [0, 1, 0],
                        rng.getItem([0, 90, 180, 270])
                    );
                    this._grid.set(this._toIndex(currentPoint), {
                        obj: tile,
                        covered: true,
                        type: tileType,
                    });
                }
            }
        }
    }

    onTileClick(key: string, auto: boolean = false) {
        if (HudModel.instance.winState || HudModel.instance.loosingState) {
            return;
        }

        const tileDesciption = this._grid.get(key);
        if (!tileDesciption) return;

        if (tileDesciption.covered) {
            if (this.userAction !== UserActions.Uncover) {
                this.userAction = UserActions.Uncover;
                TileSpawner.instance.spawn(this.flag, tileDesciption.obj);
                return;
            }

            const tile = tileDesciption.obj;
            const pos = tile.getPositionWorld();
            if (!auto) {
                AudioManager.instance.play(Sounds.uncover);
            }
            wlUtils.setActive(tile, false);
            wlUtils.destroyWithDelay(tile, 1);

            let tileName: string = this._getTilename(tileDesciption);
            const uncoveredTile = TileSpawner.instance.spawn(tileName, this.object);
            uncoveredTile.setPositionWorld(pos);
            tileDesciption.obj = uncoveredTile;
            tileDesciption.covered = false;
            this._grid.set(key, tileDesciption);

            if (tileDesciption.type === TileTypes.Empty) {
                this._uncoverNeighbors(key);
            }

            if (tileDesciption.type === TileTypes.Bomb) {
                this._gameOver();
            } else {
                this._hasWon();
            }
        }
    }

    restart() {
        this._createGrid();
        HudModel.instance.setWinState(false);
        HudModel.instance.setLoosingState(false);
        this.userAction = UserActions.Uncover;
    }

    private _uncoverNeighbors(key: string) {
        const point = this._toPoint(key);
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x == 0 && y == 0) continue;
                const checkPoint = new Point2D(point.x + x, point.y + y);
                const checkKey = this._toIndex(checkPoint);
                const tileDesciption = this._grid.get(checkKey);
                if (tileDesciption && tileDesciption.covered) {
                    this.onTileClick(checkKey, true);
                }
            }
        }
    }

    private _toIndex(point: Point2D): string {
        return `${point.x},${point.y}`;
    }
    private _toPoint(key: string): Point2D {
        return new Point2D(parseInt(key.split(',')[0]), parseInt(key.split(',')[1]));
    }

    private _getTilename(tileDesciption: tileDefinition) {
        let tileName: string = this.emptyTile;
        switch (tileDesciption.type) {
            case TileTypes.Number1:
                tileName = this.number1Tile;
                break;
            case TileTypes.Number2:
                tileName = this.number2Tile;
                break;
            case TileTypes.Number3:
                tileName = this.number3Tile;
                break;
            case TileTypes.Number4:
                tileName = this.number4Tile;
                break;
            case TileTypes.Number5:
                tileName = this.number5Tile;
                break;
            case TileTypes.Number6:
                tileName = this.number6Tile;
                break;
            case TileTypes.Number7:
                tileName = this.number7Tile;
                break;
            case TileTypes.Number8:
                tileName = this.number8Tile;
                break;
            case TileTypes.Bomb:
                tileName = this.bombTile;
                break;
        }
        return tileName;
    }

    private _hasWon() {
        if (this._countCoveredTiles() == this.numberOfBombs) {
            AudioManager.instance.play(Sounds.success);
            setTimeout(() => {
                HudModel.instance.setWinState(true);
            }, 500);
        }
    }
    private _gameOver() {
        AudioManager.instance.play(Sounds.explosion);
        setTimeout(() => {
            HudModel.instance.setLoosingState(true);
        }, 500);
    }

    private _countCoveredTiles(): number {
        let count = 0;
        this._grid.forEach((tile) => {
            if (tile.covered) {
                count++;
            }
        });
        return count;
    }
}
