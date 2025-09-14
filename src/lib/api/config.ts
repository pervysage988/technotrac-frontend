// src/lib/api/config.ts

// Always use one consistent variable name
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in your environment");
}
