# Decision log

## 2026-09-15 — D001: General foundation before department pathways

**Decision:** Build one shared general course first, then add cheese room, cafe/restaurant, and shop pathways.

**Why:** It establishes consistent safety language across all stores while allowing later modules to focus on genuinely role-specific controls.

## 2026-09-15 — D002: Internal completion certificate

**Decision:** The first certificate will say “Internal Training” and explicitly state that it is not an accredited Level 2 qualification.

**Why:** Comparable scope does not itself confer regulated accreditation.

## 2026-09-15 — D003: Private source repository first

**Decision:** Keep source private initially and make it public later after content approval and a secrets/privacy check.

**Why:** GitHub permits administrators to change repository visibility later. Private website access through GitHub Pages, however, is plan-dependent and is not guaranteed merely by making the repository private.

## 2026-09-15 — D004: Superseded — two-hour general course target

**Decision:** Plan 100 minutes of learning and a 20-minute assessment.

**Why:** This is long enough for meaningful applied coverage while remaining practical for rota-based completion. Timing will be validated with staff pilots.

Superseded by D009 after comparing CPD-certified course durations and regulated qualification specifications.

## 2026-09-15 — D005: Brand-complementary field-guide direction

**Decision:** Use a “cheesemonger's field guide” visual system based on the public site's cream, charcoal, blue, Source Sans Pro, uppercase tracked headings, and food-led imagery.

**Why:** It preserves brand recognition while giving safety instruction stronger hierarchy and clarity than a retail homepage needs.

## 2026-09-15 — D006: Lightweight access prompt for the pilot

**Decision:** Put a client-side staff access phrase in front of the static prototype, save access only for the browser session, request that search engines do not index it, and store no confidential learner data.

**Why:** It provides the requested casual deterrence on GitHub Pages while honestly recognising that client-side access control is not secure authentication.

## 2026-09-15 — D007: Review-gated delivery

**Decision:** Deliver Welcome, Module 1, Module 2, and Module 3 as separate review milestones. Do not open the next module until the previous milestone is approved.

**Why:** Early feedback on tone, pacing, and company-specific language will prevent rework across later modules.

## 2026-09-15 — D008: Presentation-style learning experience

**Decision:** Deliver the course as a full-viewport slide deck with one focused idea per slide, persistent progress, previous/continue controls, direct outline navigation, and keyboard arrow-key support.

**Why:** This creates a more deliberate training rhythm than a long scrolling page while keeping the course usable on phones and by keyboard.

## 2026-09-15 — D009: CPD Level 2-equivalent route

**Decision:** Target approximately 3–4 hours including a 25-minute, 30-question assessment, while mapping content to the breadth and expected understanding of established Level 2 food-safety specifications.

**Why:** Typical CPD-certified online Level 2 courses are commonly delivered in roughly 2–4 hours. This is distinct from the seven guided-learning hours of the regulated RSPH award and better matches La Fromagerie's intended CPD-first route.

## 2026-09-15 — D010: Hazard language and food-specific context

**Decision:** Teach four hazard categories—microbiological, allergenic, chemical and physical—before teaching controls in depth. Use ready-to-eat cheese, charcuterie, sandwiches, quiche, salads and desserts as shared-store examples.

**Why:** This maps directly to established Level 2 content while making the distinction between a hazard, its route and its control clear in La Fromagerie's context.

## 2026-10-05 — D011: Personal hygiene and fitness-for-work baseline

**Decision:** Base Module 3 on current Food Standards Agency guidance: effective handwashing at contamination points; clean protective clothing and controlled hair/jewellery; waterproof, brightly coloured dressings; immediate illness reporting; and the usual 48-hour exclusion after vomiting or diarrhoea stops naturally, subject to manager confirmation and any stricter diagnosis-specific advice.

**Why:** These are practical UK food-handler controls that apply across the cheese room, cafe/restaurant and shop. Company procedures may be stricter and will be confirmed during competent-person review.

## 2026-10-05 — D012: Allergen information and PPDS baseline

**Decision:** Teach all 14 regulated allergens, current approved-information checks, prevention of allergen cross-contact, and the different information duties for loose, prepacked and prepacked-for-direct-sale food. Present written allergen information supported by a customer conversation as best practice for non-prepacked food.

**Why:** La Fromagerie sells and serves food in each of these formats. This reflects current Food Standards Agency guidance while keeping the operational instruction clear: never guess, never remove an allergen and serve the same food, and do not claim safety when cross-contact cannot be controlled.

## 2026-10-05 — D013: Cleaning and chemical-safety baseline

**Decision:** Teach cleaning and disinfection as separate stages, with visible debris and grease removed before an approved disinfectant or sanitiser is used at its specified dilution and contact time. Include cleaning schedules, cloth control, safe chemical storage/use, waste, spill/breakage response and pest reporting.

**Why:** This aligns with Food Standards Agency Safer Food Better Business controls and HSE COSHH principles. Exact products, colour coding, protective equipment and machinery methods remain site-specific and must follow La Fromagerie procedures and manufacturer instructions.

## 2026-10-05 — D014: Temperature-control baseline

**Decision:** Teach refrigeration targeted at 5°C or below, an 8°C legal maximum for chilled food, hot holding at 63°C or above, and the recognised cooking combinations of 70°C for two minutes or 75°C for 30 seconds. Hot food may be below 63°C once for no more than two hours. Do not teach a general four-hour cold-display allowance: any ambient cheese display requires prior manager approval against the product specification.

