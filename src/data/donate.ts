import { cmsDonations, cmsPageContent } from '@/cms/adapters';
import type { BreadcrumbItem } from '@/data/about';
import type { Locale } from '@/i18n/content';
import waqfShareImage from '@/assets/donate/waqf-share.jpg';
import waqfShareHeroImage from '@/assets/donate/waqf-share-hero.jpg';
import waqfApartmentsImage from '@/assets/donate/waqf-apartments.jpeg';
import waqfGiftImage from '@/assets/donate/waqf-gift.jpg';
import motherYemenImage from '@/assets/donate/mother-yemen.jpg';
import goldWalletImage from '@/assets/donate/gold-wallet.jpg';
import waqfLandImage from '@/assets/donate/waqf-land.jpeg';
import waqfCarsImage from '@/assets/donate/waqf-cars.jpeg';
import blessedTreeImage from '@/assets/donate/blessed-tree.jpg';
import blessedTreeFarmImage from '@/assets/donate/blessed-tree-farm.jpg';

export const donateRoute = '/donate';

export type DonationOpportunity = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
  url?: string;
  available: boolean;
};

export type DonatePageContent = {
  seo: {
    title: string;
    description: string;
    canonical?: string;
  };
  hero: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  breadcrumbs: BreadcrumbItem[];
  intro: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  /** Heading above the opportunity cards. */
  grid: {
    eyebrow: string;
    title: string;
    description: string;
  };
  labels: {
    opportunities: string;
    contributionValue: string;
    available: string;
    featured: string;
    contribute: string;
    unavailable: string;
    emptyState: string;
    officialNotice: string;
    externalNotice: string;
  };
  opportunities: DonationOpportunity[];
};

// Direct contact stays available as the alternative contribution path.
export const contributeContactRoute = '/participate/contact';

// The site's own card payment flow (currently running against the mock
// gateway in test mode). Checkout pages are addressed by opportunity slug.
export const donateCheckoutBase = '/donate/checkout';
export const donateResultRoute = '/donate/result';
export const donateCheckoutRoute = (slug: string) => `${donateCheckoutBase}/${slug}`;

const sharedOpportunities = {
  waqfShare: {
    id: 'waqf-share',
    price: '$100.00',
    image: waqfShareImage,
    url: donateCheckoutRoute('waqf-share'),
    available: true,
  },
  waqfApartments: {
    id: 'waqf-apartments',
    price: '$0.00',
    image: waqfApartmentsImage,
    url: donateCheckoutRoute('waqf-apartments'),
    available: false,
  },
  waqfGift: {
    id: 'waqf-gift',
    price: '$1.00',
    image: waqfGiftImage,
    url: donateCheckoutRoute('waqf-gift'),
    available: true,
  },
  motherYemen: {
    id: 'mother-yemen',
    price: '$1.00',
    image: motherYemenImage,
    url: donateCheckoutRoute('mother-yemen'),
    available: true,
  },
  goldWallet: {
    id: 'gold-wallet',
    price: '$100.00',
    image: goldWalletImage,
    url: donateCheckoutRoute('gold-wallet'),
    available: true,
  },
  waqfLand: {
    id: 'waqf-land',
    price: '$0.00',
    image: waqfLandImage,
    url: donateCheckoutRoute('waqf-land'),
    available: false,
  },
  waqfCars: {
    id: 'waqf-cars',
    price: '$100.00',
    image: waqfCarsImage,
    url: donateCheckoutRoute('waqf-cars'),
    available: false,
  },
  blessedTree: {
    id: 'blessed-tree',
    price: '$100.00',
    image: blessedTreeImage,
    url: donateCheckoutRoute('blessed-tree'),
    available: true,
  },
  blessedTreeFarmOne: {
    id: 'blessed-tree-farm-one',
    price: '$0.00',
    image: blessedTreeFarmImage,
    url: donateCheckoutRoute('blessed-tree-farm-one'),
    available: false,
  },
  blessedTreeFarmTwo: {
    id: 'blessed-tree-farm-two',
    price: '$100.00',
    image: blessedTreeFarmImage,
    url: donateCheckoutRoute('blessed-tree-farm-two'),
    available: false,
  },
  blessedTreeFarmThree: {
    id: 'blessed-tree-farm-three',
    price: '$100.00',
    image: blessedTreeFarmImage,
    url: donateCheckoutRoute('blessed-tree-farm-three'),
    available: true,
  },
} as const;

