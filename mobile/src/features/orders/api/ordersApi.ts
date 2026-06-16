import { apiClient } from "@/src/shared/api/client";
import type { CreateOrderPayload, Order, Payment } from "../types/orderTypes";

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const response = await apiClient.post("/orders/create/", {
    ...payload,
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    scheduled_at: payload.scheduled_at ?? null,
  });

  return response.data.data;
}

export async function createMockPayment(orderId: number): Promise<Payment> {
  const response = await apiClient.post("/payments/", {
    order: orderId,
    method: "visa",
  });

  return response.data.data;
}