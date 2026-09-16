import React, { useState, useEffect } from 'react';
import { X, Activity, CheckCircle2, AlertTriangle, Wrench, ShieldAlert } from 'lucide-react';
import { InventoryItem, ItemCondition } from '../types';
import { getConditionBadgeClass } from '../utils/formatters';

interface ConditionUpdateModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onSaveCondition: (
    itemId: string,
    newCondition: ItemCondition,
    notes: string,
    inspector: string
  ) => void;
}

const CONDITIONS: ItemCondition[] = [
  'Sangat Baik',
  'Baik',
  'Rusak Ringan',
  'Rusak Berat',
  'Dalam Perbaikan',
  'Afkir',
];

export const ConditionUpdateModal: React.FC<ConditionUpdateModalProps> = ({
  item,
  onClose,
  onSaveCondition,
}) => {
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition>('Baik');
  const [notes, setNotes] = useState('');
  const [inspector, setInspector] = useState('');

  useEffect(() => {
    if (item) {
      setSelectedCondition(item.condition);
      setNotes('');
      setInspector(item.pic || 'Petugas Inspeksi');
    }
  }, [item]);

  if (!item) return null;

  const currentBadge = getConditionBadgeClass(item.condition);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCondition(
      item.id,
      selectedCondition,
      notes.trim() || 'Pemeriksaan rutin berkala inventaris dapur MBG.',
      inspector.trim() || 'Petugas Inspeksi'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        <div className="p-4.5 border-b border-[#011E4D]/20 flex items-center justify-between bg-[#011E4D] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-[#B4E0E8] flex items-center justify-center border border-white/20">
              <Activity className="w-4 h-4 text-[#B4E0E8]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Update Status Kondisi Barang
              </h3>
              <p className="text-[11px] text-white/70">
                Pencatatan hasil pemeriksaan fisik aset dapur MBG
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
          {/* Target Item Brief */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <span className="font-mono text-[10px] text-slate-500 font-bold block">
              {item.code}
            </span>
            <div className="font-bold text-slate-900 text-xs sm:text-sm">
              {item.name}
            </div>
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              <span className="text-slate-500">Kondisi saat ini:</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold border ${currentBadge.bg} ${currentBadge.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${currentBadge.dot}`} />
                {item.condition}
              </span>
            </div>
          </div>

          {/* Condition Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-2">
              Pilih Status Kondisi Baru:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map((cond) => {
                const b = getConditionBadgeClass(cond);
                const isSelected = selectedCondition === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setSelectedCondition(cond)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left font-semibold transition cursor-pointer ${
                      isSelected
                        ? `${b.bg} ${b.border} ring-2 ring-[#011E4D] shadow-xs`
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-[#B4E0E8]/20 hover:border-[#B4E0E8]'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${b.dot}`} />
                    <span className="truncate">{cond}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inspector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Petugas Pemeriksa / Inspektor
            </label>
            <input
              type="text"
              required
              value={inspector}
              onChange={(e) => setInspector(e.target.value)}
              placeholder="Nama staf pemeriksa"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Catatan Hasil Inspeksi / Kerusakan / Perbaikan
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pemantik kompor agak tersumbat jelaga, perlu pembersihan nozzle..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white resize-none"
            />
          </div>

          {/* Submit */}
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
              Simpan Hasil Inspeksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
