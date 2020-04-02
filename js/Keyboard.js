import { Layout } from './Layout'
import { Settings } from './Settings'

// TODO Реализовать:
// Подключение eslint

export class Keyboard {
    constructor() {
        this._layout = new Layout();
        this._settings = new Settings();
        this._keys = {};
        this._keyStickingForMouse = {
            isCapsLock: undefined,
            specialKeys: []
        }
        this._isCapsLockMouse = false;
    }

    //#region public methods
    init() {
        this._settings.load();
        this._layout.create(this._settings.getLanguage());
    }

    run() {
        const that = this;
        document.addEventListener('keydown', function(event) {
                that._keyDownEvent(event.code, event);
                event.preventDefault();
            });
        document.addEventListener('keyup', function(event) {
                that._keyUpEvent(event.code, event);
          });
        document.querySelector('.keyboard').addEventListener('click', function(e) {
            let elementKey = e.target.classList.contains('key') ? e.target : 
                e.target.classList.contains('key__text') ? e.target.parentElement : null; 
            if(!elementKey) return

            let keyCode = that._layout.getKeyCodeByElement(elementKey);
            that._keyMouseClickEvent(keyCode);            
        })
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

    _keyUpEvent(eventCode, event) {
        if(this._keys[eventCode]){
            this._keys[eventCode] = undefined;
            const isCapsLock = event.getModifierState("CapsLock");
            if(eventCode !== 'CapsLock' || !isCapsLock)
                this._layout.pressKey(eventCode, false);
            this._setSettings(event.shiftKey, isCapsLock);

            if(this._checkChangeLanguage(eventCode)){
                let language = this._settings.changeAndGetLanguage();
                this._layout.changeLanguage(language, event.shiftKey, isCapsLock);
            }
        }
    }

    _keyMouseClickEvent(eventCode) {
        if(eventCode == 'CapsLock') this._isCapsLockMouse = !this._isCapsLockMouse;
        let isCapsLock = this._isCapsLockMouse;

        let customEvent = {
            getModifierState: (s) => { return isCapsLock; },
            shiftKey: event.shiftKey || this._checkStickingShiftForMouse(),
            isMouseEvent: true
        }
        if(this._checkShift(eventCode) || this._checkControl(eventCode) || this._checkAlt(eventCode)) {
            if(this._keyStickingForMouse.specialKeys.includes(eventCode)){
                this._keyStickingForMouse.specialKeys = 
                        this._keyStickingForMouse.specialKeys.filter(o=>o!=eventCode);
                if(this._checkShift(eventCode))
                    customEvent.shiftKey = event.shiftKey || this._checkStickingShiftForMouse();
                this._keyUpEvent(eventCode, customEvent);
                return;
            } else {
                this._keyStickingForMouse.specialKeys.push(eventCode);
                customEvent.shiftKey = event.shiftKey || this._checkStickingShiftForMouse();
                this._keyDownEvent(eventCode, customEvent);
            }

        } else {
            this._keyDownEvent(eventCode, customEvent);
            customEvent.shiftKey = event.shiftKey;
            this._keyUpEvent(eventCode, customEvent);
            if(this._keyStickingForMouse.specialKeys.length)
            {
                this._keyStickingForMouse.specialKeys.forEach(specialKey => {
                    this._keyUpEvent(specialKey, customEvent);
                });
                this._keyStickingForMouse.specialKeys = [];
            }
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

    _checkChangeLanguage(eventCode) {
        return (this._checkShift(eventCode) &&
            (this._keys['ControlLeft'] || this._keys['ControlRight'])) || 
            (this._checkControl(eventCode) &&
            (this._keys['ShiftLeft'] || this._keys['ShiftRight']));
    }

    _checkShift(eventCode) {
        return eventCode === 'ShiftLeft' || eventCode === 'ShiftRight';
    }
    _checkControl(eventCode) {
        return eventCode === 'ControlLeft' || eventCode === 'ControlRight';
    }
    _checkAlt(eventCode) {
        return eventCode === 'AltLeft' || eventCode === 'AltRight';
    }
    _checkStickingShiftForMouse() {
        return this._keyStickingForMouse.specialKeys.includes('ShiftLeft') || 
            this._keyStickingForMouse.specialKeys.includes('ShiftRight');
    }
    //#endregion private methods
}