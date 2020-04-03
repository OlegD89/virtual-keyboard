/* eslint-disable no-param-reassign */
export default class Input {
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
