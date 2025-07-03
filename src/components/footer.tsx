import Link from 'next/link';
import { ShipWheel, Anchor } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <ShipWheel className="h-8 w-8 text-primary" />
              <span className="font-headline text-xl font-bold">Coast Masters</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">The premier marketplace for luxury yachts.</p>
          </div>
          <div>
            <h3 className="font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Support</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {currentYear} Coast Masters, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
