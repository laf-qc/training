import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("const ASSESSMENT_VERSION =");
const end = source.indexOf("let QUESTIONS = [];") + "let QUESTIONS = [];".length;
if (start < 0 || end < start) throw new Error("Question bank block was not found");

const context = {};
vm.runInNewContext(`${source.slice(start, end)}; this.bank = QUESTION_BANK; this.draw = MODULE_DRAW;`, context);
const bank = context.bank;
const ids = new Set(bank.map((item) => item.id));
const failures = [];
if (bank.length !== 40) failures.push(`Expected 40 banked questions; found ${bank.length}`);
if (ids.size !== bank.length) failures.push("Question IDs are not unique");
if (Object.values(context.draw).reduce((sum, count) => sum + count, 0) !== 30) failures.push("Blueprint does not draw 30 questions");
for (const item of bank) {
  if (item.options.length !== 4) failures.push(`${item.id} does not have four options`);
  if (!Number.isInteger(item.correct) || item.correct < 0 || item.correct > 3) failures.push(`${item.id} has an invalid key`);
}
const scenarioCount = bank.filter((item) => item.type === "scenario").length;
const lengthGiveaways = bank.filter((item) => { const correctLength = item.options[item.correct].length; const longestWrong = Math.max(...item.options.filter((_, index) => index !== item.correct).map((option) => option.length)); return correctLength >= longestWrong * 1.25; });
const minimumScenarios = Object.entries(context.draw).reduce((total, [module, draw]) => {
  const recallCount = bank.filter((item) => item.module === module && item.type !== "scenario").length;
  return total + Math.max(0, draw - recallCount);
}, 0);
if (minimumScenarios < 15) failures.push(`A draw could contain only ${minimumScenarios} scenarios`);
if (lengthGiveaways.length > 4) failures.push(`${lengthGiveaways.length} answers are at least 25% longer than every distractor: ${lengthGiveaways.map((item) => item.id).join(", ")}`);

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exit(1);
}
console.log(`PASS ${bank.length} unique four-option questions`);
console.log(`PASS ${scenarioCount} scenario questions in bank; every draw contains at least ${minimumScenarios}`);
console.log(`PASS ${lengthGiveaways.length} potential answer-length giveaways (maximum 4)`);
console.log("PASS balanced 30-question module blueprint");
