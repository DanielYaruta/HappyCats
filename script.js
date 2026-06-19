/* ===========================================================
   HappyCats — логика формы.
   Всё в одном файле, без import/export, обёрнуто в IIFE,
   чтобы переменные не "утекали" в глобальную область видимости.
   =========================================================== */

(function () {
  "use strict";

  /* -----------------------------------------------------------
       1. ВАЛИДАЦИЯ ПОЛЕЙ
       ----------------------------------------------------------- */

  const NAME_REGEX = /^[А-Яа-яЁё]+(?:[\s-][А-Яа-яЁё]+)*$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

  function setFieldState(input, errorElement, message) {
    if (message) {
      input.classList.add("is-invalid");
      errorElement.textContent = message;
    } else {
      input.classList.remove("is-invalid");
      errorElement.textContent = "";
    }
  }

  function validateName(input, errorElement) {
    const normalized = input.value.trim().replace(/\s+/g, " ");

    if (input.value !== normalized) {
      input.value = normalized;
    }

    const value = normalized;

    if (value === "") {
      setFieldState(input, errorElement, "Подскажите, как вас зовут");
      return false;
    }

    if (!NAME_REGEX.test(value)) {
      setFieldState(input, errorElement, "Только кириллица, пробел и дефис");
      return false;
    }

    setFieldState(input, errorElement, "");
    return true;
  }

  function validateEmail(input, errorElement) {
    const value = input.value.trim();

    if (value === "") {
      setFieldState(input, errorElement, "Укажите почту, куда писать");
      return false;
    }

    if (!EMAIL_REGEX.test(value)) {
      setFieldState(
        input,
        errorElement,
        "Проверьте адрес: латиница, цифры, обязательны «@» и точка"
      );
      return false;
    }

    setFieldState(input, errorElement, "");
    return true;
  }

  /* -----------------------------------------------------------
       2. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
       ----------------------------------------------------------- */

  const THEME_DARK = "dark";
  const THEME_LIGHT = "light";
  const STAMP_CLASS = "is-stamping";
  const STAMP_DURATION = 500; // мс, совпадает с длительностью CSS-анимации

  let currentTheme = THEME_LIGHT;

  function applyTheme(theme) {
    if (theme === THEME_DARK) {
      document.documentElement.setAttribute("data-theme", THEME_DARK);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function playPawStamp(button) {
    button.classList.remove(STAMP_CLASS);
    void button.offsetWidth; // перезапуск анимации при быстрых повторных кликах
    button.classList.add(STAMP_CLASS);

    window.setTimeout(() => {
      button.classList.remove(STAMP_CLASS);
    }, STAMP_DURATION);
  }

  function initThemeToggle(button) {
    applyTheme(currentTheme);
    button.setAttribute("aria-pressed", String(currentTheme === THEME_DARK));

    button.addEventListener("click", () => {
      currentTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
      applyTheme(currentTheme);
      button.setAttribute("aria-pressed", String(currentTheme === THEME_DARK));
      playPawStamp(button);
    });
  }

  /* -----------------------------------------------------------
       3. ПЛАВНЫЙ СКРОЛЛ К ФОРМЕ
       ----------------------------------------------------------- */

  function initScrollButton(button, target) {
    if (!button || !target) {
      return;
    }

    button.addEventListener("click", () => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* -----------------------------------------------------------
       4. ОТПРАВКА ФОРМЫ
       ----------------------------------------------------------- */

  function initSignupForm(refs) {
    const {
      form,
      nameInput,
      nameError,
      emailInput,
      emailError,
      successMessage,
    } = refs;

    nameInput.addEventListener("blur", () =>
      validateName(nameInput, nameError)
    );
    emailInput.addEventListener("blur", () =>
      validateEmail(emailInput, emailError)
    );

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const isNameValid = validateName(nameInput, nameError);
      const isEmailValid = validateEmail(emailInput, emailError);

      if (!isNameValid || !isEmailValid) {
        return;
      }

      // Здесь в будущем будет запрос к бэкенду (fetch/axios).
      // Пока — просто показываем заглушку успеха.
      form.hidden = true;
      successMessage.hidden = false;
    });
  }

  /* -----------------------------------------------------------
       5. ИНИЦИАЛИЗАЦИЯ
       ----------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle(document.getElementById("themeToggle"));

    initScrollButton(
      document.getElementById("scrollDown"),
      document.getElementById("formSection")
    );

    initSignupForm({
      form: document.getElementById("signupForm"),
      nameInput: document.getElementById("fullname"),
      nameError: document.getElementById("fullname-error"),
      emailInput: document.getElementById("email"),
      emailError: document.getElementById("email-error"),
      successMessage: document.getElementById("successMessage"),
    });
  });
})();
