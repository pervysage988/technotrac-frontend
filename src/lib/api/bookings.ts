// src/lib/api/bookings.ts
import { API_BASE } from "./config";

export async function fetchBookings() {
  const res = await fetch(`${API_BASE}/api/v1/booking`); // singular
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

type BookingPayload = {
  equipment_id: string;
  start_ts: string;
  end_ts: string;
};

export async function createBooking(payload: BookingPayload, token: string) {
  const response = await fetch(`${API_BASE}/api/v1/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create booking.");
  }

  return response.json();
}

export async function updateBookingStatus(
  bookingId: string,
  action: "accept" | "reject",
  token: string
) {
  const response = await fetch(
    `${API_BASE}/api/v1/bookings/${bookingId}/${action}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to ${action} booking.`);
  }

  // This endpoint may not return a body.
  try {
    return await response.json();
  } catch {
    return response; // ✅ no unused "e"
  }
}
