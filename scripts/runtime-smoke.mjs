const targets = await fetch("http://127.0.0.1:9223/json").then((response) => response.json());
const target = targets.find((item) => item.type === "page" && item.url.startsWith("http://127.0.0.1:4173"));
if (!target) throw new Error("Local training page was not found in Chrome");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
let nextId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => { const message = JSON.parse(event.data); if (!message.id) return; const request = pending.get(message.id); if (!request) return; pending.delete(message.id); if (message.error) request.reject(new Error(message.error.message)); else request.resolve(message.result); });
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => { const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.text); return result.result.value; };
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

await send("Runtime.enable"); await send("Page.enable");
await evaluate(`localStorage.setItem('lf-training-profiles-v1', JSON.stringify({'test|learner':{firstName:'Test',lastName:'Learner',slide:0,answers:Array(30).fill(null),attempts:0}})); sessionStorage.setItem('lf-training-access','open'); sessionStorage.setItem('lf-current-learner','test|learner');`);
await send("Page.reload", { ignoreCache: true }); await wait(700);
await evaluate("showSlide(124); renderAssessment();");
const attempt = await evaluate(`({bank:QUESTION_BANK.length,draw:QUESTIONS.length,options:QUESTIONS.every(q=>q.options.length===4),scenarios:QUESTIONS.filter(q=>q.type==='scenario').length,saved:currentProfile.examOrder.length})`);
if (attempt.bank !== 40 || attempt.draw !== 30 || !attempt.options || attempt.scenarios < 15 || attempt.saved !== 30) throw new Error(`Assessment draw failed: ${JSON.stringify(attempt)}`);

await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 640, deviceScaleFactor: 1, mobile: true }); await wait(250);
const mobile = await evaluate(`(()=>{const heading=document.querySelector('#assessment-question');heading.scrollIntoView({block:'start'});const q=heading.getBoundingClientRect();const slide=document.querySelector('[data-slide="124"]');return {questionTop:q.top,questionBottom:q.bottom,viewport:innerHeight,text:heading.textContent.length,scrollTop:slide.scrollTop,scrollHeight:slide.scrollHeight,clientHeight:slide.clientHeight};})()`);
if (!mobile.text || mobile.questionTop < 0 || mobile.questionTop >= mobile.viewport) throw new Error(`Question is not reachable on mobile: ${JSON.stringify(mobile)}`);

await evaluate(`currentProfile.answers=QUESTIONS.map(item=>item.correct); saveProfile(); currentExamQuestion=29; renderAssessment(); document.querySelector('#assessment-submit').click();`); await wait(250);
const result = await evaluate(`({title:document.querySelector('#result-title').textContent,score:document.querySelector('#result-score').textContent,certificate:!document.querySelector('#certificate-wrap').hidden,printReady:document.body.classList.contains('certificate-print-ready')})`);
if (result.title !== "Assessment passed" || result.score !== "30 / 30" || !result.certificate || !result.printReady) throw new Error(`Pass flow failed: ${JSON.stringify(result)}`);

await evaluate(`document.querySelector('#lock-button').click()`); await wait(100);
const locked = await evaluate(`({gate:!document.querySelector('#access-gate').hidden,current:sessionStorage.getItem('lf-current-learner')})`);
if (!locked.gate || locked.current !== null) throw new Error(`Lock flow failed: ${JSON.stringify(locked)}`);
await evaluate(`localStorage.removeItem('lf-training-profiles-v1'); sessionStorage.clear();`);
socket.close();
console.log(`PASS browser assessment draw: ${JSON.stringify(attempt)}`);
console.log(`PASS mobile assessment question reachable: ${JSON.stringify(mobile)}`);
console.log(`PASS assessment/certificate flow: ${JSON.stringify(result)}`);
console.log("PASS Lock clears the current learner");
