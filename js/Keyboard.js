import Layout from './Layout';
import Input from './Input';
import { Settings } from './Settings';

export default class Keyboard {
  constructor() {
    this._layout = new Layout();
    this._settings = new Settings();
    this._input = undefined;
    this._keys = {};
    this._keyStickingForMouse = {
      isCapsLock: undefined,
      specialKeys: [],
    };
    this._isCapsLockMouse = false;
  }

  // #region public methods
  init() {
    this._settings.load();
    const layoutResult = this._layout.create(this._settings.getLanguage());
    this._input = new Input(layoutResult.input, layoutResult.keys, this._settings.getLanguage());
  }

  run() {
    const that = this;
    document.addEventListener('keydown', (event) => {
      that._keyDownEvent(event.code, event);
      event.preventDefault();
    });
    document.addEventListener('keyup', (event) => {
      that._keyUpEvent(event.code, event);
    });
    document.querySelector('.keyboard').addEventListener('click', (e) => {
      // eslint-disable-next-line no-nested-ternary
      const elementKey = e.target.classList.contains('key')
        ? e.target
        : e.target.classList.contains('key__text')
          ? e.target.parentElement
          : null;
      if (!elementKey) return;

      const keyCode = that._input.getKeyCodeByElement(elementKey);
      that._keyMouseClickEvent(keyCode);
    });
  }
  // #endregion public methods


  // #region private methods
  _keyDownEvent(eventCode, event) {
    if (!this._keys[eventCode]) {
      this._keys[eventCode] = true;
      this._input.pressKey(eventCode, true);
      this._setSettings(event.shiftKey, event.getModifierState('CapsLock'));
    }
    this._input.print(eventCode);
  }

  _keyUpEvent(eventCode, event) {
    if (this._keys[eventCode]) {
      this._keys[eventCode] = undefined;
      const isCapsLock = event.getModifierState('CapsLock');
      if (eventCode !== 'CapsLock' || !isCapsLock) {
        this._input.pressKey(eventCode, false);
      }
      this._setSettings(event.shiftKey, isCapsLock);

      if (this._checkChangeLanguage(eventCode)) {
        const language = this._settings.changeAndGetLanguage();
        this._input.changeLanguage(language, event.shiftKey, isCapsLock);
      }

      this._fixTwoShiftKeyUpEvent(event);
      this._altKeyUpAnotherWindow(event);
      this._ctrlKeyUpAnotherTab(event);
    }
  }

  _keyMouseClickEvent(eventCode) {
    if (eventCode === 'CapsLock') this._isCapsLockMouse = !this._isCapsLockMouse;
    const isCapsLock = this._isCapsLockMouse;

    const customEvent = {
      getModifierState: () => isCapsLock,
      shiftKey: window.event.shiftKey || this._checkStickingShiftForMouse(),
      isMouseEvent: true,
    };
    if (Keyboard._checkShift(eventCode) || Keyboard._checkControl(eventCode)
        || Keyboard._checkAlt(eventCode)) {
      if (this._keyStickingForMouse.specialKeys.includes(eventCode)) {
        this._keyStickingForMouse.specialKeys = this._keyStickingForMouse
          .specialKeys.filter((o) => o !== eventCode);
        if (Keyboard._checkShift(eventCode)) {
          customEvent.shiftKey = window.event.shiftKey || this._checkStickingShiftForMouse();
        }
        this._keyUpEvent(eventCode, customEvent);
      } else {
        this._keyStickingForMouse.specialKeys.push(eventCode);
        customEvent.shiftKey = window.event.shiftKey || this._checkStickingShiftForMouse();
        this._keyDownEvent(eventCode, customEvent);
      }
    } else {
      this._keyDownEvent(eventCode, customEvent);
      customEvent.shiftKey = window.event.shiftKey;
      this._keyUpEvent(eventCode, customEvent);
      if (this._keyStickingForMouse.specialKeys.length) {
        this._keyStickingForMouse.specialKeys.forEach((specialKey) => {
          this._keyUpEvent(specialKey, customEvent);
        });
        this._keyStickingForMouse.specialKeys = [];
      }
    }
  }

  _setSettings(isShift, isCapsLock) {
    if (this._settings.changeSettingsShift(isShift)) {
      this._input.setShift(isShift, isCapsLock);
    }
    if (this._settings.changeSettingsCaps(isCapsLock)) {
      this._input.setCapsLock(isCapsLock, isShift);
    }
  }

  _checkChangeLanguage(eventCode) {
    return (Keyboard._checkShift(eventCode) && (this._keys.ControlLeft || this._keys.ControlRight))
     || (Keyboard._checkControl(eventCode) && (this._keys.ShiftLeft || this._keys.ShiftRight));
  }

  static _checkShift(eventCode) {
    return eventCode === 'ShiftLeft' || eventCode === 'ShiftRight';
  }

  static _checkControl(eventCode) {
    return eventCode === 'ControlLeft' || eventCode === 'ControlRight';
  }

  static _checkAlt(eventCode) {
    return eventCode === 'AltLeft' || eventCode === 'AltRight';
  }

  _checkStickingShiftForMouse() {
    return this._keyStickingForMouse.specialKeys.includes('ShiftLeft')
    || this._keyStickingForMouse.specialKeys.includes('ShiftRight');
  }

  _fixTwoShiftKeyUpEvent(event) {
    if (!event.shiftKey) {
      if (this._keys.ShiftLeft) {
        this._input.pressKey('ShiftLeft', false);
        this._keys.ShiftLeft = undefined;
      }
      if (this._keys.ShiftRight) {
        this._input.pressKey('ShiftRight', false);
        this._keys.ShiftRight = undefined;
      }
    }
  }

  // При переключении между окнами Alt часто снимается не в браузере (Alt+Tab)
  _altKeyUpAnotherWindow(event) {
    if (!event.altKey) {
      if (this._keys.AltLeft) {
        this._input.pressKey('AltLeft', false);
        this._keys.AltLeft = undefined;
      }
      if (this._keys.AltRight) {
        this._input.pressKey('AltRight', false);
        this._keys.AltRight = undefined;
      }
    }
  }

  // При переключении между вкладками Alt часто снимается на другой вкладке (Ctrl+Tab)
  _ctrlKeyUpAnotherTab(event) {
    if (!event.ctrlKey) {
      if (this._keys.ControlLeft) {
        this._input.pressKey('ControlLeft', false);
        this._keys.ControlLeft = undefined;
      }
      if (this._keys.ControlRight) {
        this._input.pressKey('ControlRight', false);
        this._keys.ControlRight = undefined;
      }
    }
  }
  // #endregion private methods
}
