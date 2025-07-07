import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              About Coast Masters
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Coast Masters is the premier online marketplace for buying and selling luxury yachts. Our mission is to connect discerning buyers with the world's finest vessels, backed by expert brokerage services and a seamless digital experience. We are passionate about the sea and dedicated to helping you embark on your next great adventure.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
