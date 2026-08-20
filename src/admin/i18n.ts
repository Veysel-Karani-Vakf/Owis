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
    sections: {
      overview: 'نظرة عامة',
      content: 'المحتوى',
      library: 'المكتبة',
      engagement: 'التفاعل',
      site: 'إعدادات الموقع',
      news: 'الأخبار',
      projects: 'المشاريع',
      programs: 'البرامج',
      donations: 'فرص التبرع',
      partners: 'الشركاء',
      statistics: 'الإحصائيات',
      library_articles: 'المقالات والقصص',
      library_documents: 'المستندات',
      gallery: 'معرض الصور',
      submissions: 'رسائل النماذج',
      subscribers: 'المشتركون',
      pages: 'صفحات الموقع',
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
      statistics: 'İstatistikler',
      library_articles: 'Makale ve hikayeler',
      library_documents: 'Belgeler',
      gallery: 'Galeri',
      submissions: 'Form mesajları',
      subscribers: 'Aboneler',
      pages: 'Site sayfaları',
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
    sections: {
      overview: 'Overview',
      content: 'Content',
      library: 'Library',
      engagement: 'Engagement',
      site: 'Site settings',
      news: 'News',
      projects: 'Projects',
      programs: 'Programs',
      donations: 'Donations',
      partners: 'Partners',
      statistics: 'Statistics',
      library_articles: 'Articles & stories',
      library_documents: 'Documents',
      gallery: 'Gallery',
      submissions: 'Form submissions',
      subscribers: 'Subscribers',
      pages: 'Site pages',
    },
  },
};
