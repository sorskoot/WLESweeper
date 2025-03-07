import { PrefabsBase} from '@sorskoot/wonderland-components';

export class TileSpawner extends PrefabsBase {
    static TypeName = 'tile-spawner';
    static InheritProperties = true;
    
    get PrefabBinName(): string {
        return 'Tiles.bin';
    }
}