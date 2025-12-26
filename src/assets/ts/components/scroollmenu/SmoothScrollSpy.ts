// SmoothScrollSpy.ts

/**
 * Интерфейс для настроек плагина.
 * Позволяет гибко настраивать селекторы и классы.
 */
export interface SmoothScrollOptions {
  menuLinksSelector: string; // Селектор для всех ссылок меню (десктоп + мобильное)
  navToggleSelector?: string; // Селектор для кнопки-бургера мобильного меню
  headerSelector?: string; // Селектор для фиксированного хедера
  sectionsSelector?: string; // Селектор для секций, за которыми нужно следить
  activeClass?: string; // CSS-класс для активного пункта меню
  menuOpenClass?: string; // CSS-класс, добавляемый к body при открытом меню
}

/**
 * Класс SmoothScrollSpy обеспечивает плавную прокрутку по якорям,
 * подсветку активного пункта меню и управление мобильным меню.
 */
export class SmoothScrollSpy {
  private options: SmoothScrollOptions;
  private allMenuLinks: NodeListOf<HTMLAnchorElement>;
  private navToggle: HTMLButtonElement | null;
  private header: HTMLElement | null;
  private body: HTMLElement;

  /**
   * Конструктор инициализирует плагин с заданными настройками.
   * @param options - Объект с настройками.
   */
  constructor(options: Partial<SmoothScrollOptions> = {}) {
    // Настройки по умолчанию
    const defaultOptions: SmoothScrollOptions = {
      menuLinksSelector: ".main-menu a, .menu-mobil a",
      navToggleSelector: ".nav-toggle",
      headerSelector: ".header",
      sectionsSelector: "section[id]",
      activeClass: "active",
      menuOpenClass: "menu-open",
    };

    // Объединяем дефолтные настройки с пользовательскими
    this.options = { ...defaultOptions, ...options };

    // Находим ключевые элементы в DOM
    this.body = document.body;
    this.allMenuLinks = document.querySelectorAll(this.options.menuLinksSelector);
    this.navToggle = this.options.navToggleSelector ? document.querySelector(this.options.navToggleSelector) : null;
    this.header = this.options.headerSelector ? document.querySelector(this.options.headerSelector) : null;

    // Если ссылок меню не найдено, прекращаем работу и выводим предупреждение
    if (this.allMenuLinks.length === 0) {
      console.warn("SmoothScrollSpy: Не найдены ссылки меню по селектору:", this.options.menuLinksSelector);
      return;
    }

    // Запускаем всю магию
    this.init();
  }

  /**
   * Основной метод инициализации, который устанавливает все обработчики событий.
   */
  private init(): void {
    if (this.navToggle) {
      this.navToggle.addEventListener("click", () => this.toggleMobileMenu());
    }

    this.allMenuLinks.forEach((link) => {
      link.addEventListener("click", (event) => this.handleLinkClick(event));
    });

    window.addEventListener("scroll", () => this.updateActiveLink(), { passive: true });
    this.updateActiveLink(); // Первоначальная проверка при загрузке страницы
  }

  private toggleMobileMenu(): void {
    this.body.classList.toggle(this.options.menuOpenClass!);
    if (this.navToggle) {
      const isExpanded = this.navToggle.getAttribute("aria-expanded") === "true";
      this.navToggle.setAttribute("aria-expanded", String(!isExpanded));
    }
  }

  private closeMobileMenu(): void {
    if (this.body.classList.contains(this.options.menuOpenClass!)) {
      this.body.classList.remove(this.options.menuOpenClass!);
      if (this.navToggle) {
        this.navToggle.setAttribute("aria-expanded", "false");
      }
    }
  }

  private handleLinkClick(event: MouseEvent): void {
    event.preventDefault();
    const link = event.currentTarget as HTMLAnchorElement;
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const targetElement = document.getElementById(href.substring(1));
    if (targetElement) {
      this.closeMobileMenu();
      this.smoothScrollTo(targetElement);
    }
  }

  private smoothScrollTo(element: HTMLElement): void {
    const headerHeight = this.header ? this.header.offsetHeight : 0;
    const elementPosition = element.offsetTop - headerHeight;

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }

  private updateActiveLink(): void {
    const fromTop = window.pageYOffset;
    const headerHeight = this.header ? this.header.offsetHeight : 0;
    let currentActiveId: string | null = null;

    const sections: NodeListOf<HTMLElement> = document.querySelectorAll(this.options.sectionsSelector!);

    // Определяем активную секцию с поправкой на высоту хедера
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 1; // -1px для точности
      if (sectionTop <= fromTop && sectionTop + section.offsetHeight > fromTop) {
        currentActiveId = section.getAttribute("id");
      }
    });

    // Если мы в самом верху или в самом низу, обрабатываем отдельно
    if (fromTop === 0) {
      currentActiveId = sections[0]?.getAttribute("id");
    } else if (window.innerHeight + fromTop >= document.body.offsetHeight) {
      currentActiveId = sections[sections.length - 1]?.getAttribute("id");
    }

    // Обновляем классы для ссылок
    this.allMenuLinks.forEach((link) => {
      const linkHref = link.getAttribute("href")?.substring(1);
      if (linkHref === currentActiveId) {
        link.classList.add(this.options.activeClass!);
      } else {
        link.classList.remove(this.options.activeClass!);
      }
    });
  }
}
