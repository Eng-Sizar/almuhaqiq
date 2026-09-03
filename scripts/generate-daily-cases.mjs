import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GoogleGenAI } from '@google/genai';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(scriptDirectory, '..');
const casesPath = join(projectRoot, 'src', 'data', 'cases', 'custom-cases.json');
const statePath = join(projectRoot, 'src', 'data', 'cases', 'daily-generation-state.json');
const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const validDifficulties = new Set(['سهل', 'متوسط', 'معقد', 'أسطوري']);
const validMessageTypes = new Set(['narrator', 'character', 'player', 'clue', 'system']);
const validClueCategories = new Set(['مادي', 'وثيقة', 'شهادة', 'علمي']);
const themes = ['فندق تراثي', 'قطار ليلي', 'متحف آثار', 'مسرح قديم', 'ميناء تجاري', 'مكتبة نادرة', 'قصر صحراوي'];
const retryableErrorPattern = /\b(429|500|502|503|504)\b|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand/i;

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value) => typeof value === 'string' && value.trim().length > 0;
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function cairoDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

function extractJson(text) {
  const withoutFence = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const first = withoutFence.indexOf('{');
  const last = withoutFence.lastIndexOf('}');
  if (first < 0 || last < first) throw new Error('Gemini لم يُرجع كائناً JSON صالحاً.');
  return JSON.parse(withoutFence.slice(first, last + 1));
}

