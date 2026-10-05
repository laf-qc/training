const ACCESS_KEY = "lf-training-access";
const ACCESS_PHRASE_HASH = "61e780cdd24b1aba30cebcdca00aa46cc86a1b7ee3f37254e162faa6312534ac";
const gate = document.querySelector("#access-gate");
const courseApp = document.querySelector("#course-app");
const presentation = document.querySelector("#presentation");
const form = document.querySelector("#access-form");
const phraseInput = document.querySelector("#access-phrase");
const errorMessage = document.querySelector("#gate-error");
const lockButton = document.querySelector("#lock-button");
const previousButton = document.querySelector("#previous-slide");
const nextButton = document.querySelector("#next-slide");
const slideCount = document.querySelector("#slide-count");
const progressLabel = document.querySelector("#progress-label");
const progressTrack = document.querySelector(".progress-track");
const progressValue = document.querySelector("#progress-value");
const slides = [...document.querySelectorAll("[data-slide]")];
const railLinks = [...document.querySelectorAll("[data-slide-target]")];
const TOTAL_SLIDES = slides.length;
let currentSlide = 0;

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function showSlide(index, moveFocus = true) {
  currentSlide = Math.max(0, Math.min(index, TOTAL_SLIDES - 1));
  slides.forEach((slide, i) => { const active = i === currentSlide; slide.hidden = !active; slide.classList.toggle("is-active", active); slide.setAttribute("aria-hidden", String(!active)); });
  railLinks.forEach((link) => {
    const start = Number(link.dataset.slideTarget);
    const end = Number(link.dataset.slideEnd || start);
    const current = currentSlide >= start && currentSlide <= end;
    link.classList.toggle("is-current", current);
    if (current) link.setAttribute("aria-current", "step"); else link.removeAttribute("aria-current");
  });
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === TOTAL_SLIDES - 1;
  nextButton.innerHTML = currentSlide === TOTAL_SLIDES - 1 ? "Outline complete" : "Continue <span aria-hidden=\"true\">→</span>";
  slideCount.textContent = `${currentSlide + 1} / ${TOTAL_SLIDES}`;
  progressLabel.textContent = slides[currentSlide].dataset.label || `Module ${Math.max(1, currentSlide - 11)}`;
  progressTrack.setAttribute("aria-valuenow", String(currentSlide + 1));
  progressValue.style.width = `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%`;
  sessionStorage.setItem("lf-training-slide", String(currentSlide));
  if (moveFocus) slides[currentSlide].querySelector("h1, h2")?.focus({ preventScroll: true });
}

function unlock() { sessionStorage.setItem(ACCESS_KEY, "open"); gate.hidden = true; courseApp.hidden = false; showSlide(Number(sessionStorage.getItem("lf-training-slide")) || 0, false); presentation.focus({ preventScroll: true }); }
function lock() { sessionStorage.removeItem(ACCESS_KEY); courseApp.hidden = true; gate.hidden = false; phraseInput.value = ""; errorMessage.textContent = ""; phraseInput.focus(); }

form.addEventListener("submit", async (event) => {
  event.preventDefault(); const candidate = phraseInput.value.trim().toLowerCase();
  if (!candidate) { errorMessage.textContent = "Enter the staff access phrase."; phraseInput.focus(); return; }
  if (await sha256(candidate) === ACCESS_PHRASE_HASH) unlock();
  else { errorMessage.textContent = "That phrase was not recognised. Check it or ask your manager."; phraseInput.select(); }
});
lockButton.addEventListener("click", lock);
previousButton.addEventListener("click", () => showSlide(currentSlide - 1));
nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
railLinks.forEach((link) => link.addEventListener("click", () => showSlide(Number(link.dataset.slideTarget))));

const moduleOneCheck = document.querySelector("#module-one-check");
const moduleOneFeedback = document.querySelector("#module-one-feedback");
moduleOneCheck.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = new FormData(moduleOneCheck).get("m1-check");
  if (!answer) {
    moduleOneFeedback.className = "answer-feedback is-incorrect";
    moduleOneFeedback.textContent = "Choose an answer before continuing.";
    return;
  }
  const correct = answer === "b";
  moduleOneFeedback.className = `answer-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  moduleOneFeedback.innerHTML = correct
    ? "<strong>Correct.</strong> Stop the risk travelling: pause, protect the food and report the concern promptly."
    : "<strong>Not quite.</strong> The safe first response is to pause the task, protect the food and report the concern. Never conceal a problem or act beyond the agreed procedure.";
  sessionStorage.setItem("lf-module-one-check", correct ? "correct" : "reviewed");
});

const moduleTwoCheck = document.querySelector("#module-two-check");
const moduleTwoFeedback = document.querySelector("#module-two-feedback");
moduleTwoCheck.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = new FormData(moduleTwoCheck).get("m2-check");
  if (!answer) {
    moduleTwoFeedback.className = "answer-feedback is-incorrect";
    moduleTwoFeedback.textContent = "Choose an answer before continuing.";
    return;
  }
  const correct = answer === "b";
  moduleTwoFeedback.className = `answer-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  moduleTwoFeedback.innerHTML = correct
    ? "<strong>Correct.</strong> Ready-to-eat food may receive no further cooking or other control, so preventing contamination is essential."
    : "<strong>Not quite.</strong> Ready-to-eat food can look and smell normal while unsafe, and it includes far more than meat. It needs protection because there may be no further cooking step.";
  sessionStorage.setItem("lf-module-two-check", correct ? "correct" : "reviewed");
});

