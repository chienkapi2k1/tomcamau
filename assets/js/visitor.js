/* visitor.html — kiểm tra form đăng ký tham quan. */
document.addEventListener("DOMContentLoaded", () => {
  window.initFormValidation?.({
    form: "#visitorForm",
    status: "#visitorStatus",
    successText:
      "Đã ghi nhận đăng ký tham quan. Ban Tổ chức sẽ gửi xác nhận qua email cho bạn.",
  });
});
