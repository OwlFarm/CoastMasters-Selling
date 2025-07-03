import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { YachtSearch } from '@/components/yacht-search';
import { YachtListings } from '@/components/yacht-listings';
import { featuredYachts } from '@/lib/data';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section
          className="relative w-full bg-cover bg-center bg-no-repeat py-24 md:py-32 lg:py-40"
          style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
          data-ai-hint="ocean yacht"
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="container relative mx-auto px-4 text-center text-white">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your Voyage Begins Here
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300 md:text-xl">
              Discover the world's most exclusive yachts. Use our AI-powered search to find the perfect vessel for your next adventure.
            </p>
            <YachtSearch />
          </div>
        </section>

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
