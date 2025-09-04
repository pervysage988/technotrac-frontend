// src/app/dashboard/page.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Booking } from "@/lib/data";
import { Loader2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { submitRating } from "@/lib/api/ratings";
import { fetchBookings, updateBookingStatus } from "@/lib/api/bookings";

const statusVariant: Record<
  Booking["status"],
  "secondary" | "default" | "destructive" | "outline"
> = {
  Pending: "secondary",
  Accepted: "default",
  Declined: "destructive",
  Completed: "outline",
  Cancelled: "destructive",
  Expired: "destructive",
};

export default function DashboardPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (error: unknown) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load your bookings.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const { borrowingRequests, lendingRequests } = useMemo(() => {
    if (!user) return { borrowingRequests: [], lendingRequests: [] };
    const borrowing = bookings.filter((b) => b.user_id === user.uid);
    const lending = bookings.filter((b) => b.owner_id === user.uid);
    return { borrowingRequests: borrowing, lendingRequests: lending };
  }, [bookings, user]);

  const handleRatingSubmit = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in.",
      });
      return;
    }
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a star rating.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      await submitRating(
        {
          booking_id: selectedRequest!.id,
          stars: rating,
          comment: review,
        },
        token
      );

      toast({
        title: "Success",
        description: "Your review has been submitted.",
      });
      setSelectedRequest(null);
      setRating(0);
      setReview("");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Something went wrong.";
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingAction = async (
    bookingId: string,
    action: "accept" | "reject"
  ) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in.",
      });
      return;
    }
    setIsUpdating(bookingId);
    try {
      const token = await user.getIdToken();
      await updateBookingStatus(bookingId, action, token);
      toast({
        title: "Success",
        description: `Booking has been ${
          action === "accept" ? "accepted" : "rejected"
        }.`,
      });
      loadBookings();
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Something went wrong.";
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: message,
      });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && setSelectedRequest(null)}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-headline mb-8">Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Request Management</CardTitle>
            <CardDescription>
              Manage your borrowing and lending requests here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="borrows">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="borrows">My Borrows</TabsTrigger>
                <TabsTrigger value="lends">Lending Requests</TabsTrigger>
              </TabsList>
              <TabsContent value="borrows" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Loading your borrowing requests...
                  </div>
                ) : borrowingRequests.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    You haven&apos;t borrowed any equipment yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {borrowingRequests.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">
                            {req.equipmentName}
                          </TableCell>
                          <TableCell>{req.ownerName}</TableCell>
                          <TableCell>
                            {new Date(req.start_ts).toLocaleDateString()} to{" "}
                            {new Date(req.end_ts).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{req.total_price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={statusVariant[req.status]}>
                              {req.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {req.status === "Pending" && (
                              <Button variant="outline" size="sm">
                                Cancel
                              </Button>
                            )}
                            {req.status === "Completed" && (
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedRequest(req)}
                                >
                                  <Star className="mr-2 h-4 w-4" /> Rate
                                </Button>
                              </DialogTrigger>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
              <TabsContent value="lends" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Loading your lending requests...
                  </div>
                ) : lendingRequests.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    You have no pending lending requests.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Borrower</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead className="text-right">Offer</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lendingRequests.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">
                            {req.equipmentName}
                          </TableCell>
                          <TableCell>{req.borrowerName}</TableCell>
                          <TableCell>
                            {new Date(req.start_ts).toLocaleDateString()} to{" "}
                            {new Date(req.end_ts).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{req.total_price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={statusVariant[req.status]}>
                              {req.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {req.status === "Pending" && (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-primary/90"
                                  onClick={() =>
                                    handleBookingAction(req.id, "accept")
                                  }
                                  disabled={isUpdating === req.id}
                                >
                                  {isUpdating === req.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    "Accept"
                                  )}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleBookingAction(req.id, "reject")
                                  }
                                  disabled={isUpdating === req.id}
                                >
                                  {isUpdating === req.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    "Decline"
                                  )}
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
          <DialogDescription>
            How was your experience renting {selectedRequest?.equipmentName} from{" "}
            {selectedRequest?.ownerName}?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    rating >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="review">Your Review (Optional)</Label>
            <Textarea
              id="review"
              placeholder="Tell us about your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleRatingSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
