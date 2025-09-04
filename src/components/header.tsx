
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { UserNav } from "@/components/user-nav";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Equipment" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/logistics", label: "Logistics" },
  { href: "/community", label: "Community" },
  { href: "/borrow", label: "Borrow AI" },
  { href: "/lend",label: "Lend AI" },
  { href: "/admin", label: "Admin" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-lg">
              TechnoTrac
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle Navigation"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                 <Link href="/" className="flex items-center space-x-2">
                  <Icons.logo className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline text-lg">TechnoTrac</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 p-4 text-lg">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="transition-colors hover:text-foreground/80 text-foreground/70"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
           <div className="md:hidden">
             <Link href="/" className="flex items-center space-x-2">
                <Icons.logo className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-lg">TechnoTrac</span>
              </Link>
           </div>
           <div className="flex items-center gap-2">
            <UserNav />
           </div>
        </div>
      </div>
    </header>
  );
}
