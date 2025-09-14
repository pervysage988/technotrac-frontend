const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getEquipment() {
  const res = await fetch(`${API_BASE}/api/equipment`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch equipment");
  return res.json();
}
