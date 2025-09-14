import { Equipment } from "@/lib/data";
import { API_BASE } from "./config";

// ✅ Fetch all pending equipment (awaiting admin approval)
export async function fetchPendingEquipment(token: string): Promise<Equipment[]> {
  const res = await fetch(`${API_BASE}/api/admin/pending-equipment`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch pending equipment");

  return res.json();
}

// ✅ Approve or reject equipment
export async function updateEquipmentStatus(
  equipmentId: string,
  action: "approve" | "reject",
  token: string
): Promise<{ success: boolean }> {
  const endpoint =
    action === "approve"
      ? `/api/admin/approve/${equipmentId}/`
      : `/api/admin/reject/${equipmentId}/`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = `Failed to ${action} equipment.`;
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
