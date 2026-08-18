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
    canonical: string;
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
  labels: {
    opportunities: string;
    contributionValue: string;
    available: string;
    closed: string;
    contribute: string;
    unavailable: string;
    officialNotice: string;
    externalNotice: string;
  };
  opportunities: DonationOpportunity[];
};

const officialSources = {
  donate: 'https://veysvakfi.org/donate-now/',
  waqfShare: 'https://veysvakfi.org/product/waqf-share/',
  waqfApartments:
    'https://veysvakfi.org/product/%d8%a7%d9%84%d8%b3%d9%87%d9%85-%d8%a7%d9%84%d8%a7%d9%88%d9%84/',
  waqfGift: 'https://veysvakfi.org/gifts/',
  motherYemen: 'https://veysvakfi.org/product/%d9%88%d9%82%d9%81-%d8%b9%d8%a7%d9%85/',
  goldWallet: 'https://veysvakfi.org/product/gold-wallet/',
  waqfLand:
    'https://veysvakfi.org/product/%d9%85%d8%b4%d8%b1%d9%88%d8%b9-%d8%a7%d9%84%d8%a3%d8%b1%d8%a7%d8%b6%d9%8a-%d8%a7%d9%84%d9%88%d9%82%d9%81%d9%8a%d8%a9/',
  waqfCars:
    'https://veysvakfi.org/product/%d9%85%d8%b4%d8%b1%d9%88%d8%b9-%d8%a7%d9%84%d8%b3%d9%8a%d8%a7%d8%b1%d8%a7%d8%aa-%d8%a7%d9%84%d9%88%d9%82%d9%81%d9%8a%d8%a9/',
  blessedTree: 'https://veysvakfi.org/product/the-blessed-tree-project/',
  blessedTreeFarmOne:
    'https://veysvakfi.org/product/%d9%85%d8%b4%d8%b1%d9%88%d8%b9-%d8%a7%d9%84%d8%b4%d8%ac%d8%b1%d8%a9-%d8%a7%d9%84%d9%85%d8%a8%d8%a7%d8%b1%d9%83%d8%a9-%d8%a7%d9%84%d9%85%d8%b2%d8%b1%d8%b9%d8%a9-%d8%a7%d9%84%d8%a3%d9%88%d9%84%d9%89/',
  blessedTreeFarmTwo:
    'https://veysvakfi.org/product/%d9%85%d8%b4%d8%b1%d9%88%d8%b9-%d8%a7%d9%84%d8%b4%d8%ac%d8%b1%d8%a9-%d8%a7%d9%84%d9%85%d8%a8%d8%a7%d8%b1%d9%83%d8%a9-%d8%a7%d9%84%d9%85%d8%b2%d8%b1%d8%b9%d8%a9-2/',
  blessedTreeFarmThree:
    'https://veysvakfi.org/product/%d9%85%d8%b4%d8%b1%d9%88%d8%b9-%d8%a7%d9%84%d8%b4%d8%ac%d8%b1%d8%a9-%d8%a7%d9%84%d9%85%d8%a8%d8%a7%d8%b1%d9%83%d8%a9-%d8%a7%d9%84%d9%85%d8%b2%d8%b1%d8%b9%d8%a9-3/',
} as const;