**Why:** This reflects Food Standards Agency guidance while giving staff a safety margin and a clear response when readings drift. Product-specific cheese controls, validated cooking methods and any stricter La Fromagerie limits remain authoritative.

## 2026-10-05 — D015: Receiving, storage and date-control baseline

**Decision:** Teach delivery as an accept/isolate/reject control point; move temperature-controlled food promptly; store ready-to-eat food protected from raw food; and apply visible labelling, FEFO rotation and secure isolation. Treat use-by as a safety limit and best-before as a quality indicator, with company approval required for any sale or use decision after best-before.

**Why:** These controls preserve safety, identity, allergen and traceability information from receipt to sale. Exact receiving limits, secondary shelf lives, storage zoning and product-quality decisions must follow La Fromagerie’s approved procedures.

## 2026-10-05 — D016: Safe systems and record integrity

**Decision:** Present HACCP as a practical identify-control-check-act-review cycle. Require checks to be completed at the time, using the actual result and the learner’s own identity; missed checks and deviations must remain visible alongside corrective action. Include traceability, recalls, change control and escalation as shared food-handler responsibilities.

**Why:** Accurate records demonstrate whether controls worked and allow rapid action during an incident. Concealing or backfilling a failure removes the opportunity to protect food and prevents managers from identifying recurring system problems.

## 2026-10-05 — D017: Browser-local learner records for the pilot

**Decision:** Require first and last name before learning begins and store progress, assessment answers, attempts, completion and refresher date in browser local storage under that normalised name. Make the limitation explicit: the record stays on that browser, can be cleared, and is not secure identity verification or the official company register.

**Why:** This provides immediate resume capability on static GitHub Pages without collecting employee information on a server. A production release should move records to authenticated central storage.

## 2026-10-05 — D018: Assessment, certificate and refresher reminder

**Decision:** Use a 30-question assessment with a 24/30 (80%) pass mark. Passing creates a named internal-training certificate that is valid for two years. La Fromagerie’s internal refresher is due annually; the application stores the one-year due date, displays due/overdue status on return and provides an iCalendar reminder download.

**Why:** Calendar export and on-return status work without a backend. Reliable email or year-later push notifications require a central service or scheduled workflow and are deferred to the production learner-record phase.

## 2026-10-06 — D019: Confirmed La Fromagerie operating rules

**Decision:** Use “manager” as the learner-facing escalation role. Illness must be reported by phoning the store or manager before the next shift. Handwashing takes at least 20 seconds; false nails and nail varnish are prohibited; jewellery is limited to a plain wedding band; hair is tied back and required coverings are worn; phones stay away from food areas; and gloves never replace handwashing. Approved tasting uses a clean utensil each time, protected time-controlled samples and stated allergen information.

**Decision:** The slicer is restricted to ready-to-eat charcuterie and is never used for raw meat. Approved allergen information is held in the due-diligence records folder. La Fromagerie makes no formal allergen-free or gluten-free claims. PPDS controls apply to sandwiches. Product names for cleaning chemicals remain outside the course; staff use the current approved products, label instructions and COSHH information.

**Why:** These rules were confirmed by Michael Sparrow for the shared general course and replace vague references to an unspecified company procedure.

## 2026-10-06 — D020: Temperature, shelf-life, recall and SFBB controls

**Decision:** Use these company limits: refrigeration target 5°C or below; chilled deliveries 8°C or below; frozen deliveries frozen solid with no evidence of thawing; cooking 70°C for two minutes or 75°C for 30 seconds; hot holding 63°C or above; no more than one two-hour period below 63°C; cooling into refrigeration within 90 minutes; and reheating to 75°C for 30 seconds, once only.

**Decision:** The approved shelf-life table/log is kept in the cheese room. Recalls are escalated to the warehouse and Technical Manager, or immediately through the store manager. La Fromagerie’s food-safety management system is Safer Food, Better Business (SFBB).

**Why:** Stating the actual limits, record locations and escalation route lets staff apply the controls rather than being told only to find an unnamed procedure.

## 2026-10-07 — D022: Production release and training-record filing

**Decision:** Release the course as version 1.0 and remove pilot-only wording from the certificate and completion screen. Keep the statement that this internal course is not an accredited or regulated qualification. A learner downloads the named certificate after passing and sends it to their manager; the manager uploads it to the employee’s OneDrive training folder as the retained training record.

**Why:** Browser-local progress supports resuming the course but is not a central company register. Retaining the certificate in the controlled employee training folder gives managers a reviewable record while a future central completion service is considered.

## 2026-10-06 — D021: Applied assessment and accessibility upgrade

**Decision:** Replace the fixed three-option examination with a versioned 40-item bank. Draw 30 questions to a balanced module blueprint, shuffle their order and shuffle answer choices while saving the exact attempt. Every question has four plausible options and every possible draw contains at least 18 applied scenarios. Preserve completed certificates; reset only incompatible unfinished assessment attempts.

**Decision:** Label radio groups and answered states programmatically, move focus when questions change, make scrolling slides keyboard-focusable, stop hijacking normal page-scroll keys, strengthen focus and contrast, preserve mobile navigation labels for assistive technology and collapse complex grids on narrow screens.

**Why:** A pass should demonstrate application rather than recognition of the longest answer, and colleagues using keyboards, zoom or assistive technology must be able to complete the same assessment independently.
