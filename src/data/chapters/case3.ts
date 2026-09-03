import { Chapter } from '../../types';

export const CASE_3: Chapter = {
  id: 'case_3',
  number: 3,
  title: 'ظل قطار منتصف الليل',
  subtitle: 'اغتيال في المقصورة رقم 4 وسر برقية جنيف',
  description: 'وسط عاصفة ثلجية هوجاء، يتوقف قطار الشرق السريع في ممر جبلي معزول. المبعوث الدبلوماسي عُثر عليه مطعوناً بخنجر فضي داخل مقصورته المقفلة، وحقيبة الوثائق السرية مفقودة.',
  location: 'قطار الشرق السريع - العربة رقم 4',
  difficulty: 'معقد',
  requiredSolvedChapterId: 'case_2',
  suspects: [
    {
      id: 'suspect_adel',
      name: 'البروفيسور عادل',
      role: 'خبير شفرات ومترجم الوفد الدبلوماسي',
      avatar: '🧐',
      bio: 'أكاديمي هادئ الطباع يحمل حقيبة كتب سميكة، وكان على خلاف سياسي مع المبعوث المغدور.',
      alibi: 'يدعي أنه كان غارقاً في قراءة مخطوطة بمقصورته رقم 6 ولم يخرج طوال عبور النفق.',
      motive: 'عميل مزدوج مكلف بمنع توقيع معاهدة السلام واستعادة وثائق الترسيم الحدودية.',
      isCulprit: true,
      interrogated: false,
      suspicionLevel: 4
    },
    {
      id: 'suspect_nadia',
      name: 'نادية الأوبرالية',
      role: 'مغنية شهيرة مسافرة إلى حفل فيينا',
      avatar: '🌹',
      bio: 'سيدة مجتمع ذات حضور طاغٍ، مقصورتها رقم 3 تجاور مقصورة المبعوث القتيل مباشرة.',
      alibi: 'كانت تتناول الشاي وتهدئ أعصابها بسبب اهتزاز القطار والضباب الثلجي.',
      motive: 'المبعوث كان يبتزها برسائل غرامية قديمة تهدد مسيرتها الفنية وسمعتها.',
      isCulprit: false,
      interrogated: false,
      suspicionLevel: 3
    },
    {
      id: 'suspect_youssef_conductor',
      name: 'يوسف قاطع التذاكر',
      role: 'رئيس طاقم المضيفين في عربة النوم',
      avatar: '🎩',
      bio: 'يعمل في هذا الخط منذ 20 عاماً، ويمتلك المفتاح الرئيسي لجميع مقصورات الركاب.',
      alibi: 'كان يتفقد تذاكر ركاب الدرجة الثانية في العربة الخلفية أثناء عبور النفق المظلم.',
      motive: 'عُثر على حزمة أوراق نقدية أجنبية مخبأة داخل قبعته الاحتياطية في غرفة الخدمة.',
      isCulprit: false,
      interrogated: false,
      suspicionLevel: 3
    }
  ],
  clues: [
    {
      id: 'clue_silver_dagger',
      title: 'خنجر جبال الألب الفضي',
      category: 'مادي',
      description: 'سلاح الجريمة؛ خنجر ذو نصل رفيع محفور عليه شعار أكاديمية اللغات الشرقية.',
      detail: 'الأكاديمية التي تخرج منها البروفيسور عادل وحصل منها على وسام الشرف.',
      iconName: 'Sword'
    },
    {
      id: 'clue_cipher_telegram',
      title: 'برقية جنيف المشفرة المحروقة',
      category: 'وثيقة',
      description: 'ورقة برقية عُثر على نصفها في سلة مهملات المقصورة رقم 6 برمز تشفير عسكري.',
      detail: 'نص البرقية: "الهدف في المقصورة 4، الحقيبة يجب ألا تصل لمحطة الحدود".',
      iconName: 'FileQuestion'
    },
    {
      id: 'clue_snow_footprints',
      title: 'آثار ثلج على الممشى الخارجي',
      category: 'مادي',
      description: 'آثار حذاء جلدي ضيق مشى على الحافة الخارجية للعربة أثناء انقطاع الكهرباء في النفق.',
      detail: 'مقاس الحذاء 42، وهو نفس مقاس حذاء البروفيسور عادل الذي كان رطباً من الأسفل.',
      iconName: 'Footprints'
    }
  ],
  timeline: [
    {
      id: 'time_3_1',
      time: '11:50 م',
      description: 'دخول القطار في نفق الجبل الأسود الطويل وانطفاء الأنوار المؤقت بسبب عطل المولد.',
      order: 1
    },
    {
      id: 'time_3_2',
      time: '11:55 م',
      description: 'صوت صراخ مكتوم من المقصورة 4 لكن ضجيج محركات القطار حجب مصدره.',
      order: 2
    },
    {
      id: 'time_3_3',
      time: '12:05 ص',
      description: 'خروج القطار من النفق وعودة الإضاءة، ويوسف يكتشف دماء تتسرب تحت باب مقصورة المبعوث.',
      relatedSuspectId: 'suspect_youssef_conductor',
      order: 3
    }
  ],
  deductions: [
    {
      id: 'deduction_3_1',
      title: 'مؤامرة النفق وخنجر الأكاديمية',
      requiredClueIds: ['clue_silver_dagger', 'clue_cipher_telegram'],
      conclusion: 'الخنجر الفضي الموسوم بأكاديمية اللغات مع البرقية المشفرة في المقصورة 6 يثبتان بما لا يدع مجالاً للشك أن البروفيسور عادل هو العميل المكلف بتصفية المبعوث!',
      unlocked: false
    }
  ],
  startNodeId: 'node_train_intro',
  nodes: {
    node_train_intro: {
      id: 'node_train_intro',
      phase: 1,
      phaseName: 'مسرح جريمة قطار منتصف الليل',
      messages: [
        {
          type: 'narrator',
          text: 'القطار عالق في الثلوج وصوت الرياح يعوي بالخارج. في الممر الضيق للعربة رقم 4، يقف يوسف المضيف مرتعشاً بجوار الباب رقم 4.'
        },
        {
          type: 'character',
          sender: 'يوسف المضيف',
          senderAvatar: '🎩',
          text: 'يا سيدي المحقق، لحسن الحظ أنك كنت مسافراً على نفس القطار! المبعوث ميت بالداخل والقطار لن يتحرك قبل الصباح بسبب الانهيار الثلجي!'
        }
      ],
      choices: [
        {
          id: 'c_train_inspect_comp4',
          text: 'دخول المقصورة رقم 4 وفحص جثة المبعوث والحقيبة',
          nextNodeId: 'node_train_comp4'
        },
        {
          id: 'c_train_inspect_passageway',
          text: 'معاينة الممر الضيق والنوافذ الخارجية للعربة',
          nextNodeId: 'node_train_window'
        }
      ]
    },
    node_train_comp4: {
      id: 'node_train_comp4',
      phase: 1,
      phaseName: 'مسرح جريمة قطار منتصف الليل',
      messages: [
        {
          type: 'narrator',
          text: 'المبعوث مستند إلى المقعد المخملي والدماء تغطي سترته. الخنجر الفضي ما زال مغروساً بدقة جراحية.'
        },
        {
          type: 'clue',
          clueId: 'clue_silver_dagger',
          text: 'تم العثور على دليل: خنجر جبال الألب الفضي - يحمل شعار أكاديمية اللغات الشرقية بدقة!'
        }
      ],
      effects: {
        addClue: 'clue_silver_dagger',
        unlockTimeline: ['time_3_2']
      },
      choices: [
        {
          id: 'c_train_to_suspects',
          text: 'بدء استجواب ركاب المقصورة المجاورة والمضيف',
          nextNodeId: 'node_train_interrogations'
        }
      ]
    },
    node_train_window: {
      id: 'node_train_window',
      phase: 1,
      phaseName: 'مسرح جريمة قطار منتصف الليل',
      messages: [
        {
          type: 'narrator',
          text: 'نافذة الممر مواربة ويدخل منها رذاذ الثلج. على الحافة الخارجية توجد آثار أقدام طازجة في الجليد.'
        },
        {
          type: 'clue',
          clueId: 'clue_snow_footprints',
          text: 'تم العثور على دليل: آثار ثلج مقاس 42 على الحافة الخارجية للمقصورة.'
        },
        {
          type: 'clue',
          clueId: 'clue_cipher_telegram',
          text: 'تم العثور على دليل: برقية جنيف المشفرة المحروقة جزئياً وتطلب تصفية الهدف.'
        }
      ],
      effects: {
        addClue: 'clue_cipher_telegram'
      },
      choices: [
        {
          id: 'c_train_win_to_interrogations',
          text: 'الانتقال لغرفة طعام القطار لمواجهة الركاب',
          nextNodeId: 'node_train_interrogations'
        }
      ]
    },
    node_train_interrogations: {
      id: 'node_train_interrogations',
      phase: 2,
      phaseName: 'استجواب ركاب العربة رقم 4',
      messages: [
        {
          type: 'narrator',
          text: 'يجلس البروفيسور عادل ونادية الأوبرالية ويوسف المضيف في عربة الطعام الدافئة، وأعينهم تراقب خطواتك.'
        }
      ],
      choices: [
        {
          id: 'c_t_ask_adel',
          text: 'استجواب البروفيسور عادل ومواجهته بخنجر أكاديميته',
          nextNodeId: 'node_train_adel'
        },
        {
          id: 'c_t_ask_nadia',
          text: 'استجواب نادية وسؤالها عن رسائل الابتزاز',
          nextNodeId: 'node_train_nadia'
        },
        {
          id: 'c_t_final_accuse',
          text: 'إعلان المتهم بارتكاب جريمة قطار الشرق السريع',
          nextNodeId: 'node_train_accuse'
        }
      ]
    },
    node_train_adel: {
      id: 'node_train_adel',
      phase: 2,
      phaseName: 'استجواب ركاب العربة رقم 4',
      messages: [
        {
          type: 'player',
          text: 'بروفيسور عادل، الخنجر الفضي يحمل شعار نفس الأكاديمية التي تخرجت منها، وحذاؤك لا يزال مبللاً بثلوج الحافة الخارجية!'
        },
        {
          type: 'character',
          sender: 'البروفيسور عادل',
          senderAvatar: '🧐',
          text: 'هذا الخنجر أُهدي للمئات من الخريجين! والثلج يملأ القطار بأكمله.. لا تملك أي إثبات على أنني من تسلل لمقصورته!'
        }
      ],
      effects: {
        modifyTrust: -15
      },
      choices: [
        {
          id: 'c_t_back_from_adel',
          text: 'العودة لتقييم جميع الشهادات',
          nextNodeId: 'node_train_interrogations'
        }
      ]
    },
    node_train_nadia: {
      id: 'node_train_nadia',
      phase: 2,
      phaseName: 'استجواب ركاب العربة رقم 4',
      messages: [
        {
          type: 'player',
          text: 'سيدة نادية، هل سمعتِ شيئاً أثناء مرور القطار في النفق المظلم؟'
        },
        {
          type: 'character',
          sender: 'نادية الأوبرالية',
          senderAvatar: '🌹',
          text: 'كنت خائفة جداً من الظلام، لكنني رأيت خيال رجل طويل يتسلل من النافذة المحاذية لمقصورتي متجهاً نحو العربة رقم 6! والبروفيسور عادل هو الوحيد المقيم هناك!'
        }
      ],
      effects: {
        modifyTrust: 20
      },
      choices: [
        {
          id: 'c_t_back_from_nadia',
          text: 'العودة لمتابعة التحقيق',
          nextNodeId: 'node_train_interrogations'
        }
      ]
    },
    node_train_accuse: {
      id: 'node_train_accuse',
      phase: 4,
      phaseName: 'المواجهة النهائية على خط السكة الحديد',
      messages: [
        {
          type: 'narrator',
          text: 'حان وقت الحسم قبل أن تصل كاسحة الثلوج وتفتح الطريق لفرار القاتل بين ركاب المحطة.'
        }
      ],
      choices: [
        {
          id: 'c_accuse_adel',
          text: 'إدانة [البروفيسور عادل] بالقتل العمد والتجسس وسرقة وثائق المعاهدة',
          nextNodeId: 'node_train_win_adel'
        },
        {
          id: 'c_accuse_nadia',
          text: 'إدانة [نادية الأوبرالية] بدافع الانتقام من الابتزاز',
          nextNodeId: 'node_train_lose_nadia'
        },
        {
          id: 'c_accuse_youssef',
          text: 'إدانة [يوسف المضيف] لامتلاكه المفتاح الرئيسي',
          nextNodeId: 'node_train_lose_youssef'
        }
      ]
    },
    node_train_win_adel: {
      id: 'node_train_win_adel',
      phase: 4,
      phaseName: 'النهاية الصحيحة - ضبط الجاسوس',
      isEnding: true,
      isCorrectEnding: true,
      endingVerdict: 'تم كشف البروفيسور عادل واستعادة الوثائق السرية المحشوة في بطانة معطفه!',
      messages: [
        {
          type: 'character',
          sender: 'البروفيسور عادل',
          senderAvatar: '🧐',
          text: '(يرمي نظارته بمرارة) اعتقدت أن ضجيج النفق وظلامه سيمحوان كل أثر.. ذكاؤك الاستقرائي كان أسرع من خطتي المحكمة!'
        },
        {
          type: 'system',
          text: 'مبروك! أغلقت القضية الكبرى الثالثة واستحققت لقب أسطورة التحقيقات وتقرير الإنجاز الشامل!'
        }
      ]
    },
    node_train_lose_nadia: {
      id: 'node_train_lose_nadia',
      phase: 4,
      phaseName: 'اتهام خاطئ',
      isEnding: true,
      isCorrectEnding: false,
      endingVerdict: 'اتهام باطل: نادية لا تملك القوة الجسدية للطعن، وتسلل القاتل الحقيقي بالوثائق إلى الجبال!',
      messages: [
        {
          type: 'character',
          sender: 'نادية الأوبرالية',
          senderAvatar: '🌹',
          text: 'أنا فنانة أرتجف من منظر إبرة الخياطة! كيف تجعل مني سفاحة خناجر؟! لقد ضيعتم العدالة!'
        },
        {
          type: 'system',
          text: 'خسرت القضية وهرب الجاني الحقيقي وسط الثلوج.'
        }
      ]
    },
    node_train_lose_youssef: {
      id: 'node_train_lose_youssef',
      phase: 4,
      phaseName: 'اتهام خاطئ',
      isEnding: true,
      isCorrectEnding: false,
      endingVerdict: 'اتهام باطل: يوسف لم يكن يملك أي دافع، والأموال في قبعته كانت إكراميات جمعها لعلاج ابنته!',
      messages: [
        {
          type: 'character',
          sender: 'يوسف المضيف',
          senderAvatar: '🎩',
          text: 'حرام عليك يا سيدي! أخدم الناس بكل أمانة وتتهمني بسفك الدماء؟!'
        },
        {
          type: 'system',
          text: 'فشل التحقيق بسبب التسرع في توجيه الاتهام.'
        }
      ]
    }
  }
};
