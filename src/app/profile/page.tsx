"use client";

import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Edit, PlusCircle, Loader2 } from "lucide-react"; // ✅ removed CalendarIcon
import { users, equipment as userEquipmentData } from "@/lib/data";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { saveAvailability } from "@/lib/api/availability";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>();

  // This is mock data, in a real app this would come from an API call
  const exampleUser = users[0];
  const userEquipment = userEquipmentData.filter(e => e.owner_id === exampleUser.id);

  const handleAvailabilitySubmit = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in." });
      return;
    }
    if (!selectedEquipmentId || !date || !date.from || !date.to) {
      toast({ variant: "destructive", title: "Invalid Date", description: "Please select a valid date range." });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      await saveAvailability(
        {
          equipment_id: selectedEquipmentId,
          start_date: date.from.toISOString().split("T")[0],
          end_date: date.to.toISOString().split("T")[0],
        },
        token
      );

      toast({ title: "Success", description: "Availability has been updated." });
      // Close dialog and reset
      setSelectedEquipmentId(null);
      setDate(undefined);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    // Or a loading spinner
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Please log in to view your profile.</p>
        <Button asChild className="mt-4">
          <Link href="/signin">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Dialog onOpenChange={(open) => !open && setSelectedEquipmentId(null)}>
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* User Profile Sidebar */}
          <Card className="w-full md:w-1/3 lg:w-1/4 sticky top-24">
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                <AvatarImage src={user.photoURL ?? exampleUser.avatarUrl} alt={user.displayName ?? ""} />
                <AvatarFallback>{(user.email ?? "U").charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-2xl">{user.displayName || user.email}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                {exampleUser.location}
              </CardDescription>
              <Badge variant="secondary" className="mt-2">
                Equipment Owner
              </Badge>
            </CardHeader>
            <CardContent>
              <Separator />
              <div className="py-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <p className="pt-2 text-xs">Member since: Jan 2023</p>
                <p className="text-xs">Successful Lendings: 12</p>
              </div>
              <Separator />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Edit className="mr-2" /> Edit Profile
              </Button>
            </CardFooter>
          </Card>

          {/* Equipment Management Section */}
          <div className="flex-1 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-headline">My Equipment for Rent</h2>
              <Button asChild>
                <Link href="/lend">
                  <PlusCircle className="mr-2" />
                  Add Equipment
                </Link>
              </Button>
            </div>

            {userEquipment.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userEquipment.map((item) => (
                  <Card key={item.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0 relative">
                      <Image
                        src={item.image_url}
                        alt={item.model}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                        data-ai-hint={`${item.type} farming`}
                      />
                      <Badge
                        variant={item.availability ? "secondary" : "destructive"}
                        className="absolute top-2 right-2 shadow-md"
                      >
                        {item.availability ? "Available" : "Booked"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-1 p-4">
                      <CardTitle className="font-headline text-xl mb-2">
                        {item.brand} {item.model}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 bg-secondary/30 flex justify-between items-center">
                      <div className="font-bold text-lg text-primary">
                        ₹{item.hourly_rate}
                        <span className="text-sm font-normal text-muted-foreground ml-1">/hour</span>
                      </div>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedEquipmentId(item.id)}>
                          Manage
                        </Button>
                      </DialogTrigger>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="flex items-center justify-center flex-col text-center p-12 border-dashed">
                <h3 className="text-xl font-headline mb-2">No Equipment Listed Yet</h3>
                <p className="text-muted-foreground mb-4">List your idle gear and earn extra income.</p>
                <Button asChild>
                  <Link href="/lend">List Your First Equipment</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Availability</DialogTitle>
            <DialogDescription>
              Select a date range when this equipment is available for rent. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Calendar mode="range" selected={date} onSelect={setDate} className="rounded-md border" />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAvailabilitySubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Availability
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
