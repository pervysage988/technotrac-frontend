// src/lib/api/admin.ts
import { Equipment } from "@/lib/data";
import { API_BASE } from "./config";

export async function fetchPendingEquipment(): Promise<Equipment[]> {
  const response = await fetch(`${API_BASE}/api/v1/admin/approvals`);
  if (!response.ok) {
    throw new Error("Failed to fetch equipment");
  }
  return response.json();
}

export async function updateEquipmentStatus(equipmentId: string, action: 'approve' | 'reject', token: string) {
  const endpoint = action === 'approve' 
    ? `/api/v1/admin/approve/${equipmentId}`
    : `/api/v1/admin/reject/${equipmentId}`;
    
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to ${action} equipment.`);
  }

  // The response for this endpoint might not have a body, or it might.
  // If it doesn't, .json() will fail. We can return the response object itself.
  return response;
}
