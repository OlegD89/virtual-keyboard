import { keysDictionary } from './Keys'
import { languages } from './Settings'

export class Layout {
    constructor() {
        this._body = document.querySelector('body');
        this._input = undefined;
        this._status = {
            language: languages.en,
            shift: false,
            capslock: false
        }
        this._keys = {};
    }

    //#region public methods
    create() {
        let wrapper = this._createWrapper();
        this._body.appendChild(wrapper);
        this._input = this._createInput();
        wrapper.appendChild(this._input);
        wrapper.appendChild(this._createKeyboard());
    }

    show(language, specialKeys) {
        if(language == this._status.language)
            return;
    }

    pressKey(keyCode, isPress) {
        let keyElement = this._keys[keyCode].element;
        if(isPress) {
            keyElement.classList.add('key_press')
        }else {
            keyElement.classList.remove('key_press')
        }

        switch (keyCode) {
            case 'ShiftLeft':
            case 'ShiftRight':
                if(this._status.shift != isPress) {

                }
                break;
        }
    }

    print(keyCode) {
        let key = this._keys[keyCode];
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
        const getProperty = isShift?'enShift':'enUnShift';
        let keys = Object.entries(this._keys).filter(o=>o[1][getProperty]);
        keys.forEach(key => {
            let char = key[1][getProperty];
            let element = key[1].element.firstElementChild;
            element.textContent = char;
            key[1].text = char;
        });
        this.setCapsLock(isCapsLock, isShift);

    }

    setCapsLock(isCapsLock, isShift) {
        let getPropertyChar = 'en';
        let keysChar = Object.entries(this._keys).filter(o=>o[1][getPropertyChar]);
        keysChar.forEach(key => {
            let char = key[1][getPropertyChar];
            char = isShift^isCapsLock ? char.toUpperCase() : char.toLowerCase();
            let element = key[1].element.firstElementChild;
            element.textContent = char;
            key[1].text = char;
        });
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
                keyboardRow.appendChild(that._createKey(this._getKey('Win'), 'special', 'win'));
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

    //#region keys
    _getKey(text) {
        let key = keysDictionary[text] ? keysDictionary[text] : {};
        key.text = text
        return key;
    }
    _getKeyWithCode(text, code) {
        let key = keysDictionary[code] ? keysDictionary[code] : {};
        key.text = text
        return key;
    }
    //#endregion keys

    //#endregion private methods

}