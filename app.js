const ACCESS_KEY = "lf-training-access";
const ACCESS_PHRASE_HASH = "3889e6c049489fc3c748b912de47aa167c0421940aa3f3347a4870160dcf980d";
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
slides.forEach((slide) => { slide.tabIndex = 0; slide.setAttribute("role", "region"); slide.setAttribute("aria-label", slide.dataset.label || "Course slide"); });
let currentSlide = 0;
let currentProfileId = null;
let currentProfile = null;
let currentExamQuestion = 0;

const ASSESSMENT_VERSION = 2;
const ASSESSMENT_SIZE = 30;
const MODULE_DRAW = { "Module 1": 4, "Module 2": 4, "Module 3": 4, "Module 4": 4, "Module 5": 4, "Module 6": 4, "Module 7": 3, "Module 8": 3 };
const q = (id, module, type, question, options, correct) => ({ id, module, type, question, options, correct });
const QUESTION_BANK = [
  q("m1-01","Module 1","scenario","A display fridge reads 9°C during a busy service. What should you do first?",["Move the reading to tomorrow's record","Pause sale, protect the food and report it","Turn the display down and carry on","Wait until the queue has cleared"],1),
  q("m1-02","Module 1","scenario","A required opening check was missed. What is the honest response?",["Enter the target value from memory","Leave the record blank without telling anyone","Record the missed check and action taken","Copy yesterday's result into the space"],2),
  q("m1-03","Module 1","recall","Who is responsible for food safety at work?",["Only the manager on duty","Only employees handling open food","The business and every food handler","Only the local authority officer"],2),
  q("m1-04","Module 1","scenario","A cheese is past its opened shelf life but looks perfect. What should you do?",["Use it because appearance is normal","Taste it before deciding whether to sell","Follow the shelf-life control and remove it","Relabel it with tomorrow's date"],2),
  q("m1-05","Module 1","scenario","A manager asks you to record a check you did not perform. What should you do?",["Record the target because they authorised it","Refuse, protect the food and escalate","Initial it but add a question mark","Complete it later when the store is quiet"],1),

  q("m2-01","Module 2","recall","Which list contains the four main hazard types?",["Temperature, time, moisture and acidity","Suppliers, premises, equipment and employees","Microbiological, allergenic, chemical and physical","Cooking, chilling, cleaning and cross-contamination"],2),
  q("m2-02","Module 2","scenario","A piece of cracked display plastic is missing beside open cheese. What hazard is this?",["A physical contamination hazard","A chemical contamination hazard","A temperature-control hazard","A stock-rotation hazard"],0),
  q("m2-03","Module 2","scenario","Cut soft cheese is left warm for several hours. Which change would most slow bacterial growth?",["Move it into brighter light","Return it to approved refrigeration","Wrap it in a second paper layer","Place it beside a drier cheese"],1),
  q("m2-04","Module 2","scenario","A pregnant customer asks whether a raw-milk cheese is safe for them. What should you do?",["Give a personal opinion from experience","Promise that refrigeration removes the risk","Check approved information and refer to NHS advice","Say all raw-milk cheese is legally prohibited"],2),
  q("m2-05","Module 2","recall","Why do use-by and opened-life controls matter for Listeria?",["Listeria can grow slowly in a fridge","Listeria grows only above 63°C","Dates remove allergens from cheese","Cold storage kills all Listeria immediately"],0),

  q("m3-01","Module 3","scenario","You take a cash payment and are asked to cut open cheese. What comes first?",["Put on gloves over unwashed hands","Wipe hands on a disposable cloth","Wash and dry hands correctly","Ask the customer to hold the packaging"],2),
  q("m3-02","Module 3","scenario","A glove tears while wrapping ready-to-eat food. What should you do?",["Put a second glove over the torn one","Finish the item and change it afterwards","Remove it, wash hands and use a fresh glove","Wash the glove and continue the task"],2),
  q("m3-03","Module 3","scenario","Vomiting stopped at 10:00 on Monday. What is the earliest usual return to open-food work?",["10:00 on Tuesday after 24 hours","10:00 on Wednesday after 48 hours","The next shift if gloves are worn","Immediately after symptoms are medicated"],1),
  q("m3-04","Module 3","recall","Which personal-hygiene rule is correct?",["Clear nail varnish is allowed","A watch is allowed beneath a glove","A plain wedding band is the exception","False nails are allowed if kept short"],2),
  q("m3-05","Module 3","scenario","A blue dressing is missing after six cheeses were wrapped. What should happen?",["Replace it and continue immediately","Stop, protect the food and report it","Search only after the shift has finished","Sell the wrapped pieces if they look normal"],1),

  q("m4-01","Module 4","scenario","A customer has an egg allergy and the due-diligence record is missing. What should you say?",["The usual recipe can be described from memory","Visible egg can be removed before the food is served","Safety cannot be confirmed until approved information is found","A manager can approve the food by tasting a small portion"],2),
  q("m4-02","Module 4","scenario","A customer appears to be having anaphylaxis. What is the first emergency action?",["Call 999 and say anaphylaxis","Ask them to walk outside for air","Offer water and wait five minutes","Remove the suspected food from view"],0),
  q("m4-03","Module 4","recall","What must a PPDS sandwich label include?",["A food name, selling price and preparation date","A verbal allergen warning provided at the till","A food name, full ingredients and emphasised allergens","An allergen list without the remaining ingredients"],2),
  q("m4-04","Module 4","scenario","A knife used on walnut-coated cheese is wiped before another cheese. What is the remaining risk?",["Allergen cross-contact on the knife","Loss of refrigeration in the display","Incorrect stock rotation by date","Chemical contamination from packaging"],0),
  q("m4-05","Module 4","scenario","A customer asks whether a dish is guaranteed gluten-free. What is the correct response?",["Guarantee it whenever wheat is absent from the recipe","Explain that La Fromagerie makes no formal free-from claim","Remove bread and crumbs from the completed dish before service","Explain that thorough cooking destroys any gluten present"],1),

  q("m5-01","Module 5","scenario","A disinfectant label requires 30 seconds' contact, but a colleague wipes it off immediately. What should happen?",["Accept it because the surface looks clean","Apply the approved method for the full contact time","Use double strength on the next surface","Record the surface as disinfected anyway"],1),
  q("m5-02","Module 5","recall","Why must cleaning happen before disinfection?",["Dirt and grease can block the disinfectant","Cleaning raises the food temperature","Disinfection works only on dry floors","Cleaning replaces the required contact time"],0),
  q("m5-03","Module 5","scenario","You find pest droppings beside packaged food. What should you do?",["Clean the visible droppings and continue normal trading","Place additional pest bait beside the packaged food","Report them and isolate any food that may be affected","Wash the outside of each pack and return it to sale"],2),
  q("m5-04","Module 5","scenario","One cloth is used on the till and then a cheese board. What is the main concern?",["It may spread microorganisms and allergens","It may change the cheese use-by date","It may cool the board too quickly","It may make the till receipt unreadable"],0),
  q("m5-05","Module 5","recall","What information controls the safe use of an approved chemical?",["The colour, smell and foam produced by the solution","Label instructions and current COSHH information","The strongest dilution that can be prepared safely","The cleaning method most colleagues normally prefer"],1),

  q("m6-01","Module 6","scenario","The centre of a quiche reads 62°C during cooking. What should you do?",["Serve it because the crust is browned","Continue cooking and check the centre again","Average the centre with the hot edge","Record 70°C because that is the target"],1),
  q("m6-02","Module 6","recall","Which is a recognised thorough-cooking combination?",["63°C for 10 seconds","70°C for 2 minutes","65°C for 30 seconds","50°C for 5 minutes"],1),
  q("m6-03","Module 6","scenario","Hot-held food has been below 63°C for two hours. What should happen?",["Reset the two-hour period after stirring","Cool rapidly to 8°C or below or discard it","Leave it until the end of service","Mix it into a newly cooked batch"],1),
  q("m6-04","Module 6","scenario","A cheese needs ambient display for an event. What must happen first?",["Use the general four-hour allowance","Ask the manager to check the product specification","Judge the limit from texture and smell","Copy the display time used for hard cheese"],1),
  q("m6-05","Module 6","recall","What is La Fromagerie's refrigeration operating target?",["5°C or below","8°C exactly","10°C or below","63°C or above"],0),

  q("m7-01","Module 7","scenario","A chilled delivery measures 10°C. What should you do?",["Accept it and refrigerate it quickly","Isolate or reject it under the delivery procedure","Subtract the room temperature from the reading","Relabel it as ambient-stable stock"],1),
  q("m7-02","Module 7","scenario","Newer sandwiches expire before older stock. Which should be used first?",["The older delivery under FIFO","The newer delivery under FEFO","Whichever is nearest the till","Both at the same time regardless of date"],1),
  q("m7-03","Module 7","recall","What does FIFO mean?",["First inspection, final outcome","Food in, food out","First in, first out","First item, first opened"],2),
  q("m7-04","Module 7","scenario","A cheese has mould that is not normal for the product. What should happen?",["Trim it without recording the issue","Isolate it and ask for an authorised decision","Mix it with a strongly flavoured cheese","Sell it as a naturally moulded product"],1),
  q("m7-05","Module 7","scenario","A cut cheese needs a discard date. Where should staff check the approved life?",["A colleague's memory","The cheese-room shelf-life table or log","The longest supplier date on any cheese","The date used by another store last year"],1),

  q("m8-01","Module 8","scenario","A safe method no longer matches the actual process. What should you do?",["Keep using it until the next annual review","Invent a replacement that seems practical","Pause affected work and report the change","Remove the written method from the folder"],2),
  q("m8-02","Module 8","recall","What does corrective action mean?",["What you do when a control fails","A correction made only to spelling","A routine check with a normal result","A target written before the work starts"],0),
  q("m8-03","Module 8","scenario","A recall notice names a batch still on display. What should happen first?",["Wait for a customer to return it","Stop sale and isolate the affected batch","Discount it before the notice spreads","Remove the batch label and keep selling"],1),
  q("m8-04","Module 8","recall","What does traceability allow the business to do?",["Follow a product through suppliers, batches and destinations","Decide whether food is safe from its appearance and smell","Replace an inaccurate delivery record with the target value","Avoid recording where stock was transferred between stores"],0),
  q("m8-05","Module 8","scenario","A recall needs escalation. Who should be informed?",["Only the colleague who accepted delivery","The warehouse and Technical Manager, or your manager","Only customers who already complained","The supplier after all stock has been sold"],1)
];
let QUESTIONS = [];

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function readProfiles() { try { return JSON.parse(localStorage.getItem(PROFILES_KEY)) || {}; } catch { return {}; } }
function saveProfile() { if (!currentProfileId || !currentProfile) return; const profiles = readProfiles(); profiles[currentProfileId] = currentProfile; localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); }
function shuffled(values) { const copy = [...values]; for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; }
const QUESTION_BY_ID = new Map(QUESTION_BANK.map((item) => [item.id, item]));
function createAssessmentAttempt() {
  const selected = Object.entries(MODULE_DRAW).flatMap(([module, count]) => shuffled(QUESTION_BANK.filter((item) => item.module === module)).slice(0, count));
  currentProfile.assessmentVersion = ASSESSMENT_VERSION; currentProfile.examOrder = shuffled(selected).map((item) => item.id); currentProfile.optionOrders = {};
  currentProfile.examOrder.forEach((id) => { currentProfile.optionOrders[id] = shuffled([0, 1, 2, 3]); });
  currentProfile.answers = Array(ASSESSMENT_SIZE).fill(null); currentProfile.lastScore = null; saveProfile();
}
function prepareAssessment() {
  const validOrder = currentProfile?.assessmentVersion === ASSESSMENT_VERSION && Array.isArray(currentProfile.examOrder) && currentProfile.examOrder.length === ASSESSMENT_SIZE && currentProfile.examOrder.every((id) => QUESTION_BY_ID.has(id) && Array.isArray(currentProfile.optionOrders?.[id]) && currentProfile.optionOrders[id].length === 4);
  if (!validOrder) createAssessmentAttempt();
  QUESTIONS = currentProfile.examOrder.map((id) => { const item = QUESTION_BY_ID.get(id); const order = currentProfile.optionOrders[id]; return { ...item, options: order.map((index) => item.options[index]), correct: order.indexOf(item.correct) }; });
}
function learnerId(firstName, lastName) { return `${firstName.trim().toLocaleLowerCase("en-GB")}|${lastName.trim().toLocaleLowerCase("en-GB")}`; }
function formatDate(value) { return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)); }
function completionSchedule(completedAt) { const due = new Date(completedAt); due.setFullYear(due.getFullYear() + 1); const validUntil = new Date(completedAt); validUntil.setFullYear(validUntil.getFullYear() + 2); return { dueAt: due.toISOString(), validUntil: validUntil.toISOString() }; }
function migrateCompletionSchedule(profile) { if (!profile.completedAt) return false; const schedule = completionSchedule(profile.completedAt); if (profile.dueAt === schedule.dueAt && profile.validUntil === schedule.validUntil) return false; profile.dueAt = schedule.dueAt; profile.validUntil = schedule.validUntil; return true; }
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
  document.body.classList.remove("certificate-print-ready");
  currentSlide = Math.max(0, Math.min(index, TOTAL_SLIDES - 1));
  presentation.classList.toggle("assessment-mode", currentSlide >= 124);
  slides.forEach((slide, i) => { const active = i === currentSlide; slide.hidden = !active; slide.classList.toggle("is-active", active); slide.setAttribute("aria-hidden", String(!active)); });
  railLinks.forEach((link) => { const start = Number(link.dataset.slideTarget); const end = Number(link.dataset.slideEnd || start); const current = currentSlide >= start && currentSlide <= end; link.classList.toggle("is-current", current); if (current) link.setAttribute("aria-current", "step"); else link.removeAttribute("aria-current"); });
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === TOTAL_SLIDES - 1;
  nextButton.textContent = currentSlide === TOTAL_SLIDES - 1 ? (currentProfile?.completedAt ? "Course complete" : "Assessment incomplete") : "Continue";
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
function startCourse(profileId, profile) { currentProfileId = profileId; currentProfile = profile; if (migrateCompletionSchedule(profile)) saveProfile(); sessionStorage.setItem(CURRENT_LEARNER_KEY, profileId); learnerGate.hidden = true; courseApp.hidden = false; updateLearnerStatus(); showSlide(Number.isInteger(profile.slide) ? profile.slide : 0, false); presentation.focus({ preventScroll: true }); }
function unlock() { sessionStorage.setItem(ACCESS_KEY, "open"); gate.hidden = true; const id = sessionStorage.getItem(CURRENT_LEARNER_KEY); const profile = id ? readProfiles()[id] : null; if (profile) startCourse(id, profile); else { learnerGate.hidden = false; document.querySelector("#first-name").focus(); } }
function lock() { sessionStorage.removeItem(ACCESS_KEY); sessionStorage.removeItem(CURRENT_LEARNER_KEY); currentProfile = null; currentProfileId = null; learnerStatus.textContent = ""; courseApp.hidden = true; learnerGate.hidden = true; gate.hidden = false; phraseInput.value = ""; accessError.textContent = ""; phraseInput.focus(); }

