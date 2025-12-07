import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CURRENCIES, Currency } from '../types';
import { ChevronDown, Search, Star } from 'lucide-react';

interface CurrencyInputProps {
  label: string;
  amount: number | string;
  currency: string;
  onAmountChange?: (val: string) => void;
  onCurrencyChange: (val: string) => void;
  readOnlyAmount?: boolean;
  favorites: string[];
  onToggleFavorite: (code: string) => void;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  readOnlyAmount = false,
  favorites,
  onToggleFavorite,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch(''); // Reset search on close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const filteredCurrencies = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(lowerSearch) ||
        c.name.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  // Split into favorites and others
  const favoriteList = filteredCurrencies.filter((c) => favorites.includes(c.code));
  const otherList = filteredCurrencies.filter((c) => !favorites.includes(c.code));

  return (
    // Added dynamic z-index: z-50 when open, z-0 when closed to fix overlapping
    <div className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 relative ${isOpen ? 'z-50' : 'z-0'}`}>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="flex items-center gap-4">
        {/* Amount Input */}
        <div className="flex-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange && onAmountChange(e.target.value)}
            readOnly={readOnlyAmount}
            placeholder="0.00"
            className={`w-full text-3xl font-bold text-slate-800 bg-transparent outline-none placeholder:text-slate-300 ${
              readOnlyAmount ? 'cursor-default' : ''
            }`}
            aria-label={`Jumlah ${label}`}
            onWheel={(e) => e.currentTarget.blur()} // Prevent accidental scroll value change
          />
        </div>

        {/* Custom Currency Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 py-2 pl-3 pr-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label="Pilih Mata Uang"
          >
            <img 
              src={`https://flagcdn.com/w40/${selectedCurrency.flagCode}.png`}
              srcSet={`https://flagcdn.com/w80/${selectedCurrency.flagCode}.png 2x`}
              alt={selectedCurrency.name}
              className="w-7 h-5 object-cover rounded shadow-sm border border-slate-100"
            />
            <span className="font-semibold">{selectedCurrency.code}</span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 max-h-[400px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden flex flex-col z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Search Header */}
              <div className="p-3 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Cari mata uang..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    aria-label="Cari kode atau nama mata uang"
                  />
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 p-2 space-y-1" role="listbox">
                {/* Favorites Section */}
                {favoriteList.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                      Favorit
                    </div>
                    {favoriteList.map((c) => (
                      <CurrencyOption
                        key={c.code}
                        currency={c}
                        isSelected={c.code === currency}
                        isFavorite={true}
                        onSelect={() => {
                          onCurrencyChange(c.code);
                          setIsOpen(false);
                          setSearch('');
                        }}
                        onToggleFavorite={() => onToggleFavorite(c.code)}
                      />
                    ))}
                    <div className="h-px bg-slate-100 my-2 mx-2" />
                  </div>
                )}

                {/* All Currencies Section */}
                {otherList.length > 0 && (
                   <>
                    {favoriteList.length > 0 && (
                        <div className="text-xs font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                        Semua Mata Uang
                        </div>
                    )}
                    {otherList.map((c) => (
                        <CurrencyOption
                        key={c.code}
                        currency={c}
                        isSelected={c.code === currency}
                        isFavorite={false}
                        onSelect={() => {
                            onCurrencyChange(c.code);
                            setIsOpen(false);
                            setSearch('');
                        }}
                        onToggleFavorite={() => onToggleFavorite(c.code)}
                        />
                    ))}
                  </>
                )}

                {favoriteList.length === 0 && otherList.length === 0 && (
                  <div className="p-4 text-center text-sm text-slate-500">
                    Mata uang tidak ditemukan
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 text-sm text-slate-400 flex items-center gap-1">
        <span>{selectedCurrency.name}</span>
      </div>
    </div>
  );
};

interface CurrencyOptionProps {
  currency: Currency;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

const CurrencyOption: React.FC<CurrencyOptionProps> = ({
  currency,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      className={`group flex items-center justify-between w-full p-2 rounded-lg transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <img 
          src={`https://flagcdn.com/w40/${currency.flagCode}.png`}
          alt={currency.name}
          className="w-8 h-5 object-cover rounded shadow-sm border border-slate-100"
          loading="lazy"
        />
        <div className="flex flex-col items-start">
          <span className="font-bold text-sm leading-none">{currency.code}</span>
          <span className={`text-xs ${isSelected ? 'text-blue-500' : 'text-slate-400'}`}>
            {currency.name}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`p-1.5 rounded-full transition-all hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 ${
          isFavorite ? 'text-yellow-400' : 'text-slate-300 hover:text-slate-400'
        }`}
        aria-label={isFavorite ? `Hapus ${currency.code} dari favorit` : `Tambah ${currency.code} ke favorit`}
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
};