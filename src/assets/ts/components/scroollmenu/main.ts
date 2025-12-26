// main.ts

import { SmoothScrollSpy } from "./SmoothScrollSpy";

document.addEventListener("DOMContentLoaded", () => {
  // Просто создаем экземпляр, не присваивая его переменной.
  // Конструктор все равно будет вызван, и плагин заработает.
  new SmoothScrollSpy({
    // здесь ваши настройки, если они нужны
  });
});
