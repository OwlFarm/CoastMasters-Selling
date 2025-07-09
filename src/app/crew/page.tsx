import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function CrewPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h1 className="text-center font-headline text-3xl font-bold tracking-tight md:text-4xl">
            Crew Services
          </h1>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            Find professional crew for deliveries, passages, and private trips.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
