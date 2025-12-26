const form = document.querySelector<HTMLFormElement>("#modal-form");
const overlay = document.querySelector<HTMLElement>(".start-project-overlay");

if (form && overlay) {
  form.addEventListener("submit", async function (event: Event) {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("sendform.php", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(response.statusText);

      const result = await response.text();

      form.reset();

      const successSpan = document.querySelector<HTMLSpanElement>(".success span");
      const successDiv = document.querySelector<HTMLElement>(".success");

      if (successSpan && successDiv) {
        successSpan.innerHTML = result;
        successDiv.classList.add("success-mail");
        successDiv.style.display = "flex";

        setTimeout(() => {
          successDiv.classList.remove("success-mail");
          successDiv.style.display = "none";

          // Через 1.5 секунды после исчезновения сообщения — закрываем окно
          setTimeout(() => {
            overlay.classList.remove("is-active");
          }, 1000); // задержка после исчезновения сообщения
        }, 4000);
      }
    } catch (error) {
      alert(`Ошибка отправки 111 формы: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    }
  });
}
