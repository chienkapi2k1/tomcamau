document.addEventListener("DOMContentLoaded", () => {
  const hotspotsContainer = document.querySelector(".booth-hotspots");

  if (!hotspotsContainer) {
    return;
  }

  /*
   * =========================
   * FIGMA DESIGN
   * =========================
   */

  const DESIGN_WIDTH = 1920;
  const DESIGN_HEIGHT = 879;

  /*
   * Vị trí + kích thước booth.svg
   */
  const BOOTH_LEFT = 98.34;
  const BOOTH_TOP = 248;

  const BOOTH_WIDTH = 1201.82470703125;
  const BOOTH_HEIGHT = 367;

  /*
   * Kích thước hệ tọa độ gốc
   * mà các group booth đang dùng.
   */
  const MAP_WIDTH = 2048;
  const MAP_HEIGHT = 625;

  /*
   * Tỷ lệ thu nhỏ booth.svg
   * từ 2048x625 -> 1201.8247x367
   */
  const scaleX = BOOTH_WIDTH / MAP_WIDTH;
  const scaleY = BOOTH_HEIGHT / MAP_HEIGHT;
  /*
   * Các nhóm booth được lấy đúng theo
   * bố cục ảnh booth-map.svg.
   *
   * top:
   * V1  -> V28
   *
   * middle:
   * V29 -> V124
   *
   * bottom:
   * V125 -> V152
   */

  const groups = [
    // =========================
    // TOP - 7 booth / group
    // =========================
    {
      start: 1,
      count: 7,
      columns: 7,
      rows: 1,
      x: 0,
      y: 0,
      width: 463,
      height: 66,
    },
    {
      start: 8,
      count: 7,
      columns: 7,
      rows: 1,
      x: 528,
      y: 0,
      width: 463,
      height: 66,
    },
    {
      start: 15,
      count: 7,
      columns: 7,
      rows: 1,
      x: 1056,
      y: 0,
      width: 464,
      height: 66,
    },
    {
      start: 22,
      count: 7,
      columns: 7,
      rows: 1,
      x: 1585,
      y: 0,
      width: 463,
      height: 66,
    },

    // =========================
    // MIDDLE ROW 1
    // =========================
    {
      start: 29,
      count: 8,
      columns: 4,
      rows: 2,
      x: 51,
      y: 132,
      width: 264,
      height: 133,
    },
    {
      start: 37,
      count: 8,
      columns: 4,
      rows: 2,
      x: 381,
      y: 132,
      width: 265,
      height: 133,
    },
    {
      start: 45,
      count: 8,
      columns: 4,
      rows: 2,
      x: 711,
      y: 132,
      width: 265,
      height: 133,
    },
    {
      start: 53,
      count: 8,
      columns: 4,
      rows: 2,
      x: 1072,
      y: 132,
      width: 265,
      height: 133,
    },
    {
      start: 61,
      count: 8,
      columns: 4,
      rows: 2,
      x: 1402,
      y: 132,
      width: 265,
      height: 133,
    },
    {
      start: 69,
      count: 8,
      columns: 4,
      rows: 2,
      x: 1732,
      y: 132,
      width: 265,
      height: 133,
    },

    // =========================
    // MIDDLE ROW 2
    // =========================
    {
      start: 77,
      count: 8,
      columns: 4,
      rows: 2,
      x: 51,
      y: 360,
      width: 264,
      height: 133,
    },
    {
      start: 85,
      count: 8,
      columns: 4,
      rows: 2,
      x: 381,
      y: 360,
      width: 265,
      height: 133,
    },
    {
      start: 93,
      count: 8,
      columns: 4,
      rows: 2,
      x: 711,
      y: 360,
      width: 265,
      height: 133,
    },
    {
      start: 101,
      count: 8,
      columns: 4,
      rows: 2,
      x: 1072,
      y: 360,
      width: 265,
      height: 133,
    },
    {
      start: 109,
      count: 8,
      columns: 4,
      rows: 2,
      x: 1402,
      y: 360,
      width: 265,
      height: 133,
    },
    {
      start: 117,
      count: 8,
      columns: 4,
      rows: 2,
      x: 1732,
      y: 360,
      width: 265,
      height: 133,
    },

    // =========================
    // BOTTOM - 7 booth / group
    // =========================
    {
      start: 125,
      count: 7,
      columns: 7,
      rows: 1,
      x: 0,
      y: 559,
      width: 463,
      height: 66,
    },
    {
      start: 132,
      count: 7,
      columns: 7,
      rows: 1,
      x: 528,
      y: 559,
      width: 463,
      height: 66,
    },
    {
      start: 139,
      count: 7,
      columns: 7,
      rows: 1,
      x: 1056,
      y: 559,
      width: 464,
      height: 66,
    },
    {
      start: 146,
      count: 7,
      columns: 7,
      rows: 1,
      x: 1585,
      y: 559,
      width: 463,
      height: 66,
    },
  ];

  const selectedBooths = new Set();

  /*
   * Tạo hotspot cho từng booth.
   */
  groups.forEach((group) => {
    const boothWidth = group.width / group.columns;
    const boothHeight = group.height / group.rows;

    for (let i = 0; i < group.count; i++) {
      const column = i % group.columns;
      const row = Math.floor(i / group.columns);

      const boothNumber = group.start + i;

      const button = document.createElement("button");

      button.type = "button";
      button.className = "booth-hotspot";

      button.dataset.booth = `V${boothNumber}`;

      /*
       * Vị trí theo % để responsive.
       */
      const originalLeft = group.x + column * boothWidth;

      const originalTop = group.y + row * boothHeight;

      const originalWidth = boothWidth;

      const originalHeight = boothHeight;

      const left = BOOTH_LEFT + originalLeft * scaleX;

      const top = BOOTH_TOP + originalTop * scaleY;

      const width = originalWidth * scaleX;

      const height = originalHeight * scaleY;

      button.style.left = `${(left / DESIGN_WIDTH) * 100}%`;

      button.style.top = `${(top / DESIGN_HEIGHT) * 100}%`;

      button.style.width = `${(width / DESIGN_WIDTH) * 100}%`;

      button.style.height = `${(height / DESIGN_HEIGHT) * 100}%`;

      button.setAttribute("aria-label", `Gian hàng V${boothNumber}`);

      button.addEventListener("click", () => {
        toggleBooth(button, boothNumber);
      });

      hotspotsContainer.appendChild(button);
    }
  });

  /*
   * Click chọn / bỏ chọn booth.
   */
  function toggleBooth(button, boothNumber) {
    const boothCode = `V${boothNumber}`;

    if (selectedBooths.has(boothCode)) {
      selectedBooths.delete(boothCode);

      button.classList.remove("selected");
    } else {
      selectedBooths.add(boothCode);

      button.classList.add("selected");
    }

    updateSelection();
  }

  /*
   * Cập nhật panel bên phải.
   */
  function updateSelection() {
    const selectedTags = document.querySelector("#selectedTags");

    const totalArea = document.querySelector("#totalArea");

    const totalPrice = document.querySelector("#totalPrice");

    const finalPrice = document.querySelector("#finalPrice");

    const selected = [...selectedBooths];

    /*
     * Không có booth.
     */
    if (selected.length === 0) {
      selectedTags.innerHTML = `
        <span class="empty-selection">
          Chưa chọn gian hàng
        </span>
      `;

      totalArea.textContent = "0 m²";
      totalPrice.textContent = "0 đ";
      finalPrice.textContent = "0 đ";

      return;
    }

    /*
     * Hiển thị tags.
     */
    selectedTags.innerHTML = selected
      .map(
        (booth) => `
          <span>${booth}/9m²</span>
        `,
      )
      .join("");

    /*
     * Mỗi booth hiện tại mặc định 3x3m.
     */
    const area = selected.length * 9;

    /*
     * Tạm để 0 đ theo UI hiện tại.
     * Sau này chỉ cần thay PRICE_PER_BOOTH.
     */
    const PRICE_PER_BOOTH = 6572000;

    const price = selected.length * PRICE_PER_BOOTH;

    totalArea.textContent = `${area} m²`;

    totalPrice.textContent = formatMoney(price);

    finalPrice.textContent = formatMoney(price);
  }

  /*
   * Format tiền Việt Nam.
   */
  function formatMoney(value) {
    return new Intl.NumberFormat("vi-VN").format(value) + " đ";
  }

  /*
   * Tiếp tục sang payment.
   *
   * Hiện tại lưu thông tin vào sessionStorage
   * để payment.html có thể lấy lại sau này.
   */
  const continueBtn = document.querySelector("#continueBtn");

  continueBtn.addEventListener("click", () => {
    sessionStorage.setItem(
      "selectedBooths",
      JSON.stringify([...selectedBooths]),
    );
  });
});
