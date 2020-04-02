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

/***/ "./js/Keyboard.js":
/*!************************!*\
  !*** ./js/Keyboard.js ***!
  \************************/
/*! exports provided: Keyboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Keyboard", function() { return Keyboard; });
/* harmony import */ var _Layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Layout */ "./js/Layout.js");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Settings */ "./js/Settings.js");



// TODO Реализовать:
// Анимация нажатия на кнопку
// Перемещение курсора и вставка имволов на место курсора
// Подключение eslint

class Keyboard {
    constructor() {
        this._layout = new _Layout__WEBPACK_IMPORTED_MODULE_0__["Layout"]();
        this._settings = new _Settings__WEBPACK_IMPORTED_MODULE_1__["Settings"]();
        this._keys = {};
        this._keyStickingForMouse = {
            isCapsLock: undefined,
            specialKeys: []
        }
        this._isCapsLockMouse = false;
    }

    //#region public methods
    init() {
        console.log("Keyboard init");

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
const keysDictionary = {
    '`' : {
        keyCode: 'Backquote',
        ru: 'ё',
        enUnShift: '`',
        enShift: '~'
    },
    '1': {
        keyCode: 'Digit1',
        ruUnShift: '1',
        ruShift: '!',
        enUnShift: '1',
        enShift: '!'
    },
    '2': {
        keyCode: 'Digit2',
        ruUnShift: '2',
        ruShift: '"',
        enUnShift: '2',
        enShift: '@'
    },
    '3': {
        keyCode: 'Digit3',
        ruUnShift: '3',
        ruShift: '№',
        enUnShift: '3',
        enShift: '#'
    },
    '4': {
        keyCode: 'Digit4',
        ruUnShift: '4',
        ruShift: ';',
        enUnShift: '4',
        enShift: '$'
    },
    '5': {
        keyCode: 'Digit5',
        ruUnShift: '5',
        ruShift: '%',
        enUnShift: '5',
        enShift: '%'
    },
    '6': {
        keyCode: 'Digit6',
        ruUnShift: '6',
        ruShift: ':',
        enUnShift: '6',
        enShift: '^'
    },
    '7': {
        keyCode: 'Digit7',
        ruUnShift: '7',
        ruShift: '?',
        enUnShift: '7',
        enShift: '&'
    },
    '8': {
        keyCode: 'Digit8',
        ruUnShift: '8',
        ruShift: '*',
        enUnShift: '8',
        enShift: '*'
    },
    '9': {
        keyCode: 'Digit9',
        ruUnShift: '9',
        ruShift: '(',
        enUnShift: '9',
        enShift: '('
    },
    '0': {
        keyCode: 'Digit0',
        ruUnShift: '0',
        ruShift: ')',
        enUnShift: '0',
        enShift: ')'
    },
    '-': {
        keyCode: 'Minus',
        ruUnShift: '-',
        ruShift: '_',
        enUnShift: '-',
        enShift: '_'
    },
    '=': {
        keyCode: 'Equal',
        ruUnShift: '=',
        ruShift: '+',
        enUnShift: '=',
        enShift: '+'
    },
    'Backspace': {
        keyCode: 'Backspace',
    },
    'Tab': {
        keyCode: 'Tab',
    },
    'q': {
        keyCode: 'KeyQ',
        ru: 'й',
        en: 'q'
    },
    'w': {
        keyCode: 'KeyW',
        ru: 'ц',
        en: 'w'
    },
    'e': {
        keyCode: 'KeyE',
        ru: 'у',
        en: 'e'
    },
    'r': {
        keyCode: 'KeyR',
        ru: 'к',
        en: 'r'
    },
    't': {
        keyCode: 'KeyT',
        ru: 'е',
        en: 't'
    },
    'y': {
        keyCode: 'KeyY',
        ru: 'н',
        en: 'y'
    },
    'u': {
        keyCode: 'KeyU',
        ru: 'г',
        en: 'u'
    },
    'i': {
        keyCode: 'KeyI',
        ru: 'ш',
        en: 'i'
    },
    'o': {
        keyCode: 'KeyO',
        ru: 'щ',
        en: 'o'
    },
    'p': {
        keyCode: 'KeyP',
        ru: 'з',
        en: 'p'
    },
    '[': {
        keyCode: 'BracketLeft',
        ru: 'х',
        enUnShift: '[',
        enShift: '{'
    },
    ']': {
        keyCode: 'BracketRight',
        ru: 'ъ',
        enUnShift: ']',
        enShift: '}'
    },
    '\\': {
        keyCode: 'Backslash',
        ruUnShift: '\\',
        ruShift: '/',
        enUnShift: '\\',
        enShift: '|'
    },
    'CapsLock': {
        keyCode: 'CapsLock',
    },
    'a': {
        keyCode: 'KeyA',
        ru: 'ф',
        en: 'a'
    },
    's': {
        keyCode: 'KeyS',
        ru: 'ы',
        en: 's'
    },
    'd': {
        keyCode: 'KeyD',
        ru: 'в',
        en: 'd'
    },
    'f': {
        keyCode: 'KeyF',
        ru: 'а',
        en: 'f'
    },
    'g': {
        keyCode: 'KeyG',
        ru: 'п',
        en: 'g'
    },
    'h': {
        keyCode: 'KeyH',
        ru: 'р',
        en: 'h'
    },
    'j': {
        keyCode: 'KeyJ',
        ru: 'о',
        en: 'j'
    },
    'k': {
        keyCode: 'KeyK',
        ru: 'л',
        en: 'k'
    },
    'l': {
        keyCode: 'KeyL',
        ru: 'д',
        en: 'l'
    },
    ';': {
        keyCode: 'Semicolon',
        ru: 'ж',
        enUnShift: ';',
        enShift: ':'
    },
    '\'': {
        keyCode: 'Quote',
        ru: 'э',
        enUnShift: '\'',
        enShift: '"'
    },
    'ShiftLeft': {
        keyCode: 'ShiftLeft',
    },
    'z': {
        keyCode: 'KeyZ',
        ru: 'я',
        en: 'z'
    },
    'x': {
        keyCode: 'KeyX',
        ru: 'ч',
        en: 'x'
    },
    'c': {
        keyCode: 'KeyC',
        ru: 'с',
        en: 'c'
    },
    'v': {
        keyCode: 'KeyV',
        ru: 'м',
        en: 'v'
    },
    'b': {
        keyCode: 'KeyB',
        ru: 'и',
        en: 'b'
    },
    'n': {
        keyCode: 'KeyN',
        ru: 'т',
        en: 'n'
    },
    'm': {
        keyCode: 'KeyM',
        ru: 'ь',
        en: 'm'
    },
    ',': {
        keyCode: 'Slash',
        ru: 'б',
        enUnShift: ',',
        enShift: '<'
    },
    '.': {
        keyCode: 'Period',
        ru: 'ю',
        enUnShift: '.',
        enShift: '>'
    },
    '/': {
        keyCode: 'Comma',
        ruUnShift: '.',
        ruShift: ',',
        enUnShift: '/',
        enShift: '?'
    },
    'Enter': {
        keyCode: 'Enter',
    },
    'Delete': {
        keyCode: 'Delete',
    },
    'ShiftRight': {
        keyCode: 'ShiftRight',
    },
    'ControlLeft': {
        keyCode: 'ControlLeft'
    },
    'MetaLeft': {
        keyCode: 'MetaLeft'
    },
    'AltLeft': {
        keyCode: 'AltLeft'
    },
    'Space': {
        keyCode: 'Space',
        ru: ' ',
        en: ' '
    },
    'AltRight': {
        keyCode: 'AltRight'
    },
    'ControlRight': {
        keyCode: 'ControlRight'
    },
    '▲': {
        keyCode: 'ArrowUp',
        ru: '▲',
        en: '▲'
    },
    '◄': {
        keyCode: 'ArrowLeft',
        ru: '◄',
        en: '◄'
    },
    '▼': {
        keyCode: 'ArrowDown',
        ru: '▼',
        en: '▼'
    },
    '►': {
        keyCode: 'ArrowRight',
        ru: '►',
        en: '►'
    }
}

/***/ }),

