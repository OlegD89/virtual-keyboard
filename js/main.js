import Keyboard from './Keyboard';

window.onload = () => {
  const keyboard = new Keyboard();
  keyboard.init();
  keyboard.run();
};
