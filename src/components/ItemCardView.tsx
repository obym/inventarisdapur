import React from 'react';
import {
  MapPin,
  Calendar,
  Coins,
  Eye,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Activity,
  QrCode,
  Building,
  Image as ImageIcon,
} from 'lucide-react';
import { InventoryItem, Kitchen } from '../types';
import {
  formatRupiah,
  formatDateIndo,
  getConditionBadgeClass,
} from '../utils/formatters';

interface ItemCardViewProps {
  items: InventoryItem[];
  kitchens: Kitchen[];
  onViewDetail: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateCondition: (item: InventoryItem) => void;
  onTransferItem: (item: InventoryItem) => void;
  onPrintTag: (item: InventoryItem) => void;
}

export const ItemCardView: React.FC<ItemCardViewProps> = ({
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const kitchen = getKitchen(item.kitchenId);
        const badge = getConditionBadgeClass(item.condition);

        return (
          <div
            key={item.id}
            id={`item-card-${item.id}`}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#B4E0E8] hover:shadow-sm transition flex flex-col justify-between group"
          >
            <div>
              {/* Product Photo Banner */}
              <div
                onClick={() => onViewDetail(item)}
                className="relative w-full h-40 bg-slate-100 overflow-hidden cursor-pointer"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                    <ImageIcon className="w-10 h-10 mb-1 opacity-50" />
                    <span className="text-[10px] font-semibold text-slate-400">Belum ada foto</span>
                  </div>
                )}

                {/* Floating Condition Badge */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateCondition(item);
                  }}
                  title="Klik untuk ubah kondisi"
                  className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-xs ${badge.bg} ${badge.border} hover:opacity-90 transition cursor-pointer backdrop-blur-xs`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                  <span>{item.condition}</span>
                </button>

                {/* Floating Kitchen Code */}
                <div className="absolute bottom-2.5 left-2.5 bg-[#011E4D]/90 text-[#B4E0E8] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/20 shadow-xs">
                  {kitchen?.code || 'MBG'}
                </div>
              </div>

              <div className="p-4">
                {/* Code & Category */}
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {item.code}
                  </span>
                  <span className="text-[10px] text-[#011E4D] bg-[#B4E0E8]/40 px-1.5 py-0.5 rounded font-bold border border-[#B4E0E8]">
                    {item.category}
                  </span>
                </div>

                {/* Title & Brand */}
                <button
                  onClick={() => onViewDetail(item)}
                  className="text-left font-bold text-slate-900 hover:text-[#011E4D] transition cursor-pointer text-sm line-clamp-2 mt-1"
                >
                  {item.name}
                </button>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {item.brandOrSpec}
                </p>

              {/* Lokasi Fisik / Tempat Berada Saat Ini (PROMINENT HIGHLIGHT) */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
                {/* Kitchen Name */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Building className="w-3.5 h-3.5 text-[#011E4D] shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">
                    {kitchen?.name || 'Dapur MBG'}
                  </span>
                </div>

                {/* Specific Spot */}
                <div className="bg-[#011E4D]/5 border border-[#011E4D]/20 rounded-lg p-2 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#011E4D] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#011E4D] tracking-wider block">
                      Lokasi Tempat Berada Saat Ini:
                    </span>
                    <span className="text-xs font-semibold text-slate-900 leading-tight block">
                      {item.locationSpot}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Purchase Date */}
              <div className="grid grid-cols-2 gap-2 mt-3.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-semibold flex items-center gap-1">
                    <Coins className="w-3 h-3 text-[#011E4D]" /> Nilai Perolehan
                  </span>
                  <div className="font-bold text-[#011E4D] mt-0.5">
                    {formatRupiah(item.acquisitionPrice)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-600" /> Tgl Pembelian
                  </span>
                  <div className="font-medium text-slate-800 mt-0.5">
                    {formatDateIndo(item.purchaseDate)}
                  </div>
                </div>
              </div>

              {/* Quantity & PIC */}
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-0.5">
                <span>
                  Jumlah: <strong className="text-slate-700">{item.quantity} {item.unit}</strong>
                </span>
                <span className="truncate max-w-[140px]">
                  PIC: <span className="text-slate-700">{item.pic || '-'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
              <button
                onClick={() => onViewDetail(item)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-md transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Detail</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateCondition(item)}
                  title="Update Kondisi"
                  className="p-1.5 text-slate-500 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-md transition cursor-pointer"
                >
                  <Activity className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onTransferItem(item)}
                  title="Pindah Lokasi / Mutasi"
                  className="p-1.5 text-slate-500 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-md transition cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onPrintTag(item)}
                  title="Cetak Label Fisik"
                  className="p-1.5 text-slate-500 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-md transition cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEditItem(item)}
                  title="Edit Data"
                  className="p-1.5 text-slate-500 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-md transition cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  title="Hapus"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
