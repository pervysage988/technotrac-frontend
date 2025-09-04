// src/lib/api/equipment.ts
import { Equipment } from "@/lib/data";
import { API_BASE } from "./config";

export async function fetchAllEquipment(): Promise<Equipment[]> {
  const response = await fetch(`${API_BASE}/api/equipment/`);
  if (!response.ok) {
    throw new Error('Failed to fetch equipment');
  }
  return response.json();
}

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

export async function createEquipment(payload: EquipmentPayload, token: string) {
    const response = await fetch(`${API_BASE}/api/equipment/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit equipment.');
    }
    
    return response.json();
}
