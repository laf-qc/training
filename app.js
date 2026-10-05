const ACCESS_KEY = "lf-training-access";
const ACCESS_PHRASE_HASH = "61e780cdd24b1aba30cebcdca00aa46cc86a1b7ee3f37254e162faa6312534ac";
const PROFILES_KEY = "lf-training-profiles-v1";
const CURRENT_LEARNER_KEY = "lf-current-learner";
const gate = document.querySelector("#access-gate");
const learnerGate = document.querySelector("#learner-gate");
const courseApp = document.querySelector("#course-app");
const presentation = document.querySelector("#presentation");
const accessForm = document.querySelector("#access-form");
const learnerForm = document.querySelector("#learner-form");
const phraseInput = document.querySelector("#access-phrase");
const accessError = document.querySelector("#gate-error");
const learnerError = document.querySelector("#learner-error");
const previousButton = document.querySelector("#previous-slide");
const nextButton = document.querySelector("#next-slide");
const slideCount = document.querySelector("#slide-count");
const learnerStatus = document.querySelector("#learner-status");
const progressLabel = document.querySelector("#progress-label");
const progressTrack = document.querySelector(".progress-track");
const progressValue = document.querySelector("#progress-value");
const slides = [...document.querySelectorAll("[data-slide]")];
const railLinks = [...document.querySelectorAll("[data-slide-target]")];
const TOTAL_SLIDES = slides.length;
let currentSlide = 0;
let currentProfileId = null;
let currentProfile = null;
let currentExamQuestion = 0;

