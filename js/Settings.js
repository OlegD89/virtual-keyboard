export const languages = {
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
export class Settings {
    constructor() {
        this._isShift = false;
        this._isCapsLock = false;
        this._language = languages.en;
    }
    load() {
        this._language = languages.en;
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
        return this._language;
    }
}