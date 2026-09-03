import { Chapter } from '../../types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const fail = (caseId: string, message: string): never => {
  throw new Error(`خطأ في القضية JSON "${caseId}": ${message}`);
};

/**
 * Validates author-created JSON at build time so broken dialogue paths never reach production.
 */
export function validateCustomCases(rawCases: unknown): Chapter[] {
  if (!Array.isArray(rawCases)) {
    throw new Error('ملف custom-cases.json يجب أن يحتوي على مصفوفة من القضايا.');
  }

  const caseIds = new Set<string>();

  return rawCases.map((rawCase, index) => {
    if (!isRecord(rawCase)) fail(`#${index + 1}`, 'كل قضية يجب أن تكون كائناً JSON.');

    const id = rawCase.id;
    if (typeof id !== 'string' || !/^[a-z0-9_]+$/.test(id)) {
      fail(`#${index + 1}`, 'id مطلوب ويستخدم حروفاً إنجليزية صغيرة وأرقاماً وشرطة سفلية فقط.');
    }
    if (caseIds.has(id)) fail(id, 'معرّف القضية مكرر.');
    caseIds.add(id);

    const requiredText = ['title', 'subtitle', 'description', 'location', 'difficulty', 'startNodeId'];
    requiredText.forEach((key) => {
      if (typeof rawCase[key] !== 'string' || rawCase[key] === '') fail(id, `الحقل ${key} مطلوب.`);
    });
    if (!['سهل', 'متوسط', 'معقد', 'أسطوري'].includes(rawCase.difficulty as string)) {
      fail(id, 'difficulty يجب أن يكون: سهل، متوسط، معقد، أو أسطوري.');
    }

    if (typeof rawCase.number !== 'number') fail(id, 'الحقل number يجب أن يكون رقماً.');
    if (!Array.isArray(rawCase.suspects) || rawCase.suspects.length === 0) fail(id, 'أضف مشتبهًا واحدًا على الأقل.');
    if (!Array.isArray(rawCase.clues) || rawCase.clues.length === 0) fail(id, 'أضف دليلاً واحدًا على الأقل.');
    if (!Array.isArray(rawCase.timeline)) fail(id, 'الحقل timeline يجب أن يكون مصفوفة.');
    if (!Array.isArray(rawCase.deductions)) fail(id, 'الحقل deductions يجب أن يكون مصفوفة.');
    if (!isRecord(rawCase.nodes)) fail(id, 'الحقل nodes يجب أن يحتوي على عقد الحوار.');

    const nodes = rawCase.nodes;
    const startNodeId = rawCase.startNodeId as string;
    if (!isRecord(nodes[startNodeId])) fail(id, 'startNodeId لا يشير إلى عقدة موجودة.');

    const clueIds = new Set(
      rawCase.clues.map((clue) => isRecord(clue) && typeof clue.id === 'string' ? clue.id : '')
    );
    if (clueIds.has('')) fail(id, 'كل دليل يحتاج إلى id صالح.');

    Object.entries(nodes).forEach(([nodeId, node]) => {
      if (!isRecord(node)) fail(id, `العقدة ${nodeId} غير صالحة.`);
      const nodeRecord = node as Record<string, unknown>;
      if (nodeRecord.id !== nodeId) fail(id, `id العقدة ${nodeId} يجب أن يطابق اسمها داخل nodes.`);
      const messages = nodeRecord.messages;
      if (!Array.isArray(messages)) fail(id, `العقدة ${nodeId} تحتاج messages كمصفوفة.`);
      const validMessages = messages as unknown[];

      validMessages.forEach((message) => {
        if (isRecord(message) && typeof message.clueId === 'string' && !clueIds.has(message.clueId)) {
          fail(id, `العقدة ${nodeId} تشير إلى دليل غير موجود: ${message.clueId}.`);
        }
      });

      if (Array.isArray(nodeRecord.choices)) {
        nodeRecord.choices.forEach((choice) => {
          if (!isRecord(choice)) {
            fail(id, `يوجد اختيار غير صالح في العقدة ${nodeId}.`);
          }
          const choiceRecord = choice as Record<string, unknown>;
          if (typeof choiceRecord.nextNodeId !== 'string' || !isRecord(nodes[choiceRecord.nextNodeId])) {
            fail(id, `يوجد اختيار في العقدة ${nodeId} يشير إلى عقدة غير موجودة.`);
          }
        });
      }
    });

    rawCase.deductions.forEach((deduction) => {
      if (!isRecord(deduction) || !Array.isArray(deduction.requiredClueIds)) {
        fail(id, 'كل استنتاج يجب أن يحتوي على requiredClueIds.');
      }
      deduction.requiredClueIds.forEach((clueId) => {
        if (typeof clueId !== 'string' || !clueIds.has(clueId)) fail(id, 'استنتاج يشير إلى دليل غير موجود.');
      });
    });

    return rawCase as unknown as Chapter;
  });
}
