import { CartCountProvider } from '#/components/cart-count-context';
import { Header } from '#/components/header';
import { GeistSans } from 'geist/font/sans';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://partialprerendering.com'),
  title: 'Next.js Partial Prerendering',
  description: 'A demo of Next.js using Partial Prerendering.',
  openGraph: {
    title: 'Next.js Partial Prerendering',
    description: 'A demo of Next.js using Partial Prerendering.',
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
    <html lang="en" className={`[color-scheme:dark] ${GeistSans.variable}`}>
      <body className="overflow-y-scroll pb-36">
        <CartCountProvider>
          <Header />
          <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
            {children}
          </div>
        </CartCountProvider>
      </body>
    </html>
  );
}