function validateCase(candidate, expectedId, usedIds) {
  const errors = [];
  const needText = (object, field, label = field) => {
    if (!isText(object?.[field])) errors.push(`${label} مطلوب كنص غير فارغ.`);
  };

  if (!isRecord(candidate)) return ['القضية ليست كائناً JSON.'];
  if (candidate.id !== expectedId) errors.push(`id يجب أن يساوي ${expectedId}.`);
  if (!/^[a-z0-9_]+$/.test(candidate.id || '')) errors.push('id غير صالح.');
  if (usedIds.has(candidate.id)) errors.push('id مكرر مع قضية منشورة.');
  if (!Number.isInteger(candidate.number) || candidate.number < 1) errors.push('number يجب أن يكون رقماً صحيحاً موجباً.');

  ['title', 'subtitle', 'description', 'location', 'startNodeId'].forEach((field) => needText(candidate, field));
  if (!validDifficulties.has(candidate.difficulty)) errors.push('difficulty غير صالح.');

  if (!Array.isArray(candidate.suspects) || candidate.suspects.length < 3) {
    errors.push('يلزم ثلاثة مشتبهين على الأقل.');
  } else {
    const suspectIds = new Set();
    let culprits = 0;
    candidate.suspects.forEach((suspect, index) => {
      if (!isRecord(suspect)) return errors.push(`المشتبه ${index + 1} غير صالح.`);
      ['id', 'name', 'role', 'avatar', 'bio', 'alibi', 'motive'].forEach((field) => needText(suspect, field, `المشتبه ${index + 1}.${field}`));
      if (!/^[a-z0-9_]+$/.test(suspect.id || '') || suspectIds.has(suspect.id)) errors.push(`id المشتبه ${index + 1} غير صالح أو مكرر.`);
      suspectIds.add(suspect.id);
      if (suspect.isCulprit === true) culprits += 1;
      if (typeof suspect.interrogated !== 'boolean') errors.push(`interrogated للمشتبه ${index + 1} يجب أن يكون boolean.`);
      if (!Number.isInteger(suspect.suspicionLevel) || suspect.suspicionLevel < 1 || suspect.suspicionLevel > 5) errors.push(`suspicionLevel للمشتبه ${index + 1} يجب أن يكون بين 1 و5.`);
    });
    if (culprits !== 1) errors.push('يجب تحديد جانٍ واحد فقط.');
  }

  const clueIds = new Set();
  if (!Array.isArray(candidate.clues) || candidate.clues.length < 4) {
    errors.push('يلزم أربعة أدلة على الأقل.');
  } else {
    candidate.clues.forEach((clue, index) => {
      if (!isRecord(clue)) return errors.push(`الدليل ${index + 1} غير صالح.`);
      ['id', 'title', 'description', 'detail'].forEach((field) => needText(clue, field, `الدليل ${index + 1}.${field}`));
      if (!/^[a-z0-9_]+$/.test(clue.id || '') || clueIds.has(clue.id)) errors.push(`id الدليل ${index + 1} غير صالح أو مكرر.`);
      clueIds.add(clue.id);
      if (!validClueCategories.has(clue.category)) errors.push(`تصنيف الدليل ${index + 1} غير صالح.`);
    });
  }

  if (!Array.isArray(candidate.timeline) || candidate.timeline.length < 3) {
    errors.push('يلزم ثلاثة أحداث زمنية على الأقل.');
  } else {
    candidate.timeline.forEach((event, index) => {
      if (!isRecord(event)) return errors.push(`الحدث الزمني ${index + 1} غير صالح.`);
      ['id', 'time', 'description'].forEach((field) => needText(event, field, `الحدث الزمني ${index + 1}.${field}`));
      if (!Number.isInteger(event.order) || event.order < 1) errors.push(`ترتيب الحدث ${index + 1} غير صالح.`);
    });
  }

  if (!Array.isArray(candidate.deductions) || candidate.deductions.length < 2) {
    errors.push('يلزم استنتاجان على الأقل.');
  } else {
    candidate.deductions.forEach((deduction, index) => {
      if (!isRecord(deduction)) return errors.push(`الاستنتاج ${index + 1} غير صالح.`);
      ['id', 'title', 'conclusion'].forEach((field) => needText(deduction, field, `الاستنتاج ${index + 1}.${field}`));
      if (!Array.isArray(deduction.requiredClueIds) || deduction.requiredClueIds.length !== 2 || deduction.requiredClueIds.some((id) => !clueIds.has(id))) {
        errors.push(`الاستنتاج ${index + 1} يجب أن يعتمد على دليلين موجودين.`);
      }
      if (typeof deduction.unlocked !== 'boolean') errors.push(`unlocked للاستنتاج ${index + 1} يجب أن يكون boolean.`);
    });
  }

  if (!isRecord(candidate.nodes) || Object.keys(candidate.nodes).length < 4) {
    errors.push('يلزم أربع عقد حوار على الأقل.');
    return errors;
  }

  const nodeIds = Object.keys(candidate.nodes);
  const revealedClues = new Set();
  let correctEndings = 0;
  let wrongEndings = 0;
  nodeIds.forEach((nodeId) => {
    const node = candidate.nodes[nodeId];
    if (!isRecord(node)) return errors.push(`العقدة ${nodeId} غير صالحة.`);
    if (node.id !== nodeId) errors.push(`id العقدة ${nodeId} لا يطابق اسمها.`);
    if (!Number.isInteger(node.phase) || node.phase < 1 || node.phase > 4) errors.push(`phase العقدة ${nodeId} غير صالح.`);
    needText(node, 'phaseName', `phaseName العقدة ${nodeId}`);
    if (!Array.isArray(node.messages) || node.messages.length === 0) errors.push(`العقدة ${nodeId} تحتاج رسالة واحدة على الأقل.`);
    else node.messages.forEach((message, messageIndex) => {
      if (!isRecord(message) || !validMessageTypes.has(message.type) || !isText(message.text)) errors.push(`الرسالة ${messageIndex + 1} في ${nodeId} غير صالحة.`);
      if (message?.clueId !== undefined) {
        if (!clueIds.has(message.clueId)) errors.push(`العقدة ${nodeId} تشير إلى دليل غير موجود.`);
        else revealedClues.add(message.clueId);
      }
    });
    if (node.effects?.addClue) {
      if (!clueIds.has(node.effects.addClue)) errors.push(`effects.addClue في ${nodeId} غير صالح.`);
      else revealedClues.add(node.effects.addClue);
    }
    if (node.isEnding === true) {
      if (!isText(node.endingVerdict)) errors.push(`نهاية ${nodeId} تحتاج حكماً نهائياً.`);
      if (node.isCorrectEnding === true) correctEndings += 1;
      else wrongEndings += 1;
    }
    if (node.choices !== undefined && !Array.isArray(node.choices)) errors.push(`choices في ${nodeId} يجب أن تكون مصفوفة.`);
    (node.choices || []).forEach((choice, choiceIndex) => {
      if (!isRecord(choice) || !isText(choice.id) || !isText(choice.text) || !nodeIds.includes(choice.nextNodeId)) errors.push(`الخيار ${choiceIndex + 1} في ${nodeId} غير صالح.`);
    });
  });

  if (!nodeIds.includes(candidate.startNodeId)) errors.push('startNodeId لا يشير إلى عقدة موجودة.');
  if (correctEndings !== 1 || wrongEndings < 1) errors.push('يلزم نهاية صحيحة واحدة ونهاية خاطئة واحدة على الأقل.');
  clueIds.forEach((clueId) => {
    if (!revealedClues.has(clueId)) errors.push(`الدليل ${clueId} لا يمكن للاعب العثور عليه عبر الحوار.`);
  });

  const visited = new Set();
  const queue = [candidate.startNodeId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current) || !candidate.nodes[current]) continue;
    visited.add(current);
    (candidate.nodes[current].choices || []).forEach((choice) => queue.push(choice.nextNodeId));
  }
  nodeIds.forEach((nodeId) => {
    if (!visited.has(nodeId)) errors.push(`العقدة ${nodeId} غير قابلة للوصول من بداية القضية.`);
  });

  return errors;
}

