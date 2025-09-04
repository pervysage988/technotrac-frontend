// This file path is a suggestion. You can move it to `src/app/borrow/borrow-form.tsx` if you prefer co-location.
"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formulateBorrowRequest, FormulateBorrowRequestInput } from '@/ai/flows/formulate-borrow-request';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

const formSchema = z.object({
  borrowerId: z.string(),  // ✅ always required
  equipmentType: z.string().min(2, { message: "Equipment type is required." }),
  rentalDates: z.string().min(5, { message: "Please specify rental dates." }),
  additionalDetails: z.string().optional(),
  pastBorrowingHistory: z.string().optional(),
});

export function BorrowForm() {
  const [isPending, startTransition] = useTransition();
  const [formulatedRequest, setFormulatedRequest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    borrowerId: "user-123", // ✅ must exist since schema requires string
    equipmentType: "",
    rentalDates: "",
    additionalDetails: "",
    pastBorrowingHistory: "Borrowed a small tractor for 3 days in June 2023 for planting. Returned on time, in good condition.",
  },
});

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setError(null);
      setFormulatedRequest(null);
      try {
        const input: FormulateBorrowRequestInput = values;
        const result = await formulateBorrowRequest(input);
        setFormulatedRequest(result.formulatedRequest);
      } catch (e) {
        setError("Failed to generate request. Please try again.");
        console.error(e);
      }
    });
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create a Borrow Request</CardTitle>
        <CardDescription>
          Let our AI assistant help you craft the perfect borrowing request to increase your chances of acceptance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="equipmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Combine Harvester" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rentalDates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Rental Dates</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., October 15-20, 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="pastBorrowingHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Past Borrowing History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your past borrowing experiences..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This helps lenders trust you with their equipment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any specific requirements for the equipment? (e.g., requires GPS, specific horsepower)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Request
            </Button>
          </form>
        </Form>
        
        {(isPending || formulatedRequest || error) && <Separator className="my-8" />}

        {isPending && (
          <div className="space-y-2">
            <p className="text-center text-muted-foreground">AI is thinking...</p>
            <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full w-full animate-pulse"></div>
            </div>
          </div>
        )}

        {error && <p className="text-destructive text-sm">{error}</p>}
        
        {formulatedRequest && (
          <div className="space-y-4">
             <h3 className="font-headline text-lg">AI-Generated Request:</h3>
            <Textarea
              readOnly
              value={formulatedRequest}
              className="min-h-[150px] bg-secondary/30"
            />
             <Button variant="secondary" className="w-full">Copy and Send Request</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
