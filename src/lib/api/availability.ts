// src/lib/api/availability.ts
import { API_BASE } from "./config";

type AvailabilityPayload = {
    equipment_id: string;
    start_date: string;
    end_date: string;
};

export async function saveAvailability(payload: AvailabilityPayload, token: string) {
    const response = await fetch(`${API_BASE}/api/v1/availability/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save availability.');
    }
    
    return response.json();
}

export async function fetchAvailabilities(token: string) {
    const response = await fetch(`${API_BASE}/api/v1/availabilities`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch availabilities.');
    }

    return response.json();
}
