import type { Locale } from "@/features/i18n/config"

const id = {
  nav: {
    home: "Beranda",
    template: "Template",
    faq: "FAQ",
    login: "Masuk",
    dashboard: "Dashboard",
    admin: "Admin",
    homeAria: "Beranda Etalase",
  },
  locale: {
    switchToEn: "English",
    switchToId: "Indonesia",
    label: "Bahasa",
  },
  hero: {
    line1Before: "Kerja",
    line1Brand: "Lebih Cerdas",
    line2: "Bukan Lebih Keras",
    cta: "Mulai Sekarang!",
    previewAlt: "Preview storefront di laptop",
  },
  templates: {
    titleBefore: "Template yang Cocok",
    titleAfter: "untuk",
    titleBrand: "Tokomu",
    exploreTitle: "Jelajahi Lainnya",
    exploreSubtitle: "Lihat semua template di library",
  },
  faq: {
    titleBefore: "Pertanyaan yang",
    titleBrand: "Sering Diajukan",
    subtitle:
      "Jawaban singkat soal setup toko, template, dan publikasi. Butuh detail lebih dalam? Lanjut ke dokumentasi.",
    docsCta: "Baca Dokumentasi",
    items: [
      {
        q: "Apa itu Etalase?",
        a: "Etalase adalah platform storefront builder untuk merchant. Kamu pilih template, kustomisasi tampilan, isi katalog, lalu publish toko ke subdomain sendiri.",
      },
      {
        q: "Bagaimana cara buat toko pertama?",
        a: "Login, buka Dashboard, lalu buat store baru dengan nama dan slug. Setelah toko dibuat, pilih template dan mulai kustomisasi dari editor.",
      },
      {
        q: "Apakah semua template berbayar?",
        a: "Tidak. Ada template gratis dan berbayar. Template yang sudah kamu miliki atau yang gratis bisa diaktifkan langsung ke toko.",
      },
      {
        q: "Bisa kustomisasi desain sampai sejauh mana?",
        a: "Di editor kamu bisa ubah section, warna, tipografi, gambar, teks, dan CTA. Perubahan langsung terlihat di preview desktop maupun mobile.",
      },
      {
        q: "Bagaimana cara toko saya live?",
        a: "Aktifkan template di toko, pastikan produk sudah siap, lalu gunakan Live Store. Toko akan tersedia di subdomain berdasarkan slug yang kamu pilih.",
      },
      {
        q: "Di mana saya bisa baca panduan lengkap?",
        a: "Semua langkah setup, template, kustomisasi, katalog, dan operasional ada di dokumentasi Etalase. Tombol di bawah mengarah ke sana.",
      },
    ],
  },
  footer: {
    rights: "© 2026 Etalase Inc. Hak cipta dilindungi.",
  },
  auth: {
    loginTitle: "Masuk ke Etalase",
    loginLine1: "Hai, Selamat Datang",
    loginLine2Prefix: "Ke ",
    loginLine2Suffix: "!",
    loginHeadingBrand: "Etalase",
    registerTitle: "Daftar Etalase",
    registerLine1: "Buat akun",
    registerHeadingBrand: "Merchant",
    email: "Email",
    password: "Password",
    confirmPassword: "Konfirmasi password",
    nameOptional: "Nama (opsional)",
    submitLogin: "Masuk",
    submitRegister: "Daftar",
    pending: "Memproses...",
    or: "atau",
    googleLogin: "Masuk dengan Google",
    googleRegister: "Daftar dengan Google",
    noAccount: "Belum punya akun?",
    hasAccount: "Sudah punya akun?",
    registerLink: "Daftar",
    loginLink: "Masuk",
    passwordHint:
      "Min. 8 karakter, huruf besar & kecil, plus angka atau simbol.",
    strengthLabel: "Kekuatan password",
    strengthWeak: "Lemah",
    strengthFair: "Cukup",
    strengthStrong: "Kuat",
    showPassword: "Tampilkan password",
    hidePassword: "Sembunyikan password",
  },
  templatesPage: {
    title: "Template Library",
  },
} as const

const en = {
  nav: {
    home: "Home",
    template: "Template",
    faq: "FAQ",
    login: "Login",
    dashboard: "Dashboard",
    admin: "Admin",
    homeAria: "Etalase home",
  },
  locale: {
    switchToEn: "English",
    switchToId: "Indonesia",
    label: "Language",
  },
  hero: {
    line1Before: "Work",
    line1Brand: "Smarter",
    line2: "Not Harder",
    cta: "Get Yours Now!",
    previewAlt: "Storefront preview on a laptop",
  },
  templates: {
    titleBefore: "Template That Might Suit",
    titleAfter: "To Your",
    titleBrand: "Store",
    exploreTitle: "Explore More",
    exploreSubtitle: "Browse all templates in the library",
  },
  faq: {
    titleBefore: "Frequently Asked",
    titleBrand: "Questions",
    subtitle:
      "Short answers about store setup, templates, and publishing. Need more detail? Head to the docs.",
    docsCta: "Read Documentation",
    items: [
      {
        q: "What is Etalase?",
        a: "Etalase is a storefront builder for merchants. Pick a template, customize the look, add your catalog, then publish your store on your own subdomain.",
      },
      {
        q: "How do I create my first store?",
        a: "Sign in, open the Dashboard, then create a new store with a name and slug. After that, choose a template and start customizing in the editor.",
      },
      {
        q: "Are all templates paid?",
        a: "No. There are free and paid templates. Free templates and ones you already own can be activated on your store right away.",
      },
      {
        q: "How far can I customize the design?",
        a: "In the editor you can change sections, colors, typography, images, text, and CTAs. Updates show instantly in desktop and mobile preview.",
      },
      {
        q: "How do I take my store live?",
        a: "Activate a template on your store, make sure products are ready, then use Live Store. Your shop will be available on the subdomain from your slug.",
      },
      {
        q: "Where can I find the full guide?",
        a: "Setup, templates, customization, catalog, and operations are all covered in the Etalase docs. The button below takes you there.",
      },
    ],
  },
  footer: {
    rights: "© 2026 Etalase Inc. All rights reserved.",
  },
  auth: {
    loginTitle: "Sign in to Etalase",
    loginLine1: "Hi, Welcome",
    loginLine2Prefix: "To ",
    loginLine2Suffix: "!",
    loginHeadingBrand: "Etalase",
    registerTitle: "Create your account",
    registerLine1: "Create a",
    registerHeadingBrand: "Merchant account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    nameOptional: "Name (optional)",
    submitLogin: "Sign in",
    submitRegister: "Sign up",
    pending: "Please wait...",
    or: "or",
    googleLogin: "Continue with Google",
    googleRegister: "Sign up with Google",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    registerLink: "Sign up",
    loginLink: "Sign in",
    passwordHint:
      "Min. 8 characters, upper & lower case, plus a number or symbol.",
    strengthLabel: "Password strength",
    strengthWeak: "Weak",
    strengthFair: "Fair",
    strengthStrong: "Strong",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },
  templatesPage: {
    title: "Template Library",
  },
} as const

export type Messages = typeof id

export const messages: Record<Locale, Messages> = {
  id,
  en: en as unknown as Messages,
}

export function getMessages(locale: Locale): Messages {
  return messages[locale]
}
