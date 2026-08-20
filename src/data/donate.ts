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

// Temporary internal contribution flow: every open opportunity leads to the
// in-site contact form until the new site's own payment gateway goes live.
export const contributeContactRoute = '/participate/contact';

const sharedOpportunities = {
  waqfShare: {
    id: 'waqf-share',
    price: '$100.00',
    image: waqfShareImage,
    url: contributeContactRoute,
    available: true,
  },
  waqfApartments: {
    id: 'waqf-apartments',
    price: '$0.00',
    image: waqfApartmentsImage,
    url: contributeContactRoute,
    available: false,
  },
  waqfGift: {
    id: 'waqf-gift',
    price: '$1.00',
    image: waqfGiftImage,
    url: contributeContactRoute,
    available: true,
  },
  motherYemen: {
    id: 'mother-yemen',
    price: '$1.00',
    image: motherYemenImage,
    url: contributeContactRoute,
    available: true,
  },
  goldWallet: {
    id: 'gold-wallet',
    price: '$100.00',
    image: goldWalletImage,
    url: contributeContactRoute,
    available: true,
  },
  waqfLand: {
    id: 'waqf-land',
    price: '$0.00',
    image: waqfLandImage,
    url: contributeContactRoute,
    available: false,
  },
  waqfCars: {
    id: 'waqf-cars',
    price: '$100.00',
    image: waqfCarsImage,
    url: contributeContactRoute,
    available: false,
  },
  blessedTree: {
    id: 'blessed-tree',
    price: '$100.00',
    image: blessedTreeImage,
    url: contributeContactRoute,
    available: true,
  },
  blessedTreeFarmOne: {
    id: 'blessed-tree-farm-one',
    price: '$0.00',
    image: blessedTreeFarmImage,
    url: contributeContactRoute,
    available: false,
  },
  blessedTreeFarmTwo: {
    id: 'blessed-tree-farm-two',
    price: '$100.00',
    image: blessedTreeFarmImage,
    url: contributeContactRoute,
    available: false,
  },
  blessedTreeFarmThree: {
    id: 'blessed-tree-farm-three',
    price: '$100.00',
    image: blessedTreeFarmImage,
    url: contributeContactRoute,
    available: true,
  },
} as const;

