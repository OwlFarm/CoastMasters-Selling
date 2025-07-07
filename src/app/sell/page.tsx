import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';

export default function SellPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Sell Your Yacht with Coast Masters
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              List your yacht with us and reach a global audience of qualified buyers. Our expert team will guide you through every step of the process, ensuring a smooth and successful sale.
            </p>
            <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              Get Started
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
