// src/lib/api/logistics.ts
import { LogisticsRequest } from "@/lib/data";
import { API_BASE } from "./config";

export async function fetchLogisticsRequests(): Promise<LogisticsRequest[]> {
  const response = await fetch(`${API_BASE}/api/v1/logistics/`);
  if (!response.ok) {
    throw new Error("Failed to fetch logistics requests");
  }
  return response.json();
}

type LogisticsPayload = {
  type: "Import" | "Export";
  goods: string;
  quantity: string;
  destination: string;
  date: string;
};

export async function createLogisticsRequest(payload: LogisticsPayload, token: string) {
  const response = await fetch(`${API_BASE}/api/v1/logistics/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to post request.');
  }

  return response.json();
}
