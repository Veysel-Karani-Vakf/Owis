import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/useI18n';

type PageSeoProps = {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
};

function upsertMeta(selector: string, create: () => HTMLMetaElement, value: string) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = create();
    document.head.appendChild(element);
  }

  element.setAttribute('content', value);
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

export default function PageSeo({
  title,
  description,
  canonical,
  type = 'website',
}: PageSeoProps) {
  const location = useLocation();
  const { locale } = useI18n();

  useEffect(() => {
    const pageUrl = canonical ?? `${window.location.origin}${location.pathname}`;

    document.title = title;

    upsertMeta("meta[name='description']", () => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      return meta;
    }, description);

    upsertCanonical(pageUrl);

    upsertMeta("meta[property='og:title']", () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      return meta;
    }, title);

    upsertMeta("meta[property='og:description']", () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      return meta;
    }, description);

    upsertMeta("meta[property='og:url']", () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      return meta;
    }, pageUrl);

    upsertMeta("meta[property='og:type']", () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:type');
      return meta;
    }, type);
  }, [canonical, description, locale, location.pathname, title, type]);

  return null;
}
