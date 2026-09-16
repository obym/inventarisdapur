import React from 'react';
import { Search, LayoutGrid, Table, X, Filter, Calendar } from 'lucide-react';
import { FilterState, ItemCategory, ItemCondition, ViewMode } from '../types';
import { formatMonthYearIndo } from '../utils/formatters';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFilteredCount: number;
  availableMonths: string[];
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

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  availableMonths,
}) => {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.condition !== 'all' ||
    filters.month !== 'all' ||
    filters.sortBy !== 'purchaseDate_desc';

  const resetFilters = () => {
    onFilterChange({
      ...filters,
      search: '',
      category: 'all',
      condition: 'all',
      month: 'all',
      sortBy: 'purchaseDate_desc',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-inventory"
            type="text"
            placeholder="Cari nama barang (kompor, meja, AC, kursi, apron, lemari...), kode, atau lokasi..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#011E4D] focus:bg-white text-slate-900 placeholder:text-slate-400 transition"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Month Selector Dropdown */}
          <div className="relative">
            <select
              id="select-month"
              value={filters.month}
              onChange={(e) =>
                onFilterChange({ ...filters, month: e.target.value })
              }
              aria-label="Pilih Bulan Perolehan"
              className={`appearance-none text-xs font-semibold px-3 py-2 pr-7 rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-[#011E4D] cursor-pointer transition ${
                filters.month !== 'all'
                  ? 'bg-[#011E4D] text-white border-[#011E4D] shadow-xs'
                  : 'bg-slate-50 hover:bg-[#B4E0E8]/30 hover:border-[#B4E0E8] text-slate-700 border-slate-200'
              }`}
            >
              <option value="all" className="text-slate-900 bg-white">
                📅 Semua Bulan Perolehan
              </option>
              {availableMonths.map((m) => (
                <option key={m} value={m} className="text-slate-900 bg-white">
                  📅 {formatMonthYearIndo(m)}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              id="select-category"
              value={filters.category}
              onChange={(e) =>
                onFilterChange({ ...filters, category: e.target.value })
              }
              aria-label="Filter Kategori"
              className="appearance-none bg-slate-50 hover:bg-[#B4E0E8]/30 hover:border-[#B4E0E8] text-slate-700 text-xs font-medium px-3 py-2 pr-7 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#011E4D] cursor-pointer transition"
            >
              <option value="all">Semua Kategori</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Dropdown */}
          <div className="relative">
            <select
              id="select-condition"
              value={filters.condition}
              onChange={(e) =>
                onFilterChange({ ...filters, condition: e.target.value })
              }
              aria-label="Filter Kondisi Barang"
              className="appearance-none bg-slate-50 hover:bg-[#B4E0E8]/30 hover:border-[#B4E0E8] text-slate-700 text-xs font-medium px-3 py-2 pr-7 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#011E4D] cursor-pointer transition"
            >
              <option value="all">Semua Kondisi</option>
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              id="select-sort-by"
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  sortBy: e.target.value as FilterState['sortBy'],
                })
              }
              aria-label="Urutkan Barang"
              className="appearance-none bg-slate-50 hover:bg-[#B4E0E8]/30 hover:border-[#B4E0E8] text-slate-700 text-xs font-medium px-3 py-2 pr-7 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#011E4D] cursor-pointer transition"
            >
              <option value="purchaseDate_desc">Tgl Beli: Terbaru</option>
              <option value="purchaseDate_asc">Tgl Beli: Terlama</option>
              <option value="price_desc">Nilai: Tertinggi</option>
              <option value="price_asc">Nilai: Terendah</option>
              <option value="name_asc">Nama Barang (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 px-2 py-1.5 rounded-md hover:bg-rose-50 transition cursor-pointer font-medium"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 ml-auto sm:ml-0">
            <button
              id="view-mode-table"
              onClick={() => onViewModeChange('table')}
              title="Tampilan Tabel (Audit)"
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#011E4D] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-[#B4E0E8] hover:text-[#011E4D]'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              id="view-mode-grid"
              onClick={() => onViewModeChange('grid')}
              title="Tampilan Kartu (Visual)"
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#011E4D] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-[#B4E0E8] hover:text-[#011E4D]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Month Selector Bar */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 pb-1 text-xs text-slate-600">
        <span className="text-[11px] font-semibold uppercase text-slate-600 shrink-0 mr-1 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#011E4D]" /> Bulan Perolehan:
        </span>
        <button
          id="month-pill-all"
          onClick={() => onFilterChange({ ...filters, month: 'all' })}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition cursor-pointer ${
            filters.month === 'all'
              ? 'bg-[#011E4D] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-[#B4E0E8] hover:text-[#011E4D]'
          }`}
        >
          Semua Bulan
        </button>
        {availableMonths.map((m) => (
          <button
            key={m}
            id={`month-pill-${m}`}
            onClick={() => onFilterChange({ ...filters, month: m })}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition cursor-pointer ${
              filters.month === m
                ? 'bg-[#011E4D] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-[#B4E0E8] hover:text-[#011E4D]'
            }`}
          >
            {formatMonthYearIndo(m)}
          </button>
        ))}

        {/* Custom Month Picker */}
        <div className="inline-flex items-center gap-1 ml-auto sm:ml-2 shrink-0">
          <label htmlFor="custom-month-picker" className="text-[11px] text-slate-500 font-medium">
            Pilih Bulan Lain:
          </label>
          <input
            id="custom-month-picker"
            type="month"
            value={filters.month !== 'all' ? filters.month : ''}
            onChange={(e) => {
              if (e.target.value) {
                onFilterChange({ ...filters, month: e.target.value });
              }
            }}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 hover:border-[#B4E0E8] focus:ring-1 focus:ring-[#011E4D] cursor-pointer"
          />
        </div>
      </div>

      {/* Active Month Alert Banner if a month is selected */}
      {filters.month !== 'all' && (
        <div className="mt-2.5 px-3 py-2 bg-[#011E4D]/5 border border-[#011E4D]/15 rounded-lg flex items-center justify-between text-xs text-[#011E4D]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#011E4D] animate-pulse" />
            <span>
              Menampilkan hanya perolehan aset pada bulan{' '}
              <strong className="font-bold underline">
                {formatMonthYearIndo(filters.month)}
              </strong>{' '}
              ({totalFilteredCount} barang ditemukan)
            </span>
          </div>
          <button
            onClick={() => onFilterChange({ ...filters, month: 'all' })}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-3 shrink-0"
          >
            ✕ Tampilkan Semua Bulan
          </button>
        </div>
      )}

      {/* Quick category badges for rapid navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto mt-2.5 pt-2 border-t border-slate-100 pb-1 text-xs text-slate-600">
        <span className="text-[11px] font-semibold uppercase text-slate-600 shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#011E4D]" /> Kategori Cepat:
        </span>
        <button
          onClick={() => onFilterChange({ ...filters, category: 'all' })}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition cursor-pointer ${
            filters.category === 'all'
              ? 'bg-[#011E4D] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-[#B4E0E8] hover:text-[#011E4D]'
          }`}
        >
          Semua ({totalFilteredCount})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onFilterChange({ ...filters, category: cat })}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition cursor-pointer ${
              filters.category === cat
                ? 'bg-[#011E4D] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-[#B4E0E8] hover:text-[#011E4D]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
