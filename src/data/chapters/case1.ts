import { Chapter } from '../../types';

export const CASE_1: Chapter = {
  id: 'case_1',
  number: 1,
  title: 'لغز الغرفة المغلقة',
  subtitle: 'لغز الغرفة المغلقة والكأس المسموم',
  description: 'في ليلة ماطرة وعاصفة، يُعثر على البارون منصور ميتاً خلف مكتبه الفاخر. الأبواب مقفلة من الداخل، والنافذة مكسورة جزئياً، وكأس مكسور يحمل آثار سم قاتل، وأربعة مشتبه بهم لديهم دوافع قوية.',
  location: 'مكان الجريمة - غرفة المعيشة والمكتب',
  difficulty: 'سهل',
  suspects: [
    {
      id: 'suspect_sami',
      name: 'سامي الحربي',
      role: 'مدير المنزل',
      avatar: '👔',
      bio: 'يشرف على القصر ويحمل المفاتيح الرئيسية للغرف، تصرفاته مريبة وتفادى النظر مباشرة.',
      alibi: 'يدعي أنه كان يشرف على جناح الخدم وتفقد الأبواب الخارجية أثناء العاصفة.',
      motive: 'اكتشف البارون مؤخراً اختلاسات وسوء إدارة مالية وهدده بالعزل والمحاكمة.',
      isCulprit: false,
      interrogated: false,
      suspicionLevel: 3
    },
    {
      id: 'suspect_layla',
      name: 'ليلى العتيبي',
      role: 'صديقة الضحية',
      avatar: '👩',
      bio: 'كاتبة وباحثة مقربة من عائلة البارون، كانت متواجدة بالقصر وقت وقوع الحادثة.',
      alibi: 'تدعي: كنتُ في المكتبة أقرأ حين سمعتُ صوتاً غريباً، ظننتُ أنه من الشارع.',
      motive: 'خلافات شخصية حادة ووثائق سرية كانت بحوزة البارون ترفض كشفها.',
      isCulprit: false,
      interrogated: false,
      suspicionLevel: 3
    },
    {
      id: 'suspect_majed',
      name: 'ماجد السليم',
      role: 'عامل الصيانة',
      avatar: '🔧',
      bio: 'عامل صيانة متجول تم استدعاؤه لإصلاح أقفال النوافذ والحديقة قبل العاصفة.',
      alibi: 'كان في ورشة الحديقة الخلفية يجمع أدواته قبل أن يشتد المطر.',
      motive: 'طرد سابق وتراكم ديون ثقيلة وتهديدات تلقاها من مرابين.',
      isCulprit: false,
      interrogated: false,
      suspicionLevel: 2
    },
    {
      id: 'suspect_tariq',
      name: 'طارق منصور',
      role: 'ابن أخ البارون والوريث المفترض',
      avatar: '💼',
      bio: 'شاب غارق في ديون المقامرة، اعتاد الاعتماد كلياً على مخصصات عمه المالية.',
      alibi: 'يدعي أنه غادر القصر في تمام الساعة العاشرة والنصف مساءً متوجهاً للنادي.',
      motive: 'اكتشف أن عمه كان بصدد تعديل الوصية لحرمانه كلياً بعد تراكم ديونه.',
      isCulprit: true,
      interrogated: false,
      suspicionLevel: 4
    }
  ],
  clues: [
    {
      id: 'clue_vase_shard',
      title: 'شظية مزهرية',
      category: 'مادي',
      description: 'تم العثور على شظية خزف مكسورة بالقرب من النافذة الداخلية.',
      detail: 'شظية حادة من مزهرية صينية أثرية، يبدو أنها كُسرت نتيجة اندفاع عنيف أو تسلل عبر إطار النافذة.',
      iconName: 'Flower2'
    },
    {
      id: 'clue_poison_cup',
      title: 'كأس مكسور',
      category: 'مادي',
      description: 'وجد بجانب الجثة على الأرض تفوح منه رائحة لوز مر خافتة.',
      detail: 'فحص الحافة أظهر بقايا سائل معتم برائحة لوز مر نفاذة (سم زيلين)، وشرب الضحية رشفة واحدة.',
      iconName: 'Wine'
    },
    {
      id: 'clue_spare_key',
      title: 'مفتاح احتياطي',
      category: 'مادي',
      description: 'تم العثور عليه في حديقة المنزل بالقرب من مدخل الخدم الخلفي.',
      detail: 'مفتاح برونزي يحمل شريطاً نحاسياً يطابق باب مكتب البارون من الداخل، مما يفسر لغز إقفال الباب.',
      iconName: 'Key'
    },
    {
      id: 'clue_mysterious_letter',
      title: 'رسالة مجهولة',
      category: 'وثيقة',
      description: 'ورقة ممزقة عليها كتابة غير واضحة ونهاية تحذيرية غامضة.',
      detail: 'تحمل عبارة مشوهة: "الليلة تنتهي كل المطالبات أو تواجه الفضيحة الكبرى".',
      iconName: 'FileText'
    },
    {
      id: 'clue_muddy_footprints',
      title: 'آثار أقدام',
      category: 'مادي',
      description: 'آثار طين باتجاه الباب الخلفي للحديقة نافذة المكتب.',
      detail: 'طبعات حذاء رجالي فاخر مغطى بوحل الحديقة، متجهة نحو شجيرات الورد تحت النافذة.',
      iconName: 'Footprints'
    },
    {
      id: 'clue_amended_will',
      title: 'مسوّدة الوصية المعدلة',
      category: 'وثيقة',
      description: 'وثيقة رسمية كتبها البارون تنص على تحويل كامل تركته وحرمان طارق.',
      detail: 'مختومة بتوقيع أولي مؤرخ بنفس يوم الجريمة، وكانت مخبأة تحت مدفأة المكتب شبه محترقة.',
      iconName: 'FileText'
    },
    {
      id: 'clue_broken_watch',
      title: 'ساعة يد ذهبية محطمة',
      category: 'مادي',
      description: 'ساعة اللورد السويسرية الفاخرة، زجاجها مكسور وتوقفت عقاربها بدقة عند 11:15.',
      detail: 'اصطدمت بحافة المكتب الرخامي لحظة سقوطه، مما يثبت بدقة توقيت وقوع الجريمة.',
      iconName: 'Clock'
    }
  ],
  timeline: [
    {
      id: 'time_1',
      time: '08:00 م',
      description: 'وصول د. ليلى وتقديم جرعة مقوي القلب ومغادرتها الرسمية للقصر.',
      order: 1
    },
    {
      id: 'time_2',
      time: '09:30 م',
      description: 'مشادة كلامية عنيفة وصراخ بين البارون وطارق بسبب ديون القمار ورفض العم سدادها.',
      relatedSuspectId: 'suspect_tariq',
      order: 2
    },
    {
      id: 'time_3',
      time: '10:45 م',
      description: 'فريد الوكيل المالي يُشاهد قرب بهو المكتب الرئيسي بدفتر الحسابات.',
      relatedSuspectId: 'suspect_farid',
      order: 3
    },
    {
      id: 'time_4',
      time: '11:15 م',
      description: 'صوت ارتطام مكتوم وتوقف ساعة البارون الذهبية بعد سقوط الكأس المسموم.',
      order: 4
    },
    {
      id: 'time_5',
      time: '11:40 م',
      description: 'سميرة تدخل صينية الشاي فتجد الباب موارباً والجثة ملقاة خلف المكتب.',
      relatedSuspectId: 'suspect_samira',
      order: 5
    }
  ],
  deductions: [
    {
      id: 'deduction_1',
      title: 'كشف الخدعة الزمنية والمغادرة المزعومة',
      requiredClueIds: ['clue_broken_watch', 'clue_muddy_footprints'],
      conclusion: 'توقفت الساعة عند 11:15 بينما يدعي طارق أنه غادر في 10:30؛ وجود آثار الأقدام الموحلة تحت نافذة المكتب يثبت تسلله عبر الحديقة في وقت الجريمة!',
      unlocked: false
    },
    {
      id: 'deduction_2',
      title: 'الدافع القاتل وسلاح الجريمة',
      requiredClueIds: ['clue_poison_cup', 'clue_amended_will'],
      conclusion: 'مسودة الوصية التي تحرم طارق ومحاولة حرقها السريعة توضح أن القاتل تصرف بدافع الذعر المالي بعد علمه بالوثيقة، مستخدماً سم الخزانة السريعة.',
      unlocked: false
    }
  ],
  startNodeId: 'node_intro',
  nodes: {
    node_intro: {
      id: 'node_intro',
      phase: 1,
      phaseName: 'فحص مسرح الجريمة',
      messages: [
        {
          type: 'narrator',
          text: 'ليلة ماطرة، غرفة مغلقة من الداخل، وصاحبها وجد جثة هامدة... لا يوجد دخول أو خروج واضح. من القاتل؟'
        },
        {
          type: 'character',
          sender: 'استجواب: ليلى العتيبي',
          senderAvatar: '👩',
          text: 'كنتُ في المكتبة أقرأ حين سمعتُ صوتاً غريباً، ظننتُ أنه من الشارع.'
        },
        {
          type: 'clue',
          clueId: 'clue_vase_shard',
          text: 'تم العثور على دليل جديد: شظية مزهرية - تم العثور على شظية خزف مكسورة بالقرب من النافذة الداخلية.'
        }
      ],
      effects: {
        addClue: 'clue_vase_shard'
      },
      choices: [
        {
          id: 'c_inspect_desk',
          text: 'فحص مكتب البارون والكأس الفضي الملقى بجواره',
          nextNodeId: 'node_desk_inspection'
        },
        {
          id: 'c_inspect_fireplace',
          text: 'معاينة المدفأة المشتعلة والأوراق في قاعها',
          nextNodeId: 'node_fireplace_inspection'
        },
        {
          id: 'c_inspect_window',
          text: 'الاقتراب من النافذة الكبيرة المطلة على الحديقة الخلفية',
          nextNodeId: 'node_window_inspection'
        }
      ]
    },
    node_desk_inspection: {
      id: 'node_desk_inspection',
      phase: 1,
      phaseName: 'فحص مسرح الجريمة',
      messages: [
        {
          type: 'narrator',
          text: 'تقترب من المكتب الخشبي الماهوجني. اللورد مستلقٍ على كرسيه الجلدي، وملامحه متشنجة بشدة تنم عن ألم مفاجئ حاد.'
        },
        {
          type: 'clue',
          clueId: 'clue_poison_cup',
          text: 'تم العثور على دليل: كأس الفضة المسموم - تفوح منه رائحة لوز مر نفاذة تشير إلى سم زيلين المركز.'
        },
        {
          type: 'clue',
          clueId: 'clue_broken_watch',
          text: 'تم العثور على دليل: ساعة يد ذهبية محطمة - عقاربها متوقفة بشكل قاطع عند الساعة 11:15 تماماً.'
        }
      ],
      effects: {
        addClue: 'clue_poison_cup',
        unlockTimeline: ['time_4']
      },
      choices: [
        {
          id: 'c_desk_to_fireplace',
          text: 'التوجه لفحص المدفأة المشتعلة',
          nextNodeId: 'node_fireplace_inspection'
        },
        {
          id: 'c_desk_to_interrogations',
          text: 'الانتقال إلى صالون الضيوف لبدء استجواب المشتبه بهم',
          nextNodeId: 'node_interrogations_hub'
        }
      ]
    },
    node_fireplace_inspection: {
      id: 'node_fireplace_inspection',
      phase: 1,
      phaseName: 'فحص مسرح الجريمة',
      messages: [
        {
          type: 'narrator',
          text: 'الجمر في المدفأة ما زال متقداً برائحة رماد ورق حديث الاحتراق. تستخدم ملقطاً حديدياً لسحب ورقة قانونية سميكة احترقت أطرافها فقط.'
        },
        {
          type: 'clue',
          clueId: 'clue_amended_will',
          text: 'تم العثور على دليل: مسوّدة الوصية المعدلة - البارون ألغى نصيب ابن أخيه طارق بالكامل وكتب بخط يده: "لا مليم لقامر لا يرجى صلاحه".'
        }
      ],
      effects: {
        addClue: 'clue_amended_will'
      },
      choices: [
        {
          id: 'c_fireplace_to_window',
          text: 'فحص النافذة والشرفة الخارجية',
          nextNodeId: 'node_window_inspection'
        },
        {
          id: 'c_fireplace_to_interrogations',
          text: 'الانتقال لصالة الاستجوابات لمواجهة المشتبه بهم',
          nextNodeId: 'node_interrogations_hub'
        }
      ]
    },
    node_window_inspection: {
      id: 'node_window_inspection',
      phase: 1,
      phaseName: 'فحص مسرح الجريمة',
      messages: [
        {
          type: 'narrator',
          text: 'النافذة المطلة على الحديقة كانت غير محكمة القفل، وهناك آثار طين رطب على الإطار الداخلي، وكسر في بعض شجيرات الورد بالأسفل.'
        },
        {
          type: 'clue',
          clueId: 'clue_muddy_gloves',
          text: 'تم العثور على دليل: قفازات جلدية مبللة بالوحل - مرمية بين الشجيرات وتحمل رائحة عطر باريسي فواح.'
        },
        {
          type: 'clue',
          clueId: 'clue_toxicology_note',
          text: 'تم العثور على دليل: مذكرة الصيدلية المنزلية - درج الأدوية القريب مفتوح مع نقص أمبولة الزيلين.'
        }
      ],
      effects: {
        addClue: 'clue_muddy_gloves'
      },
      choices: [
        {
          id: 'c_window_to_interrogations',
          text: 'الانتقال إلى الصالون لبدء استجواب المشتبه بهم الأربعة',
          nextNodeId: 'node_interrogations_hub'
        }
      ]
    },
    node_interrogations_hub: {
      id: 'node_interrogations_hub',
      phase: 2,
      phaseName: 'استجواب المشتبه بهم',
      messages: [
        {
          type: 'narrator',
          text: 'يجلس المشتبه بهم الأربعة في الصالون الكبير تحت حراسة مشددة. التوتر يسود المكان والعيون تتبادل نظرات الشك والاتهام.'
        },
        {
          type: 'character',
          sender: 'سميرة إبراهيم',
          senderAvatar: '🗝️',
          text: 'يا حضرة المحقق، لا يعلم كم عانينا في خدمة هذا الرجل، لكن القتل لم يكن في حسابات أحد منا!'
        }
      ],
      choices: [
        {
          id: 'c_ask_tariq',
          text: 'استجواب طارق منصور (ابن الأخ والوريث)',
          nextNodeId: 'node_interrogate_tariq'
        },
        {
          id: 'c_ask_farid',
          text: 'استجواب فريد الراوي (الوكيل المالي)',
          nextNodeId: 'node_interrogate_farid'
        },
        {
          id: 'c_ask_layla',
          text: 'استجواب د. ليلى شوكت (الطبيبة الخاصة)',
          nextNodeId: 'node_interrogate_layla'
        },
        {
          id: 'c_ask_samira',
          text: 'استجواب سميرة إبراهيم (مديرة القصر)',
          nextNodeId: 'node_interrogate_samira'
        },
        {
          id: 'c_ready_to_accuse',
          text: 'الانتقال إلى مرحلة التقييم والاتهام النهائي (إذا جمعت ما يكفي)',
          nextNodeId: 'node_accusation_chamber'
        }
      ]
    },
    node_interrogate_tariq: {
      id: 'node_interrogate_tariq',
      phase: 2,
      phaseName: 'استجواب المشتبه بهم',
      messages: [
        {
          type: 'player',
          text: 'أين كنت يا سيد طارق في تمام الساعة 11:15 مساءً؟ سمعت الجيران يتحدثون عن مشادة حامية بينك وبين عمك.'
        },
        {
          type: 'character',
          sender: 'طارق منصور',
          senderAvatar: '👔',
          text: 'هذا افتراء! نعم تحدثنا عند التاسعة والنصف حول بعض المستحقات، لكنني غادرت القصر في 10:30 تماماً إلى نادي البلياردو! اسألوا حارس البوابة!'
        },
        {
          type: 'player',
          text: 'حارس البوابة يقول إنك غادرت سيارتك لكن الباب الخلفي للحديقة كان مفتوحاً. وماذا عن القفازات المبللة تحت النافذة التي تفوح بعطرك نفسه؟'
        },
        {
          type: 'character',
          sender: 'طارق منصور',
          senderAvatar: '👔',
          text: '(يتصبب عرقاً) عطري؟ الكثير من النبلاء يستخدمون هذا العطر! أنت تحاول توريطي لأني الوريث الوحيد!'
        }
      ],
      effects: {
        modifyTrust: -15,
        unlockTimeline: ['time_2']
      },
      choices: [
        {
          id: 'c_back_hub_from_tariq',
          text: 'العودة لصالون الاستجواب لاستكمال بقية الإفادات',
          nextNodeId: 'node_interrogations_hub'
        }
      ]
    },
    node_interrogate_farid: {
      id: 'node_interrogate_farid',
      phase: 2,
      phaseName: 'استجواب المشتبه بهم',
      messages: [
        {
          type: 'player',
          text: 'سيد فريد، بصفتك الوكيل المالي، عثرنا على تضارب في دفاتر الحسابات تشير لاختلاس أموال ضخمة.'
        },
        {
          type: 'character',
          sender: 'فريد الراوي',
          senderAvatar: '💼',
          text: 'أعترف بوجود ارتباك مالي، وكنت في مكتبي بالطابق السفلي أجهز إيضاحات للبارون، لكنني لم أصعد لمكتبه ليلاً. لست قاتلاً؛ السجن المالي أهون من حبل المشنقة!'
        },
        {
          type: 'character',
          sender: 'فريد الراوي',
          senderAvatar: '💼',
          text: 'إن أردت الحقيقة، رأيت طارق يتسلل عبر ممر الحديقة نحو الساعة الحادية عشرة وهو يخفي شيئاً تحت سترته!'
        }
      ],
      effects: {
        modifyTrust: 10,
        unlockTimeline: ['time_3']
      },
      choices: [
        {
          id: 'c_back_hub_from_farid',
          text: 'العودة لصالون الاستجواب لمتابعة الخيوط',
          nextNodeId: 'node_interrogations_hub'
        }
      ]
    },
    node_interrogate_layla: {
      id: 'node_interrogate_layla',
      phase: 2,
      phaseName: 'استجواب المشتبه بهم',
      messages: [
        {
          type: 'player',
          text: 'دكتورة ليلى، سم الزيلين الذي أودى بحياة البارون هو مستحضر طبي خطير يتطلب تصريحاً خاصاً. كيف تفسرين نقص أمبولة من صيدليته؟'
        },
        {
          type: 'character',
          sender: 'د. ليلى شوكت',
          senderAvatar: '🩺',
          text: 'أنا من طلب هذه الأمبولة قبل أسبوعين لأبحاث ضغط الدم المعتمدة. وكانت الخزانة مقفلة والمفتاح في درج البارون الشخصي. حين غادرت في الثامنة كانت الأمبولة في مكانها تماماً.'
        },
        {
          type: 'character',
          sender: 'د. ليلى شوكت',
          senderAvatar: '🩺',
          text: 'من استخدمه كان يعلم مكان المفتاح، وتوقيت تناول البارون لعصيره المسائي الساخن.'
        }
      ],
      effects: {
        modifyTrust: 15,
        unlockTimeline: ['time_1']
      },
      choices: [
        {
          id: 'c_back_hub_from_layla',
          text: 'العودة إلى صالون الاستجواب',
          nextNodeId: 'node_interrogations_hub'
        }
      ]
    },
    node_interrogate_samira: {
      id: 'node_interrogate_samira',
      phase: 2,
      phaseName: 'استجواب المشتبه بهم',
      messages: [
        {
          type: 'player',
          text: 'سيدة سميرة، كيف عثرت على الجثة؟'
        },
        {
          type: 'character',
          sender: 'سميرة إبراهيم',
          senderAvatar: '🗝️',
          text: 'كنت أحمل صينية الشاي في 11:40 م، وجدت باب المكتب موارباً والأنوار خافتة، وحين ناديت لم يجب.. رأيت الكأس منسكباً وهو ملقى بلا حراك، فصرخت واستدعيت الحراس.'
        },
        {
          type: 'character',
          sender: 'سميرة إبراهيم',
          senderAvatar: '🗝️',
          text: 'وقبل ذلك بنصف ساعة سمعت وقع خطوات مسرعة على الدرج الجانبي المؤدي للحديقة الخلفية.'
        }
      ],
      effects: {
        modifyTrust: 20,
        unlockTimeline: ['time_5']
      },
      choices: [
        {
          id: 'c_back_hub_from_samira',
          text: 'العودة لصالون الاستجواب للبت في قرارك',
          nextNodeId: 'node_interrogations_hub'
        }
      ]
    },
    node_accusation_chamber: {
      id: 'node_accusation_chamber',
      phase: 4,
      phaseName: 'المواجهة والاتهام النهائي',
      messages: [
        {
          type: 'narrator',
          text: 'اجتمع الجميع في قاعة المكتب. نظرات الترقب تملأ الأفق. حان وقت توجيه أصابع الاتهام مدعومة بالأدلة القطعية.'
        },
        {
          type: 'character',
          sender: 'ضابط الدورية كمال',
          senderAvatar: '👮‍♂️',
          text: 'سيدي المحقق، القضاة والنيابة بانتظار تقريرك الحاسم. من هو المتهم بقتل البارون منصور؟'
        }
      ],
      choices: [
        {
          id: 'c_accuse_tariq',
          text: 'أوجه الاتهام إلى [طارق منصور] بالقتل العمد والتسميم لإنقاذ ميراثه المحروم منه!',
          nextNodeId: 'node_ending_correct_tariq'
        },
        {
          id: 'c_accuse_farid',
          text: 'أوجه الاتهام إلى [فريد الراوي] للتستر على اختلاساته المالية المتراكمة.',
          nextNodeId: 'node_ending_wrong_farid'
        },
        {
          id: 'c_accuse_layla',
          text: 'أوجه الاتهام إلى [د. ليلى شوكت] لامتلاكها المعرفة الكيميائية بالسم.',
          nextNodeId: 'node_ending_wrong_layla'
        },
        {
          id: 'c_accuse_samira',
          text: 'أوجه الاتهام إلى [سميرة إبراهيم] لكونها أول من تواجد في مسرح الجريمة.',
          nextNodeId: 'node_ending_wrong_samira'
        }
      ]
    },
    node_ending_correct_tariq: {
      id: 'node_ending_correct_tariq',
      phase: 4,
      phaseName: 'إسدال الستار - إدانة ناجحة',
      isEnding: true,
      isCorrectEnding: true,
      endingVerdict: 'إدانة صحيحة وقاطعة: تم الكشف عن المجرم الحقيقي!',
      messages: [
        {
          type: 'player',
          text: 'القاتل هو طارق منصور! حين اكتشفت مسودة الوصية التي تحرمك من كل شيء، ثارت ثائرتك وتسللت لدرج المكتب واستوليت على أمبولة الزيلين، ودسستها في كأس عمك!'
        },
        {
          type: 'player',
          text: 'ادعيت مغادرة القصر، لكنك دخلت من النافذة بالقفازات التي عثرنا عليها تحت المطر برائحة عطرك، وتوقفت ساعة يد البارون في 11:15 أثناء صراعه معك!'
        },
        {
          type: 'character',
          sender: 'طارق منصور',
          senderAvatar: '👔',
          text: '(ينهار باكياً على ركبتيه) كان سيتركني في الشارع للمرابين! بنيت حياتي على أمل هذا الإرث، ولم يترك لي خياراً آخر... لقد انتهى كل شيء!'
        },
        {
          type: 'system',
          text: 'تهانينا! تم إغلاق القضية بنجاح باهر وكسبت نقاط خبرة وجوائز التحقيق الذهبية.'
        }
      ]
    },
    node_ending_wrong_farid: {
      id: 'node_ending_wrong_farid',
      phase: 4,
      phaseName: 'إسدال الستار - اتهام خاطئ',
      isEnding: true,
      isCorrectEnding: false,
      endingVerdict: 'اتهام باطل: فريد مختلس لكنه ليس القاتل، وأفلت المجرم الحقيقي بتركته!',
      messages: [
        {
          type: 'character',
          sender: 'فريد الراوي',
          senderAvatar: '💼',
          text: 'هذا جنون! سجلات كاميرات المبنى الفرعي تثبت وجودي بالأسفل مع الحراس! لقد اتهمت الشخص الخطأ وأفلت طارق بجريمته!'
        },
        {
          type: 'system',
          text: 'أخفقت في تحديد الجاني الحقيقي. خسر مكتبك نقاط مصداقية ويمكنك إعادة التحقيق لتحقيق نتيجة أفضل.'
        }
      ]
    },
    node_ending_wrong_layla: {
      id: 'node_ending_wrong_layla',
      phase: 4,
      phaseName: 'إسدال الستار - اتهام خاطئ',
      isEnding: true,
      isCorrectEnding: false,
      endingVerdict: 'اتهام باطل: د. ليلى كانت في غرفة العمليات وقت الجريمة ولدها شهود رسميون!',
      messages: [
        {
          type: 'character',
          sender: 'د. ليلى شوكت',
          senderAvatar: '🩺',
          text: 'اتهامك مبني على شبهة كيميائية فقط! سجلات المستشفى تؤكد إجرائي عملية طارئة في 11:15 مساءً! محاميتي ستطالب برد اعتبار فوري.'
        },
        {
          type: 'system',
          text: 'أخفقت في استنتاج التوقيت الصحيح وتطابق الأدلة. خسر مكتبك بعض السمعة.'
        }
      ]
    },
    node_ending_wrong_samira: {
      id: 'node_ending_wrong_samira',
      phase: 4,
      phaseName: 'إسدال الستار - اتهام خاطئ',
      isEnding: true,
      isCorrectEnding: false,
      endingVerdict: 'اتهام باطل: سميرة مسكينة لا علم لها بالكيمياء أو الميراث، واستغل الجاني طيبتها!',
      messages: [
        {
          type: 'character',
          sender: 'سميرة إبراهيم',
          senderAvatar: '🗝️',
          text: 'حسبي الله ونعم الوكيل! خادمة مخلصة 20 عاماً تجعلون منها قاتلة بالسموم؟! أين ضميركم يا رجال الشرطة؟!'
        },
        {
          type: 'system',
          text: 'اتهام غير مدعوم بأي دليل مادي. تراجع رصيد خبرتك نتيجة الاتهام العشوائي.'
        }
      ]
    }
  }
};
