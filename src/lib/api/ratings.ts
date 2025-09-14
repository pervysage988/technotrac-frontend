// src/lib/api/ratings.ts
import { API_BASE } from "./config";

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in your environment");
}

type RatingPayload = {
  booking_id: string;
  stars: number;
  comment: string;
};

// ✅ Submit rating for a booking
export async function submitRating(payload: RatingPayload, token: string) {
  const response = await fetch(`${API_BASE}/api/ratings/`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Failed to submit review.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}
