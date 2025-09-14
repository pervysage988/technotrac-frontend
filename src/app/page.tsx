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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

  // ✅ Updated: fetch equipment with token
  useEffect(() => {
    async function loadEquipment() {
      if (!user) return;
      setIsLoading(true);
      try {
        const token = await user.getIdToken();
        const data = await fetchAllEquipment(token); // pass token
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
  }, [toast, user]);

  useEffect(() => {
    const filterAndSetEquipment = () => {
      const filtered = allEquipment.filter((item) => {
        const owner = users.find((u) => u.id === item.owner_id);
        if (!owner) return false;

        const distance = getDistance(
          { lat: farmer.lat!, lon: farmer.lon! },
          { lat: item.lat, lon: item.lon }
        );
        if (distance > MAX_DISTANCE_KM) return false;

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
      setCalculatedPrice(days > 0 ? days * selectedEquipment.daily_rate : null);
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
        token // pass token here
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
      {/* ... rest of the JSX remains unchanged ... */}
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
