/* ==========================================================================
   Tôm Fest Cà Mau — Xử lý gửi dữ liệu Form sang Google Form
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("visitorForm");
  const hiddenIframe = document.getElementById("hidden_iframe");
  const statusEl = document.getElementById("visitorStatus");
  const btnSubmit = document.getElementById("btnSubmit");

  if (!form || !hiddenIframe) return;

  let isSubmitting = false;

  // 1. Khi người dùng bấm Submit
  form.addEventListener("submit", function (e) {
    // Không dùng e.preventDefault() ở đây để form thực hiện POST sang hidden_iframe
    isSubmitting = true;

    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = "⏳ Đang gửi thông tin đăng ký...";
      statusEl.style.color = "#0052cc";
    }

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Đang xử lý...";
    }
  });

  // 2. Lắng nghe iframe nhận kết quả trả về từ Google Form
  hiddenIframe.addEventListener("load", function () {
    // Chỉ xử lý khi đúng là sự kiện submit vừa xảy ra
    if (isSubmitting) {
      if (statusEl) {
        statusEl.textContent = "🎉 Đăng ký thành công! Ban Tổ chức sẽ xác nhận qua email.";
        statusEl.style.color = "#008a00";
      }

      // Reset các ô input
      form.reset();

      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Đăng ký";
      }

      isSubmitting = false;
    }
  });
});