accessForm.addEventListener("submit", async (event) => { event.preventDefault(); const candidate = phraseInput.value.trim(); if (!candidate) { accessError.textContent = "Enter the staff access phrase."; return; } if (await sha256(candidate) === ACCESS_PHRASE_HASH) unlock(); else { accessError.textContent = "That phrase was not recognised. Check capital letters or ask your manager."; phraseInput.select(); } });
learnerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const firstName = document.querySelector("#first-name").value.trim().replace(/\s+/g, " ");
  const lastName = document.querySelector("#last-name").value.trim().replace(/\s+/g, " ");
  if (firstName.length < 2 || lastName.length < 2) { learnerError.textContent = "Enter both your first and last name."; return; }
  const id = learnerId(firstName, lastName); const profiles = readProfiles();
  const profile = profiles[id] || { firstName, lastName, slide: 0, answers: Array(ASSESSMENT_SIZE).fill(null), attempts: 0 };
  profile.firstName = firstName; profile.lastName = lastName; profiles[id] = profile; localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); learnerError.textContent = ""; startCourse(id, profile);
});
document.querySelector("#lock-button").addEventListener("click", lock);
document.querySelector("#change-learner").addEventListener("click", () => { sessionStorage.removeItem(CURRENT_LEARNER_KEY); currentProfile = null; currentProfileId = null; courseApp.hidden = true; learnerGate.hidden = false; learnerForm.reset(); document.querySelector("#first-name").focus(); });
document.querySelector("#delete-learner-record").addEventListener("click", () => {
  const firstName = document.querySelector("#first-name").value.trim(); const lastName = document.querySelector("#last-name").value.trim();
  if (!firstName || !lastName) { learnerError.textContent = "Enter the saved first and last name you want to delete."; return; }
  const id = learnerId(firstName, lastName); const profiles = readProfiles();
  if (!profiles[id]) { learnerError.textContent = "No saved record with that name was found on this device."; return; }
  delete profiles[id]; localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); sessionStorage.removeItem(CURRENT_LEARNER_KEY); learnerForm.reset(); learnerError.textContent = "The saved record has been deleted from this device.";
});
learnerForm.addEventListener("input", () => { document.querySelector("#delete-learner-record").hidden = !(document.querySelector("#first-name").value.trim() && document.querySelector("#last-name").value.trim()); });
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
moduleChecks.forEach(([formId, fieldName, feedbackId, correctText]) => {
  const checkForm = document.querySelector(`#${formId}`); const feedback = document.querySelector(`#${feedbackId}`); const heading = checkForm.closest("[data-slide]")?.querySelector("h2");
  checkForm.setAttribute("role", "radiogroup"); if (heading?.id) checkForm.setAttribute("aria-labelledby", heading.id);
  const submit = checkForm.querySelector("button[type='submit']"); shuffled([...checkForm.querySelectorAll("label")]).forEach((label) => checkForm.insertBefore(label, submit));
  checkForm.addEventListener("submit", (event) => { event.preventDefault(); const answer = new FormData(checkForm).get(fieldName); if (!answer) { feedback.className = "answer-feedback is-incorrect"; feedback.textContent = "Choose an answer before continuing."; return; } const correct = answer === "b"; feedback.className = `answer-feedback ${correct ? "is-correct" : "is-incorrect"}`; feedback.innerHTML = correct ? `<strong>Correct.</strong> ${correctText}` : "<strong>Not quite.</strong> Review the safe response on the previous slides, then try again."; });
});

