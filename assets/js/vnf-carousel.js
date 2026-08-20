/* ==========================================================================
   <vnf-carousel> — custom element bọc Swiper
   --------------------------------------------------------------------------
   Cách dùng:

     <vnf-carousel space-between="12" slides-per-view="auto" loop>
       <div class="swiper">
         <div class="swiper-wrapper">
           <div class="swiper-slide">…</div>
         </div>
       </div>
       <button data-carousel-prev>…</button>
       <button data-carousel-next>…</button>
     </vnf-carousel>

   Element tự tìm `.swiper` bên trong (light DOM — giữ nguyên HTML/CSS của trang,
   không dùng shadow DOM để CSS token của dự án vẫn áp được), đọc option từ
   attribute rồi khởi tạo Swiper. Nút prev/next có thể đặt bất kỳ đâu bên trong.

   Yêu cầu: swiper-bundle.min.js đã được nạp trước (assets/vendor/swiper/).
   ========================================================================== */
(function () {
  'use strict';

  var seq = 0; // đánh số id cho nút prev/next khi trang có nhiều carousel

  /** Đọc attribute dạng số, trả về giá trị mặc định nếu không hợp lệ. */
  function numAttr(el, name, fallback) {
    var raw = el.getAttribute(name);
    if (raw === null) return fallback;
    var n = parseFloat(raw);
    return isNaN(n) ? fallback : n;
  }

  /** "auto" giữ nguyên chuỗi, còn lại parse số (slidesPerView chấp nhận cả hai). */
  function perViewAttr(el, name, fallback) {
    var raw = el.getAttribute(name);
    if (raw === null) return fallback;
    if (raw === 'auto') return 'auto';
    var n = parseFloat(raw);
    return isNaN(n) ? fallback : n;
  }

  /**
   * breakpoints="700:2, 1024:3" → { 700: {slidesPerView: 2}, 1024: {slidesPerView: 3} }
   * Dùng khi muốn số slide cố định theo bề rộng; bỏ qua nếu dùng slides-per-view="auto".
   */
  function parseBreakpoints(raw) {
    if (!raw) return undefined;
    var out = {};
    raw.split(',').forEach(function (pair) {
      var parts = pair.split(':');
      if (parts.length !== 2) return;
      var width = parseInt(parts[0], 10);
      var perView = parts[1].trim() === 'auto' ? 'auto' : parseFloat(parts[1]);
      if (!isNaN(width)) out[width] = { slidesPerView: perView };
    });
    return Object.keys(out).length ? out : undefined;
  }

  class VnfCarousel extends HTMLElement {
    connectedCallback() {
      if (this.swiper) return;
      this.init();
      // Nếu element được nâng cấp trước khi các slide kịp parse (script không defer),
      // thử lại sau khi trình duyệt parse xong phần còn lại của tài liệu.
      if (!this.swiper) setTimeout(this.init.bind(this), 0);
    }

    disconnectedCallback() {
      if (this.swiper) {
        this.swiper.destroy(true, true);
        this.swiper = null;
      }
    }

    init() {
      if (this.swiper || !this.isConnected) return;

      var root = this.querySelector('.swiper');
      if (!root) return;

      if (typeof window.Swiper !== 'function') {
        console.warn('[vnf-carousel] Chưa nạp Swiper — bỏ qua khởi tạo, carousel giữ nguyên dạng danh sách cuộn ngang.');
        this.setAttribute('data-fallback', '');
        return;
      }

      // Nút điều hướng: mặc định tìm trong element; nếu nút nằm ngoài (ví dụ trên
      // hàng tiêu đề section) thì trỏ tới nó bằng attribute prev="…" / next="…".
      var prev = this.getAttribute('prev')
        ? document.querySelector(this.getAttribute('prev'))
        : this.querySelector('[data-carousel-prev]');
      var next = this.getAttribute('next')
        ? document.querySelector(this.getAttribute('next'))
        : this.querySelector('[data-carousel-next]');

      var options = {
        slidesPerView: perViewAttr(this, 'slides-per-view', 'auto'),
        spaceBetween: numAttr(this, 'space-between', 0),
        speed: numAttr(this, 'speed', 450),
        slidesPerGroup: numAttr(this, 'slides-per-group', 1),
        loop: this.hasAttribute('loop'),
        grabCursor: true,
        watchOverflow: true,
        a11y: { enabled: true },
        keyboard: { enabled: true, onlyInViewport: true },
        breakpoints: parseBreakpoints(this.getAttribute('breakpoints'))
      };

      if (prev && next) {
        // Swiper merge sâu object option → truyền thẳng HTMLElement sẽ bị mất tham chiếu
        // (params.navigation.nextEl thành null). Vì vậy gán id rồi truyền selector.
        seq += 1;
        if (!prev.id) prev.id = 'vnf-carousel-prev-' + seq;
        if (!next.id) next.id = 'vnf-carousel-next-' + seq;
        options.navigation = {
          prevEl: '#' + prev.id,
          nextEl: '#' + next.id,
          disabledClass: 'is-disabled'
        };
      }

      this.swiper = new window.Swiper(root, options);
      this.setAttribute('data-ready', '');
    }
  }

  if (!customElements.get('vnf-carousel')) {
    customElements.define('vnf-carousel', VnfCarousel);
  }
})();