/***/ "./js/Layout.js":
/*!**********************!*\
  !*** ./js/Layout.js ***!
  \**********************/
/*! exports provided: Layout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Layout", function() { return Layout; });
/* harmony import */ var _Keys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Keys */ "./js/Keys.js");
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Settings */ "./js/Settings.js");



class Layout {
    constructor() {
        this._body = document.querySelector('body');
        this._input = undefined;
        this._keys = {};
    }

    //#region public methods
    create(language) {
        this._language = language;
        let wrapper = this._createWrapper();
        this._body.appendChild(wrapper);
        this._input = this._createInput();
        wrapper.appendChild(this._input);
        wrapper.appendChild(this._createKeyboard());
        wrapper.appendChild(this._createDescription())
    }

    pressKey(keyCode, isPress) {
        let keyElement = this._keys[keyCode].element;
        if(isPress) {
            keyElement.classList.add('key_press')
        }else {
            keyElement.classList.remove('key_press')
        }
    }

    print(keyCode) {
        let key = this._keys[keyCode];
        var cursorPosition = this._input.selectionStart; //TODO реализовать работу с выбранным местом

        if(!key.element.classList.contains('special')){
            this._input.value += this._keys[keyCode].text;
        }else {
            switch (keyCode) {
                case 'Backspace':
                    this._input.value = this._input.value.slice(0, -1)
                    break;
                case 'Tab':
                    this._input.value += '\t';
                    break;
                case 'Enter':
                    this._input.value += '\n';
                    break;
                case 'Delete':
                    this._input.value = this._input.value.substr(1)
                    break;
            }
        }
    }

