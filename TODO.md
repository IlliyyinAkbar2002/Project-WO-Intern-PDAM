# TODO: Perbaikan Error Handling di API Interceptor

## Langkah-langkah yang Telah Dilakukan:
1. **Perbaiki error handling di response interceptor** di `src/lib/api.ts`:
   - ✅ Tambahkan try-catch di sekitar logging untuk mencegah error sekunder.
   - ✅ Pastikan errorDetails tidak memiliki referensi melingkar dengan JSON.stringify pada data.
   - ✅ Tambahkan stack trace untuk debugging lebih baik.
   - ✅ Perbaiki TypeScript error dengan type assertion pada loggingError.

2. **Test perubahan**:
   - Jalankan aplikasi dan coba panggilan API yang gagal untuk memverifikasi logging bekerja dengan baik.
   - Periksa console untuk memastikan tidak ada error tambahan.

3. **Verifikasi**:
   - Pastikan error ditangani dengan benar dan tidak mengganggu alur aplikasi.
