import React from 'react';
import { Building2, Plus, MapPin, Users, UtensilsCrossed } from 'lucide-react';
import { Kitchen, InventoryItem } from '../types';

interface KitchenSelectorProps {
  kitchens: Kitchen[];
  items: InventoryItem[];
  selectedKitchenId: string;
  onSelectKitchen: (id: string) => void;
  onOpenAddKitchen: () => void;
  onOpenManageKitchens: () => void;
}

export const KitchenSelector: React.FC<KitchenSelectorProps> = ({
  kitchens,
  items,
  selectedKitchenId,
  onSelectKitchen,
  onOpenAddKitchen,
  onOpenManageKitchens,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#011E4D]" />
          <h2 className="text-sm font-bold text-[#011E4D] uppercase tracking-wide">
            Pilih Lokasi Dapur MBG
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            ({kitchens.length} Dapur Terdaftar)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-add-kitchen-quick"
            onClick={onOpenAddKitchen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#011E4D] bg-[#B4E0E8]/50 hover:bg-[#B4E0E8] rounded-lg border border-[#B4E0E8] transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Dapur Baru</span>
          </button>

          <button
            id="btn-manage-kitchen-link"
            onClick={onOpenManageKitchens}
            className="text-xs font-semibold text-[#011E4D] hover:bg-[#B4E0E8] px-2 py-1 rounded transition cursor-pointer"
          >
            Detail & Edit Dapur
          </button>
        </div>
      </div>

      {/* Kitchen Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* All Kitchens Tab */}
        <button
          id="kitchen-tab-all"
          onClick={() => onSelectKitchen('all')}
          className={`flex flex-col text-left p-3 rounded-lg border transition cursor-pointer ${
            selectedKitchenId === 'all'
              ? 'bg-[#011E4D] text-white border-[#011E4D] shadow-sm'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-[#B4E0E8]/30 hover:border-[#B4E0E8]'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider">
              Semua Dapur
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                selectedKitchenId === 'all'
                  ? 'bg-[#B4E0E8] text-[#011E4D]'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {items.length} Aset
            </span>
          </div>
          <p
            className={`text-xs mt-1 line-clamp-1 ${
              selectedKitchenId === 'all' ? 'text-[#B4E0E8]/90' : 'text-slate-500'
            }`}
          >
            Total Inventaris Terkonsolidasi Seluruh Cabang
          </p>
          <div
            className={`flex items-center gap-1.5 text-[11px] mt-2 font-medium ${
              selectedKitchenId === 'all' ? 'text-[#B4E0E8]' : 'text-slate-600'
            }`}
          >
            <UtensilsCrossed className="w-3 h-3" />
            <span>
              Kapasitas Total:{' '}
              {kitchens
                .reduce((acc, k) => acc + (k.capacityPortions || 0), 0)
                .toLocaleString('id-ID')}{' '}
              porsi/hari
            </span>
          </div>
        </button>

        {/* Individual Kitchen Tabs */}
        {kitchens.map((kitchen) => {
          const kitchenItemCount = items.filter(
            (it) => it.kitchenId === kitchen.id
          ).length;
          const isSelected = selectedKitchenId === kitchen.id;

          return (
            <button
              key={kitchen.id}
              id={`kitchen-tab-${kitchen.id}`}
              onClick={() => onSelectKitchen(kitchen.id)}
              className={`flex flex-col text-left p-3 rounded-lg border transition cursor-pointer ${
                isSelected
                  ? 'bg-[#011E4D] text-white border-[#011E4D] shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-[#B4E0E8]/30 hover:border-[#B4E0E8]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-white/20 text-[#B4E0E8]'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {kitchen.code}
                  </span>
                  <span className="text-xs font-bold truncate max-w-[120px]">
                    {kitchen.name}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-[#B4E0E8] text-[#011E4D]'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {kitchenItemCount} Aset
                </span>
              </div>

              <div
                className={`flex items-center gap-1 text-[11px] mt-1 line-clamp-1 ${
                  isSelected ? 'text-white/80' : 'text-slate-500'
                }`}
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{kitchen.address}</span>
              </div>

              <div
                className={`flex items-center justify-between text-[11px] mt-2 font-medium pt-1.5 border-t ${
                  isSelected
                    ? 'border-white/20 text-[#B4E0E8]'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <span className="truncate">PIC: {kitchen.pic.split(',')[0]}</span>
                <span>
                  {(kitchen.capacityPortions || 0).toLocaleString('id-ID')} porsi
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
