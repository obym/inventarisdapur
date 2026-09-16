import React from 'react';
import {
  X,
  MapPin,
  Calendar,
  Coins,
  Building,
  User,
  Activity,
  ArrowRightLeft,
  QrCode,
  Edit2,
  FileText,
  Clock,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { InventoryItem, Kitchen } from '../types';
import {
  formatRupiah,
  formatDateIndo,
  getConditionBadgeClass,
} from '../utils/formatters';

interface ItemDetailModalProps {
  item: InventoryItem | null;
  kitchens: Kitchen[];
  onClose: () => void;
  onEdit: (item: InventoryItem) => void;
  onUpdateCondition: (item: InventoryItem) => void;
  onTransfer: (item: InventoryItem) => void;
  onPrintTag: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  kitchens,
  onClose,
  onEdit,
  onUpdateCondition,
  onTransfer,
  onPrintTag,
  onDelete,
}) => {
  if (!item) return null;

  const kitchen = kitchens.find((k) => k.id === item.kitchenId);
  const badge = getConditionBadgeClass(item.condition);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#011E4D]/20 flex items-start justify-between bg-[#011E4D] text-white">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#011E4D] bg-white px-2 py-0.5 rounded shadow-xs">
                {item.code}
              </span>
              <span className="text-xs font-bold text-[#011E4D] bg-[#B4E0E8] px-2 py-0.5 rounded">
                {item.category}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg} ${badge.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                {item.condition}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-2">
              {item.name}
            </h3>
            <p className="text-xs text-white/70">
              {item.brandOrSpec || 'Spesifikasi standar MBG'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* FOTO FISIK BARANG */}
          {item.imageUrl ? (
            <div className="relative w-full h-64 sm:h-72 bg-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-inner group">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-[#011E4D]/80 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-lg border border-white/20 font-medium">
                Foto Aset Fisik
              </div>
            </div>
          ) : (
            <div className="w-full h-36 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="w-8 h-8 mb-1 text-slate-300" />
              <span className="text-xs font-medium">Belum ada foto fisik diunggah</span>
            </div>
          )}

          {/* LOKASI FISIK SAAT INI (HIGHLIGHTED) */}
          <div className="bg-gradient-to-br from-[#011E4D]/5 to-[#B4E0E8]/20 border border-[#011E4D]/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-[#011E4D] text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-[#011E4D]" />
              <span>Lokasi Tempat Berada Saat Ini:</span>
            </div>
            <div className="space-y-1 pl-6">
              <div className="text-sm font-bold text-slate-900">
                {item.locationSpot}
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {kitchen?.name || 'Dapur MBG'} ({kitchen?.code}) — {kitchen?.address}
                </span>
              </div>
            </div>
          </div>

          {/* Nilai Perolehan & Tanggal Beli */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>Nilai Perolehan Barang</span>
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {formatRupiah(item.acquisitionPrice)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Total Kuantitas: {item.quantity} {item.unit}
                {item.quantity > 1 && (
                  <span className="font-semibold text-slate-700 block">
                    Total Nilai: {formatRupiah(item.acquisitionPrice * item.quantity)}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Tanggal Pembelian</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1">
                {formatDateIndo(item.purchaseDate)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>PIC: {item.pic || '-'}</span>
              </div>
            </div>
          </div>

          {/* Catatan Tambahan */}
          {item.notes && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-slate-900 block mb-0.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> Catatan Operasional:
              </span>
              {item.notes}
            </div>
          )}

          {/* Riwayat Mutasi / Perpindahan Lokasi */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Riwayat Mutasi & Pemindahan Lokasi</span>
            </h4>
            {item.mutationHistory && item.mutationHistory.length > 0 ? (
              <div className="space-y-2">
                {item.mutationHistory.map((mut) => {
                  const fromK = kitchens.find((k) => k.id === mut.fromKitchenId);
                  const toK = kitchens.find((k) => k.id === mut.toKitchenId);
                  return (
                    <div
                      key={mut.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatDateIndo(mut.date)}
                        </span>
                        <span className="font-medium">Oleh: {mut.handledBy}</span>
                      </div>
                      <div className="font-semibold text-slate-800">
                        {fromK?.code || 'Asal'}: {mut.fromSpot} &rarr; {toK?.code || 'Tujuan'}: {mut.toSpot}
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        Alasan: {mut.reason}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                Belum ada riwayat mutasi. Barang tetap berada di lokasi awal perolehan.
              </p>
            )}
          </div>

          {/* Riwayat Pemeriksaan Kondisi */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Log Inspeksi & Riwayat Kondisi Fisik</span>
            </h4>
            {item.conditionHistory && item.conditionHistory.length > 0 ? (
              <div className="space-y-2">
                {item.conditionHistory.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{formatDateIndo(ch.date)}</span>
                      <span>Inspektor: {ch.inspector}</span>
                    </div>
                    <div className="font-semibold text-slate-800">
                      Kondisi: {ch.fromCondition} &rarr;{' '}
                      <span className="text-emerald-700">{ch.toCondition}</span>
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Catatan: {ch.notes}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                Kondisi awal tercatat: {item.condition}.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onUpdateCondition(item);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#011E4D] bg-[#B4E0E8]/40 hover:bg-[#B4E0E8] border border-[#B4E0E8] rounded-lg transition cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Update Kondisi</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTransfer(item);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#011E4D] bg-slate-100 hover:bg-[#B4E0E8] border border-slate-200 rounded-lg transition cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Mutasi / Pindah</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onPrintTag(item);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#011E4D] bg-slate-100 hover:bg-[#B4E0E8] border border-slate-200 rounded-lg transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Cetak Label Tag</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#011E4D] bg-white hover:bg-[#B4E0E8] border border-slate-200 rounded-lg transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            {onDelete && (
              <button
                id="btn-delete-from-detail"
                onClick={() => {
                  onClose();
                  onDelete(item);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Aset</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#011E4D] bg-slate-200 hover:bg-[#B4E0E8] rounded-lg transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
