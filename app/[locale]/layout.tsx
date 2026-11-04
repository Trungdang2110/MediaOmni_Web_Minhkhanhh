import { ReactNode } from 'react';
import { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';

import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';

import { Providers } from '@/app/providers';
import '@/styles/design-system/tokens.css';
import '@/styles/design-system/components.css';
import '@/styles/pyra.css';
import { getMessages, getTranslations } from 'next-intl/server';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://numerology-app.site';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const alternates = routing.locales.reduce(
    (acc, l) => {
      acc[l] = `${baseUrl}/${l}`;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: alternates
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: 'Numerology',
      images: [
        {
          url: '/icon.svg',
          width: 512,
          height: 512,
          alt: 'Numerology Logo - Pyra Mascot'
        }
      ],
      locale: locale,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/icon.svg']
    },
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg'
    }
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Cormorant+SC:wght@600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Playfair+Display:wght@600;700;900&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Numerology',
              url: baseUrl,
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'All',
              description:
                'Professional Numerology Analysis and RAG AI Chatbot.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              }
            })
          }}
        />
      </head>

      <body suppressHydrationWarning>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>

        <Script
          id="gtag-src"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${
            process.env?.NEXT_PUBLIC_GOOGLE_ANALYTICS ?? 'UA-137260564-1'
          }`}
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${
              process.env?.NEXT_PUBLIC_GOOGLE_ANALYTICS ?? 'UA-137260564-1'
            }', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
