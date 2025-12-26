export {};

// ======================= Header Scroll Bottom ============================= //

const defaultOffset: number = 40;
const header: HTMLElement | null = document.querySelector(".header");

const scrollPosition = (): number => window.pageYOffset || document.documentElement.scrollTop;

// Функция для инициализации состояния header
const initializeHeader = (): void => {
  if (header) {
    if (scrollPosition() <= defaultOffset) {
      header.classList.remove("is-active");
    } else {
      header.classList.add("is-active");
    }
  }
};

// Вызываем инициализацию при загрузке страницы
document.addEventListener("DOMContentLoaded", initializeHeader);

// Обработчик прокрутки
window.addEventListener("scroll", (): void => {
  if (header) {
    const currentScroll = scrollPosition();
    if (currentScroll > defaultOffset) {
      header.classList.add("is-active");
    } else {
      header.classList.remove("is-active");
    }
  }
});

// ===================== Выравнивание высоты блоков ====================== //

function equalizeCardContentHeights(containerSelector: string = ".row", cardContentSelector: string = ".card-content"): void {
  const rows = document.querySelectorAll(containerSelector);

  rows.forEach((row) => {
    const contents = Array.from(row.querySelectorAll(cardContentSelector)) as HTMLElement[];

    if (contents.length === 0) return;

    // Сброс высоты, чтобы корректно измерить естественную высоту
    contents.forEach((el) => {
      el.style.height = "";
    });

    // Группировка по строкам (на основе top)
    const groups: HTMLElement[][] = [];
    let currentGroup: HTMLElement[] = [];
    let lastTop = -1;

    contents.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const top = Math.round(rect.top);

      if (top !== lastTop) {
        if (currentGroup.length) {
          groups.push(currentGroup);
        }
        currentGroup = [el];
        lastTop = top;
      } else {
        currentGroup.push(el);
      }
    });

    if (currentGroup.length) {
      groups.push(currentGroup);
    }

    // Установка максимальной высоты в каждой группе
    groups.forEach((group) => {
      const maxHeight = Math.max(...group.map((el) => el.offsetHeight));
      group.forEach((el) => {
        el.style.height = `${maxHeight}px`;
      });
    });
  });
}

// Запуск после загрузки и при изменении размера окна
window.addEventListener("load", () => equalizeCardContentHeights());
window.addEventListener("resize", () => {
  clearTimeout((window as any).resizeTimeout);
  (window as any).resizeTimeout = setTimeout(() => equalizeCardContentHeights(), 150);
});

// faq.ts ======================================================

document.addEventListener("DOMContentLoaded", () => {
  const faqList = document.querySelector(".faq-list");
  if (!faqList) {
    console.error('FAQ list not found. Make sure an element with class "faq-list" exists.');
    return;
  }

  const faqItems = Array.from(faqList.querySelectorAll("li"));

  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function displayRandomFaqItems(count: number = 15) {
    faqList!.innerHTML = "";
    const shuffledItems = shuffleArray([...faqItems]);
    const itemsToDisplay = shuffledItems.slice(0, count);

    itemsToDisplay.forEach((item) => {
      const clonedItem = item.cloneNode(true) as HTMLLIElement;
      faqList!.appendChild(clonedItem);

      const questionElement = clonedItem.querySelector(".faq-question") as HTMLElement;
      const answerElement = clonedItem.querySelector(".faq-answer") as HTMLElement;
      const answerContent = answerElement?.querySelector("p"); // Находим внутренний параграф для контента

      if (questionElement && answerElement && answerContent) {
        // Изначально скрываем все ответы и устанавливаем высоту в 0
        answerElement.style.maxHeight = "0";
        answerElement.style.overflow = "hidden";
        answerElement.style.transition = "max-height 0.3s ease-out"; // Только max-height
        // Отступы теперь будут на внутреннем элементе, а не на answerElement
        clonedItem.classList.remove("active");

        const toggleIcon = document.createElement("span");
        toggleIcon.classList.add("faq-toggle-icon");
        toggleIcon.textContent = "+";

        questionElement.appendChild(toggleIcon);

        questionElement.addEventListener("click", () => {
          const isActive = clonedItem.classList.contains("active");

          if (isActive) {
            // Скрываем ответ
            answerElement.style.maxHeight = "0";
            clonedItem.classList.remove("active");
            toggleIcon.textContent = "+";
          } else {
            // Показываем ответ
            // Устанавливаем max-height на фактическую высоту контента, включая padding внутреннего элемента.
            // offsetHeight учитывает border и padding.
            // Если padding применяется к самому .faq-answer, то scrollHeight может быть меньше
            // фактической высоты, которая получается с padding.
            // Поэтому лучше, чтобы padding был на внутреннем элементе (p).
            answerElement.style.maxHeight = answerContent.offsetHeight + "px"; // Используем offsetHeight внутреннего контента
            clonedItem.classList.add("active");
            toggleIcon.textContent = "-";
          }
          // Удаляем ontransitionend, так как мы не сбрасываем max-height в 'none'
        });
      }
    });
  }

  displayRandomFaqItems();
});

// ===============================
