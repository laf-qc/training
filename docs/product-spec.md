# Product and layout specification

Version: 0.1  
Date: 15 September 2026  
Status: Working specification

## 1. Product statement

A concise, mobile-first food hygiene and safety course for every La Fromagerie colleague. It should feel recognisably La Fromagerie: knowledgeable, warm, exacting, and rooted in real food handling—not like generic compliance software.

The first course is the common foundation used by all three departments:

1. Cheese room — storage, display, cutting, wrapping, sampling, and sale of artisan cheese.
2. Cafe/restaurant — front of house and, at relevant stores, full restaurant-kitchen service.
3. Shop — retail food, ambient and chilled products, and at one store a limited sandwich, sausage-roll, and quiche offer.

Department pathways will later add role-specific content without repeating the shared foundation.

## 2. Audience and outcome

Primary learners are new and existing food handlers, including colleagues whose first language may not be English. Managers need a simple way to confirm completion and retain a training record.

By the end, a learner should be able to recognise common hazards, explain the controls used at La Fromagerie, make safe day-to-day choices, and know when to stop and ask a manager.

## 3. Scope boundaries

### Release 1 includes

- General course, approximately 3–4 hours including a 25-minute assessment.
- Short, sequential cards with knowledge checks and module recaps.
- A scored final quiz, pass/fail result, retry pathway, and completion certificate.
- Examples spanning cheese room, cafe/restaurant, and shop.
- Responsive desktop and phone layouts; keyboard access and readable plain English.
- Progress saved on the learner's device for the first prototype.

### Later releases

- Cheese-room pathway.
- Cafe/restaurant front-of-house and kitchen pathways.
- Shop pathway, with variants for limited hot-food and full-kitchen stores.
- Manager dashboard, central learner records, sign-in, expiry reminders, and reporting.
- Translations, if required after staff-language review.

### Not claimed

The course can be described as **La Fromagerie internal food hygiene and safety training, aligned in breadth with Level 2 topics**. A generated certificate is evidence of internal course completion, not an accredited regulated qualification. Any future accreditation claim needs an awarding/assessment arrangement and separate review.

## 4. Learner journey

1. **Welcome** — course purpose, approximate duration, accessibility/help, and the internal-training disclaimer.
2. **Identify** — learner enters their name and selects store and department. In the prototype this data remains on the device.
3. **Learn** — modules appear in order; each displays duration and progress.
4. **Practise** — scenario and knowledge-check cards give immediate explanatory feedback.
5. **Recap** — every module ends with a short, printable mental checklist.
6. **Assessment** — 30 randomised questions drawn across all learning outcomes.
7. **Result** — pass at 80%; missed topics are explained without exposing a reusable answer sheet.
8. **Certificate** — available only after passing; includes learner, course, completion date, score, certificate ID, version, and disclaimer.

## 5. Course/card pattern

Each module follows the same rhythm:

```text
Module N · title · duration
  Intro card — why this matters here
  Information card(s) — one idea per card
  Visual/example card — a La Fromagerie situation
  Check card — one decision with feedback
  Information/practice card(s)
  Recap card — 3–5 actions to remember
```

Card rules:

- Target 40–90 words per information card.
- One learning objective or decision per card.
- Use “what would you do?” scenarios rather than trivia.
- Explain why an answer is safe or unsafe.
- Use progressive reveal for diagrams, not decorative animation.
- “Back” remains available; assessment answers lock only when submitted.

## 6. Information architecture

```text
/
├── course/general
│   ├── module/:moduleId
│   ├── recap/:moduleId
│   └── assessment
├── result
├── certificate/:certificateId
├── accessibility
└── privacy
```

For the first static prototype, these may be views in a single-page application so GitHub Pages can host it reliably. URLs and data structures should remain ready for multiple courses.

## 7. Page layouts

### Course home

- Compact La Fromagerie masthead.
- “General Food Hygiene & Safety” as the primary title.
- Course duration, progress, and resume/start action in the first viewport.
- Module list with duration and status: not started, in progress, complete.
- Department pathways shown as “coming next,” without implying they are available.

### Learning view

- Desktop: slim module rail on the left; focused card in the centre; progress at top.
- Mobile: top progress bar, card, then fixed previous/continue controls.
- Maximum reading width around 680px.
- Persistent “Stop and ask a manager” treatment for uncertain high-risk decisions.

### Assessment

- One question per screen.
- Visible question count and saved progress.
- Single-choice, multiple-choice, ordering, and image hotspot/selection patterns.
- No colour-only correctness signals; text and icon reinforce status.

### Result and certificate

- Clear pass/not-yet result.
- Topic-level remediation links for unsuccessful attempts.
- Certificate designed for A4 printing and PDF export.
- Certificate verification is explicitly “internal record” until a central database exists.

## 8. Visual direction

### Thesis

