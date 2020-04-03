/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/Input.js":
/*!*********************!*\
  !*** ./js/Input.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Input; });
/* eslint-disable no-param-reassign */
class Input {
  constructor(input, keys, language) {
    this._body = document.querySelector('body');
    this._input = input;
    this._keys = keys;
    this._language = language;
  }

  // #region public methods
  pressKey(keyCode, isPress) {
    if (!this._keys[keyCode]) { return; }
    const keyElement = this._keys[keyCode].element;
    if (isPress) {
      keyElement.classList.add('key_press');
    } else {
      keyElement.classList.remove('key_press');
    }
  }

  print(keyCode) {
    if (!this._keys[keyCode]) { return; }
    this._input.focus();
    const key = this._keys[keyCode];
    let { selectionStart } = this._input;
    if (!key.element.classList.contains('special')) {
      this._input.value = this._setChar(key.text);
    } else {
      switch (keyCode) {
        case 'Backspace':
          this._input.value = this._getTextBeforePosition().slice(0, -1)
                        + this._getTextAfterPosition();
          selectionStart -= 2;
          break;
        case 'Tab':
          this._input.value = this._setChar('\t');
          break;
        case 'Enter':
        case 'NumpadEnter':
          this._input.value = this._setChar('\n');
          break;
        case 'Delete':
          this._input.value = this._getTextBeforePosition()
                        + this._getTextAfterPosition().slice(1);
          selectionStart -= 1;
          break;
        case 'ArrowLeft':
          this._input.selectionStart -= 1;
          this._input.selectionEnd -= 1;
          return;
        case 'ArrowRight':
          this._input.selectionStart += 1;
          return;
        case 'ArrowUp':
          this._setCurrentPositionUp();
          return;
        case 'ArrowDown':
          this._setCurrentPositionDown();
          return;
        default:
          return;
      }
    }
    selectionStart += 1;
    this._input.setSelectionRange(selectionStart, selectionStart);
  }

  setShift(isShift, isCapsLock) {
    const getProperty = isShift ? this._language.nameShift : this._language.nameUnShift;
    const keys = this._getKeysArray().filter((o) => o[1][getProperty]);
    keys.forEach((key) => {
      const char = key[1][getProperty];
      const element = key[1].element.firstElementChild;
      element.textContent = char;
      key[1].text = char;
    });
    this.setCapsLock(isCapsLock, isShift);
  }

  setCapsLock(isCapsLock, isShift) {
    const getPropertyChar = this._language.name;
    const keysChar = this._getKeysArray().filter((o) => o[1][getPropertyChar]);
    keysChar.forEach((key) => {
      let char = key[1][getPropertyChar];
      // eslint-disable-next-line no-bitwise
      char = isShift ^ isCapsLock ? char.toUpperCase() : char.toLowerCase();
      const element = key[1].element.firstElementChild;
      element.textContent = char;
      key[1].text = char;
    });
  }

  changeLanguage(language, isShift, isCapsLock) {
    this._language = language;
    this.setShift(isShift, isCapsLock);
  }

  getKeyCodeByElement(elementKey) {
    const keyCurrent = this._getKeysArray().find((key) => key[1].element === elementKey);
    return keyCurrent[0];
  }
  // #endregion public methods

  // #region private methods
  _getKeysArray() {
    return Object.entries(this._keys);
  }

  _setCurrentPositionUp() {
    const text = this._input.value;
    const rows = text.split('\n');
    const currentPosition = this._input.selectionStart;
    const indicesEndRows = Input._getIndicesEndRows(text);
    const currentRow = Input._getCurrentRowIndex(indicesEndRows, currentPosition);

    let newPosition;
    if (currentRow === 0) {
      newPosition = 0;
    } else {
      newPosition = currentPosition - rows[currentRow - 1].length - 1; // 1='\n'
      if (newPosition > indicesEndRows[currentRow - 1]) {
        newPosition = indicesEndRows[currentRow - 1];
      }
    }
    this._input.setSelectionRange(newPosition, newPosition);
  }

  _setCurrentPositionDown() {
    const text = this._input.value;
    const rows = text.split('\n');
    const currentPosition = this._input.selectionStart;
    const indicesEndRows = Input._getIndicesEndRows(text);
    const currentRow = Input._getCurrentRowIndex(indicesEndRows, currentPosition);

    let newPosition;
    if (currentRow === indicesEndRows.length - 1) {
      newPosition = indicesEndRows[indicesEndRows.length - 1];
    } else {
      newPosition = currentPosition + rows[currentRow].length + 1; // 1='\n'
      if (newPosition > indicesEndRows[currentRow + 1]) {
        newPosition = indicesEndRows[currentRow + 1];
      }
    }
    this._input.setSelectionRange(newPosition, newPosition);
  }

