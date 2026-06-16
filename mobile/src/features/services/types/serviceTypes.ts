export type ServiceCategory = {
  id: number;
  name_ar: string;
  name_en: string;
  icon: string | null;
  is_active: boolean;
};

export type Service = {
  id: number;
  provider: number;
  provider_name: string;
  provider_latitude: string | null;
  provider_longitude: string | null;
  category: number;
  category_name: string;
  name: string;
  description: string;
  image_url: string | null;
  price: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
};