**The cheesemonger's field guide:** quiet editorial confidence, cream paper, charcoal ink, documentary food photography, fine rules, and precise instructional diagrams.

### Observed brand cues

The current public site uses Source Sans Pro, a warm cream page background, charcoal copy, widely tracked uppercase headings, restrained blue links, a muted grey wordmark, and large food/location photography. The learning site should complement those cues while improving contrast, hierarchy, and task focus.

### Working tokens

| Role | Value | Use |
|---|---:|---|
| Paper | `#FFFAEF` | Primary background |
| Ink | `#333138` | Main text and controls |
| Slate | `#777671` | Secondary text; verify contrast before use |
| Blue | `#1C5E75` | Links, focus, active state |
| Whey | `#F1E8D5` | Panels and diagram fields |
| Rind | `#9A4A1F` | Warnings and emphasis, sparingly |
| Safe | `#356447` | Confirmed safe state with icon/text |

Typography: Source Sans Pro where licensed/served appropriately, with a system sans-serif fallback. Headings use semibold uppercase sparingly with approximately `0.08–0.1em` tracking; body copy stays sentence case at 16–18px.

### Graphic language

- Original, simplified instructional illustrations with flat paper-cut shapes and charcoal outlines.
- First graphic set: contamination journey, handwashing sequence, fridge/storage zoning, clean/disinfect sequence, and allergen conversation/escalation.
- Diagrams label the hazard, route, control, and safe outcome.
- Photographs are used for atmosphere or location recognition, not as the sole teaching device.
- Never rely on the common coloured-chopping-board convention unless it matches La Fromagerie's actual policy.

## 9. Assessment specification

- 30 questions, balanced across every module and major learning outcome.
- Recommended pass mark: 80% (24/30), subject to management and future CPD-review approval.
- Randomise question order and options where meaning is preserved.
- At least half the bank should be applied workplace scenarios.
- Critical topics—illness reporting, allergens, ready-to-eat/raw separation, time/temperature control, and chemical safety—must appear in every attempt.
- After an unsuccessful attempt, route the learner to relevant recap cards before retrying.
- Unlimited prototype retries; store attempt count and best/latest score.
- Current question bank: 40 reviewed four-option items, with a balanced random draw of 30 and at least 18 applied scenarios in every possible draw.
- Every item records objective, correct rationale, distractor rationale, source, reviewer, and review date.

## 10. Certificate specification

Certificate fields:

- La Fromagerie name/mark.
- “General Food Hygiene & Safety — Internal Training”.
- Learner's full name.
- Store and department at time of completion.
- Completion date, score, course version, and unique certificate ID.
- Signatory or “authorised by” field after management approval.
- Footer: “Evidence of completion of La Fromagerie internal training. This is not an accredited Level 2 qualification.”

The first version can generate a printable certificate locally. A later authenticated version should create an immutable completion record server-side; a PDF alone is not robust proof.

## 11. Accessibility, privacy, and content standards

- Aim for WCAG 2.2 AA: keyboard operation, visible focus, semantic headings, sufficient contrast, captions/alternatives, 200% text zoom, and no time-limited reading.
- Plain English, short sentences, and defined terms; avoid unexplained acronyms.
- Decorative images have empty alt text; instructional graphics receive equivalent text explanations.
- Ask only for data needed for completion records.
- Do not store employee dates of birth or unnecessary personal details.
- Publish a privacy notice before centralised learner tracking is introduced.

## 12. Hosting decision

Start with a **private repository**. It can later be changed to public by an administrator, subject to organisation policy. GitHub Pages can build from a private repository on eligible paid plans, but that does **not** automatically make the Pages website private. Private Pages access control is an Enterprise Cloud organisation feature; on other plans the deployed site may be public even when its source repository is private.

Recommendation for this phase: keep the repository private and do not publish employee data. If private staff-only access is required before the public launch, use an authenticated host or confirm that the organisation has GitHub Enterprise Cloud Pages access control. When the course is approved, remove any secrets/internal-only material, switch repository/site visibility deliberately, rebuild, and re-test the URL.

## 13. Acceptance criteria for the first prototype

- A learner can start, leave, resume, complete all general modules, take the quiz, and print a certificate after passing.
- All module durations and completion states are visible.
- Each module contains at least one applied check and a recap.
- Quiz coverage and pass logic follow section 9.
- Phone and desktop layouts have no horizontal overflow and work by keyboard.
- Training content cites its controlling source internally and has a named competent reviewer.
- The product makes no claim of accreditation.
- No real learner data is committed to the repository.

## 14. Content governance

Before release, a La Fromagerie competent person must confirm local procedures: handwashing, illness reporting, allergen escalation, cleaning chemicals/contact times, probe use, delivery checks, refrigeration targets/limits, display times, date coding, waste/pest process, and who records corrective actions.

Review the course at least annually and whenever law, FSA guidance, suppliers, recipes, equipment, premises, or company procedures materially change. Course and certificate versions must stay linked.