  static _getIndicesEndRows(text) {
    const regex = /\n/gi;
    let result;
    const indicesEndRows = [];
    // eslint-disable-next-line no-cond-assign
    while ((result = regex.exec(text))) {
      indicesEndRows.push(result.index);
    }
    indicesEndRows.push(text.length);
    return indicesEndRows;
  }

  static _getCurrentRowIndex(indicesEndRows, currentPosition) {
    let currentRow;
    for (let i = 0; i < indicesEndRows.length; i += 1) {
      if (indicesEndRows[i] >= currentPosition) {
        currentRow = i;
        break;
      }
    }
    return currentRow;
  }

  _setChar(text) {
    return this._getTextBeforePosition() + text + this._getTextAfterPosition();
  }

  _getTextBeforePosition() {
    return this._input.value.slice(0, this._input.selectionStart);
  }

  _getTextAfterPosition() {
    return this._input.value.slice(this._input.selectionStart);
  }
  // #endregion private methods
}


/***/ }),

/***/ "./js/Keyboard.js":
/*!************************!*\
  !*** ./js/Keyboard.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Keyboard; });
/* harmony import */ var _Layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Layout */ "./js/Layout.js");
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Input */ "./js/Input.js");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Settings */ "./js/Settings.js");




class Keyboard {
  constructor() {
    this._layout = new _Layout__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this._settings = new _Settings__WEBPACK_IMPORTED_MODULE_2__["Settings"]();
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
    this._input = new _Input__WEBPACK_IMPORTED_MODULE_1__["default"](layoutResult.input, layoutResult.keys, this._settings.getLanguage());
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


/***/ }),

/***/ "./js/Keys.js":
/*!********************!*\
  !*** ./js/Keys.js ***!
  \********************/
