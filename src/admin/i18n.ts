import type { Locale } from '@/lib/types';

// Admin UI strings in the three site locales. The admin reuses the site's
// active locale (and RTL direction) from the I18n provider.
export type AdminStrings = {
  brand: string;
  dashboard: string;
  signIn: string;
  signOut: string;
  email: string;
  password: string;
  signingIn: string;
  loginError: string;
  loginSubtitle: string;
  search: string;
  create: string;
  edit: string;
  save: string;
  saving: string;
  saved: string;
  cancel: string;
  delete: string;
  confirmDelete: string;
  deleting: string;
  loading: string;
  empty: string;
  published: string;
  draft: string;
  order: string;
  actions: string;
  back: string;
  newItem: string;
  saveError: string;
  required: string;
  addItem: string;
  removeItem: string;
  moveUp: string;
  moveDown: string;
  uploadImage: string;
  uploading: string;
  orPasteUrl: string;
  preview: string;
  loginPending: string;
  overview: string;
  totalItems: string;
  recentSubmissions: string;
  noAccess: string;
  markRead: string;
  markNew: string;
  archive: string;
  status: string;
  date: string;
  view: string;
  jsonInvalid: string;
  connectionMissing: string;
  // Dialogs and feedback
  confirm: string;
  typeToConfirm: string;
  unsavedTitle: string;
  unsavedBody: string;
  leaveWithoutSaving: string;
  stay: string;
  saveAndLeave: string;
  savedToast: string;
  deletedToast: string;
  undo: string;
  deleteTitle: string;
  deleteBody: string;
  noChanges: string;
  lastSaved: string;
  fixErrors: string;
  // Lists
  publish: string;
  unpublish: string;
  openOnSite: string;
  translations: string;
  all: string;
  clear: string;
  items: string;
  addFirst: string;
  updatedAt: string;
  // Navigation groups
  navSitePages: string;
  navRecords: string;
  navLibrary: string;
  navInbox: string;
  navTools: string;
  sitePages: string;
  mediaLibrary: string;
  restoreContent: string;
  searchEverything: string;
  searchHint: string;
  noSearchResults: string;
  editingLanguage: string;
  copyFrom: string;
  chooseFromLibrary: string;
  moreSettings: string;
  whereItAppears: string;
  help: string;
  noAccessHint: string;
  /** Tab name for a page's own texts inside a site-page hub. */
  pageTexts: string;
  sections: Record<string, string>;
};

