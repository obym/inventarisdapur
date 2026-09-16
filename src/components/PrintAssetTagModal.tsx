import React from 'react';
import { X, Printer, QrCode, ChefHat, MapPin, Building } from 'lucide-react';
import { InventoryItem, Kitchen } from '../types';
import { formatDateIndo, formatRupiah } from '../utils/formatters';

interface PrintAssetTagModalProps {
  item: InventoryItem | null;
  kitchens: Kitchen[];
  onClose: () => void;
}

export const PrintAssetTagModal: React.FC<PrintAssetTagModalProps> = ({
  item,
  kitchens,
  onClose,
}) => {
  if (!item) return null;

  const kitchen = kitchens.find((k) => k.id === item.kitchenId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="p-4.5 border-b border-[#011E4D]/20 flex items-center justify-between bg-[#011E4D] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 text-[#B4E0E8] flex items-center justify-center border border-white/20">
              <QrCode className="w-4 h-4 text-[#B4E0E8]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Label Inventaris Fisik Aset
              </h3>
              <p className="text-[11px] text-white/70">
                Siap cetak untuk ditempel pada kompor, meja, AC, kursi, dll.
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

        {/* Tag Preview (Print Area) */}
        <div className="p-6 bg-slate-100 flex justify-center">
          <div
            id="printable-asset-tag"
            className="bg-white border-2 border-[#011E4D] rounded-xl p-4 w-full shadow-md text-slate-900 font-sans"
          >
            {/* Header Tag */}
            <div className="flex items-center justify-between border-b-2 border-[#011E4D] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#011E4D] text-[#B4E0E8] flex items-center justify-center font-black text-xs">
                  MBG
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#011E4D]">
                    LABEL ASET INVENTARIS
                  </div>
                  <div className="text-[9px] font-medium text-slate-600">
                    Program Makan Bergizi Gratis
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#B4E0E8]/40 text-[#011E4D] border border-[#B4E0E8]">
                {kitchen?.code || 'MBG'}
              </span>
            </div>

            {/* Body Tag */}
            <div className="pt-3 pb-2 flex gap-3 items-center">
              {/* Fake QR Canvas Pattern for Visual Asset Tagging */}
              <div className="w-20 h-20 bg-[#011E4D] rounded p-1 flex flex-col justify-between shrink-0 shadow-xs">
                <div className="flex justify-between">
                  <div className="w-5 h-5 bg-white rounded-xs p-1 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-[#011E4D]" />
                  </div>
                  <div className="w-5 h-5 bg-white rounded-xs p-1 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-[#011E4D]" />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-[7px] font-mono text-[#B4E0E8] font-bold tracking-tighter">
                    MBG-ID
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-5 h-5 bg-white rounded-xs p-1 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-[#011E4D]" />
                  </div>
                  <div className="w-2.5 h-2.5 bg-white rounded-xs" />
                </div>
              </div>

              {/* Information text */}
              <div className="min-w-0 space-y-1">
                <div className="font-mono text-xs font-black text-[#011E4D] bg-[#B4E0E8]/30 px-1.5 py-0.5 rounded inline-block border border-[#B4E0E8]">
                  {item.code}
                </div>
                <div className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-600">
                  Kategori: <strong>{item.category}</strong>
                </div>
              </div>
            </div>

            {/* Tag Location & Acquisition Details */}
            <div className="mt-2 pt-2 border-t border-dashed border-slate-400 text-[10px] space-y-1">
              <div className="flex items-start gap-1 font-semibold text-slate-900">
                <MapPin className="w-3 h-3 text-[#011E4D] shrink-0 mt-0.5" />
                <span>Lokasi: {item.locationSpot}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 pt-0.5">
                <span>Dapur: {kitchen?.name}</span>
                <span>Tgl Beli: {formatDateIndo(item.purchaseDate)}</span>
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-200">
                <span>Kondisi: {item.condition}</span>
                <span>PIC: {item.pic || 'Koordinator'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg cursor-pointer transition"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 font-bold text-white bg-[#011E4D] hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Label (Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
