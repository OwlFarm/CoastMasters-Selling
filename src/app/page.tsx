import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { YachtListings } from '@/components/yacht-listings';
import { getFeaturedYachts } from '@/services/yacht-service';
import { HeroSection } from '@/components/hero-section';

export default async function Home() {
  const featuredYachts = await getFeaturedYachts();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Featured Yachts
            </h2>
            <YachtListings yachts={featuredYachts} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
