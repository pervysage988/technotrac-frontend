// src/lib/api/ratings.ts
import { API_BASE } from "./config";

type RatingPayload = {
    booking_id: string;
    stars: number;
    comment: string;
};

export async function submitRating(payload: RatingPayload, token: string) {
    const response = await fetch(`${API_BASE}/api/v1/ratings`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Failed to submit review.");
    }
    
    return response.json();
}
