export type Order = {
  id: number;
  order_number: string;
  resident: number;
  resident_name: string;
  provider: number;
  provider_name: string;
  service: number | null;
  service_name: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled" | "rejected";
  notes: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  scheduled_at: string | null;
  total_price: string;
  created_at: string;
};

export type CreateOrderPayload = {
  provider: number;
  service: number;
  notes?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  scheduled_at?: string | null;
};

export type Payment = {
  id: number;
  order: number;
  order_number: string;
  amount: string;
  status: string;
  method: string;
  transaction_id: string;
  created_at: string;
};