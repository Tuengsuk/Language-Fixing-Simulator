const eventMap = new Map();

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
  let output = "";
  for (let char of input) {
    const index = thai.indexOf(char);
    output += index !== -1 ? eng.charAt(index) : char;
  }
  return output;
}

function checkLang(input) {
  let output = "";
  let check = "";
  for (let char of input) {
    const index = eng.indexOf(char);
    check += index !== -1 && thai.charAt(index) != "๖" && thai.charAt(index) != "๗" && thai.charAt(index) != "ใ" && thai.charAt(index) != "๙" && thai.charAt(index) != "ฝ" && thai.charAt(index) != "ม" && thai.charAt(index) != "ข" && thai.charAt(index) != "\"" && thai.charAt(index) != "." && thai.charAt(index) != "ฦ" ? thai.charAt(index) : char;
    output += index !== -1 ? thai.charAt(index) : char;
  }
  if (check === input) {
    return thaiToEng(input);
  } else {
    return output;
  }
}
  
function createSuggestionBox(targetElem) {
  const box = document.createElement("div");
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

  document.body.appendChild(box);
  return box;
}
  
function removeSuggestionBox() {
  const box = document.getElementById("thai-suggestion-box");
  if (box) box.remove();
}
  
function showSuggestion(target, text) {
  removeSuggestionBox();

  const texts = text.split(" ")
  let first = true
  let output = ""
  let convert

  texts.forEach(function(splited_text) {
    convert = checkLang(splited_text)

    if (first) {
      first = false
      output = convert
    } else {
      output += " " + convert
    }
  })

  const box = createSuggestionBox(target);
  box.id = "thai-suggestion-box";
  box.textContent = output;

  box.addEventListener("mousedown", (e) => {
    e.preventDefault();
    target.value = output;
    removeSuggestionBox();
  })
}
  
function attachListener(textarea) {
  if (textarea._ListenerAttached) return;
  textarea._ListenerAttached = true;

  textarea.addEventListener("input", (e) => {
    const text = e.target.value;
    showSuggestion(e.target, text);
  });

  textarea.addEventListener("focus", (e) => {
    const text = e.target.value;
    showSuggestion(e.target, text);
  });

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      const text = e.target.value;
      e.preventDefault();
      let texts = textarea.value.split(" ");
      let first = true;
      let output = "";

      texts.forEach(function(splited_text) {
        convert = checkLang(splited_text);

        if (first) {
          first = false;
          output = convert;
        } else {
          output += " " + convert;
        }
      })

      if (textarea.value.slice(-1) != " ") {
        textarea.value = output + " ";
      } else {
        textarea.value = output
      }

      textarea.setSelectionRange(text.length + 1, text.length + 1);
    }
  })

  textarea.addEventListener("blur", () => {
    setTimeout(removeSuggestionBox, 200);
  });
}
  
function observeAndAttach() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll("textarea").forEach(attachListener);
    document.querySelectorAll("input").forEach(attachListener);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll('textarea').forEach(attachListener);
  document.querySelectorAll("input").forEach(attachListener);
}
  
observeAndAttach();
