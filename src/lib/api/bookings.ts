import { API_BASE } from "./config";

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in your environment");
}

type BookingPayload = {
  equipment_id: string;
  start_ts: string;
  end_ts: string;
};

// ✅ Fetch all bookings (requires admin/user token)
export async function fetchBookings(token: string) {
  const response = await fetch(`${API_BASE}/api/bookings/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch bookings.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

// ✅ Create a new booking
export async function createBooking(payload: BookingPayload, token: string) {
  const response = await fetch(`${API_BASE}/api/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create booking.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

// ✅ Update booking status (accept/reject)
export async function updateBookingStatus(
  bookingId: string,
  action: "accept" | "reject",
  token: string
) {
  const response = await fetch(
    `${API_BASE}/api/bookings/${bookingId}/${action}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    let errorMessage = `Failed to ${action} booking.`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch {
    return { success: true };
  }
}
