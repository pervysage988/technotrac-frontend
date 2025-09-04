

export type Equipment = {
    id: string;
    owner_id: string;
    type: 'TRACTOR' | 'HARVESTER' | 'SPRAYER' | 'ROTAVATOR' | 'PLOUGH' | 'OTHER';
    brand: string;
    model: string;
    description?: string; // Not in schema, but useful for display
    daily_rate: number;
    hourly_rate?: number;
    operator_included: boolean;
    lat: number;
    lon: number;
    status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
    created_at: string;
    
    // Kept for frontend use, will be populated from equipment_photos
    image_url: string; 
    // Kept for frontend convenience, will be populated from availability
    availability: boolean; 
};

export type EquipmentPhoto = {
    id: string;
    equipment_id: string;
    url: string;
    position: number;
};

export type Availability = {
    id: string;
    equipment_id: string;
    start_ts: string;
    end_ts: string;
};


export type User = {
  id: string;
  phone_e164: string;
  role: 'FARMER' | 'OWNER' | 'ADMIN';
  displayName: string;
  language: 'hi' | 'en' | 'mr';
  rating_avg: number;
  rating_count: number;
  created_at: string; // Using string for timestamp
  // These were part of the old mock data, but are now in profiles.
  // We can join this data from the backend later.
  // For now, components will need to be adapted.
  email?: string;
  avatarUrl?: string;
  location?: string;
  lat?: number;
  lon?: number;
};

export type OwnerProfile = {
    user_id: string; // FK to users(id)
    upi_id: string;
    kyc_status: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
};

export type FarmerProfile = {
    user_id: string; // FK to users(id)
    village: string;
    pincode: string;
};


export type Booking = {
  id: string;
  equipment_id: string;
  user_id: string; // renter_id
  owner_id: string; // owner_id
  start_ts: string;
  end_ts: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Cancelled' | 'Completed' | 'Expired';
  total_price: number;
  // Frontend-specific fields for easier display, likely joined on the backend
  equipmentName: string;
  ownerName: string;
  borrowerName: string;
};

export type LogisticsRequest = {
  id: string;
  userId: string;
  type: 'Import' | 'Export';
  goods: string;
  destination: string;
  date: string;
  quantity: string;
};

export type AuditLog = {
    id: string;
    actor_user_id: string;
    action: string;
    entity: string;
    entity_id: string;
    payload: Record<string, unknown>; // safer than any, works well for JSONB
    created_at: string;
};


// MOCK DATA - This will need to be updated to reflect the new structure.
// For now, I'm adding the new fields with default values.
export const users: User[] = [
    { id: 'user-1', displayName: 'Ramesh Kumar', email: 'ramesh@farm.com', avatarUrl: 'https://i.pravatar.cc/150?u=ramesh', location: 'Ludhiana, Punjab', lat: 30.9010, lon: 75.8573, phone_e164: '+919876543210', role: 'OWNER', language: 'en', rating_avg: 4.5, rating_count: 10, created_at: '2023-01-15T10:00:00Z' },
    { id: 'user-2', displayName: 'Sita Devi', email: 'sita@garden.com', avatarUrl: 'https://i.pravatar.cc/150?u=sita', location: 'Karnal, Haryana', lat: 29.6857, lon: 76.9905, phone_e164: '+919876543211', role: 'FARMER', language: 'hi', rating_avg: 4.8, rating_count: 25, created_at: '2023-02-20T11:30:00Z' },
    { id: 'user-3', displayName: 'Gurpreet Singh', email: 'gurpreet@field.com', avatarUrl: 'https://i.pravatar.cc/150?u=gurpreet', location: 'Amritsar, Punjab', lat: 31.6340, lon: 74.8723, phone_e164: '+919876543212', role: 'FARMER', language: 'en', rating_avg: 4.2, rating_count: 5, created_at: '2023-03-10T09:00:00Z' },
];

