/*
 * payment.html — lấy danh sách gian hàng booth.js đã lưu và dựng tóm tắt đơn hàng.
 * Khoá sessionStorage: "selectedBooths" (mảng mã gian hàng, vd ["V1","V2"]).
 */
document.addEventListener("DOMContentLoaded", () => {
  const PRICE_PER_BOOTH = 6572000; // đồng / gian 9m² — khớp assets/js/booth.js

  const chips = document.querySelector("#boothChips");
  const subtotal = document.querySelector("#orderSubtotal");
  const total = document.querySelector("#orderTotal");

  const formatMoney = (value) =>
    new Intl.NumberFormat("vi-VN").format(value) + " đ";

  /* ---- Đổ danh sách gian hàng ---- */
  let booths = [];

  try {
    booths = JSON.parse(sessionStorage.getItem("selectedBooths") || "[]");
  } catch (error) {
    booths = [];
  }

  if (chips && Array.isArray(booths) && booths.length > 0) {
    chips.innerHTML = booths
      .map((booth) => `<span>${booth}</span>`)
      .join("");

    const amount = booths.length * PRICE_PER_BOOTH;

    if (subtotal) subtotal.textContent = formatMoney(amount);
    if (total) total.textContent = formatMoney(amount);
  }

  /* ---- Upload logo: hiện tên file thật khi người dùng chọn ---- */
  const logoInput = document.querySelector("#logoInput");
  const logoPreview = document.querySelector("#logoPreview");
  const logoRemove = document.querySelector("#logoRemove");

  if (logoInput && logoPreview) {
    const name = logoPreview.querySelector(".upload-file__name");
    const size = logoPreview.querySelector(".upload-file__size");

    logoInput.addEventListener("change", () => {
      const file = logoInput.files && logoInput.files[0];

      if (!file) {
        logoPreview.hidden = true;
        return;
      }

      name.textContent = file.name;
      size.textContent = (file.size / (1024 * 1024)).toFixed(1) + "MB";
      logoPreview.hidden = false;
    });

    logoRemove?.addEventListener("click", () => {
      logoInput.value = "";
      logoPreview.hidden = true;
    });
  }

  /* ---- Kiểm tra trước khi gửi (dùng assets/js/form-validate.js) ---- */
  window.initFormValidation?.({
    form: "#registerForm",
    status: "#orderStatus",
    successText: "Đã ghi nhận đăng ký. Ban tổ chức sẽ liên hệ lại với bạn.",
    onValid: () => sessionStorage.setItem("registrationDone", "1"),
  });
});
