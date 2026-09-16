import React, { useState } from 'react';
import {
  X,
  Building2,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Users,
  Phone,
  UtensilsCrossed,
} from 'lucide-react';
import { Kitchen, InventoryItem } from '../types';

interface KitchenManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  kitchens: Kitchen[];
  items: InventoryItem[];
  onAddKitchen: (kitchenData: Omit<Kitchen, 'id' | 'createdAt'>) => void;
  onUpdateKitchen: (kitchen: Kitchen) => void;
  onDeleteKitchen: (kitchenId: string) => void;
}

export const KitchenManageModal: React.FC<KitchenManageModalProps> = ({
  isOpen,
  onClose,
  kitchens,
  items,
  onAddKitchen,
  onUpdateKitchen,
  onDeleteKitchen,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKitchen, setEditingKitchen] = useState<Kitchen | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [pic, setPic] = useState('');
  const [contact, setContact] = useState('');
  const [capacityPortions, setCapacityPortions] = useState(2500);
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [kitchenWarning, setKitchenWarning] = useState<string | null>(null);
  const [confirmDeleteKitchen, setConfirmDeleteKitchen] = useState<Kitchen | null>(null);

  if (!isOpen) return null;

  const openNewForm = () => {
    setEditingKitchen(null);
    const nextCodeNum = kitchens.length + 1;
    setName(`Dapur MBG 0${nextCodeNum}`);
    setCode(`MBG-0${nextCodeNum}`);
    setAddress('');
    setPic('');
    setContact('');
    setCapacityPortions(2500);
    setDescription('');
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const openEditForm = (k: Kitchen) => {
    setEditingKitchen(k);
    setName(k.name);
    setCode(k.code);
    setAddress(k.address);
    setPic(k.pic);
    setContact(k.contact);
    setCapacityPortions(k.capacityPortions || 2000);
    setDescription(k.description || '');
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama dapur wajib diisi');
      return;
    }
    if (!code.trim()) {
      setErrorMsg('Kode dapur wajib diisi');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Alamat lokasi dapur wajib diisi');
      return;
    }

    if (editingKitchen) {
      onUpdateKitchen({
        ...editingKitchen,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        address: address.trim(),
        pic: pic.trim(),
        contact: contact.trim(),
        capacityPortions: Number(capacityPortions) || 0,
        description: description.trim(),
      });
    } else {
      onAddKitchen({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        address: address.trim(),
        pic: pic.trim() || 'Koordinator Dapur',
        contact: contact.trim(),
        capacityPortions: Number(capacityPortions) || 0,
        description: description.trim(),
      });
    }

    setIsFormOpen(false);
  };

  const handleDelete = (kitchen: Kitchen) => {
    setKitchenWarning(null);
    const attachedCount = items.filter((it) => it.kitchenId === kitchen.id).length;
    if (attachedCount > 0) {
      setKitchenWarning(
        `Tidak dapat menghapus ${kitchen.name} karena masih memiliki ${attachedCount} barang inventaris terkait. Silakan pindahkan/mutasikan barang terlebih dahulu.`
      );
      setConfirmDeleteKitchen(null);
      return;
    }
    if (kitchens.length <= 1) {
      setKitchenWarning('Minimal harus ada 1 dapur operasional terdaftar.');
      setConfirmDeleteKitchen(null);
      return;
    }
    setConfirmDeleteKitchen(kitchen);
  };

  const handleConfirmDeleteKitchen = (kitchenId: string) => {
    onDeleteKitchen(kitchenId);
    setConfirmDeleteKitchen(null);
    setKitchenWarning(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-[#011E4D]/20 flex items-center justify-between bg-[#011E4D] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/15 text-[#B4E0E8] flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-[#B4E0E8]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Kelola Daftar Dapur MBG
              </h3>
              <p className="text-xs text-white/70">
                Tambah atau edit cabang dapur program Makan Bergizi Gratis ({kitchens.length} Dapur Aktif)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Top Actions */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              Daftar Cabang Dapur Operasional
            </span>
            <button
              onClick={openNewForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#011E4D] hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Dapur Baru</span>
            </button>
          </div>

          {/* Kitchen Deletion Warning Banner */}
          {kitchenWarning && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center justify-between">
              <span>{kitchenWarning}</span>
              <button
                onClick={() => setKitchenWarning(null)}
                className="text-amber-900 font-bold ml-2 hover:underline cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Confirm Delete Kitchen Dialog */}
          {confirmDeleteKitchen && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2.5 animate-in fade-in duration-150">
              <div className="font-bold text-rose-800 flex items-center gap-1.5 text-sm">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Konfirmasi Hapus Dapur: {confirmDeleteKitchen.name}?</span>
              </div>
              <p className="text-slate-600 text-xs">
                Apakah Anda yakin ingin menghapus <strong>{confirmDeleteKitchen.name}</strong> ({confirmDeleteKitchen.code}) dari daftar cabang dapur?
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteKitchen(null)}
                  className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDeleteKitchen(confirmDeleteKitchen.id)}
                  className="px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Ya, Hapus Dapur
                </button>
              </div>
            </div>
          )}

          {/* Form inside modal when adding/editing */}
          {isFormOpen && (
            <div className="bg-[#011E4D]/5 border border-[#011E4D]/20 rounded-xl p-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-3 border-b border-[#011E4D]/20 pb-2">
                <span className="font-bold text-[#011E4D] text-xs flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#011E4D]" />
                  {editingKitchen ? `Edit ${editingKitchen.name}` : 'Form Pendaftaran Dapur Baru'}
                </span>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-500 hover:text-slate-800 text-xs cursor-pointer font-medium"
                >
                  Tutup Form
                </button>
              </div>

              {errorMsg && (
                <div className="mb-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Nama Dapur <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Dapur MBG 04 (Pulogadung)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Kode Dapur <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="MBG-04"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-[#011E4D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Alamat Lengkap Dapur <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Jl. Perintis Kemerdekaan No. 12, Pulo Gadung..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Kepala Dapur / PIC
                    </label>
                    <input
                      type="text"
                      value={pic}
                      onChange={(e) => setPic(e.target.value)}
                      placeholder="Nama penanggung jawab"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Kontak Telepon
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Kapasitas Porsi/Hari
                    </label>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      value={capacityPortions}
                      onChange={(e) => setCapacityPortions(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Deskripsi / Catatan Wilayah MBG
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Dapur satelit penyalur ke 8 sekolah dasar sekitar"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-[#B4E0E8] hover:text-[#011E4D] text-slate-700 rounded-lg cursor-pointer transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#011E4D] hover:bg-[#B4E0E8] hover:text-[#011E4D] text-white font-bold rounded-lg cursor-pointer shadow-xs transition"
                  >
                    {editingKitchen ? 'Simpan Perubahan' : '+ Tambah Dapur'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Kitchens List */}
          <div className="space-y-3">
            {kitchens.map((k) => {
              const count = items.filter((it) => it.kitchenId === k.id).length;
              return (
                <div
                  key={k.id}
                  className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 hover:border-[#B4E0E8] transition"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#011E4D] text-white px-2 py-0.5 rounded">
                        {k.code}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{k.name}</h4>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#B4E0E8]/40 text-[#011E4D] border border-[#B4E0E8]">
                        {count} Aset Terdata
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <button
                        onClick={() => openEditForm(k)}
                        className="p-1.5 text-slate-600 hover:text-[#011E4D] hover:bg-[#B4E0E8] rounded-md border border-slate-200 transition cursor-pointer"
                        title="Edit Dapur"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(k)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 transition cursor-pointer"
                        title="Hapus Dapur"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{k.address}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        PIC: <strong className="text-slate-700">{k.pic}</strong>
                      </span>
                      {k.contact && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {k.contact}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[#011E4D] font-bold">
                        <UtensilsCrossed className="w-3 h-3 text-[#011E4D]" />
                        Kapasitas: {(k.capacityPortions || 0).toLocaleString('id-ID')} porsi/hari
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-[#011E4D] bg-slate-200 hover:bg-[#B4E0E8] rounded-lg transition cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
