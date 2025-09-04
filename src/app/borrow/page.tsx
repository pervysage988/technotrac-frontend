import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tractor } from 'lucide-react';
import Link from 'next/link';

export default function BorrowPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
       <Card className="w-full max-w-2xl text-center">
        <CardHeader>
            <Tractor className="mx-auto h-12 w-12 mb-4 text-primary"/>
            <CardTitle className="font-headline text-2xl">Find and Book Equipment</CardTitle>
            <CardDescription>
            The best way to borrow equipment is to browse our live listings.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-6">
                Our main page shows all available equipment near you. You can filter by type and book directly from the listing. The AI-powered request form has been replaced with a direct booking system.
            </p>
            <Button asChild>
                <Link href="/">Browse Available Equipment</Link>
            </Button>
        </CardContent>
       </Card>
    </div>
  );
}
