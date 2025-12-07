import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowUpDown, Globe, TrendingUp, AlertTriangle, RefreshCw, Radio, XCircle, Heart, ShieldCheck, Zap } from 'lucide-react';
import { CurrencyInput } from './components/CurrencyInput';
import { ConversionChart } from './components/ConversionChart';
import { convertCurrency, getTrendData, detectUserCurrency } from './services/currencyService';
import { ConversionResult, TrendDataPoint } from './types';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const App: React.FC = () => {
  // Manage amount as string to allow "0", "0.", empty string, etc.
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('IDR');
  
  // Store the raw numeric rate for smooth optimistic updates
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [isLocationDetected, setIsLocationDetected] = useState(false);
  
  // Animation state for swapping
  const [isSwapping, setIsSwapping] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('currency_favorites');
      return saved ? JSON.parse(saved) : ['USD', 'IDR', 'EUR', 'GBP'];
    } catch {
      return ['USD', 'IDR', 'EUR', 'GBP'];
    }
  });

  const toggleFavorite = useCallback((code: string) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code];
      localStorage.setItem('currency_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  }, []);
  
  const [convertedAmountInput, setConvertedAmountInput] = useState<number>(0);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reduced debounce time for snappier typing response
  const debouncedAmount = useDebounce(amount, 500);

  // Initial Location Detection
  useEffect(() => {
    if (isLocationDetected) return;

    const detected = detectUserCurrency();
    
    // Smart logic for default pairs
    if (detected === 'IDR') {
      setFromCurrency('USD'); 
      setToCurrency('IDR');
    } else {
      setFromCurrency(detected);
      setToCurrency('IDR');
    }
    
    setIsLocationDetected(true);
  }, [isLocationDetected]);

  // Optimistic UI Update: Handle typing instantly
  const handleAmountChange = (val: string) => {
    setAmount(val);
    
    // If we already have a valid rate for this pair, update the output INSTANTLY
    const numericVal = parseFloat(val);
    
    if (!isNaN(numericVal) && currentRate > 0) {
       setConvertedAmountInput(parseFloat((numericVal * currentRate).toFixed(2)));
    } else if (!val) {
       // If input is empty, clear output
       setConvertedAmountInput(0);
    }
  };

  const handleSwap = () => {
    // 1. Trigger Animation Start
    setIsSwapping(true);

    // 2. Wait for exit animation (200ms)
    setTimeout(() => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        
        // Invert rate logic
        if (currentRate > 0) {
            const newRate = 1 / currentRate;
            setCurrentRate(newRate);
            
            const previousOutput = convertedAmountInput;
            setAmount(previousOutput.toString());
            
            const numericAmount = parseFloat(amount);
            if (!isNaN(numericAmount)) {
                 setConvertedAmountInput(parseFloat((previousOutput * newRate).toFixed(2)));
            } else {
                 setConvertedAmountInput(0);
            }
        } else {
            setCurrentRate(0);
            setAmount(convertedAmountInput.toString());
            setConvertedAmountInput(parseFloat(amount) || 0);
        }

        // 3. Trigger Animation End (Enter)
        setTimeout(() => {
            setIsSwapping(false);
        }, 50);

    }, 200);
  };
  
  // When currency changes, we reset the rate to 0 until fetch completes
  const handleCurrencyChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (val: string) => {
    setter(val);
    setCurrentRate(0);
  };

  const fetchData = useCallback(async () => {
    const numericAmount = parseFloat(debouncedAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;
    
    setLoading(true);
    
    try {
      const [conversionRes, trendRes] = await Promise.all([
        convertCurrency(numericAmount, fromCurrency, toCurrency),
        getTrendData(fromCurrency, toCurrency)
      ]);
      
      setResult(conversionRes);
      setError(null);
      
      const numericResult = parseFloat(conversionRes.convertedAmount);
      if (!isNaN(numericResult)) {
        setConvertedAmountInput(numericResult);
        
        if (numericAmount > 0) {
            setCurrentRate(numericResult / numericAmount);
        }
      }
      
      setTrendData(trendRes);
    } catch (err) {
      console.error(err);
      setError("Tidak dapat terhubung ke layanan nilai tukar.");
    } finally {
      setLoading(false);
    }
  }, [debouncedAmount, fromCurrency, toCurrency]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="flex flex-col min-h-screen text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-2 rounded-lg shadow-md transform rotate-3">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-600 tracking-tight leading-none">
                Tukar Uang
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {loading && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full animate-pulse border border-emerald-100/50 shadow-sm">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Memperbarui
              </span>
            )}
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span>Langsung</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 pt-8 pb-12">
        
        {/* Hero Section */}
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Konverter Mata Uang
          </h2>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            by Ade Mulyana
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm md:text-base pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <p>Nilai tukar global terpercaya • Diperbarui setiap 60d</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 animate-in slide-in-from-top-4 fade-in duration-300 mx-auto max-w-2xl">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full shrink-0 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-red-800 font-bold mb-1">Kesalahan Koneksi</h3>
                <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                <button 
                  onClick={() => fetchData()}
                  className="mt-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-fit shadow-sm"
                >
                  <RefreshCw className="w-3 h-3" />
                  Coba Lagi
                </button>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 md:p-10 border border-slate-100 relative overflow-visible z-10 max-w-2xl mx-auto">
          {/* Progress bar */}
          {loading && !error && (
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 overflow-hidden rounded-t-3xl">
               <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 animate-progress"></div>
            </div>
          )}
          
          <div className="flex flex-col gap-6 relative">
            
            {/* From Input Wrapper with Animation */}
            {/* Added relative z-30 to ensure this container is above the bottom container */}
            <div className={`relative z-30 transition-all duration-300 ease-in-out transform ${isSwapping ? 'translate-y-4 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
                <CurrencyInput
                label="Anda Kirim"
                amount={amount}
                currency={fromCurrency}
                onAmountChange={handleAmountChange}
                onCurrencyChange={handleCurrencyChange(setFromCurrency)}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                />
            </div>

            {/* Added relative z-20 to sit between the layers if needed, or simply below top layer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <button
                onClick={handleSwap}
                className={`bg-white hover:bg-slate-50 text-emerald-600 p-3.5 rounded-full shadow-lg border border-slate-100 transition-all hover:scale-110 active:scale-95 group ring-4 ring-slate-50 ${isSwapping ? 'rotate-180' : 'rotate-0'}`}
                style={{ transitionDuration: '300ms' }}
                aria-label="Tukar mata uang"
              >
                <ArrowUpDown className="w-5 h-5 group-hover:text-emerald-700" />
              </button>
            </div>

            {/* To Input Wrapper with Animation */}
            {/* Added relative z-10 so it stays below the top input's dropdown */}
            <div className={`relative z-10 transition-all duration-300 ease-in-out transform ${isSwapping ? '-translate-y-4 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
                <CurrencyInput
                label="Anda Terima"
                amount={convertedAmountInput}
                currency={toCurrency}
                onCurrencyChange={handleCurrencyChange(setToCurrency)}
                readOnlyAmount={true}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                />
            </div>
          </div>
          
          {/* Live Rate Indicator */}
          {(result || currentRate > 0) && !error && (
             <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-6 gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Nilai Tukar Indikatif</span>
                  <span className="font-bold text-slate-800 text-lg">
                    1 {fromCurrency} ≈ {currentRate > 0 ? currentRate.toFixed(4) : (result && parseFloat(result.convertedAmount) > 0 ? (parseFloat(result.convertedAmount) / (parseFloat(debouncedAmount) || 1)).toFixed(4) : "...")} {toCurrency}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-100">
                   <Zap className="w-3.5 h-3.5 fill-current" />
                   <span className="font-bold text-xs">Data Real-time</span>
                </div>
             </div>
          )}
        </div>

        {/* Info & Charts Section */}
        {result && !error && (
          <div className="mt-12 animate-fade-in-up grid gap-8 max-w-2xl mx-auto">
            
            {/* Market Insight Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-start gap-4">
                 <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0">
                   <TrendingUp className="w-6 h-6" />
                 </div>
                 <div className="w-full">
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Ringkasan Pasar</h3>
                   <div className="prose prose-slate prose-sm text-slate-600 leading-relaxed mb-4">
                      <p className="whitespace-pre-wrap">{result.explanation}</p>
                   </div>
                   
                   {result.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-50">
                        {result.sources.map((source, idx) => (
                          <a 
                            key={idx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors truncate max-w-[200px] flex items-center gap-1.5"
                          >
                            <Globe className="w-3 h-3 text-slate-400" />
                            {source.title}
                          </a>
                        ))}
                      </div>
                   )}
                 </div>
               </div>
            </div>

            {/* Chart Component */}
            <ConversionChart 
              data={trendData} 
              from={fromCurrency} 
              to={toCurrency} 
            />
            
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-1.5 rounded-md">
                <Globe className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-700 leading-none">Tukar Uang</span>
                <span className="text-[10px] text-slate-400 font-medium">by Ade Mulyana</span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm text-center md:text-right">
              &copy; {new Date().getFullYear()} Tukar Uang. Nilai tukar real-time didukung oleh Open Exchange Rates.
            </p>
          </div>
          <div className="mt-4 flex justify-center md:justify-end gap-6 text-xs text-slate-400 font-medium">
             <span className="hover:text-slate-600 cursor-pointer transition-colors">Kebijakan Privasi</span>
             <span className="hover:text-slate-600 cursor-pointer transition-colors">Ketentuan Layanan</span>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; margin-left: 0; }
          50% { width: 70%; margin-left: 30%; }
          100% { width: 100%; margin-left: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default App;