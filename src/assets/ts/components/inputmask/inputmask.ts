// src/PhoneInputMask.ts

export class PhoneInputMask {
  private inputElements: NodeListOf<HTMLInputElement>;
  // Вынесем шаблон маски в константу для удобства
  private readonly maskTemplate = "+7 (___) ___-__-__";

  constructor() {
    this.inputElements = document.querySelectorAll("input[data-phone-pattern]");
    this.init();
  }

  private getDigits(value: string): string {
    return value.replace(/\D/g, "");
  }

  private init(): void {
    this.inputElements.forEach((input) => {
      const originalPlaceholder = input.placeholder;

      // --- 1. Обновленный обработчик focus ---
      input.addEventListener("focus", () => {
        // Убираем placeholder на время фокуса
        input.placeholder = "";
        // Если поле пустое, устанавливаем полный шаблон маски
        if (!input.value) {
          input.value = this.maskTemplate;
        }
        // Независимо от содержимого, при фокусе ставим курсор
        // в первую доступную для ввода позицию.
        const pos = this.getCursorPosition(this.getDigits(input.value).slice(1));
        setTimeout(() => {
          input.setSelectionRange(pos, pos);
        }, 0);
      });

      // --- 2. Обновленный обработчик blur ---
      input.addEventListener("blur", () => {
        // Если пользователь ушел, а в поле только шаблон, очищаем его
        if (input.value === this.maskTemplate) {
          input.value = "";
        }
        // Возвращаем исходный placeholder
        input.placeholder = originalPlaceholder;
      });

      // --- 3. Обновленный обработчик input ---
      input.addEventListener("input", (event) => {
        const e = event as InputEvent;
        const target = e.target as HTMLInputElement;

        // Получаем только "чистые" цифры, введенные пользователем
        let digits = this.getDigits(target.value);
        if (digits.startsWith("7")) {
          digits = digits.slice(1);
        }

        // Ограничиваем количество цифр до 10 (код + номер)
        digits = digits.slice(0, 10);

        // Применяем новую маску, которая заменяет "_" на цифры
        const maskedValue = this.applyMask(digits);
        target.value = maskedValue;

        // Вычисляем и устанавливаем корректную позицию курсора
        const cursorPosition = this.getCursorPosition(digits);
        target.setSelectionRange(cursorPosition, cursorPosition);
      });

      // Обработчики click и keydown остаются без изменений,
      // они отлично справляются со своей задачей.
      input.addEventListener("click", (event) => {
        const target = event.target as HTMLInputElement;
        const pos = this.getCursorPosition(this.getDigits(target.value).slice(1));
        setTimeout(() => {
          target.setSelectionRange(pos, pos);
        }, 0);
      });

      input.addEventListener("keydown", (e) => {
        // Специальная обработка Backspace для "стирания" до шаблона
        if (e.key === "Backspace") {
          const target = e.target as HTMLInputElement;
          const digits = this.getDigits(target.value).slice(1);
          if (digits.length === 1) {
            // Если осталась одна цифра и пользователь жмет Backspace,
            // мы принудительно возвращаем поле к исходному шаблону,
            // чтобы избежать "застревания" на последней цифре.
            e.preventDefault(); // отменяем стандартное удаление
            target.value = this.maskTemplate;
            const pos = this.getCursorPosition("");
            target.setSelectionRange(pos, pos);
            return;
          }
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
        }
      });
    });
  }

  // --- 4. Новая логика для applyMask ---
  private applyMask(digits: string): string {
    // Берем наш шаблон
    let template = this.maskTemplate;
    const digitsArray = digits.split("");

    // Последовательно заменяем каждый символ "_" на введенную цифру
    for (const digit of digitsArray) {
      template = template.replace("_", digit);
    }

    return template;
  }

  // --- 5. Обновленная логика для getCursorPosition ---
  private getCursorPosition(digits: string): number {
    const len = digits.length;

    // Начальная позиция курсора
    if (len === 0) return 4; // "+7 ("

    // Позиция внутри кода оператора
    if (len <= 3) return 4 + len; // "+7 (912"

    // Позиция после кода оператора
    if (len <= 6) return 9 + (len - 3); // "+7 (912) 345"

    // Позиция после первой группы номера
    if (len <= 8) return 13 + (len - 6); // "+7 (912) 345-67"

    // Позиция после второй группы номера
    if (len <= 10) return 16 + (len - 8); // "+7 (912) 345-67-89"

    return 18; // Максимальная длина
  }
}