    setShift(isShift, isCapsLock) {
        const getProperty = isShift ? this._language.nameShift : this._language.nameUnShift;
        let keys = this._getKeysArray().filter(o=>o[1][getProperty]);
        keys.forEach(key => {
            let char = key[1][getProperty];
            let element = key[1].element.firstElementChild;
            element.textContent = char;
            key[1].text = char;
        });
        this.setCapsLock(isCapsLock, isShift);
    }

    setCapsLock(isCapsLock, isShift) {
        let getPropertyChar = this._language.name;
        let keysChar = this._getKeysArray().filter(o=>o[1][getPropertyChar]);
        keysChar.forEach(key => {
            let char = key[1][getPropertyChar];
            char = isShift^isCapsLock ? char.toUpperCase() : char.toLowerCase();
            let element = key[1].element.firstElementChild;
            element.textContent = char;
            key[1].text = char;
        });
    }

    changeLanguage(language, isShift, isCapsLock) {
        this._language = language;
        this.setShift(isShift, isCapsLock);
    }

    getKeyCodeByElement(elementKey) {
        let key = this._getKeysArray().find(key=>key[1].element === elementKey);
        return key[0];
    }
    //#endregion public methods

    //#region private methods
    _createWrapper(){
        let wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        return wrapper;
    }
    _createInput(){
        let input = document.createElement('textarea');
        input.rows = 6;
        input.cols = 60;
        input.classList.add('input');
        return input;
    }
    _createKeyboard() {
        let keyboard = document.createElement('div');
        keyboard.classList.add('keyboard');
        keyboard.appendChild(this._createKeysRow(1));
        keyboard.appendChild(this._createKeysRow(2));
        keyboard.appendChild(this._createKeysRow(3));
        keyboard.appendChild(this._createKeysRow(4));
        keyboard.appendChild(this._createKeysRow(5));
        return keyboard;
    }