export const adminStrings: Record<Locale, AdminStrings> = {
  ar: {
    brand: 'لوحة تحكم وقف أويس القرني',
    dashboard: 'لوحة التحكم',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signingIn: 'جارٍ الدخول…',
    loginError: 'بيانات الدخول غير صحيحة',
    loginSubtitle: 'ادخل بياناتك لإدارة محتوى الموقع',
    search: 'بحث…',
    create: 'إضافة',
    edit: 'تعديل',
    save: 'حفظ',
    saving: 'جارٍ الحفظ…',
    saved: 'تم الحفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    confirmDelete: 'هل أنت متأكد من الحذف؟',
    deleting: 'جارٍ الحذف…',
    loading: 'جارٍ التحميل…',
    empty: 'لا توجد عناصر بعد',
    published: 'منشور',
    draft: 'مسودة',
    order: 'الترتيب',
    actions: 'إجراءات',
    back: 'رجوع',
    newItem: 'عنصر جديد',
    saveError: 'تعذر الحفظ',
    required: 'مطلوب',
    addItem: 'إضافة عنصر',
    removeItem: 'حذف',
    moveUp: 'أعلى',
    moveDown: 'أسفل',
    uploadImage: 'رفع صورة',
    uploading: 'جارٍ الرفع…',
    orPasteUrl: 'أو الصق الرابط',
    preview: 'معاينة',
    loginPending: 'يتم التحقق…',
    overview: 'نظرة عامة',
    totalItems: 'إجمالي العناصر',
    recentSubmissions: 'أحدث الرسائل',
    noAccess: 'لا تملك صلاحية الوصول لهذه الصفحة',
    markRead: 'وضع كمقروء',
    markNew: 'وضع كجديد',
    archive: 'أرشفة',
    status: 'الحالة',
    date: 'التاريخ',
    view: 'عرض',
    jsonInvalid: 'صيغة JSON غير صحيحة',
    connectionMissing: 'لم يتم ضبط الاتصال بقاعدة البيانات',
    confirm: 'تأكيد',
    typeToConfirm: 'اكتب "{word}" للتأكيد',
    unsavedTitle: 'لديك تغييرات غير محفوظة',
    unsavedBody: 'إذا غادرت الآن ستضيع التعديلات التي لم تحفظها.',
    leaveWithoutSaving: 'مغادرة بدون حفظ',
    stay: 'البقاء هنا',
    saveAndLeave: 'حفظ ثم مغادرة',
    savedToast: 'تم الحفظ — التغييرات ظاهرة الآن على الموقع',
    deletedToast: 'تم الحذف',
    undo: 'تراجع',
    deleteTitle: 'حذف "{name}"؟',
    deleteBody: 'سيُحذف نهائياً ولا يمكن استرجاعه. إن أردت إخفاءه مؤقتاً فألغِ النشر بدلاً من الحذف.',
    noChanges: 'لا توجد تغييرات',
    lastSaved: 'آخر حفظ',
    fixErrors: 'أكمل الحقول المطلوبة أولاً',
    publish: 'نشر',
    unpublish: 'إلغاء النشر',
    openOnSite: 'فتح على الموقع',
    translations: 'الترجمات',
    all: 'الكل',
    clear: 'مسح',
    items: 'عنصر',
    addFirst: 'أضف أول عنصر',
    updatedAt: 'آخر تعديل',
    navSitePages: 'صفحات الموقع',
    navRecords: 'المحتوى المتجدد',
    navLibrary: 'المكتبة',
    navInbox: 'الرسائل',
    navTools: 'الأدوات',
    sitePages: 'نصوص الصفحات وصورها',
    mediaLibrary: 'مكتبة الوسائط',
    restoreContent: 'استعادة المحتوى الأصلي',
    searchEverything: 'ابحث عن أي شيء تريد تعديله…',
    searchHint: 'اكتب اسم صفحة أو قسم أو عنوان مادة',
    noSearchResults: 'لا نتائج',
    editingLanguage: 'لغة التحرير',
    copyFrom: 'نسخ من',
    chooseFromLibrary: 'اختيار من المكتبة',
    moreSettings: 'إعدادات إضافية',
    whereItAppears: 'أين يظهر',
    help: 'دليل الاستخدام',
    noAccessHint: 'حسابك مسجّل لكنه ليس ضمن قائمة المشرفين. اطلب من المسؤول التقني إضافة هذا البريد إلى قائمة المشرفين.',
    pageTexts: 'نصوص وصور الصفحة',
    sections: {
      overview: 'نظرة عامة',
      content: 'المحتوى',
      library: 'المكتبة',
      engagement: 'التفاعل',
      site: 'إعدادات الموقع',
      news: 'الأخبار',
      projects: 'المشاريع',
      programs: 'البرامج',
      donations: 'فرص المساهمة',
      partners: 'الشركاء',
      statistics: 'الإحصائيات والأرقام',
      library_articles: 'المقالات والقصص',
      library_documents: 'المستندات (PDF)',
      gallery: 'معرض الصور',
      submissions: 'رسائل النماذج',
      subscribers: 'المشتركون في النشرة',
      payments: 'عمليات الدفع',
      pages: 'صفحات الموقع',
      bank_accounts: 'البنوك والحسابات',
    },
  },
  tr: {
    brand: 'Veysel Karani Vakfı Yönetim Paneli',
    dashboard: 'Panel',
    signIn: 'Giriş Yap',
    signOut: 'Çıkış Yap',
    email: 'E-posta',
    password: 'Şifre',
    signingIn: 'Giriş yapılıyor…',
    loginError: 'Geçersiz giriş bilgileri',
    loginSubtitle: 'İçeriği yönetmek için giriş yapın',
    search: 'Ara…',
    create: 'Ekle',
    edit: 'Düzenle',
    save: 'Kaydet',
    saving: 'Kaydediliyor…',
    saved: 'Kaydedildi',
    cancel: 'İptal',
    delete: 'Sil',
    confirmDelete: 'Silmek istediğinize emin misiniz?',
    deleting: 'Siliniyor…',
    loading: 'Yükleniyor…',
    empty: 'Henüz kayıt yok',
    published: 'Yayında',
    draft: 'Taslak',
    order: 'Sıra',
    actions: 'İşlemler',
    back: 'Geri',
    newItem: 'Yeni kayıt',
    saveError: 'Kaydedilemedi',
    required: 'Zorunlu',
    addItem: 'Öğe ekle',
    removeItem: 'Kaldır',
    moveUp: 'Yukarı',
    moveDown: 'Aşağı',
    uploadImage: 'Görsel yükle',
    uploading: 'Yükleniyor…',
    orPasteUrl: 'veya bağlantı yapıştırın',
    preview: 'Önizleme',
    loginPending: 'Doğrulanıyor…',
    overview: 'Genel bakış',
    totalItems: 'Toplam kayıt',
    recentSubmissions: 'Son mesajlar',
    noAccess: 'Bu sayfaya erişim yetkiniz yok',
    markRead: 'Okundu işaretle',
    markNew: 'Yeni işaretle',
    archive: 'Arşivle',
    status: 'Durum',
    date: 'Tarih',
    view: 'Görüntüle',
    jsonInvalid: 'Geçersiz JSON',
    connectionMissing: 'Veritabanı bağlantısı yapılandırılmamış',
    confirm: 'Onayla',
    typeToConfirm: 'Onaylamak için "{word}" yazın',
    unsavedTitle: 'Kaydedilmemiş değişiklikler var',
    unsavedBody: 'Şimdi ayrılırsanız kaydetmediğiniz düzenlemeler kaybolur.',
    leaveWithoutSaving: 'Kaydetmeden ayrıl',
    stay: 'Burada kal',
    saveAndLeave: 'Kaydet ve ayrıl',
    savedToast: 'Kaydedildi — değişiklikler sitede yayında',
    deletedToast: 'Silindi',
    undo: 'Geri al',
    deleteTitle: '"{name}" silinsin mi?',
    deleteBody: 'Kalıcı olarak silinir ve geri alınamaz. Geçici olarak gizlemek için silmek yerine yayından kaldırın.',
    noChanges: 'Değişiklik yok',
    lastSaved: 'Son kayıt',
    fixErrors: 'Önce zorunlu alanları doldurun',
    publish: 'Yayınla',
    unpublish: 'Yayından kaldır',
    openOnSite: 'Sitede aç',
    translations: 'Çeviriler',
    all: 'Tümü',
    clear: 'Temizle',
    items: 'öğe',
    addFirst: 'İlk öğeyi ekle',
    updatedAt: 'Son düzenleme',
    navSitePages: 'Site sayfaları',
    navRecords: 'Güncel içerik',
    navLibrary: 'Kütüphane',
    navInbox: 'Mesajlar',
    navTools: 'Araçlar',
    sitePages: 'Sayfa metinleri ve görselleri',
    mediaLibrary: 'Medya kütüphanesi',
    restoreContent: 'Özgün içeriği geri yükle',
    searchEverything: 'Düzenlemek istediğiniz şeyi arayın…',
    searchHint: 'Sayfa, bölüm veya kayıt başlığı yazın',
    noSearchResults: 'Sonuç yok',
    editingLanguage: 'Düzenleme dili',
    copyFrom: 'Kopyala:',
    chooseFromLibrary: 'Kütüphaneden seç',
    moreSettings: 'Ek ayarlar',
    whereItAppears: 'Nerede görünür',
    help: 'Kullanım kılavuzu',
    noAccessHint: 'Hesabınız kayıtlı ancak yönetici listesinde değil. Bu e-postanın yönetici listesine eklenmesi için teknik sorumluya başvurun.',
    pageTexts: 'Sayfa metinleri ve görselleri',
    sections: {
      overview: 'Genel bakış',
      content: 'İçerik',
      library: 'Kütüphane',
      engagement: 'Etkileşim',
      site: 'Site ayarları',
      news: 'Haberler',
      projects: 'Projeler',
      programs: 'Programlar',
      donations: 'Bağış fırsatları',
      partners: 'Ortaklar',
      statistics: 'İstatistikler ve rakamlar',
      library_articles: 'Makale ve hikayeler',
      library_documents: 'Belgeler (PDF)',
      gallery: 'Galeri',
      submissions: 'Form mesajları',
      subscribers: 'Bülten aboneleri',
      payments: 'Ödeme işlemleri',
      pages: 'Site sayfaları',
      bank_accounts: 'Bankalar ve hesaplar',
    },
  },
  en: {
    brand: 'Veysel Karani Waqf Admin',
    dashboard: 'Dashboard',
    signIn: 'Sign in',
    signOut: 'Sign out',
    email: 'Email',
    password: 'Password',
    signingIn: 'Signing in…',
    loginError: 'Invalid credentials',
    loginSubtitle: 'Sign in to manage site content',
    search: 'Search…',
    create: 'Create',
    edit: 'Edit',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved',
    cancel: 'Cancel',
    delete: 'Delete',
    confirmDelete: 'Delete this item?',
    deleting: 'Deleting…',
    loading: 'Loading…',
    empty: 'No items yet',
    published: 'Published',
    draft: 'Draft',
    order: 'Order',
    actions: 'Actions',
    back: 'Back',
    newItem: 'New item',
    saveError: 'Could not save',
    required: 'Required',
    addItem: 'Add item',
    removeItem: 'Remove',
    moveUp: 'Up',
    moveDown: 'Down',
    uploadImage: 'Upload image',
    uploading: 'Uploading…',
    orPasteUrl: 'or paste a URL',
    preview: 'Preview',
    loginPending: 'Verifying…',
    overview: 'Overview',
    totalItems: 'Total items',
    recentSubmissions: 'Recent submissions',
    noAccess: 'You do not have access to this page',
    markRead: 'Mark read',
    markNew: 'Mark new',
    archive: 'Archive',
    status: 'Status',
    date: 'Date',
    view: 'View',
    jsonInvalid: 'Invalid JSON',
    connectionMissing: 'Database connection is not configured',
    confirm: 'Confirm',
    typeToConfirm: 'Type "{word}" to confirm',
    unsavedTitle: 'You have unsaved changes',
    unsavedBody: 'If you leave now, the edits you have not saved will be lost.',
    leaveWithoutSaving: 'Leave without saving',
    stay: 'Stay here',
    saveAndLeave: 'Save and leave',
    savedToast: 'Saved — the changes are live on the site',
    deletedToast: 'Deleted',
    undo: 'Undo',
    deleteTitle: 'Delete "{name}"?',
    deleteBody: 'It will be removed permanently and cannot be recovered. To hide it temporarily, unpublish it instead.',
    noChanges: 'No changes',
    lastSaved: 'Last saved',
    fixErrors: 'Fill in the required fields first',
    publish: 'Publish',
    unpublish: 'Unpublish',
    openOnSite: 'Open on site',
    translations: 'Translations',
    all: 'All',
    clear: 'Clear',
    items: 'items',
    addFirst: 'Add the first item',
    updatedAt: 'Last edited',
    navSitePages: 'Site pages',
    navRecords: 'Content',
    navLibrary: 'Library',
    navInbox: 'Inbox',
    navTools: 'Tools',
    sitePages: 'Page texts & images',
    mediaLibrary: 'Media library',
    restoreContent: 'Restore original content',
    searchEverything: 'Search for anything you want to change…',
    searchHint: 'Type a page, section or item title',
    noSearchResults: 'No results',
    editingLanguage: 'Editing language',
    copyFrom: 'Copy from',
    chooseFromLibrary: 'Choose from library',
    moreSettings: 'More settings',
    whereItAppears: 'Where it appears',
    help: 'User guide',
    noAccessHint: 'Your account exists but is not on the administrators list. Ask the technical administrator to add this email to it.',
    pageTexts: 'Page texts & images',
    sections: {
      overview: 'Overview',
      content: 'Content',
      library: 'Library',
      engagement: 'Engagement',
      site: 'Site settings',
      news: 'News',
      projects: 'Projects',
      programs: 'Programs',
      donations: 'Donation opportunities',
      partners: 'Partners',
      statistics: 'Statistics & figures',
      library_articles: 'Articles & stories',
      library_documents: 'Documents (PDF)',
      gallery: 'Gallery',
      submissions: 'Form submissions',
      subscribers: 'Newsletter subscribers',
      payments: 'Payments',
      pages: 'Site pages',
      bank_accounts: 'Banks & accounts',
    },
  },
};