function casePrompt({ date, slot, id, number, theme }) {
  return `أنت كاتب ألعاب تحقيق عربي محترف. أنشئ قضية جريمة خيالية قابلة للعب، مكتوبة بالعامية المصرية فقط، ولا تستخدم أشخاصاً أو جرائم حقيقية.\n\nأعد كائناً JSON فقط، بلا Markdown وبلا شرح. يجب أن يطابق هذا العقد بدقة:\n- id: "${id}"، number: ${number}، title، subtitle، description، location، difficulty واحدة من: سهل، متوسط، معقد، أسطوري.\n- suspects: أنشئ 4 مشتبهين بالضبط؛ كل عنصر يملك id، name، role، avatar، bio، alibi، motive، isCulprit، interrogated:false، suspicionLevel من 1 إلى 5. يوجد جانٍ واحد فقط.\n- clues: أنشئ 4 أدلة بالضبط، لا ثلاثة ولا خمسة. كل عنصر يملك id، title، category واحدة من مادي أو وثيقة أو شهادة أو علمي، description، detail، iconName.\n- timeline: أنشئ 4 أحداث زمنية بالضبط؛ كل منها id، time، description، order. يجب ألا تتضارب الأحداث مع الأعذار.\n- deductions: أنشئ استنتاجين بالضبط؛ كل منها id، title، requiredClueIds يحتوي بالضبط على معرفي دليلين موجودين، conclusion، unlocked:false.\n- nodes: أنشئ 6 عقد حوار بالضبط. كل عقدة تحتوي id مطابقاً لمفتاحها، phase من 1 إلى 4، phaseName، messages (رسالة أو أكثر، وكل رسالة تحتوي type من narrator أو character أو player أو clue أو system وtext؛ وعندما تمنح دليلاً أضف clueId الصحيح)، وchoices عند الحاجة. كل خيار يحتوي id وtext وnextNodeId موجوداً.\n- يجب أن يبدأ startNodeId بعقدة موجودة. يجب وجود نهاية صحيحة واحدة isEnding:true وisCorrectEnding:true ونهاية خاطئة واحدة على الأقل isEnding:true وisCorrectEnding:false، ولكل نهاية endingVerdict.\n- اجعل كل الأدلة الأربعة قابلة للاكتشاف عبر messages.clueId أو effects.addClue، وكل العقد قابلة للوصول من startNodeId.\n- أنشئ طريقاً واضحاً للوصول إلى الاتهام الصحيح، واجعل الأدلة والاستنتاجات تكشف الجاني منطقياً.\n\nاليوم: ${date}. القضية رقم ${slot} من ثلاث قضايا يومية. موضوع الإلهام: ${theme}. اجعلها مختلفة جذرياً عن أي قالب نمطي، دون عنف وصفي مفرط.`;
}

function reviewerPrompt(candidate, reviewType) {
  const focus = reviewType === 'narrative'
    ? 'راجع التسلسل الزمني والدوافع والأعذار والأدلة والاستنتاجات: هل تقود كل الأسباب منطقياً إلى الجاني الوحيد؟ وهل توجد أي تناقضات أو قفزات غير مبررة؟ تأكد أن النص مكتوب بالعامية المصرية فقط.'
    : 'راجع قابلية اللعب تقنياً: هل كل عقد الحوار ومسارات الخيارات قابلة للوصول؟ هل يكشف الحوار الأدلة المطلوبة؟ وهل يستطيع اللاعب الوصول إلى النهاية الصحيحة بناءً على أدلة متسقة؟ تأكد أن النص مكتوب بالعامية المصرية فقط.';
  return `أنت مراجع جودة صارم لألعاب التحقيق المصرية. ${focus}\n\nأعد JSON فقط بالشكل {"approved":boolean,"issues":["..."],"revisionBrief":"..."}. لا توافق إذا وجدت أي تعارض أو غموض يمنع الحل المنطقي أو إذا لم يكن النص بالعامية المصرية.\n\nالقضية:\n${JSON.stringify(candidate)}`;
}

function repairPrompt(candidate, issues, expectedId, number) {
  return `أنت محرر ألعاب تحقيق. أصلح القضية التالية بالكامل وفق ملاحظات المراجعين والفحص التقني. أعد كائن JSON كامل فقط، بلا Markdown. لا تغير id (${expectedId}) أو number (${number})، ولا تحذف نهايتي الاتهام الصحيحة والخاطئة. تأكد أن جميع النصوص مكتوبة بالعامية المصرية فقط.\n\nالملاحظات:\n${issues.map((issue) => `- ${issue}`).join('\n')}\n\nالقضية الحالية:\n${JSON.stringify(candidate)}`;
}

