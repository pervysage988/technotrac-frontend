// src/app/logistics/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { LogisticsRequest, users } from "@/lib/data";
import { getDistance } from "@/lib/utils";
import { createLogisticsRequest, fetchLogisticsRequests } from "@/lib/api/logistics";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Loader2, Truck, ArrowUpRight, ArrowDownLeft, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loggedInUser = users[0];
const MAX_DISTANCE_KM = 70;

const logisticsFormSchema = z.object({
  type: z.enum(["Import", "Export"]),
  goods: z.string().min(2, "Goods type is required."),
  quantity: z.string().min(1, "Quantity is required."),
  destination: z.string().min(2, "Destination is required."),
  date: z.string().min(5, "A date or timeframe is required."),
});

export default function LogisticsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [logisticsRequests, setLogisticsRequests] = useState<LogisticsRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof logisticsFormSchema>>({
    resolver: zodResolver(logisticsFormSchema),
    defaultValues: {
      type: "Export",
      goods: "",
      quantity: "",
      destination: "",
      date: "",
    },
  });

  // ✅ Fetch logistics requests with auth token
  const fetchLogistics = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const data = await fetchLogisticsRequests(token);
      setLogisticsRequests(data);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load logistics requests.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchLogistics();
  }, [fetchLogistics]);

  const onSubmit = async (values: z.infer<typeof logisticsFormSchema>) => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in." });
      return;
    }
    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      await createLogisticsRequest(values, token);
      toast({ title: "Success", description: "Your logistics request has been posted." });
      setIsDialogOpen(false);
      form.reset();
      fetchLogistics();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An unexpected error occurred.";
      toast({ variant: "destructive", title: "Submission Failed", description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nearbyRequests = logisticsRequests.filter((req) => {
    const requester = users.find((u) => u.id === req.userId);
    if (!requester || requester.id === loggedInUser.id) return false;
    const distance = getDistance(
      { lat: loggedInUser.lat!, lon: loggedInUser.lon! },
      { lat: requester.lat ?? 0, lon: requester.lon ?? 0 }
    );
    return distance <= MAX_DISTANCE_KM;
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-headline mb-2">Logistics Collaboration</h1>
            <p className="text-muted-foreground max-w-2xl">
              Coordinate with nearby farmers for import/export needs. Share transport costs and save money.
            </p>
          </div>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Post a New Request
            </Button>
          </DialogTrigger>
        </div>

        {/* Nearby Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck />
              Nearby Transport Requests
            </CardTitle>
            <CardDescription>
              Showing requests from farmers within a {MAX_DISTANCE_KM}km radius of your location.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <Loader2 className="mx-auto h-12 w-12 animate-spin mb-4" />
                <p>Loading requests...</p>
              </div>
            ) : nearbyRequests.length > 0 ? (
              nearbyRequests.map((req) => {
                const requester = users.find((u) => u.id === req.userId)!;
                const isExport = req.type === "Export";
                return (
                  <Card
                    key={req.id}
                    className="p-4 flex flex-col sm:flex-row items-start gap-4 hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="w-12 h-12 border">
                      <AvatarImage src={requester.avatarUrl} alt={requester.displayName} />
                      <AvatarFallback>{requester.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {requester.displayName}{" "}
                            <span className="text-xs text-muted-foreground">
                              from {requester.location}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Needs to <span className="font-medium">{req.type}</span>:{" "}
                            <span className="font-semibold text-primary">
                              {req.quantity} of {req.goods}
                            </span>
                          </p>
                        </div>
                        <Badge
                          variant={isExport ? "secondary" : "outline"}
                          className="gap-1"
                        >
                          {isExport ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                          {req.type}
                        </Badge>
                      </div>
                      <div className="border-l-2 pl-3 mt-2 text-sm">
                        <p>
                          <span className="font-semibold">Destination:</span> {req.destination}
                        </p>
                        <p>
                          <span className="font-semibold">When:</span> {req.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-2 sm:mt-0 self-start">
                      <MessageSquare className="mr-2" /> Connect
                    </Button>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Truck className="mx-auto h-12 w-12 mb-4" />
                <p>No nearby logistics requests found.</p>
                <p className="text-sm">Be the first to post one!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for creating request */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a Logistics Request</DialogTitle>
          <DialogDescription>
            Share your transport needs with nearby farmers to find collaboration opportunities.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Request Type</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Export" id="r1" />
                        </FormControl>
                        <Label htmlFor="r1">Export (Sending goods)</Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Import" id="r2" />
                        </FormControl>
                        <Label htmlFor="r2">Import (Receiving goods)</Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Goods */}
            <FormField
              control={form.control}
              name="goods"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goods</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Wheat, Fertilizer, Seeds" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Quantity & Date */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10 tonnes, 50 bags" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Date</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Next week, Oct 15th" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Destination */}
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination / Origin</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Delhi Mandi, Karnal Warehouse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
