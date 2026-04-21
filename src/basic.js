(function () {
  "use strict";

  const popupItemList = document.getElementById("popupItemList");
  const addPopupBtn = document.getElementById("addPopupBtn");
  const generateBtn = document.getElementById("generateBtn");
  const resetBtn = document.getElementById("resetBtn");
  const statusBox = document.getElementById("statusBox");
  const allOutput = document.getElementById("allOutput");
  const copyAllBtn = document.getElementById("copyAllBtn");

  let popupItems = [createEmptyPopupItem()];

  const popupCssText = `.mainPopup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
  height: 0;
}
.mainPopup .popup {
  max-width: 500px;
  min-width: 250px;
  margin: 20px;
  background: #fff;
  position: relative;
}
.mainPopup .popup_inner {
  display: flex;
  flex-wrap: wrap;
  gap: 15px 0;
  align-items: flex-start;
  height: 0;
}
.mainPopup .popup_inner .popup .pop_con a {
  width: 100%;
  height: 100%;
  display: block;
}
.mainPopup .popup_inner .popup .pop_con img {
  width: 100%;
  height: auto !important;
  display: block;
}
.mainPopup .popup_inner .popup .pop_btn {
  display: flex;
  justify-content: space-between;
  background: #000;
  color: #fff;
  padding: 6px 10px 7px;
  font-size: 14px;
  position: absolute;
  top: 100%;
  width: 100%;
  gap: 12px;
  align-items: center;
}
.mainPopup .popup_inner .popup .pop_btn button {
  color: #fff;
  font-size: 14px;
  background: url(./userContent/images/common/pop_btn.png) no-repeat center right;
  padding-right: 18px;
  border: 0;
  cursor: pointer;
}
.mainPopup .popup_inner .popup .pop_btn .check_box {
  display: flex;
  align-items: center;
  gap: 6px;
}
.mainPopup .popup_inner .popup .pop_btn .check_box input {
  margin: 0;
}
.mainPopup .popup_inner .popup .pop_btn .check_box label {
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  .mainPopup {
    position: absolute;
  }
  .mainPopup .popup_inner {
    justify-content: center;
  }
  .mainPopup .popup_inner .popup .pop_con {
    max-height: none;
  }
}`;

  const popupJsText = `$('.mainPopup .popup_inner .popup .pop_btn button').on('click', function () {
  var $popup = $(this).closest(".popup");
  var $checkbox = $popup.find("input[type=checkbox]");
  var id = $popup.attr("id");

  $popup.hide();

  if ($checkbox.is(":checked") === true) {
    setCookie("POPUP_" + id, "Y", 1);
  }
});

$(document).ready(function () {
  var popups = $(".popup_inner .popup");
  if ($(popups).length > 0) {
    $(popups).each(function () {
      var id = this.id;
      var val = getCookie("POPUP_" + id);
      if (val !== "Y") {
        $(this).show();
      }
    });
  }
});

function setCookie(name, value, expiredays) {
  if (expiredays === 0) expiredays = 365;
  var todayDate = new Date();
  todayDate.setDate(todayDate.getDate() + expiredays);

  if (expiredays > 0) {
    todayDate.setHours(0);
    todayDate.setMinutes(0);
    todayDate.setSeconds(0);
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
  } else {
    document.cookie = name + "=" + escape(value) + "; path=/;";
  }
}

function getCookie(name) {
  var nameOfCookie = name + "=";
  var x = 0;

  while (x <= document.cookie.length) {
    var y = x + nameOfCookie.length;
    if (document.cookie.substring(x, y) === nameOfCookie) {
      var endOfCookie = document.cookie.indexOf(";", y);
      if (endOfCookie === -1) endOfCookie = document.cookie.length;
      return unescape(document.cookie.substring(y, endOfCookie));
    }
    x = document.cookie.indexOf(" ", x) + 1;
    if (x === 0) break;
  }

  return "";
}`;

  function createEmptyPopupItem() {
    return {
      link: "",
      image: "https://ggcf.kr/",
      newWindow: false
    };
  }

  function padNumber(num) {
    return String(num).padStart(2, "0");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function buildThumbPreview(imageUrl, index) {
    const trimmed = imageUrl.trim();

    if (!trimmed) {
      return `<div class="preview-thumb-empty">이미지 경로를 입력해 주세요.</div>`;
    }

    return `
      <img
        src="${escapeAttribute(trimmed)}"
        alt="팝업 ${index} 미리보기 이미지"
        onerror="this.outerHTML='&lt;div class=&quot;preview-thumb-error&quot;&gt;이미지를 불러오지 못했습니다&lt;br&gt;경로를 확인해주세요&lt;/div&gt;'"
      />
    `;
  }

  function renderPopupItemList() {
    popupItemList.innerHTML = "";

    popupItems.forEach(function (item, index) {
      const popupNumber = index + 1;
      const wrapper = document.createElement("section");
      wrapper.className = "popup-item";
      wrapper.dataset.index = String(index);

      wrapper.innerHTML = `
        <div class="popup-item-head">
          <h3 class="popup-item-title">팝업 ${padNumber(popupNumber)}</h3>
          <button type="button" class="btn-danger remove-popup-btn" ${popupItems.length === 1 ? "disabled" : ""}>
            삭제
          </button>
        </div>

        <label class="field-block">
          <span class="field-label">링크 주소</span>
          <input type="text" class="popup-link-input" placeholder="비워두면 #none 처리" value="${escapeAttribute(item.link)}" />
          <p class="field-help">비워두면 자동으로 <code>#none</code>이 들어갑니다.</p>
        </label>

        <label class="field-block">
          <span class="field-label">이미지 경로</span>
          <input type="text" class="popup-image-input" placeholder="https://example.com/popup.jpg" value="${escapeAttribute(item.image)}" />
          <p class="field-help">팝업에 들어갈 이미지 경로를 입력해 주세요.</p>
        </label>

        <label class="check-inline">
          <input type="checkbox" class="popup-window-input" ${item.newWindow ? "checked" : ""} />
          새창 열기
        </label>

        <div class="preview-thumb-wrap">
          <p class="preview-thumb-title">이미지 미리보기</p>
          <div class="preview-thumb-box">
            ${buildThumbPreview(item.image, popupNumber)}
          </div>
        </div>
      `;

      popupItemList.appendChild(wrapper);
    });
  }

  function buildPopupHtml(items) {
    const popupHtml = items
      .map(function (item, index) {
        const popupId = `popup${padNumber(index + 1)}`;
        const closeId = `close${padNumber(index + 1)}`;
        const href = item.link.trim() || "#none";
        const src = item.image.trim();
        const anchorAttrs = item.newWindow
          ? `href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" title="새 창 열림" aria-label="새 창 열림"`
          : `href="${escapeHtml(href)}"`;

        return `    <div class="popup" id="${popupId}" style="">
      <div class="pop_con">
        <a ${anchorAttrs}>
          <img src="${escapeHtml(src)}" alt="">
        </a>
      </div>
      <div class="pop_btn">
        <div class="check_box">
          <input type="checkbox" id="${closeId}">
          <label for="${closeId}">오늘 하루 이 창을 열지 않음</label>
        </div>
        <button type="button">닫기</button>
      </div>
    </div>`;
      })
      .join("\n\n");

    return `<div class="mainPopup">
  <div class="popup_inner">

${popupHtml}

  </div>

  <!-- popup_inner -->
</div>`;
  }

  function buildAllOutput(html, css, js) {
    return `<!-- HTML -->
${html}

<style>
${css}
</style>

<script>
${js}
</script>`;
  }

  function validateData(items) {
    const messages = [];
    let hasError = false;

    items.forEach(function (item, index) {
      const num = index + 1;

      if (!item.image.trim()) {
        messages.push(
          '<span class="error">팝업 ' + padNumber(num) + ': 이미지 경로를 입력해 주세요.</span>'
        );
        hasError = true;
      }

      if (item.link.trim() && !/^(https?:\/\/|\/|#)/i.test(item.link.trim())) {
        messages.push(
          '<span class="warn">팝업 ' + padNumber(num) + ': 링크 형식을 다시 확인해 주세요. 현재 값도 그대로 출력됩니다.</span>'
        );
      }

      if (item.image.trim() && !/^(https?:\/\/|\/)/i.test(item.image.trim())) {
        messages.push(
          '<span class="warn">팝업 ' + padNumber(num) + ': 이미지 경로 형식을 다시 확인해 주세요. 현재 값도 그대로 출력됩니다.</span>'
        );
      }
    });

    if (!hasError && messages.length === 0) {
      messages.push('<span class="ok">정상입니다. 전체 코드가 생성되었습니다.</span>');
    }

    return {
      hasError: hasError,
      messages: messages
    };
  }

  function renderOutput() {
    const validation = validateData(popupItems);
    statusBox.innerHTML = validation.messages.join("\n");

    if (validation.hasError) {
      allOutput.value = "";
      return;
    }

    const html = buildPopupHtml(popupItems);
    const all = buildAllOutput(html, popupCssText, popupJsText);
    allOutput.value = all;
  }

  function syncInputsToState() {
    const itemElements = Array.from(document.querySelectorAll(".popup-item"));

    popupItems = itemElements.map(function (itemElement) {
      return {
        link: itemElement.querySelector(".popup-link-input").value,
        image: itemElement.querySelector(".popup-image-input").value,
        newWindow: itemElement.querySelector(".popup-window-input").checked
      };
    });
  }

  function setStatus(message, type) {
    if (!type) {
      statusBox.innerHTML = message;
      return;
    }

    statusBox.innerHTML = '<span class="' + type + '">' + message + "</span>";
  }

  function copyText(text, successMessage) {
    if (!text) {
      setStatus("복사할 내용이 없습니다. 먼저 코드를 생성해 주세요.", "warn");
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(function () {
        setStatus(successMessage, "ok");
      })
      .catch(function () {
        setStatus("복사에 실패했습니다. 직접 선택해서 복사해 주세요.", "error");
      });
  }

  function bindEvents() {
    addPopupBtn.addEventListener("click", function () {
      popupItems.push(createEmptyPopupItem());
      renderPopupItemList();
      setStatus("새 팝업 항목이 추가되었습니다.", "ok");
    });

    resetBtn.addEventListener("click", function () {
      popupItems = [createEmptyPopupItem()];
      renderPopupItemList();
      allOutput.value = "";
      statusBox.innerHTML = '입력 후 <strong>코드 생성</strong> 버튼을 눌러주세요.';
    });

    generateBtn.addEventListener("click", function () {
      syncInputsToState();
      renderOutput();
    });

    popupItemList.addEventListener("input", function (event) {
      const itemElement = event.target.closest(".popup-item");
      if (!itemElement) return;

      const index = Number(itemElement.dataset.index);
      if (Number.isNaN(index)) return;

      const linkInput = itemElement.querySelector(".popup-link-input");
      const imageInput = itemElement.querySelector(".popup-image-input");
      const windowInput = itemElement.querySelector(".popup-window-input");

      popupItems[index] = {
        link: linkInput.value,
        image: imageInput.value,
        newWindow: windowInput.checked
      };

      const previewBox = itemElement.querySelector(".preview-thumb-box");
      if (previewBox) {
        previewBox.innerHTML = buildThumbPreview(popupItems[index].image, index + 1);
      }
    });

    popupItemList.addEventListener("click", function (event) {
      const removeBtn = event.target.closest(".remove-popup-btn");
      if (!removeBtn) return;

      const itemElement = event.target.closest(".popup-item");
      if (!itemElement) return;

      const index = Number(itemElement.dataset.index);
      if (popupItems.length === 1) return;

      popupItems.splice(index, 1);
      renderPopupItemList();
      setStatus("팝업 항목이 삭제되었습니다.", "ok");
    });

    copyAllBtn.addEventListener("click", function () {
      copyText(allOutput.value, "전체 코드가 복사되었습니다.");
    });
  }

  function init() {
    renderPopupItemList();
    bindEvents();
  }

  init();
})();