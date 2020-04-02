import { keysDictionary } from './Keys'

export class Layout {
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
        this._input.focus();
        let key = this._keys[keyCode];
        let selectionStart = this._input.selectionStart
        if(!key.element.classList.contains('special')){
            this._input.value = this._setChar(key.text);
        }else {
            switch (keyCode) {
                case 'Backspace':
                    this._input.value = this._getTextBeforePosition().slice(0, -1) + 
                        this._getTextAfterPosition();
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
                    this._input.value = this._getTextBeforePosition() + 
                        this._getTextAfterPosition().slice(1) ;
                    break;
                case 'ArrowLeft':
                    this._input.selectionStart -= 1
                    this._input.selectionEnd -= 1
                    return;
                case 'ArrowRight':
                    this._input.selectionStart += 1
                    return;
                case 'ArrowUp':
                    this._setCurrentPositionUp();
                    return;
                case 'ArrowDown':
                    this._setCurrentPositionDown();
                    return;
            }
        }
        selectionStart++;
        this._input.setSelectionRange(selectionStart, selectionStart);
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
        this._createDublicateKeys();
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
    _createDublicateKeys() {
        this._keys['NumpadEnter'] = this._keys['Enter'];
        //для задания не требуется, поэтому делаю не совсем верно, для удобства
        this._keys['Numpad1'] = this._keys['Digit1'];
        this._keys['Numpad2'] = this._keys['Digit2'];
        this._keys['Numpad3'] = this._keys['Digit3'];
        this._keys['Numpad4'] = this._keys['Digit4'];
        this._keys['Numpad5'] = this._keys['Digit5'];
        this._keys['Numpad6'] = this._keys['Digit6'];
        this._keys['Numpad7'] = this._keys['Digit7'];
        this._keys['Numpad8'] = this._keys['Digit8'];
        this._keys['Numpad9'] = this._keys['Digit9'];
        this._keys['Numpad0'] = this._keys['Digit0'];
        this._keys['NumpadDivide'] = this._keys['Slash'];
        //this._keys['NumpadMultiply'] = this._keys[''];
        this._keys['NumpadSubtract'] = this._keys['Minus'];
        //this._keys['NumpadAdd'] = this._keys[''];
        this._keys['NumpadDecimal'] = this._keys['Period'];
    }

    _createDescription(){
        let descriptionSpan = document.createElement('span');
        descriptionSpan.classList.add('description-text');
        descriptionSpan.textContent = 'Переключение языка Ctrl+Shift';
        return descriptionSpan;
    }

    //#region keys
    _getKey(text) {
        let key = keysDictionary[text] ? keysDictionary[text] : {};
        key.text = key[this._language.nameUnShift] || key[this._language.name] || text
        return key;
    }
    _getKeyWithCode(text, code) {
        let key = keysDictionary[code] ? keysDictionary[code] : {};
        key.text = key[this._language.nameUnShift] || key[this._language.name] || text
        return key;
    }    
    _getKeysArray() {
        return Object.entries(this._keys);
    }
    //#endregion keys

    //#region print

    //#endregion print
    _setCurrentPositionUp() {
        let text = this._input.value;
        let rows = text.split('\n');
        let currentPosition = this._input.selectionStart;
        let indicesEndRows = this._getIndicesEndRows(text);
        let currentRow = this._getCurrentRowIndex(indicesEndRows, currentPosition);

        let newPosition;
        if(currentRow==0) {
            newPosition = 0;
        } else {
            newPosition = currentPosition - rows[currentRow-1].length - 1; //1='\n'
            if(newPosition>indicesEndRows[currentRow-1])
                newPosition = indicesEndRows[currentRow-1];
        }
        this._input.setSelectionRange(newPosition, newPosition);
    }
    _setCurrentPositionDown() {        
        let text = this._input.value;
        let rows = text.split('\n');
        let currentPosition = this._input.selectionStart;
        let indicesEndRows = this._getIndicesEndRows(text);
        let currentRow = this._getCurrentRowIndex(indicesEndRows, currentPosition);

        let newPosition;
        if(currentRow==indicesEndRows.length-1) {
            newPosition = indicesEndRows[indicesEndRows.length-1];
        } else {
            newPosition = currentPosition + rows[currentRow].length + 1; //1='\n'
            if(newPosition>indicesEndRows[currentRow+1])
                newPosition = indicesEndRows[currentRow+1];
        }
        this._input.setSelectionRange(newPosition, newPosition);
    }
    _getIndicesEndRows(text) {
        let regex = /\n/gi, result, indicesEndRows = [];
        while ( (result = regex.exec(text)) ) {
            indicesEndRows.push(result.index);
        }
        indicesEndRows.push(text.length);
        return indicesEndRows;
    }
    _getCurrentRowIndex(indicesEndRows, currentPosition) {
        let currentRow;
        for(let i = 0; i<indicesEndRows.length; i++) {
            if(indicesEndRows[i]>=currentPosition){
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
    //#endregion private methods

}