async function generateJson(ai, prompt, systemInstruction) {
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json', systemInstruction, temperature: 0.45 },
      });
      if (!response.text) throw new Error('Gemini لم يُرجع محتوى.');
      return extractJson(response.text);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (attempt === maxAttempts || !retryableErrorPattern.test(message)) throw error;
      const delay = 2000 * (2 ** (attempt - 1)) + Math.floor(Math.random() * 700);
      console.warn(`Gemini غير متاح مؤقتاً؛ إعادة المحاولة ${attempt}/${maxAttempts - 1} بعد ${Math.ceil(delay / 1000)} ثوانٍ.`);
      await wait(delay);
    }
  }
  throw new Error('تعذر الاتصال بـ Gemini بعد المحاولات المسموح بها.');
}

async function generateApprovedCase(ai, details, usedIds) {
  const systemInstruction = 'اكتب بالعامية المصرية فقط. لا تؤلف بيانات حقيقية ولا تستعمل لغة مسيئة. اتبع بنية JSON المطلوبة حرفياً.';
  const failures = [];

  // A fresh draft is more reliable than endlessly repairing a model response that ignored the schema.
  for (let freshDraft = 1; freshDraft <= 3; freshDraft += 1) {
    let candidate = await generateJson(ai, casePrompt(details), systemInstruction);
    for (let correction = 1; correction <= 2; correction += 1) {
      candidate.id = details.id;
      candidate.number = details.number;
      const technicalIssues = validateCase(candidate, details.id, usedIds);

      if (technicalIssues.length > 0) {
        failures.push(...technicalIssues);
        if (correction === 2) break;
        candidate = await generateJson(ai, repairPrompt(candidate, technicalIssues, details.id, details.number), systemInstruction);
        continue;
      }

      // Run reviewers one after another to reduce rate-limit pressure while preserving two independent reviews.
      const narrativeReview = await generateJson(ai, reviewerPrompt(candidate, 'narrative'), 'أنت مدقق منطقي شديد الدقة. أعد JSON فقط.');
      const gameplayReview = await generateJson(ai, reviewerPrompt(candidate, 'gameplay'), 'أنت مدقق تقني شديد الدقة. أعد JSON فقط.');
      const reviewIssues = [
        ...(Array.isArray(narrativeReview.issues) ? narrativeReview.issues : []),
        ...(Array.isArray(gameplayReview.issues) ? gameplayReview.issues : []),
      ].filter(isText);
      const reviewsApproved = narrativeReview.approved === true && gameplayReview.approved === true && reviewIssues.length === 0;

      if (reviewsApproved) return candidate;
      failures.push(...reviewIssues);
      if (correction === 2) break;
      candidate = await generateJson(ai, repairPrompt(candidate, reviewIssues, details.id, details.number), systemInstruction);
    }
    console.warn(`لم تعتمد المسودة ${freshDraft} للقضية ${details.id}; يتم إنشاء مسودة جديدة.`);
  }
  throw new Error(`القضية ${details.id} لم تجتز كل المسودات. آخر الملاحظات: ${[...new Set(failures)].slice(-6).join(' | ')}`);
}

async function main() {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY غير مضبوط. أضفه كسِر GitHub أو متغير بيئة محلي.');

  const state = await readJson(statePath);
  const date = cairoDate();
  if (state.lastGeneratedCairoDate === date && process.argv[2] !== '--force') {
    console.log(`لا توجد عملية: تم إنشاء قصص ${date} بالفعل.`);
    return;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const usedIds = new Set();
  const nextNumber = 1;
  const compactDate = date.replaceAll('-', '');
  const approvedCases = [];

  for (let slot = 1; slot <= 3; slot += 1) {
    const details = {
      date,
      slot,
      id: `case_daily_${compactDate}_${slot}`,
      number: nextNumber + slot - 1,
      theme: themes[(Number(compactDate.slice(-2)) + slot - 1) % themes.length],
    };
    const approved = await generateApprovedCase(ai, details, usedIds);
    approvedCases.push(approved);
    usedIds.add(approved.id);
    console.log(`اعتمدت ${approved.id} بعد المراجعات.`);
  }

  await Promise.all([
    writeJson(casesPath, approvedCases),
    writeJson(statePath, { lastGeneratedCairoDate: date, generatedCaseIds: approvedCases.map((item) => item.id) }),
  ]);
  console.log(`تمت إضافة ${approvedCases.length} قضايا بتاريخ ${date} (Africa/Cairo) وحذف القصص السابقة.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