/*! exports provided: keysDictionary */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keysDictionary", function() { return keysDictionary; });
// eslint-disable-next-line import/prefer-default-export
const keysDictionary = {
  '`': {
    keyCode: 'Backquote',
    ru: 'ё',
    enUnShift: '`',
    enShift: '~',
  },
  1: {
    keyCode: 'Digit1',
    ruUnShift: '1',
    ruShift: '!',
    enUnShift: '1',
    enShift: '!',
  },
  2: {
    keyCode: 'Digit2',
    ruUnShift: '2',
    ruShift: '"',
    enUnShift: '2',
    enShift: '@',
  },
  3: {
    keyCode: 'Digit3',
    ruUnShift: '3',
    ruShift: '№',
    enUnShift: '3',
    enShift: '#',
  },
  4: {
    keyCode: 'Digit4',
    ruUnShift: '4',
    ruShift: ';',
    enUnShift: '4',
    enShift: '$',
  },
  5: {
    keyCode: 'Digit5',
    ruUnShift: '5',
    ruShift: '%',
    enUnShift: '5',
    enShift: '%',
  },
  6: {
    keyCode: 'Digit6',
    ruUnShift: '6',
    ruShift: ':',
    enUnShift: '6',
    enShift: '^',
  },
  7: {
    keyCode: 'Digit7',
    ruUnShift: '7',
    ruShift: '?',
    enUnShift: '7',
    enShift: '&',
  },
  8: {
    keyCode: 'Digit8',
    ruUnShift: '8',
    ruShift: '*',
    enUnShift: '8',
    enShift: '*',
  },
  9: {
    keyCode: 'Digit9',
    ruUnShift: '9',
    ruShift: '(',
    enUnShift: '9',
    enShift: '(',
  },
  0: {
    keyCode: 'Digit0',
    ruUnShift: '0',
    ruShift: ')',
    enUnShift: '0',
    enShift: ')',
  },
  '-': {
    keyCode: 'Minus',
    ruUnShift: '-',
    ruShift: '_',
    enUnShift: '-',
    enShift: '_',
  },
  '=': {
    keyCode: 'Equal',
    ruUnShift: '=',
    ruShift: '+',
    enUnShift: '=',
    enShift: '+',
  },
  Backspace: {
    keyCode: 'Backspace',
  },
  Tab: {
    keyCode: 'Tab',
  },
  q: {
    keyCode: 'KeyQ',
    ru: 'й',
    en: 'q',
  },
  w: {
    keyCode: 'KeyW',
    ru: 'ц',
    en: 'w',
  },
  e: {
    keyCode: 'KeyE',
    ru: 'у',
    en: 'e',
  },
  r: {
    keyCode: 'KeyR',
    ru: 'к',
    en: 'r',
  },
  t: {
    keyCode: 'KeyT',
    ru: 'е',
    en: 't',
  },
  y: {
    keyCode: 'KeyY',
    ru: 'н',
    en: 'y',
  },
  u: {
    keyCode: 'KeyU',
    ru: 'г',
    en: 'u',
  },
  i: {
    keyCode: 'KeyI',
    ru: 'ш',
    en: 'i',
  },
  o: {
    keyCode: 'KeyO',
    ru: 'щ',
    en: 'o',
  },
  p: {
    keyCode: 'KeyP',
    ru: 'з',
    en: 'p',
  },
  '[': {
    keyCode: 'BracketLeft',
    ru: 'х',
    enUnShift: '[',
    enShift: '{',
  },
  ']': {
    keyCode: 'BracketRight',
    ru: 'ъ',
    enUnShift: ']',
    enShift: '}',
  },
  '\\': {
    keyCode: 'Backslash',
    ruUnShift: '\\',
    ruShift: '/',
    enUnShift: '\\',
    enShift: '|',
  },
  CapsLock: {
    keyCode: 'CapsLock',
  },
  a: {
    keyCode: 'KeyA',
    ru: 'ф',
    en: 'a',
  },
  s: {
    keyCode: 'KeyS',
    ru: 'ы',
    en: 's',
  },
  d: {
    keyCode: 'KeyD',
    ru: 'в',
    en: 'd',
  },
  f: {
    keyCode: 'KeyF',
    ru: 'а',
    en: 'f',
  },
  g: {
    keyCode: 'KeyG',
    ru: 'п',
    en: 'g',
  },
  h: {
    keyCode: 'KeyH',
    ru: 'р',
    en: 'h',
  },
  j: {
    keyCode: 'KeyJ',
    ru: 'о',
    en: 'j',
  },
  k: {
    keyCode: 'KeyK',
    ru: 'л',
    en: 'k',
  },
  l: {
    keyCode: 'KeyL',
    ru: 'д',
    en: 'l',
  },
  ';': {
    keyCode: 'Semicolon',
    ru: 'ж',
    enUnShift: ';',
    enShift: ':',
  },
  '\'': {
    keyCode: 'Quote',
    ru: 'э',
    enUnShift: '\'',
    enShift: '"',
  },
  ShiftLeft: {
    keyCode: 'ShiftLeft',
  },
  z: {
    keyCode: 'KeyZ',
    ru: 'я',
    en: 'z',
  },
  x: {
    keyCode: 'KeyX',
    ru: 'ч',
    en: 'x',
  },
  c: {
    keyCode: 'KeyC',
    ru: 'с',
    en: 'c',
  },
  v: {
    keyCode: 'KeyV',
    ru: 'м',
    en: 'v',
  },
  b: {
    keyCode: 'KeyB',
    ru: 'и',
    en: 'b',
  },
  n: {
    keyCode: 'KeyN',
    ru: 'т',
    en: 'n',
  },
  m: {
    keyCode: 'KeyM',
    ru: 'ь',
    en: 'm',
  },
  ',': {
    keyCode: 'Slash',
    ru: 'б',
    enUnShift: ',',
    enShift: '<',
  },
  '.': {
    keyCode: 'Period',
    ru: 'ю',
    enUnShift: '.',
    enShift: '>',
  },
  '/': {
    keyCode: 'Comma',
    ruUnShift: '.',
    ruShift: ',',
    enUnShift: '/',
    enShift: '?',
  },
  Enter: {
    keyCode: 'Enter',
  },
  NumpadEnter: {
    keyCode: 'Enter',
  },
  Delete: {
    keyCode: 'Delete',
  },
  ShiftRight: {
    keyCode: 'ShiftRight',
  },
  ControlLeft: {
    keyCode: 'ControlLeft',
  },
  MetaLeft: {
    keyCode: 'MetaLeft',
  },
  AltLeft: {
    keyCode: 'AltLeft',
  },
  Space: {
    keyCode: 'Space',
    ru: ' ',
    en: ' ',
  },
  AltRight: {
    keyCode: 'AltRight',
  },
  ControlRight: {
    keyCode: 'ControlRight',
  },
  '▲': {
    keyCode: 'ArrowUp',
    ru: '▲',
    en: '▲',
  },
  '◄': {
    keyCode: 'ArrowLeft',
    ru: '◄',
    en: '◄',
  },
  '▼': {
    keyCode: 'ArrowDown',
    ru: '▼',
    en: '▼',
  },
  '►': {
    keyCode: 'ArrowRight',
    ru: '►',
    en: '►',
  },
};


