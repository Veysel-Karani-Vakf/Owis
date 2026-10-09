export type PioneerRosterEntry = {
  slug: string;
  nameAr: string;
  nameLatin: string;
  shortNameAr?: string;
  shortNameLatin?: string;
  cohortId: 'cohort-1' | 'cohort-2' | 'cohort-3';
  origin: string;
  city?: string;
  university?: string;
  degree: string;
  major: string;
  image?: string;
  imagePosition?: string;
};

/**
 * Source: "كشف كل الرواد أكتوبر 2026م.xlsx" supplied by the user.
 * The order follows the source worksheet so that future comparisons stay simple.
 */
export const pioneersRoster: PioneerRosterEntry[] = [
  { slug: 'asmaa-shaeen', nameAr: 'أسماء شعين محسن شعين', nameLatin: 'Asmaa Shaeen Mohsen Shaeen', cohortId: 'cohort-1', origin: 'عدن', city: 'كونيا', university: 'نجم الدين أربكان', degree: 'بكالوريوس', major: 'إدارة أعمال' },
  { slug: 'alaa-abdullah-abdulhakim', nameAr: 'الاء عبد الله عبدالحكيم', nameLatin: 'Alaa Abdullah Abdulhakim', cohortId: 'cohort-2', origin: 'تعز', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'إدارة صحية' },
  { slug: 'thuraya-abdulmumin-murshid', nameAr: 'ثريا عبد المؤمن سعيد مرشد', nameLatin: 'Thuraya Abdulmumin Saeed Murshid', cohortId: 'cohort-3', origin: 'إب', degree: 'بكالوريوس', major: 'إدارة صحية' },
  { slug: 'hanan-abdullah-qaid', nameAr: 'حنان عبد الله قائد', nameLatin: 'Hanan Abdullah Qaid', cohortId: 'cohort-2', origin: 'تعز', city: 'كونيا', university: 'جامعة سلجوق', degree: 'بكالوريوس', major: 'إدراة صحية' },
  { slug: 'raghad-abdulaziz-abdulrahman', nameAr: 'رغد عبدالعزيز عبدالرقيب عبدالرحمن', nameLatin: 'Raghad Abdulaziz Abdulraqib Abdulrahman', cohortId: 'cohort-3', origin: 'عدن', degree: 'بكالوريوس', major: 'تجارة دولية وتمويل' },
  { slug: 'rana-abdulaziz-abdulrahman', nameAr: 'رنا عبدالعزيز عبدالرقيب عبدالرحمن', nameLatin: 'Rana Abdulaziz Abdulraqib Abdulrahman', cohortId: 'cohort-3', origin: 'عدن', degree: 'بكالوريوس', major: 'تجارة دولية وتمويل' },
  { slug: 'isra-mohamed-bajubair', nameAr: 'إسراء محمد عوض باجبير', nameLatin: 'Isra Mohamed Awad Bajubair', cohortId: 'cohort-1', origin: 'عدن', city: 'سكاريا', university: 'سكاريا', degree: 'ماجستير', major: 'دراسات إسلامية' },
  { slug: 'aseel-najeeb', nameAr: 'أسيل نجيب', nameLatin: 'Aseel Najeeb', cohortId: 'cohort-2', origin: 'تعز', degree: 'ماجستير', major: 'ريادة أعمال' },
  { slug: 'marwa-fouad-al-ramsi', nameAr: 'مروه فؤاد سعيد قاسم الرامسي', nameLatin: 'Marwa Fouad Saeed Al-Ramsi', cohortId: 'cohort-1', origin: 'تعز', city: 'كونيا', university: 'سلجوق', degree: 'بكالوريوس', major: 'علاقات دولية' },
  { slug: 'abdullah-balhawal', nameAr: 'عبدالله عمر محفوظ بلهول', nameLatin: 'Abdullah Omar Balhawal', cohortId: 'cohort-1', origin: 'حضرموت', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'اقتصاد', image: '/pioneers/abdullah-balhawal.jpg', imagePosition: 'center 20%' },
  { slug: 'mohamed-hadijan', nameAr: 'محمد فيصل عبد حديجان', nameLatin: 'Mohamed Faisal Hadijan', cohortId: 'cohort-1', origin: 'حضرموت', city: 'كونيا', university: 'سلجوق', degree: 'بكالوريوس', major: 'اقتصاد' },
  { slug: 'raad-al-jalal', nameAr: 'رعد حسن الجلال', nameLatin: 'Raad Hassan Al-Jalal', cohortId: 'cohort-1', origin: 'إب', city: 'كونيا', university: 'نجم الدين أربكان', degree: 'ماجستير', major: 'إدارة أعمال' },
  { slug: 'jamal-al-husseini', nameAr: 'جمال عبدالملك مهيوب الحسيني', nameLatin: 'Jamal Abdulmalik Al-Husseini', cohortId: 'cohort-1', origin: 'تعز', city: 'كوتاهيا', university: 'دملوبينار', degree: 'بكالوريوس', major: 'إدارة أعمال' },
  { slug: 'mohamed-abdullah-suwaidan', nameAr: 'محمد عبدالله صالح سويدان', nameLatin: 'Mohamed Abdullah Saleh Suwaidan', cohortId: 'cohort-1', origin: 'حضرموت', city: 'كونيا', university: 'جامعة سلجوق', degree: 'بكالوريوس', major: 'إدارة أعمال' },
  { slug: 'ayman-riyadh-hassan', nameAr: 'أيمن رياض سعيد حسن', nameLatin: 'Ayman Riyadh Saeed Hassan', cohortId: 'cohort-1', origin: 'عدن', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'إدارة أعمال' },
  { slug: 'raslan-al-kindi', nameAr: 'رسلان فتح محمد محمد الكندي', nameLatin: 'Raslan Fath Mohamed Al-Kindi', cohortId: 'cohort-3', origin: 'ذمار', degree: 'بكالوريوس', major: 'إدارة أعمال' },
  { slug: 'abdullah-al-kalshat', nameAr: 'عبدالله محمد سعيد كلشات', nameLatin: 'Abdullah Mohamed Saeed Kalshat', cohortId: 'cohort-1', origin: 'المهرة', city: 'كونيا', university: 'جامعة سلجوق', degree: 'بكالوريوس', major: 'إدارة سياحية' },
  { slug: 'taher-khaled-taher', nameAr: 'طاهر خالد عبدالجبار طاهر', nameLatin: 'Taher Khaled Abduljabbar Taher', cohortId: 'cohort-3', origin: 'تعز', degree: 'بكالوريوس', major: 'إدارة سياحية' },
  { slug: 'abdulrahman-al-jariri', nameAr: 'عبدالرحمن محمد الجريري', nameLatin: 'Abdulrahman Mohamed Al-Jariri', cohortId: 'cohort-1', origin: 'حضرموت', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'تجارة دولية' },
  { slug: 'alaa-jamil-al-hilali', nameAr: 'علاء جميل علي الهلالي', nameLatin: 'Alaa Jamil Ali Al-Hilali', cohortId: 'cohort-1', origin: 'صنعاء', city: 'موغلا', university: 'موغلا', degree: 'بكالوريوس', major: 'تجارة دولية' },
  { slug: 'abdullah-saleh-huwaidi', nameAr: 'عبدالله صالح هويدي', nameLatin: 'Abdullah Saleh Huwaidi', cohortId: 'cohort-1', origin: 'حضرموت', city: 'كونيا', university: 'نجم الدين أربكان', degree: 'بكالوريوس', major: 'توجيه وإرشاد نفسي' },
  { slug: 'abdulrahman-rajih', nameAr: 'عبد الرحمن راجح', nameLatin: 'Abdulrahman Rajih', cohortId: 'cohort-2', origin: 'حجة', city: 'إسطنبول', university: 'إسطنبول', degree: 'بكالوريوس', major: 'توجيه وإرشاد نفسي' },
  { slug: 'mohamed-bajubair', nameAr: 'محمد لطفي عبيد باجبير', nameLatin: 'Mohamed Lotfi Bajubair', cohortId: 'cohort-1', origin: 'حضرموت', city: 'كونيا', university: 'سلجوق', degree: 'بكالوريوس', major: 'راديو وتلفزيون وسينما', image: '/pioneers/mohamed-bajubair.jpg', imagePosition: 'center 20%' },
  { slug: 'hamza-mohamed-irfan', nameAr: 'حمزة محمد عرفان', nameLatin: 'Hamza Mohamed Irfan', cohortId: 'cohort-1', origin: 'حضرموت', city: 'كونيا', university: 'جامعة سلجوق', degree: 'بكالوريوس', major: 'راديو وتلفزيون وسينما' },
  { slug: 'dhanin-al-howaishi', nameAr: 'ظنين صالح عبده محمد', nameLatin: 'Zanin Saleh Abdo Mohamed', cohortId: 'cohort-1', origin: 'عدن', city: 'كونيا', university: 'سلجوق', degree: 'ماجستير', major: 'صحافة', image: '/pioneers/dhanin-al-howaishi.jpg', imagePosition: 'center 18%' },
  { slug: 'salem-bin-ali-jaber', nameAr: 'سالم عبدالله صال حبيب بن علي جابر', nameLatin: 'Salem Abdullah Saleh Bin Ali Jaber', cohortId: 'cohort-3', origin: 'حضرموت', degree: 'بكالوريوس', major: 'صحافة' },
  { slug: 'ahmed-fouad-muqaydehan', nameAr: 'أحمد فؤاد عبدالله مقيدحان', nameLatin: 'Ahmed Fouad Abdullah Muqaydehan', cohortId: 'cohort-1', origin: 'حضرموت', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'علاقات دولية' },
  { slug: 'abdulrahman-al-shojaa', nameAr: 'عبدالرحمن عماد الشجاع', nameLatin: 'Abdulrahman Emad Al-Shojaa', cohortId: 'cohort-2', origin: 'تعز', city: 'كوتاهيا', university: 'دملوبينار', degree: 'بكالوريوس', major: 'علاقات وعلوم سياسية', image: '/pioneers/abdulrahman-al-shojaa.jpg', imagePosition: 'center 22%' },
  { slug: 'amin-al-haddad', nameAr: 'أمين فيصل الحداد', nameLatin: 'Amin Faisal Al-Haddad', cohortId: 'cohort-1', origin: 'الضالع', city: 'كونيا', university: 'نجم الدين أربكان', degree: 'بكالوريوس', major: 'علوم سياسية وإدارة عامة', image: '/pioneers/amin-al-haddad.jpg', imagePosition: 'center 20%' },
  { slug: 'nader-saeed-qarwan', nameAr: 'نادر سعيد فرج قروان', nameLatin: 'Nader Saeed Faraj Qarwan', cohortId: 'cohort-1', origin: 'حضرموت', city: 'كونيا', university: 'سلجوق', degree: 'ماجستير', major: 'محاسبة مالية' },
  { slug: 'yahya-zakaria-sawaban', nameAr: 'يحيى زكريا عبدربه صوابان', nameLatin: 'Yahya Zakaria Abdraboh Sawaban', cohortId: 'cohort-1', origin: 'شبوة', city: 'كونيا', university: 'نجم الدين أربكان', degree: 'بكالوريوس', major: 'نظم معلومات إدارية' },
  { slug: 'mohamed-nabil-al-tashi', nameAr: 'محمد نبيل محمد الطشي', nameLatin: 'Mohamed Nabil Al-Tashi', cohortId: 'cohort-3', origin: 'البيضاء', degree: 'بكالوريوس', major: 'نظم معلومات إدارية' },
  { slug: 'sumaya-al-rouhani', nameAr: 'سمية عبدالرحمن ناصر الروحاني', nameLatin: 'Sumaya Abdulrahman Al-Rouhani', cohortId: 'cohort-3', origin: 'الجوف', degree: 'بكالوريوس', major: 'بيولوجيا جزيئية و وراثة' },
  { slug: 'abdulaziz-mohamed-mazariq', nameAr: 'عبدالعزيز محمد محمد مزارق', nameLatin: 'Abdulaziz Mohamed Mazariq', cohortId: 'cohort-1', origin: 'المحويت', city: 'كوتاهيا', university: 'كوتاهيا الصحية', degree: 'بكالوريوس', major: 'تمريض', image: '/pioneers/abdulaziz-mohamed-mazariq.JPG', imagePosition: 'center 18%' },
  { slug: 'amat-al-rahman-al-warafi', nameAr: 'أمة الرحمن الورافي', nameLatin: 'Amat Al-Rahman Al-Warafi', cohortId: 'cohort-1', origin: 'تعز', city: 'غازي عنتاب', university: 'غازي عنتاب', degree: 'بكالوريوس', major: 'طب' },
  { slug: 'malak-waheed-al-faris', nameAr: 'ملاك وحيد الفريس', nameLatin: 'Malak Waheed Al-Faris', cohortId: 'cohort-2', origin: 'تعز', city: 'كونيا', university: 'نجم الدين أربكان', degree: 'بكالوريوس', major: 'علاج طبيعي' },
  { slug: 'duaa-nabil-johar', nameAr: 'دعاء نبيل جوهر', nameLatin: 'Duaa Nabil Johar', cohortId: 'cohort-2', origin: 'حضرموت', city: 'كونيا', university: 'نجم الدين أربكان', degree: 'بكالوريوس', major: 'علاج طبيعي' },
  { slug: 'sara-aidaroos', nameAr: 'سارة عبدالله عيدروس', nameLatin: 'Sara Abdullah Aidaroos', cohortId: 'cohort-3', origin: 'إب', degree: 'بكالوريوس', major: 'هندسة ذكاء صناعي' },
  { slug: 'manar-adel-saeed', nameAr: 'منار عادل سعيد سعيد', nameLatin: 'Manar Adel Saeed', cohortId: 'cohort-1', origin: 'عدن', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'هندسة معمارية' },
  { slug: 'noha-abdulqader-bayazid', nameAr: 'نهى عبدالقادر بايزيد', nameLatin: 'Noha Abdulqader Bayazid', cohortId: 'cohort-1', origin: 'حضرموت', city: 'كونيا', university: 'نجم الدين أربكان', degree: 'بكالوريوس', major: 'هندسة ميكاترونكس' },
  { slug: 'fursan-thabet', nameAr: 'فرسان ثابت', nameLatin: 'Fursan Thabet', cohortId: 'cohort-2', origin: 'تعز', degree: 'دكتوراة', major: 'أمين سيبراني' },
  { slug: 'ahmed-murtada', nameAr: 'احمد مرتضى', nameLatin: 'Ahmed Murtada', cohortId: 'cohort-1', origin: 'تعز', city: 'كونيا', university: 'كونيا تكنيك', degree: 'بكالوريوس', major: 'هندسة الكترونية كهربائية' },
  { slug: 'ahmed-hassan-al-ward', nameAr: 'أحمد حسن عبده الورد', nameLatin: 'Ahmed Hassan Abdo Al-Ward', cohortId: 'cohort-3', origin: 'المحويت', degree: 'بكالوريوس', major: 'هندسة الكترونية واتصالات' },
  { slug: 'issa-saad', nameAr: 'عيسى نعمان حمود سيف سعد', nameLatin: 'Issa Noman Hamoud Saad', cohortId: 'cohort-3', origin: 'إب', degree: 'بكالوريوس', major: 'هندسة برمجيات' },
  { slug: 'al-baraa-al-yadomi', nameAr: 'البراء عبدالله عبدالله عبدالله اليدومي', nameLatin: 'Al-Baraa Abdullah Al-Yadomi', cohortId: 'cohort-3', origin: 'آزال', degree: 'بكالوريوس', major: 'هندسة برمجيات', image: '/pioneers/al-baraa-al-yadomi.jpg', imagePosition: 'center 22%' },
  { slug: 'naji-saleh-al-qabali', nameAr: 'ناجي صالح صالح القبالي', nameLatin: 'Naji Saleh Al-Qabali', cohortId: 'cohort-1', origin: 'شبوة', city: 'كونيا', university: 'سلجوق', degree: 'ماجستير', major: 'هندسة جيولوجية' },
  { slug: 'al-harith-mohamed-al-samman', nameAr: 'الحارث محمد حسن السمان', nameLatin: 'Al-Harith Mohamed Hassan Al-Samman', cohortId: 'cohort-1', origin: 'المحويت', city: 'كوتاهيا', university: 'دملوبينار', degree: 'بكالوريوس', major: 'هندسة حاسوب' },
  { slug: 'owab-atta', nameAr: 'أواب توفيق عطاء', nameLatin: 'Owab Tawfiq Atta', cohortId: 'cohort-2', origin: 'صنعاء', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'هندسة حاسوب' },
  { slug: 'younis-ali', nameAr: 'يونس زين علي أحمد', nameLatin: 'Younis Zain Ali Ahmed', cohortId: 'cohort-3', origin: 'أبينس', degree: 'بكالوريوس', major: 'هندسة حاسوب' },
  { slug: 'abdulrahman-hassan', nameAr: 'عبدالرحمن عماد محمد حسن', nameLatin: 'Abdulrahman Emad Mohamed Hassan', cohortId: 'cohort-3', origin: 'الجند', degree: 'بكالوريوس', major: 'هندسة صناعية' },
  { slug: 'ali-badukhan', nameAr: 'علي محسن يسلم بادخن', nameLatin: 'Ali Mohsen Yaslam Badukhan', cohortId: 'cohort-3', origin: 'شبوة', degree: 'بكالوريوس', major: 'هندسة طبية حيوية' },
  { slug: 'wahi-hassan-mohamed', nameAr: 'وحي حسن أحمد حسن محمد', nameLatin: 'Wahi Hassan Ahmed Mohamed', cohortId: 'cohort-1', origin: 'عدن', city: 'كونيا', university: 'كونيا تكنيك', degree: 'بكالوريوس', major: 'هندسة كمبيوتر' },
  { slug: 'jalal-mubarak-muslim', nameAr: 'جلال مبارك مسلم', nameLatin: 'Jalal Mubarak Muslim', cohortId: 'cohort-1', origin: 'حضرموت', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'هندسة كهربائية إلكترونية' },
  { slug: 'mohamed-shakib-aqlan', nameAr: 'محمد شكيب عقلان', nameLatin: 'Mohamed Shakib Aqlan', cohortId: 'cohort-1', origin: 'عدن', city: 'كونيا', university: 'كونيا تكنيك', degree: 'بكالوريوس', major: 'هندسة كهربائية إلكترونية', image: '/pioneers/mohamed-shakib-aqlan.jpg', imagePosition: 'center 26%' },
  { slug: 'hossam-shaqibel', nameAr: 'حسام محمد شقيبل', nameLatin: 'Hossam Mohamed Shaqibel', cohortId: 'cohort-2', origin: 'الحديدة', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'هندسة كهربائية إلكترونية' },
  { slug: 'akram-baalawi', nameAr: 'أكرم حسين باعلوي', nameLatin: 'Akram Hussein Ba-Alawi', cohortId: 'cohort-2', origin: 'حضرموت', city: 'كونيا', university: 'نجم الدين أربكان', degree: 'بكالوريوس', major: 'هندسة كهربائية إلكترونية' },
  { slug: 'ali-al-khulaifi', nameAr: 'علي احمد سالم الخليفي', nameLatin: 'Ali Ahmed Salem Al-Khulaifi', cohortId: 'cohort-1', origin: 'شبوة', city: 'كونيا', university: 'كونيا تكنيك', degree: 'بكالوريوس', major: 'هندسة كيميائية' },
  { slug: 'mohamed-ramzi-saeed', nameAr: 'محمد رمزي سعيد قاسم', nameLatin: 'Mohamed Ramzi Saeed Qasim', cohortId: 'cohort-1', origin: 'لحج', city: 'كونيا', university: 'سلجوق', degree: 'بكالوريوس', major: 'هندسة كيميائية', image: '/pioneers/mohamed-ramzi-saeed.jpg', imagePosition: 'center 20%' },
  { slug: 'ali-abdo-al-jafa', nameAr: 'علي عبده قاسم غالب الجفاء', nameLatin: 'Ali Abdo Qasim Al-Jafa', cohortId: 'cohort-3', origin: 'تعز', degree: 'بكالوريوس', major: 'هندسة كيميائية' },
  { slug: 'hassan-bin-obeidullah', nameAr: 'حسن سعيد بن عبيدالله', nameLatin: 'Hassan Saeed Bin Obeidullah', cohortId: 'cohort-1', origin: 'حضرموت', city: 'سكاريا', university: 'سكاريا التطبيقية', degree: 'ماجستير', major: 'هندسة مدنية' },
  { slug: 'abdullah-alkharraz', nameAr: 'عبدالله عيسى عبدالله الخراز', nameLatin: 'Abdullah Issa Al-Kharraz', cohortId: 'cohort-3', origin: 'مأرب', degree: 'بكالوريوس', major: 'هندسة مدنية' },
  { slug: 'madeen-emad-al-lawkami', nameAr: 'مدين عماد اللوكمي', nameLatin: 'Madeen Emad Al-Lawkami', cohortId: 'cohort-1', origin: 'عمران', city: 'كوتاهيا', university: 'دملوبينار', degree: 'بكالوريوس', major: 'هندسة مواد ومعادن' },
  { slug: 'mohamed-raed-ibrahim', nameAr: 'محمد رائد إبراهيم', nameLatin: 'Mohamed Raed Ibrahim', cohortId: 'cohort-1', origin: 'عدن', city: 'كارابوك', university: 'كارابوك', degree: 'بكالوريوس', major: 'هندسة ميكاترونكس' },
  { slug: 'ahmed-amin-al-rabbadi', nameAr: 'أحمد أمين الربادي', nameLatin: 'Ahmed Amin Al-Rabbadi', cohortId: 'cohort-2', origin: 'تعز', city: 'سكاريا', university: 'سكاريا التطبيقية', degree: 'بكالوريوس', major: 'هندسة ميكاترونكس', image: '/pioneers/ahmed-amin-al-rabbadi.jpg', imagePosition: 'center 22%' },
  { slug: 'bassem-al-odaymi', nameAr: 'باسم عبده الأديمي', nameLatin: 'Bassem Abdo Al-Odaymi', cohortId: 'cohort-2', origin: 'تعز', city: 'إسطنبول', university: 'مرمرة', degree: 'بكالوريوس', major: 'هندسة ميكاترونكس' },
  { slug: 'abdulrahman-al-omaisi', nameAr: 'عبد الرحمن سامي العميسي', nameLatin: 'Abdulrahman Sami Al-Omaisi', cohortId: 'cohort-2', origin: 'ذمار', city: 'سكاريا', university: 'سكاريا التطبيقية', degree: 'بكالوريوس', major: 'هندسة ميكاترونكس' },
  { slug: 'mukhtar-aljaradi', nameAr: 'مختار خالد عبده سفيان الجرادي', nameLatin: 'Mukhtar Khaled Al-Jaradi', cohortId: 'cohort-3', origin: 'تعز', degree: 'بكالوريوس', major: 'هندسة ميكاترونكس' },
  { slug: 'abdulrahman-musa-al-eidaroos', nameAr: 'عبدالرحمن موسى سقاف العيدروس', nameLatin: 'Abdulrahman Musa Al-Eidaroos', cohortId: 'cohort-3', origin: 'حضرموت', degree: 'بكالوريوس', major: 'هندسة ميكاترونكس' },
  { slug: 'alzubair-alnuweirah', nameAr: 'الزبير محمد حسن أحمد النويره', nameLatin: 'Al-Zubair Mohamed Hassan Al-Nuweirah', cohortId: 'cohort-3', origin: 'تهامة', degree: 'بكالوريوس', major: 'هندسة ميكاترونكس' },
  { slug: 'alawi-al-hamati', nameAr: 'علوي الحماطي', nameLatin: 'Alawi Al-Hamati', cohortId: 'cohort-1', origin: 'تعز', city: 'كوتاهيا', university: 'دملوبينار', degree: 'بكالوريوس', major: 'هندسة ميكانيكية', image: '/pioneers/alawi-al-hamati.JPG', imagePosition: 'center 18%' },
  { slug: 'ziad-al-ezzi-ahmed', nameAr: 'زياد العزي أحمد', nameLatin: 'Ziad Al-Ezzi Ahmed', cohortId: 'cohort-2', origin: 'تعز', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'هندسة نظم معلومات' },
  { slug: 'hibat-al-rahman-al-himyari', nameAr: 'هبة الرحمن أحمد أحمد الحميري', nameLatin: 'Hibat Al-Rahman Ahmed Al-Himyari', cohortId: 'cohort-3', origin: 'صنعاء', city: 'إسطنبول', university: 'اسكودر', degree: 'بكالوريوس', major: 'هندسة حاسوب' },
  { slug: 'abdullah-al-naqeeb', nameAr: 'عبدالله عبدالله طه النقيب', nameLatin: 'Abdullah Abdullah Taha Al-Naqeeb', cohortId: 'cohort-3', origin: 'إب', city: 'سكاريا', university: 'سكاريا', degree: 'بكالوريوس', major: 'مالية' },
  { slug: 'ruqaya-yamani', nameAr: 'رقية نجيب حيدر يماني', nameLatin: 'Ruqaya Najeeb Haider Yamani', cohortId: 'cohort-3', origin: 'إب', city: 'إسطنبول', university: 'نيشان تاشه', degree: 'بكالوريوس', major: 'هندسة حاسوب' },
];

