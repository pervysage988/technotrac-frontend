// src/app/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, MapPin, Calendar as CalendarIcon, MessageCircle, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { users, Equipment } from "@/lib/data";
import type { DateRange } from "react-day-picker";
import Link from "next/link";
import { getDistance } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { differenceInDays } from "date-fns";
import { fetchAllEquipment } from "@/lib/api/equipment";
import { createBooking } from "@/lib/api/bookings";

const farmer = users[0]; // Assume this is the logged-in farmer
const MAX_DISTANCE_KM = 70;
const ITEMS_PER_PAGE = 8;

export default function Home() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentType, setEquipmentType] = useState("all");
  const [date, setDate] = useState<DateRange | undefined>();

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [bookingDate, setBookingDate] = useState<DateRange | undefined>();
  const [isBooking, setIsBooking] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadEquipment() {
      setIsLoading(true);
      try {
        const data = await fetchAllEquipment();
        setAllEquipment(data);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load equipment from the server.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadEquipment();
  }, [toast]);

  useEffect(() => {
    const filterAndSetEquipment = () => {
      const filtered = allEquipment.filter((item) => {
        const owner = users.find((u) => u.id === item.owner_id); // Mock owner data for location
        if (!owner) return false;

        const distance = getDistance(
          { lat: farmer.lat!, lon: farmer.lon! },
          { lat: item.lat, lon: item.lon }
        );
        if (distance > MAX_DISTANCE_KM) {
          return false;
        }

        const matchesSearch =
          item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = equipmentType === "all" || item.type.toLowerCase() === equipmentType;
        return matchesSearch && matchesType && item.status === "APPROVED";
      });
      setFilteredEquipment(filtered);
      setCurrentPage(1);
    };
    filterAndSetEquipment();
  }, [searchTerm, equipmentType, allEquipment]);

  useEffect(() => {
    if (bookingDate?.from && bookingDate?.to && selectedEquipment) {
      const days = differenceInDays(bookingDate.to, bookingDate.from) + 1;
      if (days > 0) {
        const total = days * selectedEquipment.daily_rate;
        setCalculatedPrice(total);
      } else {
        setCalculatedPrice(null);
      }
    } else {
      setCalculatedPrice(null);
    }
  }, [bookingDate, selectedEquipment]);

  const equipmentTypes = ["all", ...Array.from(new Set(allEquipment.map((e) => e.type.toLowerCase())))];

  const handleBookingSubmit = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You must be logged in to book equipment.",
      });
      return;
    }
    if (!selectedEquipment || !bookingDate?.from || !bookingDate?.to) {
      toast({
        variant: "destructive",
        title: "Invalid Date",
        description: "Please select a valid date range for your booking.",
      });
      return;
    }

    setIsBooking(true);
    try {
      const token = await user.getIdToken();
      await createBooking(
        {
          equipment_id: selectedEquipment.id,
          start_ts: bookingDate.from.toISOString(),
          end_ts: bookingDate.to.toISOString(),
        },
        token
      );

      toast({ title: "Success!", description: "Your booking request has been sent to the owner." });
      setSelectedEquipment(null);
      setBookingDate(undefined);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error("Unknown error");
      toast({ variant: "destructive", title: "Booking Failed", description: err.message });
    } finally {
      setIsBooking(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedEquipment(null);
      setBookingDate(undefined);
      setCalculatedPrice(null);
    }
  };

  const paginatedEquipment = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEquipment.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEquipment, currentPage]);

  const totalPages = Math.ceil(filteredEquipment.length / ITEMS_PER_PAGE);

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <div className="flex flex-col">
        <section className="container mx-auto px-4 py-12 md:py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-headline text-primary mb-4">Empowering India&apos;s Farmers</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Welcome to TechnoTrac, the community marketplace for sharing farming equipment. Rent the tools you need,
            when you need them.
          </p>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <Card className="p-4 sm:p-6 shadow-lg bg-card/80 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium mb-1">
                  Search Equipment
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="e.g., Tractor, Harvester..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Type
                </label>
                <Select value={equipmentType} onValueChange={setEquipmentType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Availability
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="date" variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {new Date(date.from).toLocaleDateString()} - {new Date(date.to).toLocaleDateString()}
                          </>
                        ) : (
                          new Date(date.from).toLocaleDateString()
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="range" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Card>
        </section>

        {/* Equipment Grid */}
        <section className="container mx-auto px-4 pb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-headline">Available Equipment Near You</h2>
            <span className="text-sm text-muted-foreground">Showing equipment within {MAX_DISTANCE_KM}km</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <Card key={i} className="flex flex-col overflow-hidden">
                  <div className="w-full h-48 bg-muted animate-pulse" />
                  <CardContent className="flex-1 p-4 space-y-2">
                    <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                  </CardContent>
                  <CardFooter className="p-4 bg-secondary/30 flex justify-between items-center">
                    <div className="h-8 w-1/4 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-1/3 bg-muted animate-pulse rounded" />
                  </CardFooter>
                </Card>
              ))
            ) : paginatedEquipment.length > 0 ? (
              paginatedEquipment.map((item) => (
                <Card
                  key={item.id}
                  className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <CardHeader className="p-0">
                    <Image
                      src={item.image_url || "https://picsum.photos/400/300"}
                      alt={item.model}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                      data-ai-hint={`${item.type} farming`}
                    />
                  </CardHeader>
                  <CardContent className="flex-1 p-4">
                    <CardTitle className="font-headline text-xl mb-2">
                      {item.brand} {item.model}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-3">{item.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground mt-3">
                      <MapPin className="h-4 w-4 mr-1.5" />
                      Location placeholder
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-secondary/30 flex justify-between items-center">
                    <div className="font-bold text-lg text-primary">
                      ₹{item.daily_rate}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/day</span>
                    </div>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        onClick={() => setSelectedEquipment(item)}
                      >
                        Book Now
                      </Button>
                    </DialogTrigger>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No equipment found matching your criteria.</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or checking back later.
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-12 gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </section>

        {/* WhatsApp Section */}
        <section className="bg-secondary/30">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-headline mb-4">Prefer Using WhatsApp?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Book equipment, manage rentals, and get support directly through WhatsApp. It&apos;s fast, easy, and
              convenient.
            </p>
            <Button size="lg" asChild className="bg-green-500 hover:bg-green-600 text-white">
              <Link href="https://wa.me/910000000000" target="_blank">
                <MessageCircle className="mr-2" /> Chat on WhatsApp
              </Link>
            </Button>
          </div>
        </section>

        {/* Map Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-headline mb-8">Equipment Near You</h2>
          <Card className="overflow-hidden shadow-lg">
            <div className="relative aspect-[16/6]">
              <Image
                src="https://picsum.photos/1200/400"
                alt="Map of available equipment"
                fill
                className="object-cover"
                data-ai-hint="map farm India"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center p-4 rounded-lg bg-background/80 backdrop-blur-sm">
                  <h3 className="font-headline text-2xl mb-2">Interactive Map Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Visualize available equipment in your area. It&apos;s coming soon!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Booking Dialog */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Request to Book: {selectedEquipment?.brand} {selectedEquipment?.model}
          </DialogTitle>
          <DialogDescription>
            Select a date range for your rental. The equipment owner will confirm the booking.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Calendar
            mode="range"
            selected={bookingDate}
            onSelect={setBookingDate}
            className="rounded-md border"
            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
          />
          {calculatedPrice !== null && (
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="text-sm text-muted-foreground">Estimated Total Price</p>
              <p className="text-2xl font-bold text-primary">₹{calculatedPrice.toLocaleString()}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleBookingSubmit} disabled={isBooking || !calculatedPrice}>
            {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Booking Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