const sharedOpportunities = {
  waqfShare: {
    id: 'waqf-share',
    price: '$100.00',
    image: waqfShareImage,
    url: officialSources.waqfShare,
    available: true,
  },
  waqfApartments: {
    id: 'waqf-apartments',
    price: '$0.00',
    image: waqfApartmentsImage,
    url: officialSources.waqfApartments,
    available: false,
  },
  waqfGift: {
    id: 'waqf-gift',
    price: '$1.00',
    image: waqfGiftImage,
    url: officialSources.waqfGift,
    available: true,
  },
  motherYemen: {
    id: 'mother-yemen',
    price: '$1.00',
    image: motherYemenImage,
    url: officialSources.motherYemen,
    available: true,
  },
  goldWallet: {
    id: 'gold-wallet',
    price: '$100.00',
    image: goldWalletImage,
    url: officialSources.goldWallet,
    available: true,
  },
  waqfLand: {
    id: 'waqf-land',
    price: '$0.00',
    image: waqfLandImage,
    url: officialSources.waqfLand,
    available: false,
  },
  waqfCars: {
    id: 'waqf-cars',
    price: '$100.00',
    image: waqfCarsImage,
    url: officialSources.waqfCars,
    available: false,
  },
  blessedTree: {
    id: 'blessed-tree',
    price: '$100.00',
    image: blessedTreeImage,
    url: officialSources.blessedTree,
    available: true,
  },
  blessedTreeFarmOne: {
    id: 'blessed-tree-farm-one',
    price: '$0.00',
    image: blessedTreeFarmImage,
    url: officialSources.blessedTreeFarmOne,
    available: false,
  },
  blessedTreeFarmTwo: {
    id: 'blessed-tree-farm-two',
    price: '$100.00',
    image: blessedTreeFarmImage,
    url: officialSources.blessedTreeFarmTwo,
    available: false,
  },
  blessedTreeFarmThree: {
    id: 'blessed-tree-farm-three',
    price: '$100.00',
    image: blessedTreeFarmImage,
    url: officialSources.blessedTreeFarmThree,
    available: true,
  },
} as const;

