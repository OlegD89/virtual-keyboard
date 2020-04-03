import { keysDictionary } from './Keys';

export default class Layout {
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
    const key = keysDictionary[text] ? keysDictionary[text] : {};
    key.text = key[this._language.nameUnShift] || key[this._language.name] || text;
    return key;
  }

  _getKeyWithCode(text, code) {
    const key = keysDictionary[code] ? keysDictionary[code] : {};
    key.text = key[this._language.nameUnShift] || key[this._language.name] || text;
    return key;
  }
  // #private methods
}
