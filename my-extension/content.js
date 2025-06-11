const eng = "`1234567890-=" +
            "qwertyuiop[]\\" +
            "asdfghjkl;'" +
            "zxcvbnm,./" +
            "~!@#$%^&*()_+" +
            "QWERTYUIOP{}|" +
            "ASDFGHJKL:\"" +
            "ZXCVBNM<>?";

const thai = "_ๅ/-ภถุึคตจขช" +
              "ๆไำพะัีรนยบลฃ" +
              "ฟหกดเ้่าสวง" +
              "ผปแอิืทมใฝ" +
              "%+๑๒๓๔ู฿๕๖๗๘๙" +
              "๐\"ฎฑธํ๊ณฯญฐ,ฅ" +
              "ฤฆฏโฌ็๋ษศซ." +
              "()ฉฮฺ์?ฒฬฦ";

function thaiToEng(input) {
  return [...input].map(char => {
    const index = thai.indexOf(char);
    return index !== -1 ? eng.charAt(index) : char;
  }).join('');
}

function checkLang(input) {
  let check = "";
  let output = "";

  for (let char of input) {
    const index = eng.indexOf(char);
    const thaiChar = index !== -1 ? thai.charAt(index) : char;

    check += (index !== -1 && !["๖", "๗", "ใ", "๙", "ฝ", "ม", "ข", "\"", ".", "ฦ"].includes(thaiChar))
      ? thaiChar : char;

    output += index !== -1 ? thaiChar : char;
  }

  if (check === input) return thaiToEng(input);
  else return output;
}

function createSuggestionBox(targetElem, text) {
  removeSuggestionBox();

  const box = document.createElement("div");
  box.id = "thai-suggestion-box";
  box.className = "thai-suggestion-box";
  box.style.position = "absolute";
  box.style.background = "black";
  box.style.border = "1px solid #ccc";
  box.style.zIndex = 9999;
  box.style.maxHeight = "150px";
  box.style.overflowY = "auto";
  box.style.fontSize = "14px";
  box.style.padding = "4px 8px";
  box.style.cursor = "pointer";
  box.style.color = "white";

  const rect = targetElem.getBoundingClientRect();
  box.style.left = `${rect.left + window.scrollX}px`;
  box.style.top = `${rect.bottom + window.scrollY}px`;
  box.style.width = `${rect.width}px`;

  box.textContent = text;

  box.addEventListener("mousedown", (e) => {
    e.preventDefault();
    targetElem.value = text;
    targetElem.focus();
  });

  document.body.appendChild(box);
}

function removeSuggestionBox() {
  const box = document.getElementById("thai-suggestion-box");
  if (box) box.remove();
}

function attachListener(textarea) {
  if (textarea._ListenerAttached) return;
  textarea._ListenerAttached = true;

  textarea.addEventListener("input", (e) => {
    const text = e.target.value;
    const converted = checkLang(text);
    if (text !== converted) {
      createSuggestionBox(e.target, converted);
    } else {
      removeSuggestionBox();
    }
  });

  textarea.addEventListener("focus", (e) => {
    const text = e.target.value;
    const converted = checkLang(text);
    if (text !== converted) {
      createSuggestionBox(e.target, converted);
    }
  });

  textarea.addEventListener("blur", () => {
    setTimeout(removeSuggestionBox, 200);
  });

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const text = textarea.value;
      const converted = checkLang(text);
      textarea.value = converted;

      const endPos = converted.length;
      textarea.setSelectionRange(endPos, endPos);

      removeSuggestionBox();
    }
  });
}

function observeAndAttach() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll("textarea").forEach(attachListener);
    document.querySelectorAll("input[type='text']").forEach(attachListener);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll("textarea").forEach(attachListener);
  document.querySelectorAll("input[type='text']").forEach(attachListener);
}

observeAndAttach();
