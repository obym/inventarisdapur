import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { KitchenSelector } from './components/KitchenSelector';
import { FilterBar } from './components/FilterBar';
import { ItemTableView } from './components/ItemTableView';
import { ItemCardView } from './components/ItemCardView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ItemFormModal } from './components/ItemFormModal';
import { KitchenManageModal } from './components/KitchenManageModal';
import { ConditionUpdateModal } from './components/ConditionUpdateModal';
import { TransferItemModal } from './components/TransferItemModal';
import { PrintAssetTagModal } from './components/PrintAssetTagModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { INITIAL_KITCHENS, INITIAL_ITEMS } from './data/initialData';
import { testFirestoreConnection } from './lib/firebase';
import {
  seedInitialFirestoreData,
  subscribeToKitchens,
  subscribeToItems,
  saveItemToFirestore,
  deleteItemFromFirestore,
  saveKitchenToFirestore,
  deleteKitchenFromFirestore,
  resetAllFirestoreData,
} from './lib/inventoryService';
import {
  InventoryItem,
  Kitchen,
  FilterState,
  ViewMode,
  ItemCondition,
} from './types';
import { formatMonthYearIndo } from './utils/formatters';

const STORAGE_KEYS = {
  KITCHENS: 'mbg_kitchens_v1',
  ITEMS: 'mbg_inventory_items_v1',
  VIEW_MODE: 'mbg_view_mode_v1',
};

