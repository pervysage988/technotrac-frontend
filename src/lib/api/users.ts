// src/lib/api/users.ts
import { API_BASE } from "./config";

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in your environment");
}

// ✅ Step 1: Request OTP
export async function requestOtp(phone: string) {
  const response = await fetch(`${API_BASE}/api/auth/otp/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_e164: phone }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to request OTP.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

type VerifyOtpPayload = {
  phone_e164: string;
  code: string;
  role: "FARMER" | "OWNER"; // must match backend UserRole
};

// ✅ Step 2: Verify OTP and login
export async function verifyOtp(payload: VerifyOtpPayload) {
  const response = await fetch(`${API_BASE}/api/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Failed to verify OTP.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json(); // { access_token, token_type, user }
}
