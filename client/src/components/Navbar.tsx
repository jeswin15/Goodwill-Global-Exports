import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MoreVertical, Lock } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Blog", path: "/blog" },
    { name: "Licenses", path: "/licenses" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 transition-all hover:opacity-80 group">
          <img src="/images/logo.png" alt="GOODWILL GLOBAL EXPORTS" className="h-10 w-auto transition-transform group-hover:scale-110" />
          <span className="font-serif text-xl font-bold tracking-tight text-primary hidden sm:inline group-hover:text-accent transition-colors uppercase">
            GOODWILL GLOBAL EXPORTS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-8 items-center">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "text-sm font-medium transition-all hover:text-accent relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full",
                location === item.path
                  ? "text-primary font-bold after:w-full"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 hover:bg-accent/10 hover:text-accent transition-colors">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/admin">
                <DropdownMenuItem className="cursor-pointer hover:bg-accent/10 hover:text-accent">
                  <Lock className="mr-2 h-4 w-4" />
                  Admin Portal
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:flex">
          <Link href="/quote">
            <Button variant="default" size="sm" className="bg-primary text-white hover:bg-primary/90 btn-hover-effect">
              Get a Quote
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/admin">
                <DropdownMenuItem className="hover:text-accent">
                  <Lock className="mr-2 h-4 w-4" />
                  Admin
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-10">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-accent",
                      location === item.path
                        ? "text-primary font-bold"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/quote">
                  <Button className="w-full mt-4 btn-hover-effect" onClick={() => setIsOpen(false)}>
                    Get a Quote
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