export const localizedDonateContent: Record<Locale, DonatePageContent> = {
  ar: {
    seo: {
      title: 'ساهم الآن | وقف أويس القرني',
      description:
        'صفحة داخلية تعرض فرص المساهمة الرسمية المنشورة لدى وقف أويس القرني دون إنشاء نظام دفع أو سلة شراء داخل الموقع الجديد.',
      canonical: officialSources.donate,
    },
    hero: {
      title: 'ساهم الآن',
      description:
        'ساهم معنا بسهم وقفي أو أكثر، أو في مشروع الشجرة المباركة، أو محفظة الذهب الوقفية، عبر الروابط الرسمية للوقف.',
      image: waqfShareHeroImage,
      imageAlt: 'السهم الوقفي من وقف أويس القرني',
    },
    breadcrumbs: [
      { label: 'الرئيسية', href: '/' },
      { label: 'ساهم الآن' },
    ],
    intro: {
      eyebrow: 'فرص المساهمة الرسمية',
      title: 'كل بطاقة تفتح مصدرها الرسمي فقط',
      paragraphs: [
        'هذه الصفحة تعرض الفرص كما ظهرت في صفحة المساهمة الرسمية لوقف أويس القرني.',
        'لا تحتوي الصفحة على دفع داخلي أو سلة أو حقول كمية؛ الأزرار المتاحة تنقل الزائر إلى الرابط الرسمي، والمشاريع المغلقة تظهر بوضوح كغير متاحة.',
      ],
    },
    labels: {
      opportunities: 'فرص المساهمة',
      contributionValue: 'قيمة السهم أو المساهمة',
      available: 'متاح للمساهمة',
      closed: 'تم إغلاق المشروع',
      contribute: 'ساهم الآن',
      unavailable: 'غير متاح حالياً',
      officialNotice: 'لا تعرض هذه الصفحة بيانات مصرفية أو عملية دفع داخلية.',
      externalNotice: 'يفتح الرابط الرسمي في نافذة جديدة',
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
        description: 'مشروع ظاهر في صفحة المساهمة الرسمية وحالته مغلقة.',
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
        description: 'مشروع ظاهر في صفحة المساهمة الرسمية وحالته مغلقة.',
        imageAlt: 'مشروع الأراضي الوقفية',
      },
      {
        ...sharedOpportunities.waqfCars,
        title: 'مشروع السيارات الوقفية',
        description: 'مشروع ظاهر في صفحة المساهمة الرسمية وحالته مغلقة.',
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
        description: 'مشروع ظاهر في صفحة المساهمة الرسمية وحالته مغلقة.',
        imageAlt: 'مشروع الشجرة المباركة - المزرعة 1',
      },
      {
        ...sharedOpportunities.blessedTreeFarmTwo,
        title: 'مشروع الشجرة المباركة - المزرعة 2',
        description: 'مشروع ظاهر في صفحة المساهمة الرسمية وحالته مغلقة.',
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
        'Veysel Karani Vakfinin resmi katkı firsatlarini gosteren dahili sayfa; yeni odeme sistemi veya sepet akisi olusturmaz.',
      canonical: officialSources.donate,
    },
    hero: {
      title: 'Simdi Katki Sun',
      description:
        'Vakif hissesi, Bereketli Agac Projesi veya Vakif Altin Portfoyu gibi resmi katkı firsatlarina vakfin resmi baglantilari uzerinden ulasin.',
      image: waqfShareHeroImage,
      imageAlt: 'Veysel Karani Vakfi vakif hissesi',
    },
    breadcrumbs: [
      { label: 'Ana Sayfa', href: '/' },
      { label: 'Simdi Katki Sun' },
    ],
    intro: {
      eyebrow: 'Resmi Katki Firsatlari',
      title: 'Her kart yalnizca resmi kaynaga gider',
      paragraphs: [
        'Bu sayfa, Veysel Karani Vakfinin resmi katkı sayfasinda gorunen firsatlari listeler.',
        'Sayfada dahili odeme, sepet veya miktar alani yoktur. Acik firsatlar resmi baglantiya gider; kapali projeler net sekilde pasif gorunur.',
      ],
    },
    labels: {
      opportunities: 'Katki Firsatlari',
      contributionValue: 'Hisse veya katkı degeri',
      available: 'Katkiya acik',
      closed: 'Proje kapatildi',
      contribute: 'Katki Sun',
      unavailable: 'Su anda kullanilamaz',
      officialNotice: 'Bu sayfa banka bilgisi veya dahili odeme islemi gostermez.',
      externalNotice: 'Resmi baglanti yeni sekmede acilir',
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
        description: 'Resmi katkı sayfasinda gorunen ve kapali olan proje.',
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
        description: 'Resmi katkı sayfasinda gorunen ve kapali olan proje.',
        imageAlt: 'Vakif Arazileri Projesi',
      },
      {
        ...sharedOpportunities.waqfCars,
        title: 'Vakif Araclari Projesi',
        description: 'Resmi katkı sayfasinda gorunen ve kapali olan proje.',
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
        description: 'Resmi katkı sayfasinda gorunen ve kapali olan proje.',
        imageAlt: 'Bereketli Agac Projesi - 1. Ciftlik',
      },
      {
        ...sharedOpportunities.blessedTreeFarmTwo,
        title: 'Bereketli Agac Projesi - 2. Ciftlik',
        description: 'Resmi katkı sayfasinda gorunen ve kapali olan proje.',
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
        'An internal page listing official contribution opportunities from Veysel Karani Waqf without creating a payment flow or cart.',
      canonical: officialSources.donate,
    },
    hero: {
      title: 'Contribute Now',
      description:
        'Access official contribution opportunities such as the waqf share, the Blessed Tree Project and the Gold Waqf Wallet through the official waqf links.',
      image: waqfShareHeroImage,
      imageAlt: 'Veysel Karani Waqf share',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Contribute Now' },
    ],
    intro: {
      eyebrow: 'Official Contribution Opportunities',
      title: 'Each card links only to its official source',
      paragraphs: [
        'This page lists the opportunities shown on the official Veysel Karani Waqf contribution page.',
        'It does not include internal payment, cart or quantity controls. Available opportunities open the official link; closed projects are clearly disabled.',
      ],
    },
    labels: {
      opportunities: 'Contribution Opportunities',
      contributionValue: 'Share or contribution value',
      available: 'Available for contribution',
      closed: 'Project closed',
      contribute: 'Contribute Now',
      unavailable: 'Unavailable now',
      officialNotice: 'This page does not show bank details or process payments internally.',
      externalNotice: 'The official link opens in a new tab',
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
        description: 'A project shown on the official contribution page and marked closed.',
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
        description: 'A project shown on the official contribution page and marked closed.',
        imageAlt: 'Waqf Land Project',
      },
      {
        ...sharedOpportunities.waqfCars,
        title: 'Waqf Cars Project',
        description: 'A project shown on the official contribution page and marked closed.',
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
        description: 'A project shown on the official contribution page and marked closed.',
        imageAlt: 'Blessed Tree Project - Farm 1',
      },
      {
        ...sharedOpportunities.blessedTreeFarmTwo,
        title: 'Blessed Tree Project - Farm 2',
        description: 'A project shown on the official contribution page and marked closed.',
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

export function getDonateContent(locale: Locale) {
  return localizedDonateContent[locale];
}
