import { Layout } from './Layout'
import { Settings } from './Settings'

export class Keyboard {
    constructor() {
        this._layout = new Layout();
        this._settings = new Settings();
        this._keys = {};
    }

    //#region public methods
    init() {
        console.log("Keyboard init");

        this._settings.load();
        this._layout.create();
    }

    show() {
        this._layout.show(this._settings.language);
    }

    run() {
        const that = this;
        document.addEventListener('keydown', function(event) {
                that._keyDownEvent(event.code, event);
            });
        document.addEventListener('keyup', function(event) {
                that._keyUpEvent(event.code);
          });
    }
    //#endregion public methods


    //#region private methods
    _keyDownEvent(eventCode, event) {
        if(!this._keys[eventCode]){
            this._keys[eventCode] = true;
            this._layout.pressKey(eventCode, true);
            this._setSettings(event.shiftKey, event.getModifierState("CapsLock"));
        }
        this._layout.print(eventCode);
    }

    _keyUpEvent(eventCode) {
        if(this._keys[eventCode]){
            this._keys[eventCode] = undefined;
            const isCapsLock = event.getModifierState("CapsLock");
            if(eventCode !== 'CapsLock' || !isCapsLock)
                this._layout.pressKey(eventCode, false);
            this._setSettings(event.shiftKey, isCapsLock);
        }
    }

    _setSettings(isShift, isCapsLock) {
        if(this._settings.changeSettingsShift(isShift)) {
            this._layout.setShift(isShift, isCapsLock);
        }
        if(this._settings.changeSettingsCaps(isCapsLock)) {
            this._layout.setCapsLock(isCapsLock, isShift);
        }
    }
    //#endregion private methods
}