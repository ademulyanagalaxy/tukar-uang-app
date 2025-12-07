# 💱 Tukar Uang

**Tukar Uang** adalah aplikasi konverter mata uang berbasis web yang modern, responsif, dan cerdas. Aplikasi ini memungkinkan pengguna untuk menghitung nilai tukar mata uang dari seluruh dunia secara real-time dengan antarmuka yang indah dan animasi yang mulus.

## ✨ Fitur Utama

1.  **Konversi Real-Time**: Menggunakan API nilai tukar terkini (Open Exchange Rates) untuk akurasi tinggi.
2.  **Deteksi Mata Uang Otomatis**: Secara cerdas mendeteksi lokasi pengguna berdasarkan zona waktu browser untuk mengatur mata uang "Asal" secara otomatis.
3.  **Grafik Tren 7 Hari**: Menampilkan visualisasi grafik area yang indah untuk melihat kenaikan atau penurunan nilai tukar dalam seminggu terakhir.
4.  **Dukungan Mata Uang Luas**: Mendukung 40+ mata uang dari berbagai wilayah (Amerika, Eropa, Asia, Timur Tengah, Afrika).
5.  **Sistem Favorit**: Simpan pasangan mata uang yang sering digunakan agar muncul di bagian atas daftar dropdown.
6.  **Animasi Halus**: Transisi tukar posisi (swap) dan loading yang memanjakan mata.
7.  **Desain Responsif**: Tampilan yang optimal di desktop maupun perangkat mobile.

## 🛠️ Teknologi yang Digunakan

*   **Frontend Library**: React (TypeScript)
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Charting**: Recharts
*   **APIs**:
    *   `open.er-api.com` (Data nilai tukar live)
    *   `frankfurter.app` (Data histori grafik untuk mata uang utama)

---

## 🚀 Cara Menjalankan Aplikasi di Local

Berikut adalah panduan untuk menjalankan kode ini di komputer Anda menggunakan **Vite** (Build tool modern untuk React).

### Prasyarat
Pastikan Anda sudah menginstall **Node.js** di komputer Anda.

### Langkah 1: Membuat Project React TypeScript
Buka terminal atau command prompt dan jalankan perintah berikut:

```bash
npm create vite@latest tukar-uang -- --template react-ts
cd tukar-uang
npm install
```

### Langkah 2: Install Library Tambahan
Install library yang digunakan dalam aplikasi ini:

```bash
npm install lucide-react recharts
```

### Langkah 3: Mengatur Struktur File
Salin kode dari file yang disediakan ke dalam folder `src` project Anda dengan struktur berikut:

```text
tukar-uang/
├── index.html          <-- (Ganti/Edit isi file ini di root folder)
├── src/
│   ├── main.tsx        <-- (Ganti isi main.tsx dengan kode dari index.tsx)
│   ├── App.tsx
│   ├── types.ts
│   ├── index.css       <-- (Boleh dikosongkan karena kita pakai Tailwind CDN)
│   ├── components/
│   │   ├── ConversionChart.tsx
│   │   └── CurrencyInput.tsx
│   └── services/
│       └── currencyService.ts
```

### Langkah 4: Konfigurasi Tailwind (Penting)
Karena kode ini menggunakan Tailwind via CDN untuk kemudahan (sesuai `index.html` yang diberikan), pastikan file `index.html` di project Vite Anda memiliki tag script ini di dalam `<head>`:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: { sans: ['Inter', 'sans-serif'] },
        // ... konfigurasi animasi lainnya dari file index.html asli
      }
    }
  }
</script>
```

### Langkah 5: Jalankan Aplikasi
Setelah semua file disalin:

```bash
npm run dev
```

Buka browser di alamat yang muncul (biasanya `http://localhost:5173`).

---

## 📂 Penjelasan Kode

*   **`src/App.tsx`**: Komponen utama. Mengatur state aplikasi, animasi swap, dan memanggil layanan API.
*   **`src/services/currencyService.ts`**:
    *   `convertCurrency`: Mengambil data rate terbaru.
    *   `getTrendData`: Mengambil data historis 7 hari ke belakang.
    *   `detectUserCurrency`: Logika pintar mendeteksi mata uang berdasarkan Timezone browser (tanpa perlu izin GPS).
*   **`src/components/CurrencyInput.tsx`**: Komponen input angka yang menangani format desimal dan pencarian mata uang.
*   **`src/components/ConversionChart.tsx`**: Menampilkan grafik tren menggunakan Recharts dengan styling custom.

## 🤝 Credit

Dibuat oleh **Ade Mulyana**.
Data nilai tukar disediakan oleh layanan Open Exchange Rates (Free Tier).
