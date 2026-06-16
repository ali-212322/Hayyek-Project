import { apiClient } from "@/src/shared/api/client";
import type { Service, ServiceCategory } from "../types/serviceTypes";

export async function getCategories(): Promise<ServiceCategory[]> {
  const response = await apiClient.get("/categories/");
  return response.data.data;
}

export async function getServices(categoryId?: number): Promise<Service[]> {
  const url = categoryId ? `/services/?category=${categoryId}` : "/services/";
  const response = await apiClient.get(url);
  return response.data.data;
}

export async function getServiceById(id: string | number): Promise<Service> {
  const response = await apiClient.get(`/services/${id}/`);
  return response.data.data;
}