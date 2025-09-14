// src/lib/api/logistics.ts
import { LogisticsRequest } from "@/lib/data";
import { API_BASE } from "./config";

// ⚠️ NOTE: Logistics API is not implemented in backend yet.
// These functions are placeholders and will throw until backend is ready.

export async function fetchLogisticsRequests(token: string): Promise<LogisticsRequest[]> {
  throw new Error("Logistics API is not implemented in backend yet.");
}

type LogisticsPayload = {
  type: "Import" | "Export";
  goods: string;
  quantity: string;
  destination: string;
  date: string;
};

export async function createLogisticsRequest(payload: LogisticsPayload, token: string) {
  throw new Error("Logistics API is not implemented in backend yet.");
}