/**
 * Portraits supplied in the public Google Drive folder for the October 2026 roster.
 * Keeping the lookup separate from the spreadsheet-derived rows makes future roster
 * imports safe without losing the manually verified image matches.
 */
export const pioneerPortraitBySlug: Record<string, string> = {
  'asmaa-shaeen': '/pioneers/asmaa-shaeen.jpg',
  'alaa-abdullah-abdulhakim': '/pioneers/alaa-abdullah-abdulhakim.jpg',
  'thuraya-abdulmumin-murshid': '/pioneers/thuraya-abdulmumin-murshid.jpg',
  'hanan-abdullah-qaid': '/pioneers/hanan-abdullah-qaid.jpg',
  'rana-abdulaziz-abdulrahman': '/pioneers/rana-abdulaziz-abdulrahman.jpg',
  'isra-mohamed-bajubair': '/pioneers/isra-mohamed-bajubair.jpg',
  'abdullah-balhawal': '/pioneers/abdullah-balhawal.jpg',
  'mohamed-hadijan': '/pioneers/mohamed-hadijan.jpg',
  'mohamed-abdullah-suwaidan': '/pioneers/mohamed-abdullah-suwaidan.jpg',
  'raslan-al-kindi': '/pioneers/raslan-al-kindi.jpg',
  'abdullah-al-kalshat': '/pioneers/abdullah-al-kalshat.jpg',
  'abdulrahman-al-jariri': '/pioneers/abdulrahman-al-jariri.jpg',
  'alaa-jamil-al-hilali': '/pioneers/alaa-jamil-al-hilali.jpg',
  'abdullah-saleh-huwaidi': '/pioneers/abdullah-saleh-huwaidi.jpg',
  'mohamed-bajubair': '/pioneers/mohamed-bajubair.jpg',
  'hamza-mohamed-irfan': '/pioneers/hamza-mohamed-irfan.jpg',
  'dhanin-al-howaishi': '/pioneers/dhanin-al-howaishi.jpg',
  'abdulrahman-al-shojaa': '/pioneers/abdulrahman-al-shojaa.jpg',
  'amin-al-haddad': '/pioneers/amin-al-haddad.jpg',
  'yahya-zakaria-sawaban': '/pioneers/yahya-zakaria-sawaban.jpg',
  'sumaya-al-rouhani': '/pioneers/sumaya-al-rouhani.jpg',
  'abdulaziz-mohamed-mazariq': '/pioneers/abdulaziz-mohamed-mazariq.JPG',
  'sara-aidaroos': '/pioneers/sara-aidaroos.jpg',
  'fursan-thabet': '/pioneers/fursan-thabet.jpg',
  'ahmed-murtada': '/pioneers/ahmed-murtada.jpg',
  'issa-saad': '/pioneers/issa-saad.jpg',
  'al-baraa-al-yadomi': '/pioneers/al-baraa-al-yadomi.jpg',
  'al-harith-mohamed-al-samman': '/pioneers/al-harith-mohamed-al-samman.jpg',
  'owab-atta': '/pioneers/owab-atta.jpg',
  'jalal-mubarak-muslim': '/pioneers/jalal-mubarak-muslim.jpg',
  'mohamed-shakib-aqlan': '/pioneers/mohamed-shakib-aqlan.jpg',
  'hossam-shaqibel': '/pioneers/hossam-shaqibel.jpg',
  'akram-baalawi': '/pioneers/akram-baalawi.jpg',
  'ali-al-khulaifi': '/pioneers/ali-al-khulaifi.jpg',
  'mohamed-ramzi-saeed': '/pioneers/mohamed-ramzi-saeed.jpg',
  'ali-abdo-al-jafa': '/pioneers/ali-abdo-al-jafa.jpg',
  'abdullah-alkharraz': '/pioneers/abdullah-alkharraz.jpg',
  'ahmed-amin-al-rabbadi': '/pioneers/ahmed-amin-al-rabbadi.jpg',
  'bassem-al-odaymi': '/pioneers/bassem-al-odaymi.jpg',
  'abdulrahman-al-omaisi': '/pioneers/abdulrahman-al-omaisi.jpg',
  'mukhtar-aljaradi': '/pioneers/mukhtar-aljaradi.jpg',
  'alzubair-alnuweirah': '/pioneers/alzubair-alnuweirah.jpg',
  'alawi-al-hamati': '/pioneers/alawi-al-hamati.JPG',
  'ziad-al-ezzi-ahmed': '/pioneers/ziad-al-ezzi-ahmed.jpg',
  'abdullah-al-naqeeb': '/pioneers/abdullah-al-naqeeb.jpg',
  'ruqaya-yamani': '/pioneers/ruqaya-yamani.jpg',
};