    _createKeysRow(rowNumber) {
        let that = this;
        let keyboardRow = document.createElement('div');
        keyboardRow.classList.add('keyboard__row');
        switch(rowNumber){
            case 1: {
                ['`',1,2,3,4,5,6,7,8,9,0,'-','='].forEach(text => {
                    keyboardRow.appendChild(that._createKey(this._getKey(text), 'char'));
                });
                keyboardRow.appendChild(that._createKey(this._getKey('Backspace'), 'special', 'backspace'));
                break;
            }
            case 2: {
                keyboardRow.appendChild(that._createKey(this._getKey('Tab'), 'special', 'tab'));
                ['q','w','e','r','t','y','u','i','o','p'].forEach(text => {
                    keyboardRow.appendChild(that._createKey(this._getKey(text), 'letter'));
                });
                ['[',']','\\'].forEach(text => {
                    keyboardRow.appendChild(that._createKey(this._getKey(text), 'char'));
                });
                keyboardRow.appendChild(that._createKey(this._getKeyWithCode('Del', 'Delete'), 'special', 'del'));
                break;
            }
            case 3: {
                keyboardRow.appendChild(that._createKey(this._getKey('CapsLock'), 'special', 'capslock'));
                ['a','s','d','f','g','h','j','k','l'].forEach(text => {
                    keyboardRow.appendChild(that._createKey(this._getKey(text), 'letter'));
                });
                [';','\''].forEach(text => {
                    keyboardRow.appendChild(that._createKey(this._getKey(text), 'char'));
                });
                keyboardRow.appendChild(that._createKey(this._getKey('Enter'), 'special', 'enter'));
                break;
            }
            case 4: {
                keyboardRow.appendChild(that._createKey(this._getKeyWithCode('Shift', 'ShiftLeft'), 'special', 'shift-left'));
                ['z','x','c','v','b','n','m'].forEach(text => {
                    keyboardRow.appendChild(that._createKey(this._getKey(text), 'letter'));
                });
                [',','.','/'].forEach(text => {
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
        }
        return keyboardRow;
    }

    _createKey(key, ...additionalClasses){
        let keyDiv = document.createElement('div');
        keyDiv.classList.add('key');
        additionalClasses.length && additionalClasses.forEach(addClass => keyDiv.classList.add(addClass)) ;
        keyDiv.appendChild(this._createKeyText(key.text));
        key.element = keyDiv;
        this._keys[key.keyCode] = key;
        return keyDiv;
    }

    _createKeyText(text){
        let keySpan = document.createElement('span');
        keySpan.classList.add('key__text');
        keySpan.textContent = text;
        return keySpan;
    }

    _createDescription(){
        let descriptionSpan = document.createElement('span');
        descriptionSpan.classList.add('description-text');
        descriptionSpan.textContent = 'Переключение языка Ctrl+Shift';
        return descriptionSpan;
    }

    //#region keys
    _getKey(text) {
        let key = _Keys__WEBPACK_IMPORTED_MODULE_0__["keysDictionary"][text] ? _Keys__WEBPACK_IMPORTED_MODULE_0__["keysDictionary"][text] : {};
        key.text = key[this._language.nameUnShift] || key[this._language.name] || text
        return key;
    }
    _getKeyWithCode(text, code) {
        let key = _Keys__WEBPACK_IMPORTED_MODULE_0__["keysDictionary"][code] ? _Keys__WEBPACK_IMPORTED_MODULE_0__["keysDictionary"][code] : {};
        key.text = key[this._language.nameUnShift] || key[this._language.name] || text
        return key;
    }
    _getKeysArray() {
        return Object.entries(this._keys);
    }
    //#endregion keys

    //#endregion private methods

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
    'ru': {
        name: 'ru',
        nameShift: 'ruShift',
        nameUnShift: 'ruUnShift',
    }, 
    'en':{
        name: 'en',
        nameShift: 'enShift',
        nameUnShift: 'enUnShift',
    }
}
class Settings {
    constructor() {
        this._isShift = false;
        this._isCapsLock = false;
        this._language = languages.en;
    }
    load() {
        var language = sessionStorage.getItem('language');
        switch (language) {
            case languages.ru.name:
                this._language = languages.ru;
                break;
            default:
                this._language = languages.en;
        }
    }
    changeSettingsShift(isShift) {
        if(this._isShift != isShift){
            this._isShift = isShift;
            return true;
        }
        return false;
    }
    changeSettingsCaps(isCapsLock) {
        if(this.isCapsLock != isCapsLock){
            this.isCapsLock = isCapsLock;
            return true;
        }
        return false;
    }
    changeAndGetLanguage() {
        this._language = this._language == languages.en ? languages.ru : languages.en;
        sessionStorage.setItem('language', this._language.name);
        return this._language;
    }
    getLanguage(){
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


window.onload = function() {
    console.log("Run start");

    const keyboard = new _Keyboard__WEBPACK_IMPORTED_MODULE_0__["Keyboard"]();
    keyboard.init();
    keyboard.run();
}

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