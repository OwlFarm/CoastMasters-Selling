import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { YachtListings } from '@/components/yacht-listings';
import { featuredYachts } from '@/lib/data';

export default function YachtsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
                <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                    Our Yacht Collection
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Browse our curated collection of luxury yachts from around the world.
                </p>
            </div>
            <YachtListings yachts={featuredYachts} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
