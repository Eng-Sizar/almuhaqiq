import { CasePuzzle } from '../types';

export const CASE_PUZZLES: CasePuzzle[] = [
  {
    id: 'puzzle_safe_1',
    chapterId: 'case_1',
    title: 'رمز خزنة اللورد الحديدية',
    type: 'safe_code',
    prompt: 'في مسرح الجريمة بقصر البارون، تقبع خزنة جدارية وراء لوحة زيتية قديمة. وجد المحقق قصاصة مكتوب فيها: "تاريخ ميلاد وريثي الشرعي + ساعة توقف الجريمة". من الأدلة: ميلاد طارق عام 1920، وتوقفت ساعة يد اللورد عند 11:15 (الرقم 11). حاصل الجمع يعطي رمز الخزنة المكون من 4 أرقام:',
    challenge: '1920 + 11 = ؟',
    hint: 'قم بجمع سنة ميلاد ابن الأخ 1920 مع ساعة وقوع الحادثة 11.',
    solution: '1931',
    rewardCoins: 50,
    solved: false,
    wrongAttempts: 0,
    unlocked: true
  },
  {
    id: 'puzzle_cipher_2',
    chapterId: 'case_2',
    title: 'شفرة المعمل الكيميائي',
    type: 'cipher',
    prompt: 'عُثر على قارورة السم مع ورقة تحذيرية كيميائية تحمل تسمية مشفرة بتبديل ترتيب الحروف: "ن - ي - ل - ي - ز". ما هو الاسم الحقيقي لهذا المركب السام القاتل؟',
    challenge: 'ن - ي - ل - ي - ز',
    hint: 'ابدأ بحرف الزاي واقرأ المركب المذكور في تقرير الطبيبة الشرعية (زيلين).',
    solution: 'زيلين',
    rewardCoins: 45,
    solved: false,
    wrongAttempts: 0,
    unlocked: true
  },
  {
    id: 'puzzle_anagram_3',
    chapterId: 'case_3',
    title: 'اسم الجاسوس المستعار',
    type: 'anagram',
    prompt: 'عثر مفتش القطار على بطاقة سفر مزورة بها اسم مبعثر الحروف: "ف - ر - ي - د". ما هو الاسم الحقيقي المقابل للشخصية؟',
    challenge: 'ف - ر - ي - د',
    hint: 'اسم مألوف يتطابق مع وكيل الأموال أو أحد المعارف في القصر.',
    solution: 'فريد',
    rewardCoins: 40,
    solved: false,
    wrongAttempts: 0,
    unlocked: true
  },
  {
    id: 'puzzle_logic_4',
    title: 'لغز قاعة الأدلة المركزية',
    type: 'logic',
    prompt: 'ثلاثة مفاتيح في درج المحقق: أحمر، فضي، ونحاسي. المفتاح الفضي لا يفتح إلا باب الأرشيف، والمفتاح الأحمر ليس للزنزانة. إذا كانت الأبواب الثلاثة هي: الأرشيف، الخزينة، الزنزانة، فما هو الباب الذي يفتحه المفتاح النحاسي؟ (اكتب: الزنزانة)',
    challenge: 'الفضي = الأرشيف | الأحمر ليس للزنزانة -> فماذا يفتح النحاسي؟',
    hint: 'إذا كان الأحمر لا يفتح الزنزانة ولا الأرشيف، فالأحمر للخزينة، وبالتالي النحاسي لـ...',
    solution: 'الزنزانة',
    rewardCoins: 60,
    solved: false,
    wrongAttempts: 0,
    unlocked: true
  }
];

export const ALL_PUZZLES = CASE_PUZZLES;
