import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Coins,
  Calendar,
  Sparkles,
  Building2,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { InventoryItem, ItemCategory, ItemCondition, Kitchen } from '../types';
import { formatRupiah } from '../utils/formatters';
import { compressImageToBase64 } from '../utils/imageCompressor';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<InventoryItem, 'id'> & { id?: string }) => void;
  editItem: InventoryItem | null;
  kitchens: Kitchen[];
  defaultKitchenId?: string;
}

const CATEGORIES: ItemCategory[] = [
  'Peralatan Masak',
  'Furnitur & Meja Kursi',
  'Elektronik & Pendingin',
  'Penyimpanan & Lemari',
  'APD & Sanitasi',
  'Wadah & Peralatan Makan',
  'Lainnya',
];

const CONDITIONS: ItemCondition[] = [
  'Sangat Baik',
  'Baik',
  'Rusak Ringan',
  'Rusak Berat',
  'Dalam Perbaikan',
  'Afkir',
];

const QUICK_SPOT_SUGGESTIONS = [
  'Area Memasak Utama (Line Tungku)',
  'Ruang Persiapan Sayur & Buah',
  'Area Pemotongan Daging & Protein',
  'Ruang Gudang Kering (Dry Storage)',
  'Ruang Dingin & Chiller',
  'Area Pencucian Alat & Dishwashing',
  'Area Pengemasan & Transit Ompreng',
  'Loker APD & Ruang Sterilisasi',
  'Ruang Administrasi & CCTV',
];

