"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function SignInPage() {
  const { toast } = useToast();
  const { user, requestOtp, verifyOtp } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("FARMER"); // or OWNER
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestOtp(phone);
      toast({ title: "OTP Sent", description: "Check your phone." });
      setStep("otp");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(phone, otp, role);
      toast({ title: "Welcome!", description: "You are logged in." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // Already logged in, redirect happens in useAuth
  }

  return (
    <div className="container mx-auto px-4 py-12 flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Welcome to TechnoTrac</CardTitle>
          <CardDescription>Sign in with your phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={step === "phone" ? "phone" : "otp"}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone">Request OTP</TabsTrigger>
              <TabsTrigger value="otp">Verify OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="phone">
              <form onSubmit={handleRequestOtp} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (E.164)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+919876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending OTP..." : "Request OTP"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="otp">
              <form onSubmit={handleVerifyOtp} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    className="border rounded px-3 py-2 w-full"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="FARMER">Farmer</option>
                    <option value="OWNER">Owner</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
