/*
 * Kiểm tra form dùng chung (payment.html, visitor.html).
 * Ô [required] còn trống → gắn .is-error lên .field-group bao ngoài và focus ô đầu tiên.
 * Hợp lệ → hiện thông báo ở phần tử status (không dùng alert).
 */
window.initFormValidation = function initFormValidation(options) {
  const form = document.querySelector(options.form);

  if (!form) return;

  const status = options.status ? document.querySelector(options.status) : null;

  const clearError = (input) => {
    if (input.value.trim()) {
      input.closest(".field-group")?.classList.remove("is-error");
    }
  };

  form.querySelectorAll("[required]").forEach((input) => {
    input.addEventListener("input", () => clearError(input));
    input.addEventListener("change", () => clearError(input));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;

    form.querySelectorAll("[required]").forEach((input) => {
      const invalid = !input.value.trim();

      input.closest(".field-group")?.classList.toggle("is-error", invalid);

      if (invalid && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    if (status) {
      status.textContent = options.successText || "Đã ghi nhận thông tin của bạn.";
      status.hidden = false;
    }

    if (typeof options.onValid === "function") options.onValid(form);
  });
};