const QUICK_ITEM_TEMPLATES = [
  { name: 'Kompor High Pressure Heavy Duty', cat: 'Peralatan Masak' as ItemCategory, price: 12000000 },
  { name: 'Meja Stainless Steel Persiapan (200x80cm)', cat: 'Furnitur & Meja Kursi' as ItemCategory, price: 4500000 },
  { name: 'Kursi Staf & Relawan Dapur Lipat', cat: 'Furnitur & Meja Kursi' as ItemCategory, price: 250000 },
  { name: 'AC Split Inverter 2 PK Daikin', cat: 'Elektronik & Pendingin' as ItemCategory, price: 8500000 },
  { name: 'Lemari Stainless 4 Pintu Tertutup', cat: 'Penyimpanan & Lemari' as ItemCategory, price: 7000000 },
  { name: 'Apron Anti Air Food Grade (Set 10 Pcs)', cat: 'APD & Sanitasi' as ItemCategory, price: 800000 },
  { name: 'Wajan Kuali Raksasa 80cm + Spatula', cat: 'Peralatan Masak' as ItemCategory, price: 3000000 },
  { name: 'Steamer Nasi Komersial Otomatis 24 Tray', cat: 'Peralatan Masak' as ItemCategory, price: 18500000 },
];

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editItem,
  kitchens,
  defaultKitchenId,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Peralatan Masak');
  const [kitchenId, setKitchenId] = useState('');
  const [locationSpot, setLocationSpot] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('Sangat Baik');
  const [acquisitionPrice, setAcquisitionPrice] = useState<number>(0);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('Unit');
  const [brandOrSpec, setBrandOrSpec] = useState('');
  const [pic, setPic] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setCode(editItem.code);
      setCategory(editItem.category);
      setKitchenId(editItem.kitchenId);
      setLocationSpot(editItem.locationSpot);
      setCondition(editItem.condition);
      setAcquisitionPrice(editItem.acquisitionPrice);
      setPurchaseDate(editItem.purchaseDate);
      setQuantity(editItem.quantity);
      setUnit(editItem.unit || 'Unit');
      setBrandOrSpec(editItem.brandOrSpec || '');
      setPic(editItem.pic || '');
      setNotes(editItem.notes || '');
      setImageUrl(editItem.imageUrl || '');
    } else {
      // Reset form
      const today = new Date().toISOString().split('T')[0];
      const initialKitchen =
        defaultKitchenId && defaultKitchenId !== 'all'
          ? defaultKitchenId
          : kitchens[0]?.id || '';

      const kObj = kitchens.find((k) => k.id === initialKitchen);
      const randomNum = Math.floor(100 + Math.random() * 900);
      const generatedCode = `MBG-${kObj?.code || 'K01'}-AST-${randomNum}`;

      setName('');
      setCode(generatedCode);
      setCategory('Peralatan Masak');
      setKitchenId(initialKitchen);
      setLocationSpot('Area Memasak Utama (Line Tungku)');
      setCondition('Sangat Baik');
      setAcquisitionPrice(5000000);
      setPurchaseDate(today);
      setQuantity(1);
      setUnit('Unit');
      setBrandOrSpec('');
      setPic(kObj?.pic?.split(',')[0] || 'Koordinator Aset');
      setNotes('');
      setImageUrl('');
    }
    setErrorMsg('');
  }, [editItem, isOpen, kitchens, defaultKitchenId]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Format file harus berupa foto/gambar (JPG, PNG, WEBP)');
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMsg('');
      const compressedDataUrl = await compressImageToBase64(file, 800, 0.75);
      setImageUrl(compressedDataUrl);
    } catch (err: any) {
      console.error('Error compressing image:', err);
      setErrorMsg(err.message || 'Gagal memproses gambar');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama barang wajib diisi');
      return;
    }
    if (!kitchenId) {
      setErrorMsg('Pilih dapur penempatan');
      return;
    }
    if (!locationSpot.trim()) {
      setErrorMsg('Lokasi tempat berada saat ini wajib diisi');
      return;
    }
    if (acquisitionPrice < 0) {
      setErrorMsg('Nilai perolehan tidak boleh negatif');
      return;
    }
    if (!purchaseDate) {
      setErrorMsg('Tanggal pembelian wajib diisi');
      return;
    }

    onSave({
      ...(editItem ? { id: editItem.id } : {}),
      name: name.trim(),
      code: code.trim() || `MBG-AST-${Date.now().toString().slice(-4)}`,
      category,
      kitchenId,
      locationSpot: locationSpot.trim(),
      condition,
      acquisitionPrice: Number(acquisitionPrice) || 0,
      purchaseDate,
      quantity: Number(quantity) || 1,
      unit,
      brandOrSpec: brandOrSpec.trim(),
      pic: pic.trim(),
      notes: notes.trim(),
      imageUrl: imageUrl.trim() || undefined,
      lastInspectedDate: editItem?.lastInspectedDate || purchaseDate,
    });

    onClose();
  };

  const applyTemplate = (tpl: typeof QUICK_ITEM_TEMPLATES[0]) => {
    setName(tpl.name);
    setCategory(tpl.cat);
    setAcquisitionPrice(tpl.price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-[#011E4D]/20 flex items-center justify-between bg-[#011E4D] text-white">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {editItem ? 'Edit Data Barang Inventaris' : 'Tambah Barang Inventaris Dapur MBG'}
            </h3>
            <p className="text-xs text-white/70 mt-0.5">
              Input data aset, nilai perolehan, tanggal beli, kondisi, dan lokasi fisik barang
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Templates Bar (only when adding new item) */}
        {!editItem && (
          <div className="bg-[#011E4D]/5 border-b border-[#011E4D]/10 p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#011E4D] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#011E4D]" />
              <span>Contoh Cepat Barang Inventaris MBG:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {QUICK_ITEM_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-[#B4E0E8] hover:text-[#011E4D] text-slate-700 rounded-md border border-slate-200 hover:border-[#B4E0E8] shrink-0 transition cursor-pointer"
                >
                  + {tpl.name.split(' ')[0]} {tpl.name.split(' ')[1] || ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Row 1: Kode & Nama Barang */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Kode Inventaris
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="MBG-K01-AST-001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-[#011E4D] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Nama Barang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kompor High Pressure 4 Tungku, Meja Stainless Steel, Kursi Lipat, AC, Apron..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white"
              />
            </div>
          </div>

          {/* Row 2: Kategori & Dapur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Kategori Barang
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#011E4D]" />
                Penempatan Dapur <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={kitchenId}
                onChange={(e) => setKitchenId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white cursor-pointer"
              >
                {kitchens.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} ({k.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: LOKASI TEMPAT BERADA SAAT INI (CRITICAL) */}
          <div className="bg-[#011E4D]/5 p-3.5 rounded-xl border border-[#011E4D]/20 space-y-2">
            <label className="block text-[#011E4D] font-bold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#011E4D]" />
              Lokasi Tempat Barang Berada Saat Ini (Agar Mudah Diidentifikasi) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={locationSpot}
              onChange={(e) => setLocationSpot(e.target.value)}
              placeholder="Contoh: Area Masak Utama - Line 1, Ruang Persiapan Sayur, Rak Logistik A-2, Ruang Admin..."
              className="w-full px-3 py-2 bg-white border border-[#011E4D]/30 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#011E4D]"
            />
            {/* Quick spot chips */}
            <div className="flex items-center gap-1 overflow-x-auto pt-1">
              <span className="text-[10px] text-[#011E4D] font-bold shrink-0">
                Pilihan Cepat:
              </span>
              {QUICK_SPOT_SUGGESTIONS.slice(0, 5).map((spot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLocationSpot(spot)}
                  className="px-2 py-0.5 text-[10px] bg-white hover:bg-[#B4E0E8] hover:text-[#011E4D] text-[#011E4D] rounded border border-[#011E4D]/20 shrink-0 cursor-pointer"
                >
                  {spot.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Nilai Perolehan & Tanggal Pembelian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-[#011E4D]" />
                  Nilai Perolehan (Rp) <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] font-bold text-[#011E4D]">
                  {formatRupiah(acquisitionPrice || 0)}
                </span>
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                required
                value={acquisitionPrice}
                onChange={(e) => setAcquisitionPrice(Number(e.target.value))}
                placeholder="1500000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#011E4D] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#011E4D]" />
                Tanggal Pembelian <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white"
              />
            </div>
          </div>

          {/* Row 5: Kondisi & Jumlah */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Status Kondisi Barang <span className="text-rose-500">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-[#011E4D] focus:bg-white cursor-pointer"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Jumlah Kuantitas
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Satuan
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white cursor-pointer"
              >
                <option value="Unit">Unit</option>
                <option value="Pcs">Pcs</option>
                <option value="Set">Set</option>
                <option value="Buah">Buah</option>
                <option value="Pack">Pack</option>
              </select>
            </div>
          </div>

          {/* Row 6: Merk/Spesifikasi & PIC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Merk / Spesifikasi Teknis
              </label>
              <input
                type="text"
                value={brandOrSpec}
                onChange={(e) => setBrandOrSpec(e.target.value)}
                placeholder="Contoh: Stainless Steel 304, Rinnai Commercial 4 Burner..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Petugas Penanggung Jawab (PIC)
              </label>
              <input
                type="text"
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                placeholder="Nama staf penanggung jawab"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white"
              />
            </div>
          </div>

          {/* Row 7: Foto Produk Inventaris (File upload / Camera / Web URL) */}
          <div className="bg-[#011E4D]/5 p-3.5 rounded-xl border border-[#011E4D]/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-[#011E4D] font-bold flex items-center gap-1.5 text-xs">
                <Camera className="w-4 h-4 text-[#011E4D]" />
                Foto Fisik Barang / Produk
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                Dapat unggah file foto, jepret kamera, atau tempel URL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {/* Image Preview Box */}
              <div className="relative w-full h-32 bg-white rounded-lg border-2 border-dashed border-[#011E4D]/30 flex flex-col items-center justify-center overflow-hidden group">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Pratinjau Aset"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        title="Hapus foto"
                        className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs flex items-center gap-1 font-semibold cursor-pointer shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                    <span className="text-[10px] block font-medium">Belum ada foto</span>
                  </div>
                )}
                {isCompressing && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                    <span className="text-xs font-bold text-[#011E4D] animate-pulse">
                      Mengompresi Foto...
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="sm:col-span-2 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                  id="file-input-product-photo"
                />

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#011E4D] bg-[#B4E0E8] hover:bg-[#011E4D] hover:text-white rounded-lg transition cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Foto dari Galeri / Kamera</span>
                  </button>

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition font-medium cursor-pointer"
                    >
                      Batal / Hapus Foto
                    </button>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">
                    Atau tempel URL gambar langsung:
                  </span>
                  <input
                    type="url"
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-[11px] focus:ring-2 focus:ring-[#011E4D]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 8: Catatan Operasional */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Catatan Operasional / Pemeliharaan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan nomor garansi, jadwal pembersihan rutin, atau kontak vendor..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#011E4D] focus:bg-white resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#011E4D] bg-slate-100 hover:bg-[#B4E0E8] rounded-lg transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#011E4D] hover:bg-[#B4E0E8] hover:text-[#011E4D] rounded-lg shadow-sm transition cursor-pointer"
            >
              {editItem ? 'Simpan Perubahan' : '+ Simpan Barang ke Inventaris'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