export default function App() {
  // Load Kitchens
  const [kitchens, setKitchens] = useState<Kitchen[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KITCHENS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading kitchens from storage:', e);
    }
    return INITIAL_KITCHENS;
  });

  // Load Inventory Items
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading items from storage:', e);
    }
    return INITIAL_ITEMS;
  });

  // Active Kitchen Selector
  const [selectedKitchenId, setSelectedKitchenId] = useState<string>('all');
  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'syncing' | 'error'>('syncing');

  // Toast Notification State
  const [toast, setToast] = useState<{
    id: number;
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  }, []);

  // Connect and verify Firestore
  const verifyAndConnectFirebase = useCallback(async () => {
    setFirebaseStatus('syncing');
    try {
      const isConnected = await testFirestoreConnection();
      if (!isConnected) {
        setFirebaseStatus('error');
        showToast('error', 'Koneksi ke Firebase Cloud Firestore gagal. Periksa koneksi internet.');
        return;
      }
      await seedInitialFirestoreData();
      setFirebaseStatus('connected');
    } catch (e) {
      console.error('Firebase initialization error:', e);
      setFirebaseStatus('error');
      showToast('error', 'Terjadi kendala saat menyinkronkan dengan database Firebase.');
    }
  }, [showToast]);

  // Initialize and subscribe to Firestore realtime updates
  useEffect(() => {
    let unsubscribeKitchens: (() => void) | undefined;
    let unsubscribeItems: (() => void) | undefined;
    let isMounted = true;

    async function initFirestore() {
      await verifyAndConnectFirebase();

      unsubscribeKitchens = subscribeToKitchens(
        (remoteKitchens) => {
          if (!isMounted) return;
          if (remoteKitchens && remoteKitchens.length > 0) {
            setKitchens(remoteKitchens);
            setFirebaseStatus('connected');
          }
        },
        (err) => {
          console.error('Kitchens subscription error:', err);
          if (isMounted) setFirebaseStatus('error');
        }
      );

      unsubscribeItems = subscribeToItems(
        (remoteItems) => {
          if (!isMounted) return;
          if (remoteItems) {
            setItems(remoteItems);
            setFirebaseStatus('connected');
          }
        },
        (err) => {
          console.error('Items subscription error:', err);
          if (isMounted) setFirebaseStatus('error');
        }
      );
    }

    initFirestore();

    return () => {
      isMounted = false;
      if (unsubscribeKitchens) unsubscribeKitchens();
      if (unsubscribeItems) unsubscribeItems();
    };
  }, [verifyAndConnectFirebase]);


  // View Mode
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      if (saved === 'grid' || saved === 'table') return saved;
    } catch (e) {
      // ignore
    }
    return 'table';
  });

  // Filter & Search State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    kitchenId: 'all',
    category: 'all',
    condition: 'all',
    month: 'all',
    sortBy: 'purchaseDate_desc',
  });

  // Calculate unique months available in inventory items
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.purchaseDate && item.purchaseDate.length >= 7) {
        set.add(item.purchaseDate.substring(0, 7)); // 'YYYY-MM'
      }
    });
    return Array.from(set).sort().reverse();
  }, [items]);

  // Modal States
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isKitchenManageOpen, setIsKitchenManageOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
  const [conditionItem, setConditionItem] = useState<InventoryItem | null>(null);
  const [transferItem, setTransferItem] = useState<InventoryItem | null>(null);
  const [printTagItem, setPrintTagItem] = useState<InventoryItem | null>(null);
  const [deleteTargetItem, setDeleteTargetItem] = useState<InventoryItem | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.KITCHENS, JSON.stringify(kitchens));
    } catch (e) {
      console.error('Failed saving kitchens:', e);
    }
  }, [kitchens]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed saving items:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    } catch (e) {
      console.error('Failed saving view mode:', e);
    }
  }, [viewMode]);

  // Sync selectedKitchenId into filter if changed
  const handleKitchenSelect = (kId: string) => {
    setSelectedKitchenId(kId);
  };

  // Filtered and Sorted Items Calculation
  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) => {
        // Kitchen match
        if (selectedKitchenId !== 'all' && item.kitchenId !== selectedKitchenId) {
          return false;
        }

        // Category match
        if (filters.category !== 'all' && item.category !== filters.category) {
          return false;
        }

        // Condition match
        if (filters.condition !== 'all' && item.condition !== filters.condition) {
          return false;
        }

        // Acquisition Month match (perolehan sesuai bulan yang dipilih)
        if (filters.month !== 'all') {
          if (!item.purchaseDate || !item.purchaseDate.startsWith(filters.month)) {
            return false;
          }
        }

        // Search text match (search name, code, brandOrSpec, locationSpot, pic)
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchName = item.name.toLowerCase().includes(query);
          const matchCode = item.code.toLowerCase().includes(query);
          const matchSpec = (item.brandOrSpec || '').toLowerCase().includes(query);
          const matchSpot = item.locationSpot.toLowerCase().includes(query);
          const matchPic = (item.pic || '').toLowerCase().includes(query);
          const kitchenName = (kitchens.find((k) => k.id === item.kitchenId)?.name || '').toLowerCase();

          return (
            matchName ||
            matchCode ||
            matchSpec ||
            matchSpot ||
            matchPic ||
            kitchenName.includes(query)
          );
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'purchaseDate_desc':
            return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
          case 'purchaseDate_asc':
            return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
          case 'price_desc':
            return (b.acquisitionPrice || 0) - (a.acquisitionPrice || 0);
          case 'price_asc':
            return (a.acquisitionPrice || 0) - (b.acquisitionPrice || 0);
          case 'name_asc':
            return a.name.localeCompare(b.name, 'id');
          default:
            return 0;
        }
      });
  }, [items, selectedKitchenId, filters, kitchens]);

  // Handler: Add or Update Item
  const handleSaveItem = async (itemData: Omit<InventoryItem, 'id'> & { id?: string }) => {
    if (itemData.id) {
      // Update
      const existing = items.find((i) => i.id === itemData.id);
      const updatedItem: InventoryItem = {
        ...existing,
        ...itemData,
        id: itemData.id,
      } as InventoryItem;

      try {
        await saveItemToFirestore(updatedItem);
        setItems((prev) =>
          prev.map((it) => (it.id === itemData.id ? updatedItem : it))
        );
        if (detailItem && detailItem.id === itemData.id) {
          setDetailItem(updatedItem);
        }
        showToast('success', `Perubahan aset "${updatedItem.name}" berhasil disimpan ke Firebase.`);
      } catch (err) {
        console.error('Failed to save item to Firestore:', err);
        showToast('error', 'Gagal menyimpan pembaruan aset ke database Firebase.');
      }
    } else {
      // Add new
      const newItem: InventoryItem = {
        ...itemData,
        id: `item-${Date.now()}`,
        mutationHistory: [],
        conditionHistory: [
          {
            id: `ch-${Date.now()}`,
            date: itemData.purchaseDate || new Date().toISOString().split('T')[0],
            fromCondition: itemData.condition,
            toCondition: itemData.condition,
            notes: 'Pencatatan awal inventaris baru diterima.',
            inspector: itemData.pic || 'Petugas Registrasi Aset',
          },
        ],
      };

      try {
        await saveItemToFirestore(newItem);
        setItems((prev) => [newItem, ...prev]);
        showToast('success', `Aset baru "${newItem.name}" berhasil ditambahkan ke Firebase.`);
      } catch (err) {
        console.error('Failed to save new item to Firestore:', err);
        showToast('error', 'Gagal menyimpan aset baru ke database Firebase.');
      }
    }
  };

  // Handlers for Delete Item (with confirmation modal)
  const handleRequestDeleteItem = (itemId: string) => {
    const it = items.find((i) => i.id === itemId);
    if (it) {
      setDeleteTargetItem(it);
    }
  };

  const handleRequestDeleteItemObj = (item: InventoryItem) => {
    setDeleteTargetItem(item);
  };

  const handleExecuteDelete = async (itemId: string) => {
    setIsDeletingItem(true);
    const itemToDelete = items.find((i) => i.id === itemId);
    const itemName = itemToDelete?.name || 'Aset';

    try {
      // Delete directly from Firestore
      await deleteItemFromFirestore(itemId);

      // Once deleted from Firebase, update local state
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== itemId);
        try {
          localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(next));
        } catch (e) {
          console.error(e);
        }
        return next;
      });

      if (detailItem?.id === itemId) setDetailItem(null);
      if (editingItem?.id === itemId) {
        setEditingItem(null);
        setIsItemFormOpen(false);
      }
      setDeleteTargetItem(null);

      showToast('success', `"${itemName}" telah berhasil dihapus permanen dari Firebase.`);
    } catch (err) {
      console.error('Failed to delete item from Firestore:', err);
      showToast('error', `Gagal menghapus "${itemName}" dari database Firebase. Periksa koneksi internet Anda.`);
    } finally {
      setIsDeletingItem(false);
    }
  };

  // Handler: Update Condition
  const handleSaveCondition = async (
    itemId: string,
    newCondition: ItemCondition,
    notes: string,
    inspector: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const it = items.find((i) => i.id === itemId);
    if (!it) return;

    const newRecord = {
      id: `ch-${Date.now()}`,
      date: today,
      fromCondition: it.condition,
      toCondition: newCondition,
      notes,
      inspector,
    };
    const updatedHistory = [newRecord, ...(it.conditionHistory || [])];
    const updatedItem: InventoryItem = {
      ...it,
      condition: newCondition,
      lastInspectedDate: today,
      conditionHistory: updatedHistory,
    };

    try {
      await saveItemToFirestore(updatedItem);
      setItems((prev) => prev.map((item) => (item.id === itemId ? updatedItem : item)));
      if (detailItem?.id === itemId) {
        setDetailItem(updatedItem);
      }
      showToast('success', `Status kondisi "${it.name}" berhasil diperbarui di Firebase.`);
    } catch (err) {
      console.error('Failed to update condition in Firestore:', err);
      showToast('error', 'Gagal memperbarui status kondisi di Firebase.');
    }
  };

  // Handler: Transfer / Mutation
  const handleSaveTransfer = async (
    itemId: string,
    targetKitchenId: string,
    newSpot: string,
    reason: string,
    handledBy: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const it = items.find((i) => i.id === itemId);
    if (!it) return;

    const newRecord = {
      id: `mut-${Date.now()}`,
      date: today,
      fromKitchenId: it.kitchenId,
      toKitchenId: targetKitchenId,
      fromSpot: it.locationSpot,
      toSpot: newSpot,
      reason,
      handledBy,
    };
    const updatedHistory = [newRecord, ...(it.mutationHistory || [])];
    const updatedItem: InventoryItem = {
      ...it,
      kitchenId: targetKitchenId,
      locationSpot: newSpot,
      mutationHistory: updatedHistory,
    };

    try {
      await saveItemToFirestore(updatedItem);
      setItems((prev) => prev.map((item) => (item.id === itemId ? updatedItem : item)));
      if (detailItem?.id === itemId) {
        setDetailItem(updatedItem);
      }
      showToast('success', `Mutasi fisik aset berhasil dicatat di Firebase.`);
    } catch (err) {
      console.error('Failed to transfer item in Firestore:', err);
      showToast('error', 'Gagal menyimpan mutasi aset di Firebase.');
    }
  };

  // Handler: Add Kitchen
  const handleAddKitchen = async (kData: Omit<Kitchen, 'id' | 'createdAt'>) => {
    const newKitchen: Kitchen = {
      ...kData,
      id: `k-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      await saveKitchenToFirestore(newKitchen);
      setKitchens((prev) => [...prev, newKitchen]);
      setSelectedKitchenId(newKitchen.id);
      showToast('success', `Dapur "${newKitchen.name}" berhasil ditambahkan ke Firebase.`);
    } catch (err) {
      console.error('Failed to save kitchen to Firestore:', err);
      showToast('error', 'Gagal menyimpan dapur baru ke Firebase.');
    }
  };

  // Handler: Update Kitchen
  const handleUpdateKitchen = async (updatedK: Kitchen) => {
    try {
      await saveKitchenToFirestore(updatedK);
      setKitchens((prev) => prev.map((k) => (k.id === updatedK.id ? updatedK : k)));
      showToast('success', `Informasi dapur "${updatedK.name}" berhasil diperbarui di Firebase.`);
    } catch (err) {
      console.error('Failed to update kitchen in Firestore:', err);
      showToast('error', 'Gagal memperbarui data dapur di Firebase.');
    }
  };

  // Handler: Delete Kitchen
  const handleDeleteKitchen = async (kId: string) => {
    const kitchenToDelete = kitchens.find((k) => k.id === kId);
    const kName = kitchenToDelete?.name || 'Dapur';

    try {
      await deleteKitchenFromFirestore(kId);
      setKitchens((prev) => prev.filter((k) => k.id !== kId));
      if (selectedKitchenId === kId) {
        setSelectedKitchenId('all');
      }
      showToast('success', `Dapur "${kName}" berhasil dihapus dari Firebase.`);
    } catch (err) {
      console.error('Failed to delete kitchen from Firestore:', err);
      showToast('error', `Gagal menghapus dapur "${kName}" dari Firebase.`);
    }
  };

  // Handler: Reset to Initial Data
  const handleResetData = async () => {
    if (
      confirm(
        'Reset semua data inventaris dan daftar dapur ke data awal demo program MBG?'
      )
    ) {
      try {
        await resetAllFirestoreData();
        setKitchens(INITIAL_KITCHENS);
        setItems(INITIAL_ITEMS);
        setSelectedKitchenId('all');
        localStorage.removeItem(STORAGE_KEYS.KITCHENS);
        localStorage.removeItem(STORAGE_KEYS.ITEMS);
        showToast('info', 'Data inventaris berhasil direset ke data bawaan demo di Firebase.');
      } catch (err) {
        console.error('Failed to reset Firestore data:', err);
        showToast('error', 'Gagal mereset database Firebase.');
      }
    }
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Kode Barang',
      'Nama Barang',
      'Kategori',
      'Kode Dapur',
      'Nama Dapur',
      'Lokasi Tempat Berada Saat Ini',
      'Nilai Perolehan (Rp)',
      'Tanggal Pembelian',
      'Status Kondisi',
      'Jumlah',
      'Satuan',
      'Merk/Spesifikasi',
      'PIC',
      'Catatan',
    ];

    const rows = filteredAndSortedItems.map((item) => {
      const kitchen = kitchens.find((k) => k.id === item.kitchenId);
      return [
        `"${item.code}"`,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        `"${kitchen?.code || ''}"`,
        `"${(kitchen?.name || '').replace(/"/g, '""')}"`,
        `"${item.locationSpot.replace(/"/g, '""')}"`,
        item.acquisitionPrice || 0,
        item.purchaseDate,
        `"${item.condition}"`,
        item.quantity,
        `"${item.unit}"`,
        `"${(item.brandOrSpec || '').replace(/"/g, '""')}"`,
        `"${(item.pic || '').replace(/"/g, '""')}"`,
        `"${(item.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStr = new Date().toISOString().split('T')[0];
    const monthSuffix = filters.month !== 'all' ? `_${filters.month}` : '';
    link.setAttribute(
      'download',
      `Inventaris_Dapur_MBG_${selectedKitchenId}${monthSuffix}_${dateStr}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        onOpenAddItem={() => {
          setEditingItem(null);
          setIsItemFormOpen(true);
        }}
        onOpenManageKitchens={() => setIsKitchenManageOpen(true)}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
        kitchenCount={kitchens.length}
        itemCount={items.length}
        firebaseStatus={firebaseStatus}
        onReconnectFirebase={verifyAndConnectFirebase}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Metric Summary Cards */}
        <StatsCards
          items={items}
          kitchens={kitchens}
          selectedKitchenId={selectedKitchenId}
          selectedMonth={filters.month}
        />

        {/* Multi-Kitchen Switcher & Kitchen Management */}
        <KitchenSelector
          kitchens={kitchens}
          items={items}
          selectedKitchenId={selectedKitchenId}
          onSelectKitchen={handleKitchenSelect}
          onOpenAddKitchen={() => setIsKitchenManageOpen(true)}
          onOpenManageKitchens={() => setIsKitchenManageOpen(true)}
        />

        {/* Filter, Search & View Mode Toggle */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFilteredCount={filteredAndSortedItems.length}
          availableMonths={availableMonths}
        />

        {/* Active Filter / Count indicator */}
        <div className="flex items-center justify-between mb-3 px-1 text-xs text-slate-500">
          <div>
            Menampilkan{' '}
            <strong className="text-slate-800">
              {filteredAndSortedItems.length}
            </strong>{' '}
            {filters.month !== 'all' ? (
              <span>
                aset perolehan{' '}
                <strong className="text-[#011E4D]">
                  {formatMonthYearIndo(filters.month)}
                </strong>{' '}
              </span>
            ) : (
              'aset inventaris '
            )}
            dari total {items.length} aset terdata
            {selectedKitchenId !== 'all' && (
              <span>
                {' '}
                di{' '}
                <strong className="text-[#011E4D]">
                  {kitchens.find((k) => k.id === selectedKitchenId)?.name}
                </strong>
              </span>
            )}
          </div>

          <div className="hidden sm:block text-slate-600 font-medium">
            Format: {viewMode === 'table' ? 'Tabel Audit Lengkap' : 'Kartu Visual'}
          </div>
        </div>

        {/* Content View: Table or Grid */}
        {viewMode === 'table' ? (
          <ItemTableView
            items={filteredAndSortedItems}
            kitchens={kitchens}
            onViewDetail={(it) => setDetailItem(it)}
            onEditItem={(it) => {
              setEditingItem(it);
              setIsItemFormOpen(true);
            }}
            onDeleteItem={handleRequestDeleteItem}
            onUpdateCondition={(it) => setConditionItem(it)}
            onTransferItem={(it) => setTransferItem(it)}
            onPrintTag={(it) => setPrintTagItem(it)}
          />
        ) : (
          <ItemCardView
            items={filteredAndSortedItems}
            kitchens={kitchens}
            onViewDetail={(it) => setDetailItem(it)}
            onEditItem={(it) => {
              setEditingItem(it);
              setIsItemFormOpen(true);
            }}
            onDeleteItem={handleRequestDeleteItem}
            onUpdateCondition={(it) => setConditionItem(it)}
            onTransferItem={(it) => setTransferItem(it)}
            onPrintTag={(it) => setPrintTagItem(it)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Sistem Monitoring Inventaris Dapur Program Makan Bergizi Gratis (MBG)
          </span>
          <span className="text-slate-400">
            Terlacak: Kompor, Meja, Kursi, AC, Lemari, Apron & Peralatan Masak
          </span>
        </div>
      </footer>

      {/* MODALS */}
      {/* Item Add/Edit Modal */}
      <ItemFormModal
        isOpen={isItemFormOpen}
        onClose={() => {
          setIsItemFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editItem={editingItem}
        kitchens={kitchens}
        defaultKitchenId={selectedKitchenId}
        onDelete={handleRequestDeleteItem}
      />

      {/* Item Detail & Audit Modal */}
      <ItemDetailModal
        item={detailItem}
        kitchens={kitchens}
        onClose={() => setDetailItem(null)}
        onEdit={(it) => {
          setEditingItem(it);
          setIsItemFormOpen(true);
        }}
        onUpdateCondition={(it) => setConditionItem(it)}
        onTransfer={(it) => setTransferItem(it)}
        onPrintTag={(it) => setPrintTagItem(it)}
        onDelete={handleRequestDeleteItemObj}
      />

      {/* Kitchen Management & Add New Kitchens Modal */}
      <KitchenManageModal
        isOpen={isKitchenManageOpen}
        onClose={() => setIsKitchenManageOpen(false)}
        kitchens={kitchens}
        items={items}
        onAddKitchen={handleAddKitchen}
        onUpdateKitchen={handleUpdateKitchen}
        onDeleteKitchen={handleDeleteKitchen}
      />

      {/* Quick Condition Update Modal */}
      <ConditionUpdateModal
        item={conditionItem}
        onClose={() => setConditionItem(null)}
        onSaveCondition={handleSaveCondition}
      />

      {/* Transfer / Move Item Modal */}
      <TransferItemModal
        item={transferItem}
        kitchens={kitchens}
        onClose={() => setTransferItem(null)}
        onSaveTransfer={handleSaveTransfer}
      />

      {/* Print Asset Tag Label Modal */}
      <PrintAssetTagModal
        item={printTagItem}
        kitchens={kitchens}
        onClose={() => setPrintTagItem(null)}
      />

      {/* Safe Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetItem}
        item={deleteTargetItem}
        kitchens={kitchens}
        onClose={() => setDeleteTargetItem(null)}
        onConfirm={handleExecuteDelete}
        isDeleting={isDeletingItem}
      />

      {/* Global Status Toast Notification */}
      {toast && (
        <div
          id="global-toast-notification"
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium border transition-all duration-300 max-w-md ${
            toast.type === 'success'
              ? 'bg-slate-900 text-emerald-300 border-emerald-500/40'
              : toast.type === 'error'
              ? 'bg-slate-900 text-rose-300 border-rose-500/40'
              : 'bg-slate-900 text-sky-300 border-sky-500/40'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <RefreshCw className="w-5 h-5 text-sky-400 shrink-0" />}
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            id="btn-close-toast"
            onClick={() => setToast(null)}
            className="text-white/50 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