export const localizedDonateContent: Record<Locale, DonatePageContent> = {
  ar: {
    seo: {
      title: 'ساهم الآن | وقف أويس القرني',
      description:
        'صفحة تعرض فرص المساهمة المعتمدة لدى وقف أويس القرني، مع إمكانية المساهمة بالبطاقة عبر بوابة الدفع داخل الموقع (حالياً في وضع تجريبي).',
      canonical: undefined,
    },
    hero: {
      title: 'ساهم الآن',
      description:
        'ساهم معنا بسهم وقفي أو أكثر، أو في مشروع الشجرة المباركة، أو محفظة الذهب الوقفية، بالدفع بالبطاقة مباشرة عبر هذا الموقع.',
      image: waqfShareHeroImage,
      imageAlt: 'السهم الوقفي من وقف أويس القرني',
    },
    breadcrumbs: [
      { label: 'الرئيسية', href: '/' },
      { label: 'ساهم الآن' },
    ],
    intro: {
      eyebrow: 'فرص المساهمة الرسمية',
      title: 'المساهمة عبر بوابة الدفع داخل الموقع',
      paragraphs: [
        'هذه الصفحة تعرض فرص المساهمة المعتمدة لدى وقف أويس القرني.',
        'بوابة الدفع الإلكتروني تعمل حالياً في وضع تجريبي: يمكنك تجربة مسار الدفع كاملاً دون خصم أي مبلغ حقيقي، وعند الإطلاق الرسمي سيتم تفعيل الدفع الفعلي عبر بنك İş التركي.',
      ],
    },
    grid: {
      eyebrow: 'فرص المساهمة',
      title: 'فرص المساهمة',
      description: 'اختر فرصة المساهمة المناسبة لك؛ كل فرصة تنقلك إلى صفحة الدفع لإتمام مساهمتك بالبطاقة.',
    },
    labels: {
      opportunities: 'فرص المساهمة',
      contributionValue: 'قيمة السهم أو المساهمة',
      available: 'متاح للمساهمة',
      featured: 'الفرصة الأبرز',
      contribute: 'ساهم الآن',
      unavailable: 'غير متاح حالياً',
      emptyState: 'لا توجد فرص مساهمة متاحة حالياً؛ تواصل معنا لمعرفة الفرص القادمة.',
      officialNotice: 'الدفع يتم عبر بوابة آمنة داخل الموقع — وهي حالياً في وضع تجريبي دون أي خصم حقيقي.',
      externalNotice: 'ينقلك الزر إلى صفحة الدفع الآمنة داخل الموقع (وضع تجريبي حالياً — لن يتم خصم أي مبلغ حقيقي)، ويبقى التواصل المباشر متاحاً عبر صفحة التواصل.',
    },
    opportunities: [
      {
        ...sharedOpportunities.waqfShare,
        title: 'السهم الوقفي',
        description: 'فرصة مساهمة رسمية بقيمة منشورة قدرها 100 دولار.',
        imageAlt: 'السهم الوقفي',
      },
      {
        ...sharedOpportunities.waqfApartments,
        title: 'الشقق الوقفية',
        description: 'فرصة مساهمة رسمية لدى وقف أويس القرني.',
        imageAlt: 'الشقق الوقفية',
      },
      {
        ...sharedOpportunities.waqfGift,
        title: 'الهدية الوقفية',
        description: 'فرصة مساهمة رسمية بقيمة منشورة قدرها 1 دولار.',
        imageAlt: 'الهدية الوقفية',
      },
      {
        ...sharedOpportunities.motherYemen,
        title: 'مبادرة أمي اليمن',
        description: 'فرصة مساهمة رسمية بقيمة منشورة قدرها 1 دولار.',
        imageAlt: 'مبادرة أمي اليمن',
      },
      {
        ...sharedOpportunities.goldWallet,
        title: 'محفظة الذهب الوقفية',
        description: 'فرصة مساهمة رسمية بقيمة منشورة قدرها 100 دولار.',
        imageAlt: 'محفظة الذهب الوقفية',
      },
      {
        ...sharedOpportunities.waqfLand,
        title: 'مشروع الأراضي الوقفية',
        description: 'فرصة مساهمة رسمية لدى وقف أويس القرني.',
        imageAlt: 'مشروع الأراضي الوقفية',
      },
      {
        ...sharedOpportunities.waqfCars,
        title: 'مشروع السيارات الوقفية',
        description: 'فرصة مساهمة رسمية لدى وقف أويس القرني.',
        imageAlt: 'مشروع السيارات الوقفية',
      },
      {
        ...sharedOpportunities.blessedTree,
        title: 'مشروع الشجرة المباركة',
        description: 'فرصة مساهمة رسمية بقيمة منشورة قدرها 100 دولار.',
        imageAlt: 'مشروع الشجرة المباركة',
      },
      {
        ...sharedOpportunities.blessedTreeFarmOne,
        title: 'مشروع الشجرة المباركة - المزرعة 1',
        description: 'فرصة مساهمة رسمية لدى وقف أويس القرني.',
        imageAlt: 'مشروع الشجرة المباركة - المزرعة 1',
      },
      {
        ...sharedOpportunities.blessedTreeFarmTwo,
        title: 'مشروع الشجرة المباركة - المزرعة 2',
        description: 'فرصة مساهمة رسمية لدى وقف أويس القرني.',
        imageAlt: 'مشروع الشجرة المباركة - المزرعة 2',
      },
      {
        ...sharedOpportunities.blessedTreeFarmThree,
        title: 'مشروع الشجرة المباركة - قيمة السهم 100$',
        description: 'فرصة مساهمة رسمية بقيمة منشورة قدرها 100 دولار.',
        imageAlt: 'مشروع الشجرة المباركة - قيمة السهم 100$',
      },
    ],
  },
  tr: {
    seo: {
      title: 'Simdi Katki Sun | Veysel Karani Vakfi',
      description:
        'Veysel Karani Vakfinin onayli katkı firsatlarini gosteren sayfa; katkılar site icindeki odeme sayfasi uzerinden kartla yapilabilir (su an test modunda).',
      canonical: undefined,
    },
    hero: {
      title: 'Simdi Katki Sun',
      description:
        'Vakif hissesi, Bereketli Agac Projesi veya Vakif Altin Portfoyu gibi katkı firsatlarina bu site uzerinden kartla odeme yaparak katilabilirsiniz.',
      image: waqfShareHeroImage,
      imageAlt: 'Veysel Karani Vakfi vakif hissesi',
    },
    breadcrumbs: [
      { label: 'Ana Sayfa', href: '/' },
      { label: 'Simdi Katki Sun' },
    ],
    intro: {
      eyebrow: 'Resmi Katki Firsatlari',
      title: 'Katki site icindeki odeme sayfasiyla yapilir',
      paragraphs: [
        'Bu sayfa, Veysel Karani Vakfinin onayli katkı firsatlarini listeler.',
        'Odeme altyapisi su an test modundadir: odeme akisini gercek bir tahsilat olmadan deneyebilirsiniz. Resmi acilista odemeler Turkiye Is Bankasi uzerinden alinacaktir.',
      ],
    },
    grid: {
      eyebrow: 'Katki Firsatlari',
      title: 'Katki Firsatlari',
      description: 'Size uygun katkı firsatini secin; her firsat sizi kartla odeme sayfasina yonlendirir.',
    },
    labels: {
      opportunities: 'Katki Firsatlari',
      contributionValue: 'Hisse veya katkı degeri',
      available: 'Katkiya acik',
      featured: 'One cikan firsat',
      contribute: 'Katki Sun',
      unavailable: 'Su anda kullanilamaz',
      emptyState: 'Su anda acik bir katkı firsati bulunmuyor; yeni firsatlar icin bizimle iletisime gecin.',
      officialNotice: 'Odeme, site icindeki guvenli odeme sayfasiyla yapilir — su an test modunda, gercek tahsilat yapilmaz.',
      externalNotice: 'Buton sizi site icindeki guvenli odeme sayfasina yonlendirir (su an test modu — gercek tahsilat yapilmaz); dogrudan iletisim sayfasi da acik kalir.',
    },
    opportunities: [
      {
        ...sharedOpportunities.waqfShare,
        title: 'Vakif Hissesi',
        description: 'Resmi katkı firsati; yayinlanan deger 100 dolardir.',
        imageAlt: 'Vakif hissesi',
      },
      {
        ...sharedOpportunities.waqfApartments,
        title: 'Vakif Daireleri',
        description: 'Veysel Karani Vakfinin resmi katkı firsati.',
        imageAlt: 'Vakif daireleri',
      },
      {
        ...sharedOpportunities.waqfGift,
        title: 'Vakif Hediyesi',
        description: 'Resmi katkı firsati; yayinlanan deger 1 dolardir.',
        imageAlt: 'Vakif hediyesi',
      },
      {
        ...sharedOpportunities.motherYemen,
        title: 'Anne Yemen Girisimi',
        description: 'Resmi katkı firsati; yayinlanan deger 1 dolardir.',
        imageAlt: 'Anne Yemen Girisimi',
      },
      {
        ...sharedOpportunities.goldWallet,
        title: 'Vakif Altin Portfoyu',
        description: 'Resmi katkı firsati; yayinlanan deger 100 dolardir.',
        imageAlt: 'Vakif Altin Portfoyu',
      },
      {
        ...sharedOpportunities.waqfLand,
        title: 'Vakif Arazileri Projesi',
        description: 'Veysel Karani Vakfinin resmi katkı firsati.',
        imageAlt: 'Vakif Arazileri Projesi',
      },
      {
        ...sharedOpportunities.waqfCars,
        title: 'Vakif Araclari Projesi',
        description: 'Veysel Karani Vakfinin resmi katkı firsati.',
        imageAlt: 'Vakif Araclari Projesi',
      },
      {
        ...sharedOpportunities.blessedTree,
        title: 'Bereketli Agac Projesi',
        description: 'Resmi katkı firsati; yayinlanan deger 100 dolardir.',
        imageAlt: 'Bereketli Agac Projesi',
      },
      {
        ...sharedOpportunities.blessedTreeFarmOne,
        title: 'Bereketli Agac Projesi - 1. Ciftlik',
        description: 'Veysel Karani Vakfinin resmi katkı firsati.',
        imageAlt: 'Bereketli Agac Projesi - 1. Ciftlik',
      },
      {
        ...sharedOpportunities.blessedTreeFarmTwo,
        title: 'Bereketli Agac Projesi - 2. Ciftlik',
        description: 'Veysel Karani Vakfinin resmi katkı firsati.',
        imageAlt: 'Bereketli Agac Projesi - 2. Ciftlik',
      },
      {
        ...sharedOpportunities.blessedTreeFarmThree,
        title: 'Bereketli Agac Projesi - 100$ Hisse Degeri',
        description: 'Resmi katkı firsati; yayinlanan deger 100 dolardir.',
        imageAlt: 'Bereketli Agac Projesi - 100$ Hisse Degeri',
      },
    ],
  },
  en: {
    seo: {
      title: 'Contribute Now | Veysel Karani Waqf',
      description:
        'A page listing the approved contribution opportunities of Veysel Karani Waqf; contributions can be made by card through the in-site payment page (currently in test mode).',
      canonical: undefined,
    },
    hero: {
      title: 'Contribute Now',
      description:
        'Contribute a waqf share, support the Blessed Tree Project or the Gold Waqf Wallet by paying securely by card through this website.',
      image: waqfShareHeroImage,
      imageAlt: 'Veysel Karani Waqf share',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Contribute Now' },
    ],
    intro: {
      eyebrow: 'Official Contribution Opportunities',
      title: 'Contributions are made through the in-site payment page',
      paragraphs: [
        'This page lists the approved contribution opportunities of Veysel Karani Waqf.',
        'The payment gateway currently runs in test mode: you can try the full payment flow without any real charge. At the official launch, payments will be processed through Türkiye İş Bankası.',
      ],
    },
    grid: {
      eyebrow: 'Contribution Opportunities',
      title: 'Contribution Opportunities',
      description: 'Choose the opportunity that suits you; each opportunity takes you to the card payment page.',
    },
    labels: {
      opportunities: 'Contribution Opportunities',
      contributionValue: 'Share or contribution value',
      available: 'Available for contribution',
      featured: 'Featured opportunity',
      contribute: 'Contribute Now',
      unavailable: 'Unavailable now',
      emptyState: 'There are no open contribution opportunities right now; contact us to hear about upcoming ones.',
      officialNotice: 'Payments go through the secure in-site payment page — currently in test mode, no real charge is made.',
      externalNotice: 'The button takes you to the secure in-site payment page (currently in test mode — no real charge); direct contact remains available.',
    },
    opportunities: [
      {
        ...sharedOpportunities.waqfShare,
        title: 'Waqf Share',
        description: 'Official contribution opportunity with a published value of 100 dollars.',
        imageAlt: 'Waqf Share',
      },
      {
        ...sharedOpportunities.waqfApartments,
        title: 'Waqf Apartments',
        description: 'An official contribution opportunity of Veysel Karani Waqf.',
        imageAlt: 'Waqf Apartments',
      },
      {
        ...sharedOpportunities.waqfGift,
        title: 'Waqf Gift',
        description: 'Official contribution opportunity with a published value of 1 dollar.',
        imageAlt: 'Waqf Gift',
      },
      {
        ...sharedOpportunities.motherYemen,
        title: 'Mother Yemen Initiative',
        description: 'Official contribution opportunity with a published value of 1 dollar.',
        imageAlt: 'Mother Yemen Initiative',
      },
      {
        ...sharedOpportunities.goldWallet,
        title: 'Gold Waqf Wallet',
        description: 'Official contribution opportunity with a published value of 100 dollars.',
        imageAlt: 'Gold Waqf Wallet',
      },
      {
        ...sharedOpportunities.waqfLand,
        title: 'Waqf Land Project',
        description: 'An official contribution opportunity of Veysel Karani Waqf.',
        imageAlt: 'Waqf Land Project',
      },
      {
        ...sharedOpportunities.waqfCars,
        title: 'Waqf Cars Project',
        description: 'An official contribution opportunity of Veysel Karani Waqf.',
        imageAlt: 'Waqf Cars Project',
      },
      {
        ...sharedOpportunities.blessedTree,
        title: 'Blessed Tree Project',
        description: 'Official contribution opportunity with a published value of 100 dollars.',
        imageAlt: 'Blessed Tree Project',
      },
      {
        ...sharedOpportunities.blessedTreeFarmOne,
        title: 'Blessed Tree Project - Farm 1',
        description: 'An official contribution opportunity of Veysel Karani Waqf.',
        imageAlt: 'Blessed Tree Project - Farm 1',
      },
      {
        ...sharedOpportunities.blessedTreeFarmTwo,
        title: 'Blessed Tree Project - Farm 2',
        description: 'An official contribution opportunity of Veysel Karani Waqf.',
        imageAlt: 'Blessed Tree Project - Farm 2',
      },
      {
        ...sharedOpportunities.blessedTreeFarmThree,
        title: 'Blessed Tree Project - 100$ Share Value',
        description: 'Official contribution opportunity with a published value of 100 dollars.',
        imageAlt: 'Blessed Tree Project - 100$ Share Value',
      },
    ],
  },
};

export function getDonateContent(locale: Locale): DonatePageContent {
  const base = localizedDonateContent[locale];
  return {
    ...cmsPageContent('donate-page', locale, base),
    // "available" is the dashboard's show/hide switch: a closed opportunity
    // stays editable in the admin but never reaches the storefront.
    opportunities: cmsDonations(locale, base.opportunities).filter(
      (opportunity) => opportunity.available,
    ),
  };
}
