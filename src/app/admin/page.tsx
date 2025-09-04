// src/app/admin/page.tsx
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
import { users, Equipment, Booking } from "@/lib/data";
import {
  CheckCircle,
  Clock,
  FileText,
  Users,
  Tractor,
  XCircle,
  Loader2,
  BarChart2,
  DollarSign,
  Map,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { fetchPendingEquipment, updateEquipmentStatus } from "@/lib/api/admin";
import { fetchBookings } from "@/lib/api/bookings";

const equipmentStatusVariant: Record<
  Equipment["status"],
  "secondary" | "default" | "destructive" | "outline"
> = {
  PENDING_REVIEW: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  DRAFT: "outline",
  BLOCKED: "destructive",
};

const bookingStatusVariant: Record<
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

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const loadEquipment = useCallback(async () => {
    setIsLoadingEquipment(true);
    try {
      const data = await fetchPendingEquipment();
      setEquipment(data);
    } catch (error: unknown) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load equipment.",
      });
    } finally {
      setIsLoadingEquipment(false);
    }
  }, [toast]);

  const loadBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      const data = await fetchBookings();
      setAllBookings(data);
    } catch (error: unknown) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load bookings.",
      });
    } finally {
      setIsLoadingBookings(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      loadEquipment();
      loadBookings();
    }
  }, [loadEquipment, loadBookings, user]);

  const handleStatusUpdate = async (
    equipmentId: string,
    action: "approve" | "reject"
  ) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in.",
      });
      return;
    }
    setIsUpdating(equipmentId);
    try {
      const token = await user.getIdToken();
      await updateEquipmentStatus(equipmentId, action, token);
      toast({
        title: "Success",
        description: `Equipment has been ${
          action === "approve" ? "approved" : "rejected"
        }.`,
      });
      loadEquipment();
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Unknown error occurred";
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: message,
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const pendingEquipment = equipment.filter(
    (e) => e.status === "PENDING_REVIEW"
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-headline mb-8">Admin Panel</h1>

      {/* Analytics Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-headline mb-4">Analytics Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bookings per Day
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Chart coming soon!</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gross Merchandise Volume (GMV)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Chart coming soon!</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Supply / Demand by Pincode
              </CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Chart coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="approvals">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="approvals">
            <Clock className="mr-2 h-4 w-4" />
            Equipment Approvals
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <FileText className="mr-2 h-4 w-4" />
            All Bookings
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Tractor className="mr-2 h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* Approvals Tab */}
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Equipment Submissions</CardTitle>
              <CardDescription>
                Review and approve or reject new equipment listings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Owner Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingEquipment ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading equipment...
                      </TableCell>
                    </TableRow>
                  ) : pendingEquipment.length > 0 ? (
                    pendingEquipment.map((item) => {
                      const owner = users.find((u) => u.id === item.owner_id);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.brand} {item.model}
                          </TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{owner?.email || "N/A"}</TableCell>
                          <TableCell>
                            Lat: {item.lat.toFixed(4)}, Lon:{" "}
                            {item.lon.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-center capitalize">
                            <Badge variant={equipmentStatusVariant[item.status]}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-primary/90"
                                onClick={() =>
                                  handleStatusUpdate(item.id, "approve")
                                }
                                disabled={isUpdating === item.id}
                              >
                                {isUpdating === item.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(item.id, "reject")
                                }
                                disabled={isUpdating === item.id}
                              >
                                {isUpdating === item.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="mr-2 h-4 w-4" />
                                )}
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No equipment pending approval.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                A consolidated view of all booking requests in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingBookings ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading bookings...
                      </TableCell>
                    </TableRow>
                  ) : allBookings.length > 0 ? (
                    allBookings.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">
                          {req.equipmentName}
                        </TableCell>
                        <TableCell>{req.borrowerName}</TableCell>
                        <TableCell>{req.ownerName}</TableCell>
                        <TableCell>
                          {new Date(req.start_ts).toLocaleDateString()} to{" "}
                          {new Date(req.end_ts).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{req.total_price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={bookingStatusVariant[req.status]}>
                            {req.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all registered users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.displayName}
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.location}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Track all significant actions performed by users and admins.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <p>Audit log feature coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