/***/ }),

/***/ "./js/Layout.js":
/*!**********************!*\
  !*** ./js/Layout.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Layout; });
/* harmony import */ var _Keys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Keys */ "./js/Keys.js");


class Layout {
  constructor() {
    this._body = document.querySelector('body');
    this._keys = {};
  }

  // #region public methods
  create(language) {
    this._language = language;
    const wrapper = Layout._createWrapper();
    this._body.appendChild(wrapper);
    const input = Layout._createInput();
    wrapper.appendChild(input);
    wrapper.appendChild(this._createKeyboard());
    wrapper.appendChild(Layout._createDescription());

    return { input, keys: this._keys };
  }
  // #endregion public methods

  // #region private methods
  static _createWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    return wrapper;
  }

  static _createInput() {
    const input = document.createElement('textarea');
    input.rows = 6;
    input.cols = 60;
    input.classList.add('input');
    return input;
  }

  _createKeyboard() {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    keyboard.appendChild(this._createKeysRow(1));
    keyboard.appendChild(this._createKeysRow(2));
    keyboard.appendChild(this._createKeysRow(3));
    keyboard.appendChild(this._createKeysRow(4));
    keyboard.appendChild(this._createKeysRow(5));
    this._createDublicateKeys();
    return keyboard;
  }

  _createKeysRow(rowNumber) {
    const that = this;
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('keyboard__row');
    switch (rowNumber) {
      case 1: {
        ['`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '='].forEach((text) => {
          keyboardRow.appendChild(that._createKey(this._getKey(text), 'char'));
        });
        keyboardRow.appendChild(that._createKey(this._getKey('Backspace'), 'special', 'backspace'));
        break;
      }
      case 2: {
        keyboardRow.appendChild(that._createKey(this._getKey('Tab'), 'special', 'tab'));
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].forEach((text) => {
          keyboardRow.appendChild(that._createKey(this._getKey(text), 'letter'));
        });
        ['[', ']', '\\'].forEach((text) => {
          keyboardRow.appendChild(that._createKey(this._getKey(text), 'char'));
        });
        keyboardRow.appendChild(that._createKey(this._getKeyWithCode('Del', 'Delete'), 'special', 'del'));
        break;
      }
      case 3: {
        keyboardRow.appendChild(that._createKey(this._getKey('CapsLock'), 'special', 'capslock'));
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].forEach((text) => {
          keyboardRow.appendChild(that._createKey(this._getKey(text), 'letter'));
        });
        [';', '\''].forEach((text) => {
          keyboardRow.appendChild(that._createKey(this._getKey(text), 'char'));
        });
        keyboardRow.appendChild(that._createKey(this._getKey('Enter'), 'special', 'enter'));
        break;
      }
      case 4: {
        keyboardRow.appendChild(that._createKey(this._getKeyWithCode('Shift', 'ShiftLeft'), 'special', 'shift-left'));
        ['z', 'x', 'c', 'v', 'b', 'n', 'm'].forEach((text) => {
          keyboardRow.appendChild(that._createKey(this._getKey(text), 'letter'));
        });
        [',', '.', '/'].forEach((text) => {
          keyboardRow.appendChild(that._createKey(this._getKey(text), 'char'));
        });
        keyboardRow.appendChild(that._createKey(this._getKey('▲'), 'special', 'arrow'));
        keyboardRow.appendChild(that._createKey(this._getKeyWithCode('Shift', 'ShiftRight'), 'special', 'shift-right'));
        break;
      }
      case 5: {
        keyboardRow.appendChild(that._createKey(this._getKeyWithCode('Ctrl', 'ControlLeft'), 'special', 'ctrl-left'));
        keyboardRow.appendChild(that._createKey(this._getKeyWithCode('Win', 'MetaLeft'), 'special', 'win'));
        keyboardRow.appendChild(that._createKey(this._getKeyWithCode('Alt', 'AltLeft'), 'special', 'alt-left'));
        keyboardRow.appendChild(that._createKey(this._getKeyWithCode(' ', 'Space'), 'space'));
        keyboardRow.appendChild(that._createKey(this._getKeyWithCode('Alt', 'AltRight'), 'special', 'alt-right'));
        keyboardRow.appendChild(that._createKey(this._getKey('◄'), 'special', 'arrow'));
        keyboardRow.appendChild(that._createKey(this._getKey('▼'), 'special', 'arrow'));
        keyboardRow.appendChild(that._createKey(this._getKey('►'), 'special', 'arrow'));
        keyboardRow.appendChild(that._createKey(this._getKeyWithCode('Ctrl', 'ControlRight'), 'special', 'ctrl-right'));
        break;
      }
      default:
        break;
    }
    return keyboardRow;
  }

  _createKey(key, ...additionalClasses) {
    const keyDiv = document.createElement('div');
    keyDiv.classList.add('key');
    if (additionalClasses.length) {
      additionalClasses.forEach((addClass) => keyDiv.classList.add(addClass));
    }
    keyDiv.appendChild(Layout._createKeyText(key.text));
    // eslint-disable-next-line no-param-reassign
    key.element = keyDiv;
    this._keys[key.keyCode] = key;
    return keyDiv;
  }

  static _createKeyText(text) {
    const keySpan = document.createElement('span');
    keySpan.classList.add('key__text');
    keySpan.textContent = text;
    return keySpan;
  }

  _createDublicateKeys() {
    this._keys.NumpadEnter = this._keys.Enter;
    // для задания не требуется, поэтому делаю не совсем верно, для удобства
    this._keys.Numpad1 = this._keys.Digit1;
    this._keys.Numpad2 = this._keys.Digit2;
    this._keys.Numpad3 = this._keys.Digit3;
    this._keys.Numpad4 = this._keys.Digit4;
    this._keys.Numpad5 = this._keys.Digit5;
    this._keys.Numpad6 = this._keys.Digit6;
    this._keys.Numpad7 = this._keys.Digit7;
    this._keys.Numpad8 = this._keys.Digit8;
    this._keys.Numpad9 = this._keys.Digit9;
    this._keys.Numpad0 = this._keys.Digit0;
    this._keys.NumpadDivide = this._keys.Slash;
    // this._keys['NumpadMultiply'] = this._keys[''];
    this._keys.NumpadSubtract = this._keys.Minus;
    // this._keys['NumpadAdd'] = this._keys[''];
    this._keys.NumpadDecimal = this._keys.Period;
  }

  static _createDescription() {
    const descriptionSpan = document.createElement('span');
    descriptionSpan.classList.add('description-text');
    descriptionSpan.textContent = 'Переключение языка Ctrl+Shift, OS - Windows';
    return descriptionSpan;
  }

  _getKey(text) {
    const key = _Keys__WEBPACK_IMPORTED_MODULE_0__["keysDictionary"][text] ? _Keys__WEBPACK_IMPORTED_MODULE_0__["keysDictionary"][text] : {};
    key.text = key[this._language.nameUnShift] || key[this._language.name] || text;
    return key;
  }

  _getKeyWithCode(text, code) {
    const key = _Keys__WEBPACK_IMPORTED_MODULE_0__["keysDictionary"][code] ? _Keys__WEBPACK_IMPORTED_MODULE_0__["keysDictionary"][code] : {};
    key.text = key[this._language.nameUnShift] || key[this._language.name] || text;
    return key;
  }
  // #private methods
}


