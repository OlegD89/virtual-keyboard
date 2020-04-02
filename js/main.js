import { Keyboard } from "./Keyboard"

window.onload = function() {
    const keyboard = new Keyboard();
    keyboard.init();
    keyboard.run();
}