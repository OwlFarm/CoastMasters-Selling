import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BrokerCard, type Broker } from '@/components/broker-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const brokers: Broker[] = [
  {
    id: '1',
    name: 'Johnathan Pierce',
    agency: 'Prestige Yachting',
    location: 'Miami, FL',
    imageUrl: 'https://placehold.co/400x400/34495E/FFFFFF.png',
    imageHint: 'male portrait',
    specialties: ['Motor Yachts', 'Superyachts', 'New Construction'],
    phone: '+1 (305) 555-1234',
    email: 'j.pierce@prestigeyacht.com',
  },
  {
    id: '2',
    name: 'Samantha Riley',
    agency: 'Azure Seas Brokerage',
    location: 'Monaco',
    imageUrl: 'https://placehold.co/400x400/A2B9D1/34495E.png',
    imageHint: 'female portrait',
    specialties: ['Sailing Yachts', 'Catamarans', 'European Market'],
    phone: '+377 97 55 55 55',
    email: 'samantha.r@azureseas.mc',
  },
  {
    id: '3',
    name: 'David Chen',
    agency: 'Pacific Rim Yachts',
    location: 'Hong Kong',
    imageUrl: 'https://placehold.co/400x400/4ECCA3/232931.png',
    imageHint: 'male portrait professional',
    specialties: ['Giga Yachts', 'Explorers', 'Asian Market'],
    phone: '+852 2525 8888',
    email: 'd.chen@pacificrim.hk',
  },
  {
    id: '4',
    name: 'Isabella Rossi',
    agency: 'Bella Vista Charters & Sales',
    location: 'Genoa, Italy',
    imageUrl: 'https://placehold.co/400x400/FFC300/581845.png',
    imageHint: 'woman portrait professional',
    specialties: ['Classic Yachts', 'Riva', 'Ferretti Group'],
    phone: '+39 010 123 4567',
    email: 'isabella@bellavistayachts.it',
  },
];


export default function BrokersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Our Expert Yacht Brokers
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Connect with our world-class team of yachting professionals. Whether you are buying, selling, or building, our brokers provide unparalleled expertise and personalized service to guide you through every step of the process.
            </p>
          </div>
          <div className="mx-auto max-w-lg mb-12">
              <div className="relative">
                  <Input
                      type="search"
                      placeholder="Search by name, agency, or location..."
                      className="pl-10 h-12 text-base"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {brokers.map((broker) => (
              <BrokerCard key={broker.id} broker={broker} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