/***/ }),

/***/ "./js/Settings.js":
/*!************************!*\
  !*** ./js/Settings.js ***!
  \************************/
/*! exports provided: languages, Settings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "languages", function() { return languages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Settings", function() { return Settings; });
const languages = {
  ru: {
    name: 'ru',
    nameShift: 'ruShift',
    nameUnShift: 'ruUnShift',
  },
  en: {
    name: 'en',
    nameShift: 'enShift',
    nameUnShift: 'enUnShift',
  },
};
class Settings {
  constructor() {
    this._isShift = false;
    this._isCapsLock = false;
    this._language = languages.en;
  }

  load() {
    const language = sessionStorage.getItem('language');
    switch (language) {
      case languages.ru.name:
        this._language = languages.ru;
        break;
      default:
        this._language = languages.en;
    }
  }

  changeSettingsShift(isShift) {
    if (this._isShift !== isShift) {
      this._isShift = isShift;
      return true;
    }
    return false;
  }

  changeSettingsCaps(isCapsLock) {
    if (this.isCapsLock !== isCapsLock) {
      this.isCapsLock = isCapsLock;
      return true;
    }
    return false;
  }

  changeAndGetLanguage() {
    this._language = this._language === languages.en ? languages.ru : languages.en;
    sessionStorage.setItem('language', this._language.name);
    return this._language;
  }

  getLanguage() {
    return this._language;
  }
}


/***/ }),

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Keyboard */ "./js/Keyboard.js");


window.onload = () => {
  const keyboard = new _Keyboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
  keyboard.init();
  keyboard.run();
};


/***/ }),

/***/ 0:
/*!**************************!*\
  !*** multi ./js/main.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./js/main.js */"./js/main.js");


/***/ })

/******/ });
//# sourceMappingURL=script.js.map