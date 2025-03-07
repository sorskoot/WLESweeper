import {Component, Object3D, Texture} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

export class UiTextures extends Component {
    static TypeName = 'ui-textures';

    // Singleton
    private static _instance: UiTextures;
    static get instance(): UiTextures {
        return UiTextures._instance;
    }

    init() {
        if (UiTextures._instance) {
            console.error('There can only be one instance of UiTextures Component');
        }
        UiTextures._instance = this;
    }

    @property.texture()
    flag?: Texture;
}
