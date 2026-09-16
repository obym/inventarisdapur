import React from 'react';
import { ChefHat, Plus, Building2, Download, RotateCcw, Cloud, CloudCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenAddItem: () => void;
  onOpenManageKitchens: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  kitchenCount: number;
  itemCount: number;
  isFirebaseSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddItem,
  onOpenManageKitchens,
  onExportCSV,
  onResetData,
  kitchenCount,
  itemCount,
  isFirebaseSyncing = false,
}) => {
  return (
    <header className="bg-[#011E4D] text-white border-b border-[#011E4D]/40 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 text-white flex items-center justify-center font-bold shadow-md border border-white/20 shrink-0">
              <ChefHat className="w-6 h-6 text-[#B4E0E8]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Inventaris Dapur MBG
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-[#B4E0E8] border border-[#B4E0E8]/40">
                  Makan Bergizi Gratis
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isFirebaseSyncing ? 'Sinkronisasi...' : 'Firebase Terhubung'}
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Monitoring Aset, Lokasi Spesifik, Nilai Perolehan & Kondisi ({kitchenCount} Dapur • {itemCount} Aset)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              id="btn-export-csv"
              onClick={onExportCSV}
              title="Unduh Data CSV"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-white/10 hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg border border-white/20 transition cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              id="btn-manage-kitchens"
              onClick={onOpenManageKitchens}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg border border-white/25 transition cursor-pointer shrink-0"
            >
              <Building2 className="w-4 h-4" />
              <span>Kelola Dapur ({kitchenCount})</span>
            </button>

            <button
              id="btn-add-item-header"
              onClick={onOpenAddItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#011E4D] bg-[#B4E0E8] hover:bg-white hover:text-[#011E4D] rounded-lg shadow-sm transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-[#011E4D]" />
              <span>+ Tambah Barang</span>
            </button>

            <button
              id="btn-reset-data"
              onClick={onResetData}
              title="Reset ke Data Awal Demo"
              className="p-2 text-white/70 hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg transition cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
