import type { Metadata, Viewport } from 'next';
import { Public_Sans, Roboto_Mono } from 'next/font/google';
import './globals.css';
import MainLayout from './main.layout';
import { appConfig } from '@/common/constants';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import ogImage from './cover.png';
import { Toaster } from 'sonner';
import JsonLd from '@/components/json-ld';

const publicSans = Public_Sans({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-public-sans',
  subsets: ['latin'],
});
const robotoMono = Roboto_Mono({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: appConfig.pageTitle,
    template: `%s | ${appConfig.name}`,
  },
  applicationName: appConfig.name,
  description: appConfig.description,
  keywords: appConfig.keywords,
  creator: appConfig.creator,
  authors: [{ name: appConfig.creator, url: appConfig.creatorUrl }],
  metadataBase: new URL(appConfig.url),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    images: [
      {
        url: ogImage.src,
        width: 1280,
        height: 640,
        alt: appConfig.pageTitle,
      },
    ],
    type: 'website',
    siteName: appConfig.name,
    title: appConfig.pageTitle,
    description: appConfig.description,
    url: appConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
    site: appConfig.twitterHandle,
    creator: appConfig.twitterHandle,
    images: [
      {
        url: ogImage.src,
        width: 1280,
        height: 640,
        alt: appConfig.pageTitle,
      },
    ],
    title: appConfig.pageTitle,
    description: appConfig.description,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafb' },
    { media: '(prefers-color-scheme: dark)', color: '#191919' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta name='apple-mobile-web-app-title' content={appConfig.name} />
      </head>
      <body
        className={`${publicSans.variable} ${robotoMono.variable} antialiased dark:bg-backgroundDark dark:text-foregroundDark bg-background text-foreground overflow-x-hidden`}
      >
        <MainLayout>{children}</MainLayout>
        <Toaster richColors />
        <JsonLd
          id='ld-site'
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                '@id': `${appConfig.url}/#website`,
                name: appConfig.name,
                url: appConfig.url,
                description: appConfig.description,
                inLanguage: 'en',
                publisher: { '@id': `${appConfig.url}/#creator` },
              },
              {
                '@type': 'WebApplication',
                '@id': `${appConfig.url}/#webapp`,
                name: appConfig.pageTitle,
                url: appConfig.url,
                description: appConfig.description,
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Any',
                browserRequirements: 'Requires JavaScript',
                isAccessibleForFree: true,
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                creator: { '@id': `${appConfig.url}/#creator` },
              },
              {
                '@type': 'Person',
                '@id': `${appConfig.url}/#creator`,
                name: appConfig.creator,
                url: appConfig.creatorUrl,
                sameAs: [appConfig.githubUrl, appConfig.linkedinUrl],
              },
            ],
          }}
        />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ?? ''}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
