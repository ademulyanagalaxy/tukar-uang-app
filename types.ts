export interface Currency {
  code: string;
  name: string;
  flagCode: string;
}

export interface ConversionResult {
  convertedAmount: string;
  rate: string;
  explanation: string;
  sources: Array<{ title: string; uri: string }>;
}

export interface TrendDataPoint {
  day: string;
  rate: number;
}

// Extensive list of currencies with ISO country codes for flags
export const CURRENCIES: Currency[] = [
  // Majors & Popular
  { code: 'USD', name: 'Dolar Amerika Serikat', flagCode: 'us' },
  { code: 'IDR', name: 'Rupiah Indonesia', flagCode: 'id' },
  { code: 'EUR', name: 'Euro', flagCode: 'eu' },
  { code: 'GBP', name: 'Pound Inggris', flagCode: 'gb' },
  { code: 'JPY', name: 'Yen Jepang', flagCode: 'jp' },
  { code: 'SGD', name: 'Dolar Singapura', flagCode: 'sg' },
  { code: 'AUD', name: 'Dolar Australia', flagCode: 'au' },
  { code: 'CAD', name: 'Dolar Kanada', flagCode: 'ca' },
  { code: 'CHF', name: 'Franc Swiss', flagCode: 'ch' },
  { code: 'CNY', name: 'Yuan Tiongkok', flagCode: 'cn' },
  { code: 'HKD', name: 'Dolar Hong Kong', flagCode: 'hk' },
  { code: 'NZD', name: 'Dolar Selandia Baru', flagCode: 'nz' },
  
  // Asian
  { code: 'INR', name: 'Rupee India', flagCode: 'in' },
  { code: 'MYR', name: 'Ringgit Malaysia', flagCode: 'my' },
  { code: 'THB', name: 'Baht Thailand', flagCode: 'th' },
  { code: 'KRW', name: 'Won Korea Selatan', flagCode: 'kr' },
  { code: 'PHP', name: 'Peso Filipina', flagCode: 'ph' },
  { code: 'VND', name: 'Dong Vietnam', flagCode: 'vn' },
  { code: 'TWD', name: 'Dolar Baru Taiwan', flagCode: 'tw' },
  { code: 'PKR', name: 'Rupee Pakistan', flagCode: 'pk' },
  { code: 'BDT', name: 'Taka Bangladesh', flagCode: 'bd' },
  { code: 'LKR', name: 'Rupee Sri Lanka', flagCode: 'lk' },
  { code: 'NPR', name: 'Rupee Nepal', flagCode: 'np' },
  { code: 'MMK', name: 'Kyat Myanmar', flagCode: 'mm' },
  { code: 'KHR', name: 'Riel Kamboja', flagCode: 'kh' },

  // European & Eurasia
  { code: 'SEK', name: 'Krona Swedia', flagCode: 'se' },
  { code: 'NOK', name: 'Krone Norwegia', flagCode: 'no' },
  { code: 'DKK', name: 'Krone Denmark', flagCode: 'dk' },
  { code: 'PLN', name: 'Zloty Polandia', flagCode: 'pl' },
  { code: 'CZK', name: 'Koruna Ceko', flagCode: 'cz' },
  { code: 'HUF', name: 'Forint Hungaria', flagCode: 'hu' },
  { code: 'RUB', name: 'Rubel Rusia', flagCode: 'ru' },
  { code: 'TRY', name: 'Lira Turki', flagCode: 'tr' },
  { code: 'UAH', name: 'Hryvnia Ukraina', flagCode: 'ua' },
  { code: 'KZT', name: 'Tenge Kazakhstan', flagCode: 'kz' },
  { code: 'RON', name: 'Leu Rumania', flagCode: 'ro' },
  { code: 'BGN', name: 'Lev Bulgaria', flagCode: 'bg' },

  // Middle East
  { code: 'AED', name: 'Dirham UEA', flagCode: 'ae' },
  { code: 'SAR', name: 'Riyal Arab Saudi', flagCode: 'sa' },
  { code: 'ILS', name: 'Shekel Baru Israel', flagCode: 'il' },
  { code: 'QAR', name: 'Riyal Qatar', flagCode: 'qa' },
  { code: 'KWD', name: 'Dinar Kuwait', flagCode: 'kw' },
  { code: 'BHD', name: 'Dinar Bahrain', flagCode: 'bh' },
  { code: 'OMR', name: 'Rial Oman', flagCode: 'om' },
  { code: 'JOD', name: 'Dinar Yordania', flagCode: 'jo' },

  // Africa
  { code: 'EGP', name: 'Pound Mesir', flagCode: 'eg' },
  { code: 'ZAR', name: 'Rand Afrika Selatan', flagCode: 'za' },
  { code: 'NGN', name: 'Naira Nigeria', flagCode: 'ng' },
  { code: 'KES', name: 'Shilling Kenya', flagCode: 'ke' },
  { code: 'GHS', name: 'Cedi Ghana', flagCode: 'gh' },
  { code: 'MAD', name: 'Dirham Maroko', flagCode: 'ma' },
  
  // Americas
  { code: 'BRL', name: 'Real Brasil', flagCode: 'br' },
  { code: 'MXN', name: 'Peso Meksiko', flagCode: 'mx' },
  { code: 'ARS', name: 'Peso Argentina', flagCode: 'ar' },
  { code: 'CLP', name: 'Peso Chili', flagCode: 'cl' },
  { code: 'COP', name: 'Peso Kolombia', flagCode: 'co' },
  { code: 'PEN', name: 'Sol Peru', flagCode: 'pe' },
  { code: 'UYU', name: 'Peso Uruguay', flagCode: 'uy' },
];