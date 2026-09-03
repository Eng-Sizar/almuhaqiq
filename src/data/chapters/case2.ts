import { Chapter } from '../../types';

export const CASE_2: Chapter = {
  id: 'case_2',
  number: 2,
  title: 'شفرة المخطوطة المفقودة',
  subtitle: 'سرقة بردية أوزيريس وخيانة قاعة الآثار',
  description: 'اقتحام غامض لمتحف التراث الوطني بعد منتصف الليل؛ أمين الأرشيف فاقد للوعي في الممر، والخزانة المصفحة مفتوحة وبردية أوزيريس الذهبية التي لا تقدر بثمن قد تلاشت كالهواء.',
  location: 'متحف التراث الوطني - القاعة الملكية',
  difficulty: 'متوسط',
  requiredSolvedChapterId: 'case_1',
  suspects: [
    {
      id: 'suspect_jalal',
      name: 'جلال التاجر',
      role: 'جامع تحف وتاجر مزادات دولي',
      avatar: '🧐',
      bio: 'رجل أعمال ثري معروف بشغفه الشديد بالقطع الملكية النادرة وحضوره الدائم لفعاليات المتحف.',
      alibi: 'يزعم أنه كان في غرفته بفندق السلام طوال الليل يتابع مزاداً هاتفياً في باريس.',
      motive: 'تلقى عرضاً بـ 2 مليون دولار من مشتري أجنبي سري لتسليم البردية قبل شروق الشمس.',
      isCulprit: true,
      interrogated: false,
      suspicionLevel: 4
    },
    {
      id: 'suspect_sara',
      name: 'سارة الأحمد',
      role: 'الباحثة الأثرية المشرفة على المعرض',
      avatar: '📚',
      bio: 'عالمة آثار كرست 10 سنوات لدراسة البردية، ولديها تصريح دخول غير مقيد للمخزن.',
      alibi: 'كانت تعد أوراق المحاضرة في مكتبها حتى الحادية عشرة ثم استقلت سيارة أجرة لمنزلها.',
      motive: 'خلافات مع إدارة المتحف حول حقوق نشر كتابها واكتشافاتها الأثرية.',
      isCulprit: false,
      interrogated: false,
      suspicionLevel: 3
    },
    {
      id: 'suspect_kamal_guard',
      name: 'كمال الحارس',
      role: 'حارس الوردية الليلية للأمن',
      avatar: '🛡️',
      bio: 'حارس قديم بالمتحف، عُثر عليه مخدراً في غرفة المراقبة وبحوزته قهوة منومة.',
      alibi: 'كان يشرب قهوته المعتادة قبل أن يشعر بدوار شديد ويسقط مغشياً عليه.',
      motive: 'يمر بأزمة ديون عائلية خانقة وعُثر في خزانته على ورقة حسابات مريبة.',
      isCulprit: false,
      interrogated: false,
      suspicionLevel: 2
    }
  ],
  clues: [
    {
      id: 'clue_red_fiber',
      title: 'ألياف وشاح حريري أحمر',
      category: 'مادي',
      description: 'عُثر على خصلة ألياف حريرية إيطالية بلون ياقوتي عالقة في قفل الخزانة المعدنية.',
      detail: 'نوع الحرير باهظ جداً ولا يرتديه إلا أصحاب الطبقة الراقية والسترات المترفة.',
      iconName: 'Sparkles'
    },
    {
      id: 'clue_stolen_keycard',
      title: 'بطاقة دخول مشفرة منسوخة',
      category: 'وثيقة',
      description: 'بطاقة إلكترونية مبرمجة برمز الدخول السري ملقاة عند مخرج الطوارئ الخلفي.',
      detail: 'استُخدمت لفتح الخزانة في تمام 01:24 بعد منتصف الليل، وتطابق كود جهاز نسخ تملكه تجارة المزادات.',
      iconName: 'Key'
    },
    {
      id: 'clue_sedative_cup',
      title: 'فنجان القهوة المنوم',
      category: 'علمي',
      description: 'فنجان قهوة كمال الذي وُضع فيه مخدر سريع المفعول لا طعم له.',
      detail: 'المادة المستخدمة متوفرة فقط عبر شبكات الاستيراد الخاصة المهربة.',
      iconName: 'Coffee'
    },
    {
      id: 'clue_auction_receipt',
      title: 'مسودة عقد شحن سري',
      category: 'وثيقة',
      description: 'قصاصة من ورقة شحن جوي باسم مستعار متجهة إلى ميناء زيورخ بختم شركة جلال.',
      detail: 'مجدولة للإقلاع الساعة الخامسة صباحاً مع إعلان طرد أثري خاص.',
      iconName: 'FileCheck'
    }
  ],
  timeline: [
    {
      id: 'time_2_1',
      time: '11:00 م',
      description: 'إغلاق أبواب المتحف ومغادرة سارة بعد فحص إضاءة البردية وتوثيق القفل.',
      relatedSuspectId: 'suspect_sara',
      order: 1
    },
    {
      id: 'time_2_2',
      time: '12:30 ص',
      description: 'حضور شخص يرتدي معطفاً فاخراً لتوصيل قهوة مجاملة لغرفة الحراسة.',
      relatedSuspectId: 'suspect_kamal_guard',
      order: 2
    },
    {
      id: 'time_2_3',
      time: '01:24 ص',
      description: 'تسجيل دخول رقمي عبر مخرج الطوارئ بالبطاقة المنسوخة وتعطيل كاميرا القاعة.',
      order: 3
    },
    {
      id: 'time_2_4',
      time: '02:00 ص',
      description: 'إفاقة كمال جزئياً وضغط زر الإنذار اليدوي بعد رؤية الخزانة فارغة.',
      relatedSuspectId: 'suspect_kamal_guard',
      order: 4
    }
  ],
  deductions: [
    {
      id: 'deduction_2_1',
      title: 'هوية المتسلل والوشاح الإيطالي',
      requiredClueIds: ['clue_red_fiber', 'clue_auction_receipt'],
      conclusion: 'الألياف الحريرية الياقوتية تتطابق حصرياً مع الوشاح الذي يرتديه جلال في جميع لقاءاته، وتتطابق مع عقد الشحن السري الصادر من مكتبه لتهريب البردية فجراً!',
      unlocked: false
    }
  ],
  startNodeId: 'node_m_intro',
  nodes: {
    node_m_intro: {
      id: 'node_m_intro',
      phase: 1,
      phaseName: 'معاينة قاعة الآثار الكبرى',
      messages: [
        {
          type: 'narrator',
          text: 'صافرات الإنذار تدوي بهدوء في ردهة المتحف الوطني. الواجهة الزجاجية الكبرى مكسورة بحرفية ليزرية، والخزانة المصفحة مفتوحة بلا أي كسر ميكانيكي عنيف.'
        },
        {
          type: 'character',
          sender: 'سارة الأحمد',
          senderAvatar: '📚',
          text: 'هذه كارثة وطنية يا حضرة المحقق! بردية أوزيريس عمرها ثلاثة آلاف عام.. إذا خرجت من البلاد فلن نراها مجدداً!'
        }
      ],
      choices: [
        {
          id: 'c_m_inspect_vault',
          text: 'فحص الخزانة المصفحة وقفلها الإلكتروني',
          nextNodeId: 'node_m_vault'
        },
        {
          id: 'c_m_inspect_guard',
          text: 'فحص غرفة الحراسة واستجواب كمال الحارس',
          nextNodeId: 'node_m_guard_room'
        }
      ]
    },
    node_m_vault: {
      id: 'node_m_vault',
      phase: 1,
      phaseName: 'معاينة قاعة الآثار الكبرى',
      messages: [
        {
          type: 'narrator',
          text: 'تفحص مقبض الخزانة المصنوعة من التيتانيوم. القفل فُتح ببطاقة مبرمجة وليس بقوة السلاح.'
        },
        {
          type: 'clue',
          clueId: 'clue_red_fiber',
          text: 'تم العثور على دليل: ألياف وشاح حريري أحمر ياقوتي عالقة في زاوية القفل المعدني!'
        },
        {
          type: 'clue',
          clueId: 'clue_stolen_keycard',
          text: 'تم العثور على دليل: بطاقة دخول مشفرة منسوخة مرمية قرب مخرج الطوارئ.'
        }
      ],
      effects: {
        addClue: 'clue_red_fiber',
        unlockTimeline: ['time_2_3']
      },
      choices: [
        {
          id: 'c_m_to_interrogations',
          text: 'بدء جولة التحقيق مع جلال التاجر وسارة وكمال',
          nextNodeId: 'node_m_interrogations'
        }
      ]
    },
    node_m_guard_room: {
      id: 'node_m_guard_room',
      phase: 1,
      phaseName: 'معاينة قاعة الآثار الكبرى',
      messages: [
        {
          type: 'narrator',
          text: 'غرفة المراقبة فيها شاشات متوقفة. فنجان قهوة ملقى على الأرض قرب كرسي كمال ورائحته كيميائية غير طبيعية.'
        },
        {
          type: 'clue',
          clueId: 'clue_sedative_cup',
          text: 'تم العثور على دليل: فنجان القهوة المنوم - يحتوي على قطرات مخدر كيميائي مستورد.'
        },
        {
          type: 'clue',
          clueId: 'clue_auction_receipt',
          text: 'تم العثور على دليل: مسودة عقد شحن سري سقطت من جيب المتسلل أثناء الهروب السريع.'
        }
      ],
      effects: {
        addClue: 'clue_auction_receipt',
        unlockTimeline: ['time_2_2']
      },
      choices: [
        {
          id: 'c_m_guard_to_interrogations',
          text: 'الانتقال لقاعة المحقق لمواجهة المشتبه بهم',
          nextNodeId: 'node_m_interrogations'
        }
      ]
    },
    node_m_interrogations: {
      id: 'node_m_interrogations',
      phase: 2,
      phaseName: 'استجواب مشتبهي المتحف',
      messages: [
        {
          type: 'narrator',
          text: 'يقف جلال التاجر متكئاً على عصاه الأنيقة مرتدياً معطفاً فخماً، وسارة ممسكة بدفاترها، وكمال يضع كمادة على رأسه.'
        }
      ],
      choices: [
        {
          id: 'c_m_ask_jalal',
          text: 'استجواب جلال التاجر حول عقود الشحن وألياف الوشاح',
          nextNodeId: 'node_m_jalal'
        },
        {
          id: 'c_m_ask_sara',
          text: 'استجواب سارة الأحمد حول شفرة البطاقة وقفل الخزانة',
          nextNodeId: 'node_m_sara'
        },
        {
          id: 'c_m_accuse_stage',
          text: 'التوجه مباشرة لغرفة الاتهام النهائي',
          nextNodeId: 'node_m_accuse'
        }
      ]
    },
    node_m_jalal: {
      id: 'node_m_jalal',
      phase: 2,
      phaseName: 'استجواب مشتبهي المتحف',
      messages: [
        {
          type: 'player',
          text: 'سيد جلال، وشاحك الحريري الأحمر تنقصه بعض الخيوط التي عثرنا عليها بالضبط في مزلاج الخزانة، ولديك طائرة شحن تنتظر إقلاعاً فجر اليوم!'
        },
        {
          type: 'character',
          sender: 'جلال التاجر',
          senderAvatar: '🧐',
          text: 'هراء! أي وشاح أحمر يمكن أن يتطابق.. أنا رجل أعمال ولدي صفقات بملايين، ولن أخاطر بسرقة صريحة!'
        }
      ],
      effects: {
        modifyTrust: -10
      },
      choices: [
        {
          id: 'c_m_back_from_jalal',
          text: 'العودة لمتابعة بقية الأدلة والشهادات',
          nextNodeId: 'node_m_interrogations'
        }
      ]
    },
    node_m_sara: {
      id: 'node_m_sara',
      phase: 2,
      phaseName: 'استجواب مشتبهي المتحف',
      messages: [
        {
          type: 'player',
          text: 'آنسة سارة، هل تمكن أحد من نسخ بطاقتك الإلكترونية مؤخراً؟'
        },
        {
          type: 'character',
          sender: 'سارة الأحمد',
          senderAvatar: '📚',
          text: 'نعم! السيد جلال زار مكتبي أمس بحجة رغبته في تمويل الجناح وطلب الاطلاع على تصريح المعرض، وترك بطاقتي على طاولته لعدة دقائق.. لقد استغل ثقتي!'
        }
      ],
      effects: {
        modifyTrust: 15
      },
      choices: [
        {
          id: 'c_m_back_from_sara',
          text: 'العودة لمتابعة التحقيق',
          nextNodeId: 'node_m_interrogations'
        }
      ]
    },
    node_m_accuse: {
      id: 'node_m_accuse',
      phase: 4,
      phaseName: 'إعلان سارق البردية',
      messages: [
        {
          type: 'narrator',
          text: 'الشرطة طوقت مخارج العاصمة وتنتظر الإشارة لتفتيش شحنات الطائرات أو حبس المشتبه به الرئيسي.'
        }
      ],
      choices: [
        {
          id: 'c_accuse_jalal',
          text: 'إدانة [جلال التاجر] بسرقة البردية وتهريبها وتخدير الحارس',
          nextNodeId: 'node_m_win_jalal'
        },
        {
          id: 'c_accuse_sara',
          text: 'إدانة [سارة الأحمد] بادعاء سرقة أبحاثها',
          nextNodeId: 'node_m_lose_sara'
        },
        {
          id: 'c_accuse_kamal',
          text: 'إدانة [كمال الحارس] بالتواطؤ مع العصابة',
          nextNodeId: 'node_m_lose_kamal'
        }
      ]
    },
    node_m_win_jalal: {
      id: 'node_m_win_jalal',
      phase: 4,
      phaseName: 'استعادة البردية التاريخية',
      isEnding: true,
      isCorrectEnding: true,
      endingVerdict: 'تم ضبط جلال التاجر واستعادة بردية أوزيريس قبل صعودها للطائرة بدقائق!',
      messages: [
        {
          type: 'character',
          sender: 'ضابط الدورية كمال',
          senderAvatar: '👮‍♂️',
          text: 'أصبتم كبد الحقيقة يا محقق! عثرت قوة المطار على البردية مخبأة داخل حقيبة جلال المزدوجة ومعه جواز سفر مزور!'
        },
        {
          type: 'system',
          text: 'تم حل القضية بنجاح ونيل وسام الحفاظ على التراث الوطني.'
        }
      ]
    },
    node_m_lose_sara: {
      id: 'node_m_lose_sara',
      phase: 4,
      phaseName: 'فشل التحقيق',
      isEnding: true,
      isCorrectEnding: false,
      endingVerdict: 'اتهام باطل: سارة باحثة نزيهة، وقد أقلعت طائرة جلال بالبردية دون رجعة!',
      messages: [
        {
          type: 'character',
          sender: 'سارة الأحمد',
          senderAvatar: '📚',
          text: 'كيف تتهمني بأثمن ما أملك في حياتي؟ لقد سمحتم للمهرب الحقيقي بالفرار!'
        },
        {
          type: 'system',
          text: 'أخفقت في استنتاج الجاني الحقيقي وخسرت القضية البردية للأبد.'
        }
      ]
    },
    node_m_lose_kamal: {
      id: 'node_m_lose_kamal',
      phase: 4,
      phaseName: 'فشل التحقيق',
      isEnding: true,
      isCorrectEnding: false,
      endingVerdict: 'اتهام باطل: الحارس كمال كان ضحية تخدير كاد يودي بحياته!',
      messages: [
        {
          type: 'character',
          sender: 'كمال الحارس',
          senderAvatar: '🛡️',
          text: 'كدت أموت بالسم وتتهمني بالخيانة؟ لا بارك الله في هذا الظلم!'
        },
        {
          type: 'system',
          text: 'اتهام سطحي غير مؤسس على المنطق الجنائي.'
        }
      ]
    }
  }
};
