// ======================================================================
// KONFIGURASI ALYZ AI — file ini TIDAK ikut ter-publish ke publik.
// Kalau kamu push project ini ke GitHub, tambahkan baris "config.js"
// ke file .gitignore supaya key tidak ikut ter-commit.
// ======================================================================

window.ALYZ_AI_CONFIG = {
  // Ambil API key dari https://aistudio.google.com/apikey
  // Google sempat memakai format lama "AIzaSy...", lalu pindah ke format
  // baru "AQ...." (Authentication Key) — keduanya didukung di sini.
  GEMINI_API_KEY: 'GANTI_DENGAN_API_KEY_ASLI_DARI_AISTUDIO',

  // Model Gemini yang dipanggil. gemini-3.1-flash-lite adalah model stabil
  // (bukan preview) per pertengahan 2026. Model keluarga Gemini 2.5 (termasuk
  // gemini-2.5-flash) dijadwalkan pensiun 16 Oktober 2026 — jangan dipakai lagi.
  MODEL: 'gemini-3.1-flash-lite'
};