export const localizedDonateContent: Record<Locale, DonatePageContent> = {
  ar: {
    seo: {
      title: 'ساهم الآن | وقف أويس القرني',
      description:
        'صفحة تعرض فرص المساهمة المعتمدة لدى وقف أويس القرني، وتتم المساهمة حالياً عبر التواصل المباشر إلى حين إطلاق بوابة الدفع الإلكتروني.',
      canonical: undefined,
    },
    hero: {
      title: 'ساهم الآن',
      description:
        'ساهم معنا بسهم وقفي أو أكثر، أو في مشروع الشجرة المباركة، أو محفظة الذهب الوقفية، بالتواصل المباشر معنا عبر هذا الموقع.',
      image: waqfShareHeroImage,
      imageAlt: 'السهم الوقفي من وقف أويس القرني',
    },
    breadcrumbs: [
      { label: 'الرئيسية', href: '/' },
      { label: 'ساهم الآن' },
    ],
    intro: {
      eyebrow: 'فرص المساهمة الرسمية',
      title: 'المساهمة تتم حالياً عبر التواصل المباشر',
      paragraphs: [
        'هذه الصفحة تعرض فرص المساهمة المعتمدة لدى وقف أويس القرني.',
        'بوابة الدفع الإلكتروني الخاصة بالموقع قيد التجهيز؛ حتى إطلاقها ينقلك زر «ساهم الآن» إلى صفحة التواصل داخل الموقع لإتمام مساهمتك، والمشاريع المغلقة تظهر بوضوح كغير متاحة.',
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
      externalNotice: 'ينقلك الزر إلى صفحة التواصل داخل الموقع لإتمام المساهمة',
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
        description: 'مشروع مغلق حالياً وغير متاح للمساهمة.',
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
        description: 'مشروع مغلق حالياً وغير متاح للمساهمة.',
        imageAlt: 'مشروع الأراضي الوقفية',
      },
      {
        ...sharedOpportunities.waqfCars,
        title: 'مشروع السيارات الوقفية',
        description: 'مشروع مغلق حالياً وغير متاح للمساهمة.',
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
        description: 'مشروع مغلق حالياً وغير متاح للمساهمة.',
        imageAlt: 'مشروع الشجرة المباركة - المزرعة 1',
      },
      {
        ...sharedOpportunities.blessedTreeFarmTwo,
        title: 'مشروع الشجرة المباركة - المزرعة 2',
        description: 'مشروع مغلق حالياً وغير متاح للمساهمة.',
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
        'Veysel Karani Vakfinin onayli katkı firsatlarini gosteren sayfa; odeme altyapisi hazir olana kadar katkı dogrudan iletisimle yapilir.',
      canonical: undefined,
    },
    hero: {
      title: 'Simdi Katki Sun',
      description:
        'Vakif hissesi, Bereketli Agac Projesi veya Vakif Altin Portfoyu gibi katkı firsatlari icin bu site uzerinden bizimle dogrudan iletisime gecin.',
      image: waqfShareHeroImage,
      imageAlt: 'Veysel Karani Vakfi vakif hissesi',
    },
    breadcrumbs: [
      { label: 'Ana Sayfa', href: '/' },
      { label: 'Simdi Katki Sun' },
    ],
    intro: {
      eyebrow: 'Resmi Katki Firsatlari',
      title: 'Katki su an dogrudan iletisimle yapilir',
      paragraphs: [
        'Bu sayfa, Veysel Karani Vakfinin onayli katkı firsatlarini listeler.',
        'Sitenin odeme altyapisi hazirlaniyor; o zamana kadar "Katki Sun" butonu sizi site icindeki iletisim sayfasina yonlendirir. Kapali projeler net sekilde pasif gorunur.',
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
      externalNotice: 'Buton sizi site icindeki iletisim sayfasina yonlendirir',
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
        description: 'Su anda kapali olan ve katkiya acik olmayan proje.',
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
        description: 'Su anda kapali olan ve katkiya acik olmayan proje.',
        imageAlt: 'Vakif Arazileri Projesi',
      },
      {
        ...sharedOpportunities.waqfCars,
        title: 'Vakif Araclari Projesi',
        description: 'Su anda kapali olan ve katkiya acik olmayan proje.',
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
        description: 'Su anda kapali olan ve katkiya acik olmayan proje.',
        imageAlt: 'Bereketli Agac Projesi - 1. Ciftlik',
      },
      {
        ...sharedOpportunities.blessedTreeFarmTwo,
        title: 'Bereketli Agac Projesi - 2. Ciftlik',
        description: 'Su anda kapali olan ve katkiya acik olmayan proje.',
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
        'A page listing the approved contribution opportunities of Veysel Karani Waqf; contributions are arranged through direct contact until the payment gateway launches.',
      canonical: undefined,
    },
    hero: {
      title: 'Contribute Now',
      description:
        'Contribute a waqf share, support the Blessed Tree Project or the Gold Waqf Wallet by contacting us directly through this website.',
      image: waqfShareHeroImage,
      imageAlt: 'Veysel Karani Waqf share',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Contribute Now' },
    ],
    intro: {
      eyebrow: 'Official Contribution Opportunities',
      title: 'Contributions are currently arranged through direct contact',
      paragraphs: [
        'This page lists the approved contribution opportunities of Veysel Karani Waqf.',
        "The site's own payment gateway is being prepared; until it launches, the Contribute button takes you to the in-site contact page to arrange your contribution. Closed projects are clearly disabled.",
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
      externalNotice: 'The button takes you to the in-site contact page',
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
        description: 'A project that is currently closed and not open for contributions.',
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
        description: 'A project that is currently closed and not open for contributions.',
        imageAlt: 'Waqf Land Project',
      },
      {
        ...sharedOpportunities.waqfCars,
        title: 'Waqf Cars Project',
        description: 'A project that is currently closed and not open for contributions.',
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
        description: 'A project that is currently closed and not open for contributions.',
        imageAlt: 'Blessed Tree Project - Farm 1',
      },
      {
        ...sharedOpportunities.blessedTreeFarmTwo,
        title: 'Blessed Tree Project - Farm 2',
        description: 'A project that is currently closed and not open for contributions.',
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
