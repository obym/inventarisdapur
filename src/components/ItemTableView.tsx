import React from 'react';
import {
  MapPin,
  Eye,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Activity,
  QrCode,
  Image as ImageIcon,
} from 'lucide-react';
import { InventoryItem, Kitchen } from '../types';
import {
  formatRupiah,
  formatDateIndo,
  getConditionBadgeClass,
} from '../utils/formatters';

interface ItemTableViewProps {
  items: InventoryItem[];
  kitchens: Kitchen[];
  onViewDetail: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateCondition: (item: InventoryItem) => void;
  onTransferItem: (item: InventoryItem) => void;
  onPrintTag: (item: InventoryItem) => void;
}

export const ItemTableView: React.FC<ItemTableViewProps> = ({
  items,
  kitchens,
  onViewDetail,
  onEditItem,
  onDeleteItem,
  onUpdateCondition,
  onTransferItem,
  onPrintTag,
}) => {
  const getKitchen = (kitchenId: string) =>
    kitchens.find((k) => k.id === kitchenId);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <p className="text-slate-500 text-sm font-medium">
          Tidak ada inventaris yang cocok dengan kriteria pencarian atau filter dapur saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#011E4D]/5 border-b border-slate-200 text-[#011E4D] font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Kode & Nama Barang</th>
              <th className="py-3.5 px-4">Dapur & Lokasi Fisik Saat Ini</th>
              <th className="py-3.5 px-4 text-right">Nilai Perolehan</th>
              <th className="py-3.5 px-4">Tanggal Pembelian</th>
              <th className="py-3.5 px-4">Status Kondisi</th>
              <th className="py-3.5 px-4">Jml & PIC</th>
              <th className="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => {
              const kitchen = getKitchen(item.kitchenId);
              const badge = getConditionBadgeClass(item.condition);

              return (
                <tr
                  key={item.id}
                  id={`item-row-${item.id}`}
                  className="hover:bg-[#B4E0E8]/15 transition group"
                >
                  {/* Kode & Nama Barang */}
                  <td className="py-3 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      {/* Product Photo Thumbnail */}
                      <div
                        onClick={() => onViewDetail(item)}
                        className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-300" />
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {item.code}
                          </span>
                          <span className="text-[10px] text-[#011E4D] bg-[#B4E0E8]/40 px-1.5 py-0.5 rounded font-bold border border-[#B4E0E8]">
                            {item.category}
                          </span>
                        </div>
                        <button
                          onClick={() => onViewDetail(item)}
                          className="text-left font-semibold text-slate-900 hover:text-[#011E4D] transition cursor-pointer line-clamp-1"
                          title={item.name}
                        >
                          {item.name}
                        </button>
                        <span className="text-[11px] text-slate-500 truncate max-w-[240px]">
                          {item.brandOrSpec}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Lokasi Fisik & Dapur (CRITICAL USER REQUIREMENT) */}
                  <td className="py-3 px-4 align-middle">
                    <div className="flex flex-col gap-1 max-w-[260px]">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-[#011E4D] bg-[#B4E0E8]/30 px-1.5 py-0.5 rounded border border-[#B4E0E8]/60">
                          {kitchen?.code || 'MBG'}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {kitchen?.name || 'Dapur MBG'}
                        </span>
                      </div>
                      {/* Highlighted exact spot badge */}
                      <div className="inline-flex items-start gap-1 bg-[#011E4D]/5 border border-[#011E4D]/20 rounded-md px-2 py-1 text-[#011E4D]">
                        <MapPin className="w-3.5 h-3.5 text-[#011E4D] shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold leading-tight">
                          {item.locationSpot}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Nilai Perolehan */}
                  <td className="py-3 px-4 align-middle text-right font-medium">
                    <div className="text-[#011E4D] font-bold text-xs sm:text-sm">
                      {formatRupiah(item.acquisitionPrice)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[10px] text-slate-400">
                        Subtotal: {formatRupiah(item.acquisitionPrice * item.quantity)}
                      </div>
                    )}
                  </td>

                  {/* Tanggal Pembelian */}
                  <td className="py-3 px-4 align-middle text-slate-600 whitespace-nowrap">
                    <div className="font-medium text-xs">
                      {formatDateIndo(item.purchaseDate)}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Tgl Akuisisi
                    </span>
                  </td>

                  {/* Status Kondisi */}
                  <td className="py-3 px-4 align-middle whitespace-nowrap">
                    <button
                      onClick={() => onUpdateCondition(item)}
                      title="Klik untuk ubah kondisi"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.border} hover:opacity-85 transition cursor-pointer`}
                    >
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      <span>{item.condition}</span>
                    </button>
                    {item.lastInspectedDate && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Cek: {formatDateIndo(item.lastInspectedDate)}
                      </div>
                    )}
                  </td>

                  {/* Jml & PIC */}
                  <td className="py-3 px-4 align-middle whitespace-nowrap">
                    <div className="font-semibold text-slate-900 text-xs">
                      {item.quantity} {item.unit}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[120px]">
                      PIC: {item.pic || '-'}
                    </div>
                  </td>

                  {/* Aksi */}
                  <td className="py-3 px-4 align-middle text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onViewDetail(item)}
                        title="Lihat Detail Lengkap & Riwayat"
                        className="p-1.5 text-slate-500 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-lg transition cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onUpdateCondition(item)}
                        title="Periksa / Ubah Kondisi"
                        className="p-1.5 text-slate-500 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-lg transition cursor-pointer"
                      >
                        <Activity className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onTransferItem(item)}
                        title="Pindah Dapur / Lokasi Spot"
                        className="p-1.5 text-slate-500 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-lg transition cursor-pointer"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onPrintTag(item)}
                        title="Cetak Label Fisik / QR Code"
                        className="p-1.5 text-slate-500 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-lg transition cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditItem(item)}
                        title="Edit Data Barang"
                        className="p-1.5 text-slate-500 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-lg transition cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        title="Hapus Barang"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
