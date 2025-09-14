// src/lib/api/equipment.ts
import { API_BASE } from "./config";
import { Equipment } from "@/lib/data";

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in your environment");
}

// ✅ Fetch all approved equipment (public)
export async function fetchAllEquipment(token: string): Promise<Equipment[]> {
  const response = await fetch(`${API_BASE}/api/equipment/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch equipment");
  return response.json();
}

// ✅ Payload type for creating equipment
type EquipmentPayload = {
  model: string;
  brand: string;
  type: string;
  description?: string;
  hourly_rate?: number;
  daily_rate: number;
  operator_included: boolean;
  image_url: string;
  lat: number;
  lon: number;
};

// ✅ Create new equipment (OWNER)
export async function createEquipment(payload: EquipmentPayload, token: string) {
  const response = await fetch(`${API_BASE}/api/equipment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Failed to submit equipment.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

// ✅ Update equipment fields (OWNER only)
export async function updateEquipment(
  equipmentId: string,
  payload: Partial<EquipmentPayload>,
  token: string
) {
  const response = await fetch(`${API_BASE}/api/equipment/${equipmentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Failed to update equipment.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}
