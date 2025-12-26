// main.ts

// Импортируем класс плагина и его опции
import CookieBannerPlugin, { CookieBannerOptions } from "./cookie-banner-plugin";

// Ждем, пока весь HTML-контент страницы будет загружен
document.addEventListener("DOMContentLoaded", () => {
  // 1. Создаем объект с настройками для нашего баннера.
  // Обязательно указываем ID элементов. Остальные опции можно не указывать,
  // тогда будут использованы значения по умолчанию из плагина.
  const bannerOptions: CookieBannerOptions = {
    bannerId: "cookie-banner",
    buttonId: "cookie-accept-btn",
    // --- Можно раскомментировать и переопределить значения по умолчанию ---
    // consentCookieName: 'my_site_consent',
    // cookieDurationDays: 180, // полгода
    // hiddenClass: 'd-none' // если используется, например, Bootstrap
  };

  try {
    // 2. Создаем новый экземпляр плагина, передавая ему наши настройки.
    const banner = new CookieBannerPlugin(bannerOptions);

    // 3. Запускаем плагин.
    banner.init();
  } catch (error) {
    // Ловим ошибку, если, например, на странице нет нужных HTML-элементов.
    console.error("Failed to initialize cookie banner:", error);
  }
});