const QUESTIONS = [
  ["Module 1", "You notice a food-safety control may have failed, but you are unsure how serious it is. What should you do first?", ["Finish the task and mention it later", "Pause, protect the food and report the concern", "Throw everything away without telling anyone"], 1],
  ["Module 1", "Who is responsible for food safety at La Fromagerie?", ["Only the store manager", "Only chefs and cheese-room staff", "The business and every food handler, with different responsibilities"], 2],
  ["Module 1", "Why can appearance and smell not prove food is safe?", ["Many hazards cannot be seen or smelled", "Only frozen food can be checked visually", "Smell is reliable only for cheese"], 0],
  ["Module 1", "What should happen if a required record was missed?", ["Backfill the expected result", "Leave it hidden", "Report the missed control and record the real action taken"], 2],
  ["Module 2", "Which list contains the four main food-safety hazard types?", ["Hot, cold, wet and dry", "Microbiological, allergenic, chemical and physical", "Supplier, staff, customer and premises"], 1],
  ["Module 2", "Why does ready-to-eat food need especially careful protection?", ["It may receive no further cooking step", "It always contains milk", "It cannot be refrigerated"], 0],
  ["Module 2", "Which is a physical hazard?", ["Sanitiser residue", "A metal fragment", "Norovirus"], 1],
  ["Module 2", "What four conditions commonly help bacteria multiply?", ["Food, moisture, warmth and time", "Light, salt, air and colour", "Packaging, labels, shelves and gloves"], 0],
  ["Module 3", "When must hands be washed?", ["Only at the start of the shift", "After contamination and before returning to clean food work", "Only when visibly dirty"], 1],
  ["Module 3", "Which statement about single-use gloves is correct?", ["They replace handwashing", "They can be washed and reused", "Hands must be washed and gloves changed between contaminated tasks"], 2],
  ["Module 3", "How should a cut on a food handler's hand be managed?", ["Cover completely with a brightly coloured waterproof dressing and report it", "Use a skin-coloured tissue", "Work without a covering if the cut is small"], 0],
  ["Module 3", "After vomiting or diarrhoea stops naturally, what is the usual minimum exclusion period?", ["12 hours", "24 hours", "48 hours, subject to manager confirmation"], 2],
  ["Module 4", "A customer reports an allergy but the current ingredient information is missing. What should you do?", ["Use recipe memory", "Explain that safety cannot be confirmed until approved information is checked", "Remove visible pieces of the allergen"], 1],
  ["Module 4", "Which item is one of the 14 regulated allergens?", ["Tomato", "Sesame", "Garlic"], 1],
  ["Module 4", "What information must appear on PPDS food?", ["Price only", "Food name, full ingredients list and emphasised regulated allergens", "A verbal allergen warning only"], 1],
  ["Module 4", "A utensil used for walnut-coated cheese is wiped and then used on another cheese. What is the risk?", ["Allergen cross-contact", "Temperature abuse", "Stock rotation failure"], 0],
  ["Module 5", "Why is cleaning required before disinfection?", ["Dirt and grease can prevent disinfectant working", "Disinfectant works only on wet floors", "Cleaning removes the need for contact time"], 0],
  ["Module 5", "What must be followed when using a disinfectant?", ["A stronger mix is always safer", "The approved dilution, contact time and rinse instructions", "Any method used by a colleague"], 1],
  ["Module 5", "You find droppings beside stored food. What should you do?", ["Sweep them away and continue", "Report immediately and isolate food that may be affected", "Move pest bait yourself"], 1],
  ["Module 5", "Why should dirty cloths be controlled?", ["They can spread bacteria and allergens", "They cool food too quickly", "They change use-by dates"], 0],
  ["Module 6", "What is the recommended operating target for refrigeration?", ["5°C or below", "8°C exactly", "10°C or below"], 0],
  ["Module 6", "What is the minimum hot-holding temperature?", ["50°C", "63°C", "70°C"], 1],
  ["Module 6", "Which is one recognised thorough-cooking combination?", ["63°C for 10 seconds", "70°C for 2 minutes", "50°C for 5 minutes"], 1],
  ["Module 6", "Where should a probe normally check a cooked item?", ["Against the tray", "At the surface", "In the centre or thickest/coldest representative part"], 2],
  ["Module 7", "What should happen to a delivery with torn, leaking packaging?", ["Accept it if the price is reduced", "Reject or isolate it under the delivery procedure", "Wash the outer pack and sell it"], 1],
  ["Module 7", "Which date concerns food safety?", ["Use-by", "Best-before", "Display-until"], 0],
  ["Module 7", "How should raw food normally be stored relative to ready-to-eat food?", ["Above it", "Below it in secure covered containers", "On the same shelf without covers"], 1],
  ["Module 7", "What does FEFO mean in stock rotation?", ["First entered, first opened", "First expiry, first out", "Food examined for odour"], 1],
  ["Module 8", "When should a food-safety check be recorded?", ["At the time it is completed", "At the end of the week from memory", "Only when the result meets the target"], 0],
  ["Module 8", "A safe method no longer matches the real process. What should you do?", ["Keep using the old method silently", "Invent a replacement", "Pause affected work and report the change for review"], 2]
].map(([module, question, options, correct]) => ({ module, question, options, correct }));

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function readProfiles() { try { return JSON.parse(localStorage.getItem(PROFILES_KEY)) || {}; } catch { return {}; } }
function saveProfile() { if (!currentProfileId || !currentProfile) return; const profiles = readProfiles(); profiles[currentProfileId] = currentProfile; localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); }
function learnerId(firstName, lastName) { return `${firstName.trim().toLocaleLowerCase("en-GB")}|${lastName.trim().toLocaleLowerCase("en-GB")}`; }
function formatDate(value) { return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)); }
function refresherStatus(profile) {
  if (!profile.completedAt || !profile.dueAt) return "In progress";
  const days = Math.ceil((new Date(profile.dueAt) - new Date()) / 86400000);
  if (days < 0) return `Refresher overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Refresher due today";
  if (days <= 30) return `Refresher due in ${days} day${days === 1 ? "" : "s"}`;
  return `Refresher due ${formatDate(profile.dueAt)}`;
}
function updateLearnerStatus() { if (currentProfile) learnerStatus.textContent = `${currentProfile.firstName} ${currentProfile.lastName} · ${refresherStatus(currentProfile)}`; }

function showSlide(index, moveFocus = true) {
  currentSlide = Math.max(0, Math.min(index, TOTAL_SLIDES - 1));
  slides.forEach((slide, i) => { const active = i === currentSlide; slide.hidden = !active; slide.classList.toggle("is-active", active); slide.setAttribute("aria-hidden", String(!active)); });
  railLinks.forEach((link) => { const start = Number(link.dataset.slideTarget); const end = Number(link.dataset.slideEnd || start); const current = currentSlide >= start && currentSlide <= end; link.classList.toggle("is-current", current); if (current) link.setAttribute("aria-current", "step"); else link.removeAttribute("aria-current"); });
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === TOTAL_SLIDES - 1;
  nextButton.textContent = currentSlide === TOTAL_SLIDES - 1 ? "Course complete" : "Continue";
  slideCount.textContent = `${currentSlide + 1} / ${TOTAL_SLIDES}`;
  progressLabel.textContent = slides[currentSlide].dataset.label || "Course";
  progressTrack.setAttribute("aria-valuemax", String(TOTAL_SLIDES));
  progressTrack.setAttribute("aria-valuenow", String(currentSlide + 1));
  progressValue.style.width = `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%`;
  if (currentProfile) { currentProfile.slide = currentSlide; saveProfile(); }
  if (currentSlide === 124 && currentProfile) renderAssessment();
  if (currentSlide === 125) renderResult();
  if (moveFocus) slides[currentSlide].querySelector("h1, h2")?.focus({ preventScroll: true });
}
function startCourse(profileId, profile) { currentProfileId = profileId; currentProfile = profile; sessionStorage.setItem(CURRENT_LEARNER_KEY, profileId); learnerGate.hidden = true; courseApp.hidden = false; updateLearnerStatus(); showSlide(Number.isInteger(profile.slide) ? profile.slide : 0, false); presentation.focus({ preventScroll: true }); }
function unlock() { sessionStorage.setItem(ACCESS_KEY, "open"); gate.hidden = true; const id = sessionStorage.getItem(CURRENT_LEARNER_KEY); const profile = id ? readProfiles()[id] : null; if (profile) startCourse(id, profile); else { learnerGate.hidden = false; document.querySelector("#first-name").focus(); } }
function lock() { sessionStorage.removeItem(ACCESS_KEY); courseApp.hidden = true; learnerGate.hidden = true; gate.hidden = false; phraseInput.value = ""; accessError.textContent = ""; phraseInput.focus(); }

accessForm.addEventListener("submit", async (event) => { event.preventDefault(); const candidate = phraseInput.value.trim().toLowerCase(); if (!candidate) { accessError.textContent = "Enter the staff access phrase."; return; } if (await sha256(candidate) === ACCESS_PHRASE_HASH) unlock(); else { accessError.textContent = "That phrase was not recognised. Check it or ask your manager."; phraseInput.select(); } });
learnerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const firstName = document.querySelector("#first-name").value.trim().replace(/\s+/g, " ");
  const lastName = document.querySelector("#last-name").value.trim().replace(/\s+/g, " ");
  if (firstName.length < 2 || lastName.length < 2) { learnerError.textContent = "Enter both your first and last name."; return; }
  const id = learnerId(firstName, lastName); const profiles = readProfiles();
  const profile = profiles[id] || { firstName, lastName, slide: 0, answers: Array(QUESTIONS.length).fill(null), attempts: 0 };
  profile.firstName = firstName; profile.lastName = lastName; profiles[id] = profile; localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); learnerError.textContent = ""; startCourse(id, profile);
});
document.querySelector("#lock-button").addEventListener("click", lock);
document.querySelector("#change-learner").addEventListener("click", () => { sessionStorage.removeItem(CURRENT_LEARNER_KEY); currentProfile = null; currentProfileId = null; courseApp.hidden = true; learnerGate.hidden = false; learnerForm.reset(); document.querySelector("#first-name").focus(); });
previousButton.addEventListener("click", () => showSlide(currentSlide - 1));
nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
railLinks.forEach((link) => link.addEventListener("click", () => showSlide(Number(link.dataset.slideTarget))));

const moduleChecks = [
  ["module-one-check", "m1-check", "module-one-feedback", "Stop the risk travelling: pause, protect the food and report the concern promptly."],
  ["module-two-check", "m2-check", "module-two-feedback", "Ready-to-eat food may receive no further cooking step, so preventing contamination is essential."],
  ["module-three-check", "m3-check", "module-three-feedback", "Report illness and follow the manager’s instruction; the usual minimum is 48 hours after symptoms stop naturally."],
  ["module-four-check", "m4-check", "module-four-feedback", "Never guess. Pause the order and use current approved information."],
  ["module-five-check", "m5-check", "module-five-feedback", "Dirt and grease can stop disinfectant reaching the surface effectively."],
  ["module-six-check", "m6-check", "module-six-feedback", "Check food and equipment, record the true reading and follow the site corrective action."],
  ["module-seven-check", "m7-check", "module-seven-feedback", "A use-by date is a safety limit. Remove the food from sale or use."],
  ["module-eight-check", "m8-check", "module-eight-feedback", "The record must show the missed check and real corrective action."]
];
moduleChecks.forEach(([formId, fieldName, feedbackId, correctText]) => { const checkForm = document.querySelector(`#${formId}`); const feedback = document.querySelector(`#${feedbackId}`); checkForm.addEventListener("submit", (event) => { event.preventDefault(); const answer = new FormData(checkForm).get(fieldName); if (!answer) { feedback.className = "answer-feedback is-incorrect"; feedback.textContent = "Choose an answer before continuing."; return; } const correct = answer === "b"; feedback.className = `answer-feedback ${correct ? "is-correct" : "is-incorrect"}`; feedback.innerHTML = correct ? `<strong>Correct.</strong> ${correctText}` : "<strong>Not quite.</strong> Review the safe response on the previous slides, then try again."; }); });

const assessmentPosition = document.querySelector("#assessment-position");
const assessmentModule = document.querySelector("#assessment-module");
const assessmentQuestion = document.querySelector("#assessment-question");
const assessmentForm = document.querySelector("#assessment-form");
const assessmentDots = document.querySelector("#assessment-dots");
const assessmentPrevious = document.querySelector("#assessment-previous");
const assessmentNext = document.querySelector("#assessment-next");
const assessmentSubmit = document.querySelector("#assessment-submit");
const assessmentError = document.querySelector("#assessment-error");
function ensureAnswers() { if (!Array.isArray(currentProfile.answers) || currentProfile.answers.length !== QUESTIONS.length) currentProfile.answers = Array(QUESTIONS.length).fill(null); }
function renderDots() { assessmentDots.innerHTML = QUESTIONS.map((_, index) => `<button type="button" class="${currentProfile.answers[index] !== null ? "is-answered" : ""} ${index === currentExamQuestion ? "is-current" : ""}" aria-label="Go to question ${index + 1}">${index + 1}</button>`).join(""); assessmentDots.querySelectorAll("button").forEach((button, index) => button.addEventListener("click", () => { currentExamQuestion = index; renderAssessment(); })); }
function renderAssessment() {
  ensureAnswers(); const item = QUESTIONS[currentExamQuestion];
  assessmentPosition.textContent = `Question ${currentExamQuestion + 1} of ${QUESTIONS.length}`; assessmentModule.textContent = item.module; assessmentQuestion.textContent = item.question;
  assessmentForm.innerHTML = item.options.map((option, index) => `<label><input type="radio" name="assessment-answer" value="${index}" ${currentProfile.answers[currentExamQuestion] === index ? "checked" : ""}><span>${option}</span></label>`).join("");
  assessmentForm.querySelectorAll("input").forEach((input) => input.addEventListener("change", () => { currentProfile.answers[currentExamQuestion] = Number(input.value); saveProfile(); renderDots(); }));
  assessmentPrevious.disabled = currentExamQuestion === 0; assessmentNext.hidden = currentExamQuestion === QUESTIONS.length - 1; assessmentSubmit.hidden = currentExamQuestion !== QUESTIONS.length - 1; assessmentError.textContent = ""; renderDots();
}
document.querySelector("#start-assessment").addEventListener("click", () => { ensureAnswers(); const unanswered = currentProfile.answers.findIndex((answer) => answer === null); currentExamQuestion = unanswered >= 0 ? unanswered : 0; showSlide(124); renderAssessment(); });
assessmentPrevious.addEventListener("click", () => { currentExamQuestion -= 1; renderAssessment(); });
assessmentNext.addEventListener("click", () => { currentExamQuestion += 1; renderAssessment(); });
function certificateId() { const initials = `${currentProfile.firstName[0]}${currentProfile.lastName[0]}`.toUpperCase(); const stamp = new Date(currentProfile.completedAt).toISOString().slice(0, 10).replaceAll("-", ""); let hash = 0; for (const character of currentProfileId) hash = ((hash << 5) - hash + character.charCodeAt(0)) >>> 0; return `LF-FHS-${stamp}-${initials}${String(hash).slice(-4).padStart(4, "0")}`; }
function buildCalendarLink() { if (!currentProfile.dueAt) return; const due = new Date(currentProfile.dueAt); const next = new Date(due); next.setDate(next.getDate() + 1); const compact = (date) => date.toISOString().slice(0, 10).replaceAll("-", ""); const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//La Fromagerie//Food Hygiene Training//EN", "BEGIN:VEVENT", `UID:${currentProfile.certificateId}@lafromagerie.co.uk`, `DTSTART;VALUE=DATE:${compact(due)}`, `DTEND;VALUE=DATE:${compact(next)}`, "SUMMARY:La Fromagerie food hygiene refresher suggested", "DESCRIPTION:Food Hygiene & Safety refresher training is suggested within two years of completion.", "END:VEVENT", "END:VCALENDAR"].join("\r\n"); document.querySelector("#calendar-reminder").href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); }
function renderResult() {
  if (!currentProfile) return; const passed = currentProfile.lastScore >= 24 && currentProfile.completedAt; const score = Number.isInteger(currentProfile.lastScore) ? currentProfile.lastScore : 0;
  document.querySelector("#result-score").textContent = `${score} / ${QUESTIONS.length}`; document.querySelector("#result-title").textContent = passed ? "Assessment passed" : "Assessment not yet passed";
  document.querySelector("#result-message").textContent = passed ? `Congratulations—you achieved ${Math.round(score / QUESTIONS.length * 100)}%. Your internal-training certificate is ready.` : "The pass mark is 24 out of 30. Review the course and try again when ready.";
  document.querySelector("#retake-assessment").hidden = passed; document.querySelector("#certificate-wrap").hidden = !passed; if (!passed) return;
  document.querySelector("#certificate-name").textContent = `${currentProfile.firstName} ${currentProfile.lastName}`; document.querySelector("#certificate-date").textContent = new Intl.DateTimeFormat("en-GB").format(new Date(currentProfile.completedAt)); document.querySelector("#certificate-score").textContent = `${Math.round(score / QUESTIONS.length * 100)}%`; document.querySelector("#certificate-id").textContent = currentProfile.certificateId; buildCalendarLink();
}
assessmentSubmit.addEventListener("click", () => {
  ensureAnswers(); const unanswered = currentProfile.answers.findIndex((answer) => answer === null); if (unanswered >= 0) { currentExamQuestion = unanswered; renderAssessment(); assessmentError.textContent = `Answer all questions before submitting. Question ${unanswered + 1} is incomplete.`; return; }
  const score = QUESTIONS.reduce((total, item, index) => total + (currentProfile.answers[index] === item.correct ? 1 : 0), 0); currentProfile.lastScore = score; currentProfile.attempts = (currentProfile.attempts || 0) + 1; currentProfile.lastAttemptAt = new Date().toISOString();
  if (score >= 24) { currentProfile.completedAt = new Date().toISOString(); const due = new Date(currentProfile.completedAt); due.setFullYear(due.getFullYear() + 2); currentProfile.dueAt = due.toISOString(); currentProfile.certificateId = certificateId(); }
  saveProfile(); updateLearnerStatus(); showSlide(125);
});
document.querySelector("#retake-assessment").addEventListener("click", () => { currentProfile.answers = Array(QUESTIONS.length).fill(null); currentProfile.lastScore = null; currentExamQuestion = 0; saveProfile(); showSlide(124); renderAssessment(); });
document.querySelector("#print-certificate").addEventListener("click", () => window.print());
document.querySelector("#download-certificate").addEventListener("click", () => {
  const canvas = document.createElement("canvas"); canvas.width = 3508; canvas.height = 2480;
  const context = canvas.getContext("2d"); const blue = "#1c5e75"; const rind = "#9a4a1f"; const ink = "#333138"; const paper = "#fffaf0";
  context.fillStyle = paper; context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = blue; context.lineWidth = 22; context.strokeRect(70, 70, 3368, 2340); context.lineWidth = 5; context.strokeRect(105, 105, 3298, 2270);
  context.strokeStyle = rind; context.lineWidth = 3;
  for (let i = 0; i < 8; i += 1) { context.beginPath(); context.arc(175 + i * 32, 175, 13, 0, Math.PI * 2); context.stroke(); context.beginPath(); context.arc(3333 - i * 32, 2305, 13, 0, Math.PI * 2); context.stroke(); }
  const centre = canvas.width / 2; context.textAlign = "center"; context.fillStyle = blue;
  context.font = "700 90px Arial"; context.fillText("LA FROMAGERIE", centre, 300);
  context.fillStyle = ink; context.font = "600 45px Arial"; context.fillText("CERTIFICATE OF ACHIEVEMENT", centre, 400);
  context.strokeStyle = rind; context.lineWidth = 4; context.beginPath(); context.moveTo(1050, 455); context.lineTo(2458, 455); context.stroke();
  context.fillStyle = rind; context.font = "700 150px Georgia"; context.fillText(`${currentProfile.firstName} ${currentProfile.lastName}`, centre, 710);
  context.fillStyle = ink; context.font = "46px Georgia"; context.fillText("has successfully passed the internal", centre, 835);
  context.font = "700 90px Georgia"; context.fillText("Food Safety Training", centre, 950);
  const percent = Math.round(currentProfile.lastScore / QUESTIONS.length * 100); context.font = "italic 52px Georgia"; context.fillText(`with a score of ${percent}%`, centre, 1060);
  context.font = "italic 36px Georgia"; context.fillText("Intended to be equivalent to a Level 2 course", centre, 1140);
  context.font = "36px Georgia"; context.fillText("Proudly presented by", centre, 1370);
  context.font = "italic 82px cursive"; context.fillStyle = blue; context.fillText("M. Sparrow", 1100, 1570); context.fillText("Patricia Michelson", 2408, 1570);
  context.fillStyle = ink; context.font = "700 42px Arial"; context.fillText("Michael Sparrow", 1100, 1660); context.fillText("Patricia Michelson", 2408, 1660);
  context.font = "36px Arial"; context.fillText("Quality Control and Author", 1100, 1715); context.fillText("Owner and Director", 2408, 1715);
  context.strokeStyle = ink; context.lineWidth = 2; context.beginPath(); context.moveTo(650, 1590); context.lineTo(1550, 1590); context.moveTo(1958, 1590); context.lineTo(2858, 1590); context.stroke();
  context.textAlign = "left"; context.font = "34px Arial"; context.fillText(`Completed: ${new Intl.DateTimeFormat("en-GB").format(new Date(currentProfile.completedAt))}`, 300, 2100); context.fillText("Suggested refresher: within 2 years of completion", 300, 2160);
  context.textAlign = "right"; context.font = "28px Arial"; context.fillText(`Certificate: ${currentProfile.certificateId}`, 3208, 2160);
  const link = document.createElement("a"); link.download = `La-Fromagerie-Food-Safety-${currentProfile.firstName}-${currentProfile.lastName}.png`; link.href = canvas.toDataURL("image/png"); link.click();
});
document.addEventListener("keydown", (event) => { if (courseApp.hidden || currentSlide === 124 || ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return; if (["ArrowRight", "PageDown"].includes(event.key)) { event.preventDefault(); showSlide(currentSlide + 1); } if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); showSlide(currentSlide - 1); } if (event.key === "Home") { event.preventDefault(); showSlide(0); } if (event.key === "End") { event.preventDefault(); showSlide(TOTAL_SLIDES - 1); } });
if (sessionStorage.getItem(ACCESS_KEY) === "open") unlock();