export const equipment: Equipment[] = [
  {
    id: "eq-1",
    owner_id: "user-1",
    type: "TRACTOR",
    brand: "Mahindra",
    model: "JIVO 365 DI",
    description: "High-performance 4WD tractor suitable for various farming operations. Compact and powerful.",
    daily_rate: 6400,
    hourly_rate: 800,
    operator_included: true,
    lat: 30.9010,
    lon: 75.8573,
    status: "APPROVED",
    created_at: "2023-05-01T12:00:00Z",
    image_url: "https://picsum.photos/400/300?random=1",
    availability: true,
  },
  {
    id: "eq-2",
    owner_id: "user-2",
    type: "HARVESTER",
    brand: "Shaktiman",
    model: "Paddy Master",
    description: "Efficient combine harvester for paddy and other grain crops. Features a large grain tank.",
    daily_rate: 12000,
    hourly_rate: 1500,
    operator_included: true,
    lat: 29.6857,
    lon: 76.9905,
    status: "APPROVED",
    created_at: "2023-05-15T14:00:00Z",
    image_url: "https://picsum.photos/400/300?random=2",
    availability: true,
  },
  {
    id: "eq-3",
    owner_id: "user-1",
    type: "TRACTOR",
    brand: "Swaraj",
    model: "717",
    description: "A versatile and maneuverable compact tractor, perfect for small farms and vineyards.",
    daily_rate: 4000,
    hourly_rate: 500,
    operator_included: false,
    lat: 28.9845,
    lon: 77.7064,
    status: "APPROVED",
    created_at: "2023-06-01T10:00:00Z",
    image_url: "https://picsum.photos/400/300?random=3",
    availability: false,
  },
  {
    id: "eq-4",
    owner_id: "user-3",
    type: "PLOUGH",
    brand: "Lemken",
    model: "Plough",
    description: "A robust 3-furrow reversible plough for primary soil tillage. Ensures deep and consistent soil turning.",
    daily_rate: 2400,
    hourly_rate: 300,
    operator_included: false,
    lat: 31.6340,
    lon: 74.8723,
    status: "PENDING_REVIEW",
    created_at: "2023-06-10T09:00:00Z",
    image_url: "https://picsum.photos/400/300?random=4",
    availability: true,
  },
   {
    id: "eq-5",
    owner_id: "user-2",
    type: "SPRAYER",
    brand: "Shrachi Agrimech",
    model: "Spreader",
    description: "Precision fertilizer spreader with adjustable spread width. Ensures even nutrient distribution.",
    daily_rate: 2000,
    hourly_rate: 250,
    operator_included: false,
    lat: 29.1492,
    lon: 75.7217,
    status: "APPROVED",
    created_at: "2023-06-12T11:00:00Z",
    image_url: "https://picsum.photos/400/300?random=5",
    availability: true,
  },
  {
    id: "eq-6",
    owner_id: "user-2",
    type: "OTHER", // Seeder maps to OTHER now
    brand: "Dasmesh",
    model: "912 Seed Drill",
    description: "High-speed seed drill for accurate planting. Suitable for a variety of seed types and soil conditions.",
    daily_rate: 3200,
    hourly_rate: 400,
    operator_included: false,
    lat: 28.6600,
    lon: 77.2300,
    status: "PENDING_REVIEW",
    created_at: "2023-06-15T16:00:00Z",
    image_url: "https://picsum.photos/400/300?random=6",
    availability: true,
  },
];

export const borrowingRequests: Booking[] = [
    { id: 'req-b1', equipment_id: 'eq-2', user_id: 'user-1', owner_id: 'user-2', equipmentName: 'Shaktiman Paddy Master', ownerName: 'Sita Devi', borrowerName: 'Ramesh Kumar', start_ts: '2024-10-01', end_ts: '2024-10-05', total_price: 60000, status: 'Accepted' },
    { id: 'req-b2', equipment_id: 'eq-4', user_id: 'user-1', owner_id: 'user-3', equipmentName: 'Lemken Plough', ownerName: 'Gurpreet Singh', borrowerName: 'Ramesh Kumar', start_ts: '2024-09-20', end_ts: '2024-09-20', total_price: 2400, status: 'Pending' },
    { id: 'req-b3', equipment_id: 'eq-6', user_id: 'user-1', owner_id: 'user-2', equipmentName: 'Dasmesh 912 Seed Drill', ownerName: 'Sita Devi', borrowerName: 'Ramesh Kumar', start_ts: '2024-08-10', end_ts: '2024-08-10', total_price: 3200, status: 'Completed' },
];

export const lendingRequests: Booking[] = [
    { id: 'req-l1', equipment_id: 'eq-1', user_id: 'user-2', owner_id: 'user-1', equipmentName: 'Mahindra JIVO 365 DI', borrowerName: 'Vijay Singh', ownerName: 'Ramesh Kumar', start_ts: '2024-10-10', end_ts: '2024-10-11', total_price: 12800, status: 'Pending' },
    { id: 'req-l2', equipment_id: 'eq-3', user_id: 'user-3', owner_id: 'user-1', equipmentName: 'Swaraj 717', borrowerName: 'Anjali Sharma', ownerName: 'Ramesh Kumar', start_ts: '2024-09-25', end_ts: '2024-09-25', total_price: 4000, status: 'Declined' },
];


export const logisticsRequests: LogisticsRequest[] = [
    { id: 'log-1', userId: 'user-1', type: 'Export', goods: 'Wheat', destination: 'Delhi Mandi', date: 'Next week', quantity: '10 tonnes' },
    { id: 'log-2', userId: 'user-2', type: 'Import', goods: 'Fertilizer', destination: 'Karnal', date: 'This Friday', quantity: '50 bags' },
    { id: 'log-3', userId: 'user-3', type: 'Export', goods: 'Basmati Rice', destination: 'Mumbai Port', date: 'In 2 weeks', quantity: '25 tonnes' },
];
