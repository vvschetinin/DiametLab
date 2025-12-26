// cookie-banner-plugin.ts

/**
 * Интерфейс для опций конфигурации плагина.
 * Делает использование плагина типизированным и предсказуемым.
 */
export interface CookieBannerOptions {
  bannerId: string;
  buttonId: string;
  consentCookieName?: string; // ? делает свойство необязательным
  cookieDurationDays?: number;
  hiddenClass?: string;
}

/**
 * Основной класс плагина.
 * Экспортируем его, чтобы можно было импортировать в других файлах.
 */
export default class CookieBannerPlugin {
  private bannerElement: HTMLElement;
  private acceptButton: HTMLButtonElement;
  private options: Required<CookieBannerOptions>; // Required<> делает все свойства обязательными внутри класса

  // Устанавливаем значения по умолчанию для опций
  private static defaultOptions: Omit<Required<CookieBannerOptions>, "bannerId" | "buttonId"> = {
    consentCookieName: "user_cookie_consent",
    cookieDurationDays: 365,
    hiddenClass: "is-hidden",
  };

  constructor(options: CookieBannerOptions) {
    // Объединяем опции по умолчанию с переданными пользователем
    this.options = { ...CookieBannerPlugin.defaultOptions, ...options };

    // Находим элементы в DOM. Если не найдены - выбрасываем ошибку.
    const banner = document.getElementById(this.options.bannerId);
    const button = document.getElementById(this.options.buttonId);

    if (!banner || !button) {
      throw new Error("Cookie banner elements not found in the DOM.");
    }

    this.bannerElement = banner as HTMLElement;
    this.acceptButton = button as HTMLButtonElement;
  }

  /**
   * Инициализирует логику баннера.
   * Этот метод должен быть вызван извне после создания экземпляра класса.
   */
  public init(): void {
    if (!this.getCookie(this.options.consentCookieName)) {
      this.showBanner();
    }

    this.acceptButton.addEventListener("click", () => this.acceptCookies());
  }

  private showBanner(): void {
    this.bannerElement.classList.remove(this.options.hiddenClass);
  }

  private hideBanner(): void {
    this.bannerElement.classList.add(this.options.hiddenClass);
  }

  private acceptCookies(): void {
    this.setCookie(this.options.consentCookieName, "true", this.options.cookieDurationDays);
    this.hideBanner();
  }

  private setCookie(name: string, value: string, days: number): void {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
