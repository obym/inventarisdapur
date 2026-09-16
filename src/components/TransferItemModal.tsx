import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, MapPin, Building2 } from 'lucide-react';
import { InventoryItem, Kitchen } from '../types';

interface TransferItemModalProps {
  item: InventoryItem | null;
  kitchens: Kitchen[];
  onClose: () => void;
  onSaveTransfer: (
    itemId: string,
    targetKitchenId: string,
    newSpot: string,
    reason: string,
    handledBy: string
  ) => void;
}

const SPOT_SUGGESTIONS = [
  'Area Memasak Utama (Line Tungku)',
  'Ruang Persiapan Sayur & Buah',
  'Area Pemotongan Daging & Protein',
  'Ruang Gudang Bahan Kering (Dry Storage)',
  'Ruang Pendingin & Chiller',
  'Area Pencucian Alat & Dishwashing',
  'Area Pengemasan & Transit Ompreng',
  'Loker APD & Ruang Sterilisasi',
  'Ruang Administrasi & CCTV',
];

export const TransferItemModal: React.FC<TransferItemModalProps> = ({
  item,
  kitchens,
  onClose,
  onSaveTransfer,
}) => {
  const [targetKitchenId, setTargetKitchenId] = useState('');
  const [newSpot, setNewSpot] = useState('');
  const [reason, setReason] = useState('');
  const [handledBy, setHandledBy] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (item) {
      setTargetKitchenId(item.kitchenId);
      setNewSpot(item.locationSpot);
      setReason('');
      setHandledBy(item.pic || 'Petugas Logistik');
      setErrorMsg('');
    }
  }, [item]);

  if (!item) return null;

  const currentKitchen = kitchens.find((k) => k.id === item.kitchenId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpot.trim()) {
      setErrorMsg('Lokasi tempat barang berada saat ini wajib diisi');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Alasan pemindahan / mutasi wajib diisi');
      return;
    }

    onSaveTransfer(
      item.id,
      targetKitchenId,
      newSpot.trim(),
      reason.trim(),
      handledBy.trim() || 'Petugas Logistik'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        <div className="p-4.5 border-b border-[#011E4D]/20 flex items-center justify-between bg-[#011E4D] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-[#B4E0E8] flex items-center justify-center border border-white/20">
              <ArrowRightLeft className="w-4 h-4 text-[#B4E0E8]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Mutasi & Pemindahan Lokasi Barang
              </h3>
              <p className="text-[11px] text-white/70">
                Pindah antar dapur atau ubah titik penempatan spesifik di dapur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-md">
              {errorMsg}
            </div>
          )}

          {/* Current Position Summary */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <span className="font-mono text-[10px] text-slate-500 font-bold block">
              {item.code}
            </span>
            <div className="font-bold text-slate-900 text-sm">{item.name}</div>
            <div className="text-slate-600 text-[11px] pt-1 border-t border-slate-200/60 mt-1">
              <strong>Posisi Asal:</strong> {currentKitchen?.name} &bull;{' '}
              <span className="text-[#011E4D] font-bold">{item.locationSpot}</span>
            </div>
          </div>

          {/* New Kitchen Target */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#011E4D]" />
              Dapur Tujuan
            </label>
            <select
              value={targetKitchenId}
              onChange={(e) => setTargetKitchenId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white cursor-pointer font-medium"
            >
              {kitchens.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} ({k.code})
                </option>
              ))}
            </select>
          </div>

          {/* New Spot (CRITICAL) */}
          <div className="bg-[#011E4D]/5 p-3.5 rounded-xl border border-[#011E4D]/20 space-y-2">
            <label className="block text-[#011E4D] font-bold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#011E4D]" />
              Lokasi Tempat Baru Saat Ini (Spesifik agar Mudah Dikenali) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newSpot}
              onChange={(e) => setNewSpot(e.target.value)}
              placeholder="Contoh: Area Masak Utama - Meja Kuali 2, Ruang Penyimpanan Kering Rak C-1..."
              className="w-full px-3 py-2 bg-white border border-[#011E4D]/30 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#011E4D]"
            />
            {/* Quick choices */}
            <div className="flex items-center gap-1 overflow-x-auto pt-1">
              <span className="text-[10px] text-[#011E4D] font-bold shrink-0">
                Pilihan Cepat:
              </span>
              {SPOT_SUGGESTIONS.slice(0, 4).map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNewSpot(s)}
                  className="px-2 py-0.5 text-[10px] bg-white hover:bg-[#B4E0E8] hover:text-[#011E4D] text-[#011E4D] rounded border border-[#011E4D]/20 shrink-0 cursor-pointer"
                >
                  {s.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Alasan Pemindahan / Mutasi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Penyesuaian alur masak, pemenuhan lonjakan kapasitas, reposisi..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white"
            />
          </div>

          {/* Handled By */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Petugas yang Menangani (PIC Mutasi)
            </label>
            <input
              type="text"
              value={handledBy}
              onChange={(e) => setHandledBy(e.target.value)}
              placeholder="Nama penanggung jawab mutasi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg cursor-pointer transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#011E4D] hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg shadow-sm transition cursor-pointer"
            >
              Konfirmasi Pemindahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
