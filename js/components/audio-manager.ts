import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {globalAudioManager} from '@wonderlandengine/spatial-audio';
import {Sounds} from '../enums/Sounds.js';

export class AudioManager extends Component {
    static TypeName = 'audio-manager';

    // Singleton
    private static _instance: AudioManager;
    static get instance(): AudioManager {
        return AudioManager._instance;
    }

    init() {
        if (AudioManager._instance) {
            console.error('There can only be one instance of AudioManager Component');
        }
        AudioManager._instance = this;
    }

    start() {
        globalAudioManager.loadBatch(
            ['sfx/click.ogg', Sounds.click],
            ['sfx/explosion.ogg', Sounds.explosion],
            ['sfx/success.wav', Sounds.success],
            [
                [
                    'sfx/DEMOLISH_Short_01_mono.wav',
                    'sfx/DEMOLISH_Short_02_mono.wav',
                    'sfx/DEMOLISH_Short_03_mono.wav',
                    'sfx/DEMOLISH_Short_04_mono.wav',
                    'sfx/DEMOLISH_Short_05_mono.wav',
                ],
                Sounds.uncover,
            ]
        );
    }

    play(sound: Sounds) {
        globalAudioManager.play(sound, {volume: 0.75});
    }
}
