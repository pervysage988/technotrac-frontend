import { API_BASE } from "./config";

type AvailabilityPayload = {
  equipment_id: string;
  start_ts: string; // ✅ align with backend naming
  end_ts: string;   // ✅ align with backend naming
};

// ✅ Save availability
export async function saveAvailability(payload: AvailabilityPayload, token: string) {
  const response = await fetch(`${API_BASE}/api/availability/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Failed to save availability.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

// ✅ Fetch all availabilities
export async function fetchAvailabilities(token: string) {
  const response = await fetch(`${API_BASE}/api/availability/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch availabilities.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}
