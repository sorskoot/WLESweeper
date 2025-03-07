import {NotifyPropertyChanged} from '@sorskoot/wonderland-components';

export class HudModel extends NotifyPropertyChanged {
    private static _instance: HudModel;
    static get instance(): HudModel {
        if (!HudModel._instance) {
            HudModel._instance = new HudModel();
        }
        return HudModel._instance;
    }

    private _winState: boolean = false;
    get winState(): boolean {
        return this._winState;
    }

    private _loosingState: boolean = false;
    get loosingState(): boolean {
        return this._loosingState;
    }

    private constructor() {
        super();
    }

    setWinState(value: boolean) {
        if (this._winState !== value) {
            this._winState = value;
            this.notifyPropertyChanged('winState');
        }
    }
    setLoosingState(value: boolean) {
        if (this._loosingState !== value) {
            this._loosingState = value;
            this.notifyPropertyChanged('loosingState');
        }
    }
}
