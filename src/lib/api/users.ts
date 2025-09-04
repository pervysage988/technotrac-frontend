// src/lib/api/users.ts
import { API_BASE } from "./config";

export async function signupStart(phone: string, token: string) {
  const res = await fetch(`${API_BASE}/api/v1/users/signup/start`, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ phone_e164: phone }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Failed to start signup.');
  }
  return res.json();
}
