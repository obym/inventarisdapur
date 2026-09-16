import React from 'react';
import { Coins, Package, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { InventoryItem, Kitchen } from '../types';
import { formatRupiah, formatMonthYearIndo } from '../utils/formatters';

interface StatsCardsProps {
  items: InventoryItem[];
  kitchens: Kitchen[];
  selectedKitchenId: string;
  selectedMonth?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  items,
  kitchens,
  selectedKitchenId,
  selectedMonth = 'all',
}) => {
  const filteredItems = items.filter((it) => {
    if (selectedKitchenId !== 'all' && it.kitchenId !== selectedKitchenId) {
      return false;
    }
    if (selectedMonth !== 'all') {
      if (!it.purchaseDate || !it.purchaseDate.startsWith(selectedMonth)) {
        return false;
      }
    }
    return true;
  });

  const totalAcquisition = filteredItems.reduce(
    (sum, it) => sum + (it.acquisitionPrice || 0) * (it.quantity || 1),
    0
  );

  const totalQuantity = filteredItems.reduce(
    (sum, it) => sum + (it.quantity || 1),
    0
  );

  const goodConditionCount = filteredItems.filter(
    (it) => it.condition === 'Sangat Baik' || it.condition === 'Baik'
  ).length;

  const warningConditionCount = filteredItems.filter(
    (it) =>
      it.condition === 'Rusak Ringan' ||
      it.condition === 'Rusak Berat' ||
      it.condition === 'Dalam Perbaikan'
  ).length;

  const goodPercentage =
    filteredItems.length > 0
      ? Math.round((goodConditionCount / filteredItems.length) * 100)
      : 0;

  const activeKitchenName =
    selectedKitchenId === 'all'
      ? 'Semua Dapur Terdaftar'
      : kitchens.find((k) => k.id === selectedKitchenId)?.name || 'Dapur Terpilih';

  const isMonthFiltered = selectedMonth !== 'all';
  const monthName = formatMonthYearIndo(selectedMonth);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Nilai Perolehan */}
      <div className={`bg-white rounded-xl border p-4.5 shadow-xs transition hover:shadow-sm ${
        isMonthFiltered ? 'border-[#011E4D]/40 ring-1 ring-[#011E4D]/10' : 'border-slate-200 hover:border-[#B4E0E8]'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Nilai Perolehan
            </span>
            {isMonthFiltered && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#011E4D] text-white">
                <Calendar className="w-2.5 h-2.5" /> {monthName}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#011E4D]/10 text-[#011E4D] flex items-center justify-center">
            <Coins className="w-4 h-4 text-[#011E4D]" />
          </div>
        </div>
        <div className="mt-2.5">
          <h2 className="text-xl font-bold text-[#011E4D] tracking-tight">
            {formatRupiah(totalAcquisition)}
          </h2>
          <p className="text-xs text-slate-600 mt-1 truncate">
            {isMonthFiltered
              ? `Perolehan ${monthName} • ${activeKitchenName}`
              : activeKitchenName}
          </p>
        </div>
      </div>

      {/* Total Aset & Unit */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs transition hover:border-[#B4E0E8] hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Barang & Unit
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#011E4D]/10 text-[#011E4D] flex items-center justify-center">
            <Package className="w-4 h-4 text-[#011E4D]" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#011E4D]">
              {filteredItems.length}
            </span>
            <span className="text-xs text-slate-600 font-medium">
              jenis ({totalQuantity} unit total)
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Kompor, meja, kursi, AC, lemari & APD
          </p>
        </div>
      </div>

      {/* Kondisi Baik */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs transition hover:border-[#B4E0E8] hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Kondisi Prima (Baik)
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#011E4D]/10 text-[#011E4D] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-[#011E4D]" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#011E4D]">
              {goodConditionCount}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#B4E0E8]/40 text-[#011E4D] border border-[#B4E0E8]">
              {goodPercentage}% Siap Pakai
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Beroperasi normal untuk proses masak MBG
          </p>
        </div>
      </div>

      {/* Perlu Servis / Rusak */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs transition hover:border-[#B4E0E8] hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Perlu Perbaikan / Rusak
          </span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            warningConditionCount > 0
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-600'
          }`}>
            <AlertTriangle className={`w-4 h-4 ${
              warningConditionCount > 0 ? 'text-amber-700' : 'text-slate-500'
            }`} />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-bold ${
              warningConditionCount > 0 ? 'text-amber-800' : 'text-slate-900'
            }`}>
              {warningConditionCount}
            </span>
            <span className="text-xs text-slate-600">
              {warningConditionCount > 0 ? 'item butuh atensi' : 'Semua aset prima'}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 truncate">
            {selectedKitchenId === 'all'
              ? `${kitchens.length} Dapur Terpantau`
              : `Dapur ${kitchens.find((k) => k.id === selectedKitchenId)?.code || ''}`}
          </p>
        </div>
      </div>
    </div>
  );
};
