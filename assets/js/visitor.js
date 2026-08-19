/* ==========================================================================
   Tôm Fest Cà Mau — Inline Validation cho Form đăng ký
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("visitorForm");
  const hiddenIframe = document.getElementById("hidden_iframe");
  const statusEl = document.getElementById("visitorStatus");
  const btnSubmit = document.getElementById("btnSubmit");

  if (!form || !hiddenIframe) return;

  let isSubmitting = false;

  // --- Hàm gán lỗi cho 1 field cụ thể ---
  function setError(inputId, errId, message) {
    const errorEl = document.getElementById(errId);
    if (errorEl) errorEl.textContent = message;

    if (inputId) {
      const inputEl = document.getElementById(inputId);
      // Trường hợp ô SĐT nằm trong wrapper .phone-field
      const targetEl = inputEl?.closest('.field') || inputEl;
      if (targetEl) targetEl.classList.add("is-invalid");
    }
  }

  // --- Hàm xóa sạch lỗi của toàn bộ form ---
  function clearAllErrors() {
    form.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  }

  // --- Hàm validate từng ô input ---
  function validateForm() {
    clearAllErrors();
    let isValid = true;

    const fullNameInput = document.getElementById("vFullName");
    const emailInput = document.getElementById("vEmail");
    const phoneInput = document.getElementById("vPhone");
    const companyInput = document.getElementById("vCompany");
    const industryInput = document.getElementById("vIndustry");
    const participationInput = form.querySelector('[name="entry.1259429111"]:checked');

    const fullName = fullNameInput?.value.trim();
    const email = emailInput?.value.trim();
    const phone = phoneInput?.value.trim();
    const company = companyInput?.value.trim();
    const industry = industryInput?.value;
    const participation = participationInput?.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+84|84|0)[3|5|7|8|9][0-9]{8}$/;

    // 1. Kiểm tra Họ tên
    if (!fullName) {
      setError("vFullName", "err-fullName", "Vui lòng nhập Họ và tên.");
      isValid = false;
    }

    // 2. Kiểm tra Email
    if (!email) {
      setError("vEmail", "err-email", "Vui lòng nhập Email.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setError("vEmail", "err-email", "Email không hợp lệ (ví dụ: name@gmail.com).");
      isValid = false;
    }

    // 3. Kiểm tra Số điện thoại
    if (!phone) {
      setError("vPhone", "err-phone", "Vui lòng nhập Số điện thoại.");
      isValid = false;
    } else {
      const cleanPhone = phone.replace(/\s+/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        setError("vPhone", "err-phone", "Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09).");
        isValid = false;
      }
    }

    // 4. Kiểm tra Công ty
    if (!company) {
      setError("vCompany", "err-company", "Vui lòng nhập Tên công ty / Tổ chức.");
      isValid = false;
    }

    // 5. Kiểm tra Lĩnh vực
    if (!industry) {
      setError("vIndustry", "err-industry", "Vui lòng chọn Lĩnh vực hoạt động.");
      isValid = false;
    }

    // 6. Kiểm tra Hình thức tham gia
    if (!participation) {
      setError("", "err-participation", "Vui lòng chọn Hình thức tham gia.");
      isValid = false;
    }

    return isValid;
  }

  // Lắng nghe người dùng gõ/thay đổi để xóa viền đỏ lỗi ngay lập tức
  form.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("input", function () {
      const fieldGroup = this.closest(".field-group");
      if (fieldGroup) {
        const errorEl = fieldGroup.querySelector(".field-error");
        if (errorEl) errorEl.textContent = "";
        
        const targetEl = this.closest('.field') || this;
        targetEl.classList.remove("is-invalid");
      }
    });
  });

  // 1. Xử lý sự kiện Submit
  form.addEventListener("submit", function (e) {
    if (!validateForm()) {
      e.preventDefault(); // Chặn không gửi nếu còn lỗi
      if (statusEl) statusEl.hidden = true;
      return;
    }

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

  // 2. Nhận phản hồi từ hidden_iframe
  hiddenIframe.addEventListener("load", function () {
    if (isSubmitting) {
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = "🎉 Đăng ký thành công! Ban Tổ chức sẽ xác nhận qua email.";
        statusEl.style.color = "#008a00";
      }

      form.reset();
      clearAllErrors();

      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Đăng ký";
      }

      isSubmitting = false;

      setTimeout(() => {
        hiddenIframe.src = "about:blank";
      }, 500);
    }
  });
});