const assessmentPosition = document.querySelector("#assessment-position");
const assessmentModule = document.querySelector("#assessment-module");
const assessmentQuestion = document.querySelector("#assessment-question");
const assessmentForm = document.querySelector("#assessment-form");
const assessmentDots = document.querySelector("#assessment-dots");
const assessmentPrevious = document.querySelector("#assessment-previous");
const assessmentNext = document.querySelector("#assessment-next");
const assessmentSubmit = document.querySelector("#assessment-submit");
const assessmentError = document.querySelector("#assessment-error");
function ensureAnswers() { prepareAssessment(); if (!Array.isArray(currentProfile.answers) || currentProfile.answers.length !== ASSESSMENT_SIZE) { currentProfile.answers = Array(ASSESSMENT_SIZE).fill(null); saveProfile(); } }
function renderDots() { assessmentDots.innerHTML = QUESTIONS.map((_, index) => { const answered = currentProfile.answers[index] !== null; const current = index === currentExamQuestion; return `<button type="button" class="${answered ? "is-answered" : ""} ${current ? "is-current" : ""}" aria-label="Question ${index + 1}, ${answered ? "answered" : "not answered"}" ${current ? 'aria-current="step"' : ""}>${index + 1}</button>`; }).join(""); assessmentDots.querySelectorAll("button").forEach((button, index) => button.addEventListener("click", () => { currentExamQuestion = index; renderAssessment(true); })); }
function renderAssessment(moveFocus = false) {
  ensureAnswers(); const item = QUESTIONS[currentExamQuestion];
  assessmentPosition.textContent = `Question ${currentExamQuestion + 1} of ${QUESTIONS.length}`; assessmentModule.textContent = item.module; assessmentQuestion.textContent = item.question;
  assessmentForm.innerHTML = item.options.map((option, index) => `<label><input type="radio" name="assessment-answer" value="${index}" ${currentProfile.answers[currentExamQuestion] === index ? "checked" : ""}><span>${option}</span></label>`).join("");
  assessmentForm.querySelectorAll("input").forEach((input) => input.addEventListener("change", () => { currentProfile.answers[currentExamQuestion] = Number(input.value); saveProfile(); renderDots(); }));
  assessmentPrevious.disabled = currentExamQuestion === 0; assessmentNext.hidden = currentExamQuestion === QUESTIONS.length - 1; assessmentSubmit.hidden = currentExamQuestion !== QUESTIONS.length - 1; assessmentError.textContent = ""; renderDots(); if (moveFocus) assessmentQuestion.focus({ preventScroll: true });
}
document.querySelector("#start-assessment").addEventListener("click", () => { ensureAnswers(); const unanswered = currentProfile.answers.findIndex((answer) => answer === null); currentExamQuestion = unanswered >= 0 ? unanswered : 0; showSlide(124); renderAssessment(); });
assessmentPrevious.addEventListener("click", () => { currentExamQuestion -= 1; renderAssessment(true); });
assessmentNext.addEventListener("click", () => { currentExamQuestion += 1; renderAssessment(true); });
function certificateId() { const initials = `${currentProfile.firstName[0]}${currentProfile.lastName[0]}`.toUpperCase(); const stamp = new Date(currentProfile.completedAt).toISOString().slice(0, 10).replaceAll("-", ""); let hash = 0; for (const character of currentProfileId) hash = ((hash << 5) - hash + character.charCodeAt(0)) >>> 0; return `LF-FHS-${stamp}-${initials}${String(hash).slice(-4).padStart(4, "0")}`; }
function buildCalendarLink() { if (!currentProfile.dueAt) return; const due = new Date(currentProfile.dueAt); const next = new Date(due); next.setDate(next.getDate() + 1); const compact = (date) => date.toISOString().slice(0, 10).replaceAll("-", ""); const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//La Fromagerie//Food Hygiene Training//EN", "BEGIN:VEVENT", `UID:${currentProfile.certificateId}@lafromagerie.co.uk`, `DTSTART;VALUE=DATE:${compact(due)}`, `DTEND;VALUE=DATE:${compact(next)}`, "SUMMARY:La Fromagerie annual food hygiene refresher due", "DESCRIPTION:Internal Food Hygiene & Safety refresher training is due one year after completion.", "END:VEVENT", "END:VCALENDAR"].join("\r\n"); const reminder = document.querySelector("#calendar-reminder"); reminder.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); reminder.textContent = "Add annual refresher to calendar"; }
function renderResult() {
  if (!currentProfile) return;
  if (!Number.isInteger(currentProfile.passingScore) && currentProfile.completedAt && currentProfile.lastScore >= 24) { currentProfile.passingScore = currentProfile.lastScore; saveProfile(); }
  const passed = Number.isInteger(currentProfile.passingScore) && currentProfile.passingScore >= 24 && currentProfile.completedAt; const attempted = Number.isInteger(currentProfile.lastScore); const score = passed ? currentProfile.passingScore : (attempted ? currentProfile.lastScore : null);
  let failMessage = "The pass mark is 24 out of 30. Review the course and try again when ready.";
  if (!passed && attempted && currentProfile.assessmentVersion === ASSESSMENT_VERSION) { prepareAssessment(); const results = Object.keys(MODULE_DRAW).map((module) => { const indexes = QUESTIONS.map((item, index) => item.module === module ? index : -1).filter((index) => index >= 0); const correct = indexes.filter((index) => currentProfile.answers[index] === QUESTIONS[index].correct).length; return { module, correct, total: indexes.length, ratio: correct / indexes.length }; }); const lowest = Math.min(...results.map((result) => result.ratio)); const topics = results.filter((result) => result.ratio === lowest).map((result) => result.module.replace("Module ", "Module ")).join(" and "); failMessage = `The pass mark is 24 out of 30. Start your review with ${topics}, then revisit its recap and examples.`; }
  document.querySelector("#result-score").textContent = score === null ? "—" : `${score} / ${ASSESSMENT_SIZE}`; document.querySelector("#result-title").textContent = passed ? "Assessment passed" : (attempted ? "Assessment not yet passed" : "Assessment not attempted");
  document.querySelector("#result-message").textContent = passed ? `Congratulations—you achieved ${Math.round(score / ASSESSMENT_SIZE * 100)}%. Your pilot certificate is ready.` : (attempted ? failMessage : "Complete the assessment before a result or certificate can be issued.");
  const retakeButton = document.querySelector("#retake-assessment"); retakeButton.hidden = passed; retakeButton.textContent = (currentProfile.attempts || 0) >= 2 ? "Review with a manager before another attempt" : "Retake assessment"; document.querySelector("#certificate-wrap").hidden = !passed; if (!passed) return;
  migrateCompletionSchedule(currentProfile); saveProfile(); document.querySelector("#certificate-name").textContent = `${currentProfile.firstName} ${currentProfile.lastName}`; document.querySelector("#certificate-date").textContent = new Intl.DateTimeFormat("en-GB").format(new Date(currentProfile.completedAt)); document.querySelector("#certificate-score").textContent = `${Math.round(score / ASSESSMENT_SIZE * 100)}%`; document.querySelector("#certificate-id").textContent = currentProfile.certificateId; document.querySelector(".certificate-footer p:nth-child(2)").textContent = `Internal refresher due: ${formatDate(currentProfile.dueAt)} · Certificate valid until: ${formatDate(currentProfile.validUntil)}`; buildCalendarLink();
  if (currentSlide === TOTAL_SLIDES - 1) document.body.classList.add("certificate-print-ready");
}
assessmentSubmit.addEventListener("click", () => {
  ensureAnswers(); const unanswered = currentProfile.answers.findIndex((answer) => answer === null); if (unanswered >= 0) { currentExamQuestion = unanswered; renderAssessment(true); assessmentError.textContent = `Answer all questions before submitting. Question ${unanswered + 1} is incomplete.`; return; }
  const score = QUESTIONS.reduce((total, item, index) => total + (currentProfile.answers[index] === item.correct ? 1 : 0), 0); currentProfile.lastScore = score; currentProfile.attempts = (currentProfile.attempts || 0) + 1; currentProfile.lastAttemptAt = new Date().toISOString();
  if (score >= 24 && !currentProfile.completedAt) { currentProfile.passingScore = score; currentProfile.completedAt = new Date().toISOString(); Object.assign(currentProfile, completionSchedule(currentProfile.completedAt)); currentProfile.certificateId = certificateId(); }
  saveProfile(); updateLearnerStatus(); showSlide(125);
});
document.querySelector("#retake-assessment").addEventListener("click", () => { createAssessmentAttempt(); currentExamQuestion = 0; showSlide(124); renderAssessment(); });
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
  context.fillStyle = ink; context.font = "600 45px Arial"; context.fillText("CERTIFICATE OF COMPLETION · INTERNAL TRAINING", centre, 400);
  context.strokeStyle = rind; context.lineWidth = 4; context.beginPath(); context.moveTo(1050, 455); context.lineTo(2458, 455); context.stroke();
  context.fillStyle = rind; context.font = "700 150px Georgia"; context.fillText(`${currentProfile.firstName} ${currentProfile.lastName}`, centre, 710);
  context.fillStyle = ink; context.font = "46px Georgia"; context.fillText("has successfully passed the internal", centre, 835);
  context.font = "700 90px Georgia"; context.fillText("General Food Hygiene & Safety", centre, 950);
  const percent = Math.round(currentProfile.passingScore / ASSESSMENT_SIZE * 100); context.font = "italic 52px Georgia"; context.fillText(`with a score of ${percent}%`, centre, 1060);
  context.fillStyle = rind; context.font = "700 28px Arial"; context.fillText("PILOT · NOT A TRAINING RECORD", centre, 190);
  context.fillStyle = ink; context.font = "32px Arial"; context.fillText("Internal La Fromagerie training covering topics commonly taught in Level 2 food safety courses.", centre, 1140); context.font = "700 32px Arial"; context.fillText("This is not an accredited or regulated qualification.", centre, 1190);
  context.font = "36px Georgia"; context.fillText("Proudly presented by", centre, 1370);
  context.font = "500 116px 'Edwardian Script ITC', 'French Script MT', cursive"; context.fillStyle = blue; context.fillText("M. Sparrow", 1100, 1570);
  context.font = "600 88px 'Kunstler Script', 'Lucida Calligraphy', cursive"; context.fillStyle = blue; context.fillText("Patricia Michelson", 2408, 1570);
  context.fillStyle = ink; context.font = "700 42px Arial"; context.fillText("Michael Sparrow", 1100, 1660); context.fillText("Patricia Michelson", 2408, 1660);
  context.font = "36px Arial"; context.fillText("Quality Control and Author", 1100, 1715); context.fillText("Owner and Director", 2408, 1715);
  context.strokeStyle = ink; context.lineWidth = 2; context.beginPath(); context.moveTo(650, 1590); context.lineTo(1550, 1590); context.moveTo(1958, 1590); context.lineTo(2858, 1590); context.stroke();
  context.textAlign = "left"; context.font = "34px Arial"; context.fillText(`Completed: ${new Intl.DateTimeFormat("en-GB").format(new Date(currentProfile.completedAt))}`, 300, 2075); context.fillText(`Internal refresher due: ${formatDate(currentProfile.dueAt)}`, 300, 2135); context.fillText(`Certificate valid until: ${formatDate(currentProfile.validUntil)}`, 300, 2195);
  context.textAlign = "right"; context.font = "28px Arial"; context.fillText(`Course version: Pilot 0.9 · Certificate: ${currentProfile.certificateId}`, 3208, 2160);
  const link = document.createElement("a"); link.download = `La-Fromagerie-Food-Safety-${currentProfile.firstName}-${currentProfile.lastName}.png`; link.href = canvas.toDataURL("image/png"); link.click();
});
document.addEventListener("keydown", (event) => { if (courseApp.hidden || currentSlide === 124 || ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return; if (event.key === "ArrowRight") { event.preventDefault(); showSlide(currentSlide + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); showSlide(currentSlide - 1); } });
if (sessionStorage.getItem(ACCESS_KEY) === "open") unlock();
