import Link from 'next/link';
import { Anchor, ShipWheel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <ShipWheel className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">Coast Masters</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Yachts
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Brokers
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Sell
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Log In</Button>
          <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">Sign Up</Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
