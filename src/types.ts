export type ItemCondition =
  | 'Sangat Baik'
  | 'Baik'
  | 'Rusak Ringan'
  | 'Rusak Berat'
  | 'Dalam Perbaikan'
  | 'Afkir';

export type ItemCategory =
  | 'Peralatan Masak'
  | 'Furnitur & Meja Kursi'
  | 'Elektronik & Pendingin'
  | 'Penyimpanan & Lemari'
  | 'APD & Sanitasi'
  | 'Wadah & Peralatan Makan'
  | 'Lainnya';

export interface MutationRecord {
  id: string;
  date: string;
  fromKitchenId: string;
  toKitchenId: string;
  fromSpot: string;
  toSpot: string;
  reason: string;
  handledBy: string;
}

export interface ConditionRecord {
  id: string;
  date: string;
  fromCondition: ItemCondition;
  toCondition: ItemCondition;
  notes: string;
  inspector: string;
}

export interface Kitchen {
  id: string;
  name: string;
  code: string;
  address: string;
  pic: string;
  contact: string;
  capacityPortions: number;
  description?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: ItemCategory;
  kitchenId: string;
  locationSpot: string; // Tempat spesifik barang berada saat ini (misal: "Area Masak Utama - Sisi Utara")
  condition: ItemCondition;
  acquisitionPrice: number; // Nilai perolehan barang (Rp)
  purchaseDate: string; // YYYY-MM-DD
  quantity: number;
  unit: string; // 'Unit', 'Pcs', 'Set', 'Buah'
  brandOrSpec: string; // Merk atau spesifikasi
  pic: string; // Petugas Penanggung Jawab
  notes?: string;
  imageUrl?: string; // Foto produk/aset fisik (URL atau data URI Base64 terkompresi)
  lastInspectedDate?: string;
  mutationHistory?: MutationRecord[];
  conditionHistory?: ConditionRecord[];
}

export type ViewMode = 'table' | 'grid';

export interface FilterState {
  search: string;
  kitchenId: string; // 'all' or specific kitchen ID
  category: string; // 'all' or specific category
  condition: string; // 'all' or specific condition
  month: string; // 'all' or 'YYYY-MM' (e.g. '2025-01')
  sortBy: 'purchaseDate_desc' | 'purchaseDate_asc' | 'price_desc' | 'price_asc' | 'name_asc';
}
