import React from 'react';
import { Trash2, AlertTriangle, X, Building, Coins, Calendar, MapPin } from 'lucide-react';
import { InventoryItem, Kitchen } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  kitchens: Kitchen[];
  onClose: () => void;
  onConfirm: (itemId: string) => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  item,
  kitchens,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !item) return null;

  const kitchen = kitchens.find((k) => k.id === item.kitchenId);

  return (
    <div
      id="delete-confirm-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        id="delete-confirm-dialog"
        className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150 my-auto"
      >
        {/* Header */}
        <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span>Konfirmasi Hapus Inventaris</span>
          </div>
          <button
            id="btn-close-delete-modal"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus barang inventaris berikut? Data yang
            dihapus akan dihilangkan dari basis data monitoring dapur MBG.
          </p>

          {/* Item Card Preview */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-[11px] font-bold text-[#011E4D] bg-[#B4E0E8]/40 px-1.5 py-0.5 rounded border border-[#B4E0E8]">
                  {item.code}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500">{item.brandOrSpec}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 shrink-0">
                {item.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/70 text-slate-600">
              <div className="flex items-center gap-1 truncate">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{kitchen?.name || 'Dapur MBG'}</span>
              </div>
              <div className="flex items-center gap-1 truncate justify-end font-semibold text-slate-800">
                <Coins className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{formatRupiah(item.acquisitionPrice * item.quantity)}</span>
              </div>
              {item.locationSpot && (
                <div className="flex items-center gap-1 col-span-2 text-slate-500 text-[11px] truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">Titik: {item.locationSpot}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Tindakan ini akan menghapus riwayat pemeriksaan kondisi dan mutasi aset ini secara permanen.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            id="btn-cancel-delete"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            id="btn-confirm-delete"
            onClick={() => onConfirm(item.id)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Barang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
