import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Your header/nav here if any */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
