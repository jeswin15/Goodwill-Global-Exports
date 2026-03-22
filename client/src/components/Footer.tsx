import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-secondary/30">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="GOODWILL GLOBAL EXPORTS" className="h-8 w-auto" />
              <span className="font-serif text-xl font-bold text-primary">
                GOODWILL GLOBAL EXPORTS
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium B2B export solutions connecting international markets with quality raw food products from GOODWILL GLOBAL EXPORTS.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Quick Links</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/licenses" className="hover:text-primary transition-colors">Licenses</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Products</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">Premium Spices</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Organic Grains</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Seasonal Fruits</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Export Quality Nuts</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>51/7-5, Mani Complex,Sangagiri Road, Namakkal, Tamil Nadu - 637209</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 74491 59999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@goodwillglobal.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center text-xs text-muted-foreground md:flex-row md:text-left">
          <p>&copy; {new Date().getFullYear()} GOODWILL GLOBAL EXPORTS Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
