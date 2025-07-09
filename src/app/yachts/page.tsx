import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getFeaturedYachts } from '@/services/yacht-service';
import { YachtsView } from '@/components/yachts-view';

export default async function YachtsPage() {
  const initialYachts = await getFeaturedYachts();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <YachtsView initialYachts={initialYachts} />
      <Footer />
    </div>
  );
}
