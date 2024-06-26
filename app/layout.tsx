import { GeistSans } from 'geist/font/sans';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://wasso.org'),
  title: 'Wasso',
  description: 'Une super appli !',
  openGraph: {
    title: 'Wasso',
    description: 'Une super appli !',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="overflow-y-scroll pb-36">{children}</body>
    </html>
  );
}
