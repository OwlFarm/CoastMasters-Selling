
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SellForm } from '@/components/sell-form';
import { getMetadata } from '@/services/metadata-service';

export default async function SellPage() {
  const metadata = await getMetadata();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                Create a Listing
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Fill out the details below to create a comprehensive and attractive listing for your yacht.
              </p>
            </div>
            <SellForm metadata={metadata} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
