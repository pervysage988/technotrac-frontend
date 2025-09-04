import Link from "next/link";
import { Icons } from "./icons";

export function Footer() {
    return (
        <footer className="border-t">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <Icons.logo className="h-6 w-6 text-primary hidden sm:block" />
                    <p className="text-center text-sm leading-loose md:text-left">
                        © {new Date().getFullYear()} TechnoTrac. All rights reserved.
                    </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Link href="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    <Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
}