const moduleThreeCheck = document.querySelector("#module-three-check");
const moduleThreeFeedback = document.querySelector("#module-three-feedback");
moduleThreeCheck.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = new FormData(moduleThreeCheck).get("m3-check");
  if (!answer) {
    moduleThreeFeedback.className = "answer-feedback is-incorrect";
    moduleThreeFeedback.textContent = "Choose an answer before continuing.";
    return;
  }
  const correct = answer === "b";
  moduleThreeFeedback.className = `answer-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  moduleThreeFeedback.innerHTML = correct
    ? "<strong>Correct.</strong> Report the illness and follow the manager’s instruction. The usual minimum is 48 hours after vomiting or diarrhoea has stopped naturally."
    : "<strong>Not quite.</strong> Gloves or avoiding one task do not remove the risk. Report the illness and remain excluded until the manager confirms it is safe to return—normally at least 48 hours after symptoms stop naturally.";
  sessionStorage.setItem("lf-module-three-check", correct ? "correct" : "reviewed");
});

const moduleFourCheck = document.querySelector("#module-four-check");
const moduleFourFeedback = document.querySelector("#module-four-feedback");
moduleFourCheck.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = new FormData(moduleFourCheck).get("m4-check");
  if (!answer) {
    moduleFourFeedback.className = "answer-feedback is-incorrect";
    moduleFourFeedback.textContent = "Choose an answer before continuing.";
    return;
  }
  const correct = answer === "b";
  moduleFourFeedback.className = `answer-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  moduleFourFeedback.innerHTML = correct
    ? "<strong>Correct.</strong> Never guess. Pause the order and use current approved information; if safety cannot be confirmed, say so clearly."
    : "<strong>Not quite.</strong> Recipe memory and removing visible seeds cannot confirm safety. Stop and check approved information before giving the customer an answer.";
  sessionStorage.setItem("lf-module-four-check", correct ? "correct" : "reviewed");
});

const moduleFiveCheck = document.querySelector("#module-five-check");
const moduleFiveFeedback = document.querySelector("#module-five-feedback");
moduleFiveCheck.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = new FormData(moduleFiveCheck).get("m5-check");
  if (!answer) {
    moduleFiveFeedback.className = "answer-feedback is-incorrect";
    moduleFiveFeedback.textContent = "Choose an answer before continuing.";
    return;
  }
  const correct = answer === "b";
  moduleFiveFeedback.className = `answer-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  moduleFiveFeedback.innerHTML = correct
    ? "<strong>Correct.</strong> Food debris, dirt and grease can shield microorganisms and stop disinfectant reaching the surface effectively."
    : "<strong>Not quite.</strong> Cleaning removes the dirt and grease that can prevent disinfectant working. You must still use the correct dilution and full contact time.";
  sessionStorage.setItem("lf-module-five-check", correct ? "correct" : "reviewed");
});

const moduleSixCheck = document.querySelector("#module-six-check");
const moduleSixFeedback = document.querySelector("#module-six-feedback");
moduleSixCheck.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = new FormData(moduleSixCheck).get("m6-check");
  if (!answer) {
    moduleSixFeedback.className = "answer-feedback is-incorrect";
    moduleSixFeedback.textContent = "Choose an answer before continuing.";
    return;
  }
  const correct = answer === "b";
  moduleSixFeedback.className = `answer-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  moduleSixFeedback.innerHTML = correct
    ? "<strong>Correct.</strong> A 7°C display is above the recommended operating target. Check the food and equipment, record the true reading and follow the site corrective action."
    : "<strong>Not quite.</strong> Do not wait for the legal maximum to be exceeded or falsify a record. Verify the reading and act under the site procedure.";
  sessionStorage.setItem("lf-module-six-check", correct ? "correct" : "reviewed");
});
document.addEventListener("keydown", (event) => {
  if (courseApp.hidden || ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  if (["ArrowRight", "PageDown"].includes(event.key)) { event.preventDefault(); showSlide(currentSlide + 1); }
  if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); showSlide(currentSlide - 1); }
  if (event.key === "Home") { event.preventDefault(); showSlide(0); }
  if (event.key === "End") { event.preventDefault(); showSlide(TOTAL_SLIDES - 1); }
});
if (sessionStorage.getItem(ACCESS_KEY) === "open") unlock();
