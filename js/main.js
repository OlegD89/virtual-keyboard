import { Keyboard } from "./Keyboard"

window.onload = function() {
    console.log("Run start");

    const keyboard = new Keyboard();
    keyboard.init();
    keyboard.show();
    keyboard.run();
}