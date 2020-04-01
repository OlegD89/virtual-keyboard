export const languages = {'ru':1 , 'en':2}
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
}