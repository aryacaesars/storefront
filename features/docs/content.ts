import type { Locale } from "@/features/i18n/config"

export type DocsBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "tip"; text: string }

export type DocsSection = {
  id: string
  heading: string
  blocks: DocsBlock[]
}

export type DocsCategory = {
  id: string
  title: string
  description: string
}

export type DocsArticle = {
  slug: string
  title: string
  description: string
  categoryId: string
  sections: DocsSection[]
}

type DocsContent = {
  categories: DocsCategory[]
  articles: DocsArticle[]
}

const EN: DocsContent = {
  categories: [
    {
      id: "memulai",
      title: "Getting Started",
      description: "Get to know Etalase and create your first store.",
    },
    {
      id: "template",
      title: "Templates",
      description: "Choose, activate, and manage your storefront design.",
    },
    {
      id: "kustomisasi",
      title: "Customization",
      description: "Edit sections, logo, colors, and store appearance.",
    },
    {
      id: "katalog",
      title: "Catalog",
      description: "Manage products and categories for sale.",
    },
    {
      id: "operasional",
      title: "Operations",
      description: "Process orders and manage customers.",
    },
    {
      id: "live-store",
      title: "Live Store",
      description: "Subdomain, publishing, and your online store.",
    },
  ],
  articles: [
    {
      slug: "memulai/pengenalan",
      title: "Introduction to Etalase",
      description:
        "What Etalase is, who it's for, and the basic merchant workflow.",
      categoryId: "memulai",
      sections: [
        {
          id: "apa-itu-etalase",
          heading: "What is Etalase?",
          blocks: [
            {
              type: "paragraph",
              text: "Etalase is a multi-tenant storefront builder platform. You create an online store with your own subdomain, choose a template, manage your catalog, and accept orders — without writing code.",
            },
            {
              type: "paragraph",
              text: "The Etalase dashboard is used by merchants (store owners). Shoppers browse the public storefront, for example namatoko.etalase.com.",
            },
          ],
        },
        {
          id: "alur-kerja",
          heading: "Quick workflow",
          blocks: [
            {
              type: "bullets",
              items: [
                "Sign up / log in to your merchant account",
                "Create a store (name + subdomain slug)",
                "Choose & activate a template",
                "Customize brand and page content",
                "Add products & categories",
                "Share your store subdomain with customers",
              ],
            },
            {
              type: "tip",
              text: "Start with one store first. Once the workflow is smooth, you can add more stores from the same dashboard.",
            },
          ],
        },
      ],
    },
    {
      slug: "memulai/buat-toko",
      title: "Creating a new store",
      description: "How to create a store, choose a slug, and open the store dashboard.",
      categoryId: "memulai",
      sections: [
        {
          id: "langkah-buat",
          heading: "Steps to create a store",
          blocks: [
            {
              type: "paragraph",
              text: "From the dashboard, open create new store. Enter the store name and slug. The slug becomes part of your storefront subdomain (example: slug sepatu-arya → sepatu-arya.etalase.com).",
            },
            {
              type: "bullets",
              items: [
                "Store name appears in the storefront header and page metadata",
                "Slug must be unique, lowercase, with no spaces",
                "After creation, the store appears in the dashboard sidebar",
              ],
            },
          ],
        },
        {
          id: "setelah-dibuat",
          heading: "After the store is created",
          blocks: [
            {
              type: "paragraph",
              text: "Open the store submenu for Store Dashboard, Templates, Products, Categories, Orders, Customers, Customization, and Settings.",
            },
            {
              type: "tip",
              text: "Slugs are hard to change once the store has been promoted. Choose a slug that is short and easy to remember.",
            },
          ],
        },
      ],
    },
    {
      slug: "template/browse-dan-aktifkan",
      title: "Browse and activate templates",
      description: "How to choose marketplace templates and activate them for your store.",
      categoryId: "template",
      sections: [
        {
          id: "browse",
          heading: "Browse templates",
          blocks: [
            {
              type: "paragraph",
              text: "Open Browse Templates from the sidebar, or the Templates menu inside your store. Each template has a different visual style (for example Bento, Bold, Fashion, Minimalist).",
            },
            {
              type: "bullets",
              items: [
                "Preview shows sample pages before activation",
                "Some templates may require payment through checkout",
                "The active template determines storefront section layout",
              ],
            },
          ],
        },
        {
          id: "aktifkan",
          heading: "Activating a template",
          blocks: [
            {
              type: "paragraph",
              text: "From your store's Templates page, choose a template and activate it. Once active, open Customization to adjust content, colors, and logo.",
            },
            {
              type: "tip",
              text: "Switching templates can change section structure. Save / publish customization changes after switching templates.",
            },
          ],
        },
      ],
    },
    {
      slug: "kustomisasi/editor",
      title: "Customization editor",
      description: "How to use the canvas editor to manage sections and page content.",
      categoryId: "kustomisasi",
      sections: [
        {
          id: "membuka-editor",
          heading: "Opening the editor",
          blocks: [
            {
              type: "paragraph",
              text: "From the store submenu, open Customization. The editor shows a storefront preview (desktop/mobile) along with section panels and settings.",
            },
            {
              type: "bullets",
              items: [
                "Select a section on the canvas or in the layers panel to edit",
                "Change text, images, CTAs, and layout to match your theme",
                "Save a draft then publish so changes appear on the Live Store",
              ],
            },
          ],
        },
        {
          id: "section-umum",
          heading: "Commonly edited sections",
          blocks: [
            {
              type: "bullets",
              items: [
                "Hero — title, subtitle, product image, CTA button",
                "Category grid — bento category cards",
                "Product grid — trending / featured products",
                "Call to action — promo banner",
              ],
            },
            {
              type: "tip",
              text: "Use mobile preview mode to make sure typography and CTAs remain readable on small screens.",
            },
          ],
        },
      ],
    },
    {
      slug: "kustomisasi/logo-dan-brand",
      title: "Logo and brand",
      description: "Set your logo, store name, primary color, and brand appearance in the header.",
      categoryId: "kustomisasi",
      sections: [
        {
          id: "logo",
          heading: "Store logo",
          blocks: [
            {
              type: "paragraph",
              text: "Upload a logo in theme / brand settings. You can show the logo only, the store name text only, or both.",
            },
            {
              type: "bullets",
              items: [
                "Logo appears in the storefront header and Live Store favicon (if mode is not text-only)",
                "Without a logo image, the favicon uses the store name initials",
                "Logo scale can be adjusted to look proportional in the header",
              ],
            },
          ],
        },
        {
          id: "warna",
          heading: "Colors and typography",
          blocks: [
            {
              type: "paragraph",
              text: "Primary color is used for UI accents (buttons, badges, prices). Choose a color that contrasts with the template background so it stays readable.",
            },
            {
              type: "tip",
              text: "After changing the logo or color, publish the theme so the favicon and header on your subdomain update as well.",
            },
          ],
        },
      ],
    },
    {
      slug: "katalog/produk",
      title: "Managing products",
      description: "Add, edit, publish, and organize products in your store catalog.",
      categoryId: "katalog",
      sections: [
        {
          id: "tambah-produk",
          heading: "Adding products",
          blocks: [
            {
              type: "paragraph",
              text: "Open Products in the store submenu, then create a new product. Fill in name, slug, price, description, image, and publish status.",
            },
            {
              type: "bullets",
              items: [
                "Only published products appear on the storefront",
                "Product slug is used in the product detail URL",
                "Link products to categories so filters/collections stay organized",
              ],
            },
          ],
        },
        {
          id: "tips-katalog",
          heading: "Catalog tips",
          blocks: [
            {
              type: "tip",
              text: "Use photos with consistent aspect ratios so product grids look clean across all templates.",
            },
            {
              type: "paragraph",
              text: "Best-selling products may appear in the Trending section on the homepage, depending on your store's sales data.",
            },
          ],
        },
      ],
    },
    {
      slug: "katalog/kategori",
      title: "Managing categories",
      description: "Create categories to group products and enrich store navigation.",
      categoryId: "katalog",
      sections: [
        {
          id: "buat-kategori",
          heading: "Creating categories",
          blocks: [
            {
              type: "paragraph",
              text: "From the Categories menu, create a new category with a name and slug. Assign products to categories from the product form or category page.",
            },
            {
              type: "bullets",
              items: [
                "Categories help shoppers browse the catalog",
                "Some templates display category cards on the homepage",
                "Category slug must be unique per store",
              ],
            },
          ],
        },
        {
          id: "struktur",
          heading: "Organizing structure",
          blocks: [
            {
              type: "tip",
              text: "Keep the number of categories focused (for example 4–8) so the homepage grid doesn't feel crowded and navigation stays clear.",
            },
          ],
        },
      ],
    },
    {
      slug: "operasional/pesanan",
      title: "Managing orders",
      description: "View incoming orders from the storefront and follow up on their status.",
      categoryId: "operasional",
      sections: [
        {
          id: "daftar-order",
          heading: "Order list",
          blocks: [
            {
              type: "paragraph",
              text: "The Orders menu shows purchases from shoppers on the Live Store. Open order details to see items, totals, and customer data.",
            },
            {
              type: "bullets",
              items: [
                "Orders are created when shoppers complete checkout",
                "Payment status follows the checkout flow (for example Stripe)",
                "Monitor new orders regularly from the store dashboard",
              ],
            },
          ],
        },
        {
          id: "tindak-lanjut",
          heading: "Follow-up",
          blocks: [
            {
              type: "tip",
              text: "Save customer contact details from order details so you can confirm shipping outside the dashboard when needed.",
            },
          ],
        },
      ],
    },
    {
      slug: "operasional/pelanggan",
      title: "Managing customers",
      description: "View shopper accounts registered on your store storefront.",
      categoryId: "operasional",
      sections: [
        {
          id: "daftar-pelanggan",
          heading: "Customer list",
          blocks: [
            {
              type: "paragraph",
              text: "The Customers menu shows end users who have accounts on your store storefront. From here you can view profiles and related history.",
            },
            {
              type: "bullets",
              items: [
                "Shoppers can sign up / log in on the storefront (not Etalase merchant accounts)",
                "Customer data is separate per store (tenant)",
                "Use this data for more personalized after-sales service",
              ],
            },
          ],
        },
        {
          id: "privasi",
          heading: "Privacy",
          blocks: [
            {
              type: "tip",
              text: "Treat customer data as sensitive information. Do not share email addresses or shipping addresses outside fulfillment needs.",
            },
          ],
        },
      ],
    },
    {
      slug: "live-store/subdomain-dan-publikasi",
      title: "Subdomain and publishing",
      description: "How your store goes live via subdomain, publish themes, and verify results in the browser.",
      categoryId: "live-store",
      sections: [
        {
          id: "subdomain",
          heading: "Store subdomain",
          blocks: [
            {
              type: "paragraph",
              text: "Each store has a subdomain based on its slug. In development, this usually follows the pattern slug.localhost:3000. In production, it uses the slug on the platform root domain.",
            },
            {
              type: "bullets",
              items: [
                "The public storefront uses a different host from the dashboard (app / root domain)",
                "Live Store favicon follows the logo or store name initials",
                "Browser tab title uses the store name from theme metadata",
              ],
            },
          ],
        },
        {
          id: "publish",
          heading: "Publishing changes",
          blocks: [
            {
              type: "paragraph",
              text: "Changes in the customization editor must be published to appear on the Live Store. Make sure the active template and products you want to sell are published.",
            },
            {
              type: "tip",
              text: "After publishing, hard-refresh the storefront page. Favicons and assets are often cached by the browser.",
            },
          ],
        },
      ],
    },
  ],
}

const ID: DocsContent = {
  categories: [
    {
      id: "memulai",
      title: "Memulai",
      description: "Kenali Etalase dan buat toko pertama kamu.",
    },
    {
      id: "template",
      title: "Template",
      description: "Pilih, aktifkan, dan kelola desain storefront kamu.",
    },
    {
      id: "kustomisasi",
      title: "Kustomisasi",
      description: "Ubah section, logo, warna, dan tampilan toko.",
    },
    {
      id: "katalog",
      title: "Katalog",
      description: "Kelola produk dan kategori untuk dijual.",
    },
    {
      id: "operasional",
      title: "Operasional",
      description: "Proses pesanan dan kelola pelanggan.",
    },
    {
      id: "live-store",
      title: "Toko Live",
      description: "Subdomain, publikasi, dan toko online kamu.",
    },
  ],
  articles: [
    {
      slug: "memulai/pengenalan",
      title: "Pengenalan Etalase",
      description: "Apa itu Etalase, untuk siapa, dan alur kerja dasar merchant.",
      categoryId: "memulai",
      sections: [
        {
          id: "apa-itu-etalase",
          heading: "Apa itu Etalase?",
          blocks: [
            {
              type: "paragraph",
              text: "Etalase adalah platform storefront builder multi-tenant. Kamu bisa membuat toko online dengan subdomain sendiri, memilih template, mengelola katalog, dan menerima pesanan — tanpa perlu menulis kode.",
            },
            {
              type: "paragraph",
              text: "Dashboard Etalase digunakan oleh merchant (pemilik toko). Pembeli menjelajahi storefront publik, misalnya namatoko.etalase.com.",
            },
          ],
        },
        {
          id: "alur-kerja",
          heading: "Alur kerja singkat",
          blocks: [
            {
              type: "bullets",
              items: [
                "Daftar / masuk ke akun merchant kamu",
                "Buat toko (nama + slug subdomain)",
                "Pilih & aktifkan template",
                "Kustomisasi brand dan konten halaman",
                "Tambahkan produk & kategori",
                "Bagikan subdomain toko kamu ke pelanggan",
              ],
            },
            {
              type: "tip",
              text: "Mulai dengan satu toko dulu. Setelah alur kerjanya lancar, kamu bisa menambah toko lain dari dashboard yang sama.",
            },
          ],
        },
      ],
    },
    {
      slug: "memulai/buat-toko",
      title: "Membuat toko baru",
      description: "Cara membuat toko, memilih slug, dan membuka dashboard toko.",
      categoryId: "memulai",
      sections: [
        {
          id: "langkah-buat",
          heading: "Langkah-langkah membuat toko",
          blocks: [
            {
              type: "paragraph",
              text: "Dari dashboard, buka buat toko baru. Isi nama toko dan slug. Slug ini akan menjadi bagian dari subdomain storefront kamu (contoh: slug sepatu-arya → sepatu-arya.etalase.com).",
            },
            {
              type: "bullets",
              items: [
                "Nama toko muncul di header storefront dan metadata halaman",
                "Slug harus unik, huruf kecil, tanpa spasi",
                "Setelah dibuat, toko akan muncul di sidebar dashboard",
              ],
            },
          ],
        },
        {
          id: "setelah-dibuat",
          heading: "Setelah toko dibuat",
          blocks: [
            {
              type: "paragraph",
              text: "Buka submenu toko untuk Dashboard Toko, Template, Produk, Kategori, Pesanan, Pelanggan, Kustomisasi, dan Pengaturan.",
            },
            {
              type: "tip",
              text: "Slug sulit diubah setelah toko dipromosikan. Pilih slug yang singkat dan mudah diingat.",
            },
          ],
        },
      ],
    },
    {
      slug: "template/browse-dan-aktifkan",
      title: "Jelajahi dan aktifkan template",
      description: "Cara memilih template dari marketplace dan mengaktifkannya untuk toko kamu.",
      categoryId: "template",
      sections: [
        {
          id: "browse",
          heading: "Jelajahi template",
          blocks: [
            {
              type: "paragraph",
              text: "Buka Jelajahi Template dari sidebar, atau menu Template di dalam toko kamu. Setiap template punya gaya visual berbeda (misalnya Bento, Bold, Fashion, Minimalist).",
            },
            {
              type: "bullets",
              items: [
                "Pratinjau menampilkan contoh halaman sebelum diaktifkan",
                "Beberapa template mungkin memerlukan pembayaran lewat checkout",
                "Template aktif menentukan tata letak section storefront",
              ],
            },
          ],
        },
        {
          id: "aktifkan",
          heading: "Mengaktifkan template",
          blocks: [
            {
              type: "paragraph",
              text: "Dari halaman Template toko kamu, pilih template dan aktifkan. Setelah aktif, buka Kustomisasi untuk mengatur konten, warna, dan logo.",
            },
            {
              type: "tip",
              text: "Mengganti template bisa mengubah struktur section. Simpan / publish perubahan kustomisasi setelah mengganti template.",
            },
          ],
        },
      ],
    },
    {
      slug: "kustomisasi/editor",
      title: "Editor kustomisasi",
      description: "Cara menggunakan editor canvas untuk mengelola section dan konten halaman.",
      categoryId: "kustomisasi",
      sections: [
        {
          id: "membuka-editor",
          heading: "Membuka editor",
          blocks: [
            {
              type: "paragraph",
              text: "Dari submenu toko, buka Kustomisasi. Editor menampilkan pratinjau storefront (desktop/mobile) beserta panel section dan pengaturan.",
            },
            {
              type: "bullets",
              items: [
                "Pilih section di canvas atau di panel layer untuk diedit",
                "Ubah teks, gambar, CTA, dan layout sesuai tema kamu",
                "Simpan draft lalu publish agar perubahan muncul di Live Store",
              ],
            },
          ],
        },
        {
          id: "section-umum",
          heading: "Section yang sering diedit",
          blocks: [
            {
              type: "bullets",
              items: [
                "Hero — judul, subjudul, gambar produk, tombol CTA",
                "Grid kategori — kartu kategori bento",
                "Grid produk — produk trending / unggulan",
                "Call to action — banner promo",
              ],
            },
            {
              type: "tip",
              text: "Gunakan mode pratinjau mobile untuk memastikan tipografi dan CTA tetap terbaca di layar kecil.",
            },
          ],
        },
      ],
    },
    {
      slug: "kustomisasi/logo-dan-brand",
      title: "Logo dan brand",
      description: "Atur logo, nama toko, warna utama, dan tampilan brand di header.",
      categoryId: "kustomisasi",
      sections: [
        {
          id: "logo",
          heading: "Logo toko",
          blocks: [
            {
              type: "paragraph",
              text: "Unggah logo di pengaturan tema / brand. Kamu bisa menampilkan logo saja, teks nama toko saja, atau keduanya.",
            },
            {
              type: "bullets",
              items: [
                "Logo muncul di header storefront dan favicon Live Store (jika mode bukan teks saja)",
                "Tanpa gambar logo, favicon menggunakan inisial nama toko",
                "Skala logo bisa disesuaikan agar proporsional di header",
              ],
            },
          ],
        },
        {
          id: "warna",
          heading: "Warna dan tipografi",
          blocks: [
            {
              type: "paragraph",
              text: "Warna utama digunakan untuk aksen UI (tombol, badge, harga). Pilih warna yang kontras dengan background template agar tetap mudah dibaca.",
            },
            {
              type: "tip",
              text: "Setelah mengubah logo atau warna, publish tema agar favicon dan header di subdomain kamu ikut ter-update.",
            },
          ],
        },
      ],
    },
    {
      slug: "katalog/produk",
      title: "Mengelola produk",
      description: "Tambah, edit, publish, dan atur produk di katalog toko kamu.",
      categoryId: "katalog",
      sections: [
        {
          id: "tambah-produk",
          heading: "Menambahkan produk",
          blocks: [
            {
              type: "paragraph",
              text: "Buka Produk di submenu toko, lalu buat produk baru. Isi nama, slug, harga, deskripsi, gambar, dan status publish.",
            },
            {
              type: "bullets",
              items: [
                "Hanya produk yang di-publish yang muncul di storefront",
                "Slug produk digunakan di URL detail produk",
                "Hubungkan produk ke kategori agar filter/koleksi tetap teratur",
              ],
            },
          ],
        },
        {
          id: "tips-katalog",
          heading: "Tips katalog",
          blocks: [
            {
              type: "tip",
              text: "Gunakan foto dengan rasio aspek yang konsisten agar grid produk terlihat rapi di semua template.",
            },
            {
              type: "paragraph",
              text: "Produk terlaris bisa muncul di section Trending pada homepage, tergantung data penjualan toko kamu.",
            },
          ],
        },
      ],
    },
    {
      slug: "katalog/kategori",
      title: "Mengelola kategori",
      description: "Buat kategori untuk mengelompokkan produk dan memperkaya navigasi toko.",
      categoryId: "katalog",
      sections: [
        {
          id: "buat-kategori",
          heading: "Membuat kategori",
          blocks: [
            {
              type: "paragraph",
              text: "Dari menu Kategori, buat kategori baru dengan nama dan slug. Tetapkan produk ke kategori dari form produk atau halaman kategori.",
            },
            {
              type: "bullets",
              items: [
                "Kategori membantu pembeli menjelajahi katalog",
                "Beberapa template menampilkan kartu kategori di homepage",
                "Slug kategori harus unik per toko",
              ],
            },
          ],
        },
        {
          id: "struktur",
          heading: "Mengatur struktur",
          blocks: [
            {
              type: "tip",
              text: "Jaga jumlah kategori tetap fokus (misalnya 4–8) agar grid homepage tidak terasa penuh dan navigasi tetap jelas.",
            },
          ],
        },
      ],
    },
    {
      slug: "operasional/pesanan",
      title: "Mengelola pesanan",
      description: "Lihat pesanan masuk dari storefront dan tindak lanjuti statusnya.",
      categoryId: "operasional",
      sections: [
        {
          id: "daftar-order",
          heading: "Daftar pesanan",
          blocks: [
            {
              type: "paragraph",
              text: "Menu Pesanan menampilkan pembelian dari pembeli di Live Store. Buka detail pesanan untuk melihat item, total, dan data pelanggan.",
            },
            {
              type: "bullets",
              items: [
                "Pesanan dibuat saat pembeli menyelesaikan checkout",
                "Status pembayaran mengikuti alur checkout (misalnya Stripe)",
                "Pantau pesanan baru secara rutin dari dashboard toko",
              ],
            },
          ],
        },
        {
          id: "tindak-lanjut",
          heading: "Tindak lanjut",
          blocks: [
            {
              type: "tip",
              text: "Simpan kontak pelanggan dari detail pesanan agar kamu bisa mengonfirmasi pengiriman di luar dashboard bila diperlukan.",
            },
          ],
        },
      ],
    },
    {
      slug: "operasional/pelanggan",
      title: "Mengelola pelanggan",
      description: "Lihat akun pembeli yang terdaftar di storefront toko kamu.",
      categoryId: "operasional",
      sections: [
        {
          id: "daftar-pelanggan",
          heading: "Daftar pelanggan",
          blocks: [
            {
              type: "paragraph",
              text: "Menu Pelanggan menampilkan pengguna akhir yang memiliki akun di storefront toko kamu. Dari sini kamu bisa melihat profil dan riwayat terkait.",
            },
            {
              type: "bullets",
              items: [
                "Pembeli bisa daftar / masuk di storefront (bukan akun merchant Etalase)",
                "Data pelanggan terpisah per toko (tenant)",
                "Gunakan data ini untuk layanan purna jual yang lebih personal",
              ],
            },
          ],
        },
        {
          id: "privasi",
          heading: "Privasi",
          blocks: [
            {
              type: "tip",
              text: "Perlakukan data pelanggan sebagai informasi sensitif. Jangan bagikan alamat email atau alamat pengiriman di luar kebutuhan fulfillment.",
            },
          ],
        },
      ],
    },
    {
      slug: "live-store/subdomain-dan-publikasi",
      title: "Subdomain dan publikasi",
      description: "Cara toko kamu live lewat subdomain, publish tema, dan memverifikasi hasilnya di browser.",
      categoryId: "live-store",
      sections: [
        {
          id: "subdomain",
          heading: "Subdomain toko",
          blocks: [
            {
              type: "paragraph",
              text: "Setiap toko memiliki subdomain berdasarkan slug-nya. Saat development, biasanya mengikuti pola slug.localhost:3000. Di production, menggunakan slug pada root domain platform.",
            },
            {
              type: "bullets",
              items: [
                "Storefront publik menggunakan host yang berbeda dari dashboard (app / root domain)",
                "Favicon Live Store mengikuti logo atau inisial nama toko",
                "Judul tab browser menggunakan nama toko dari metadata tema",
              ],
            },
          ],
        },
        {
          id: "publish",
          heading: "Mempublikasikan perubahan",
          blocks: [
            {
              type: "paragraph",
              text: "Perubahan di editor kustomisasi harus di-publish agar muncul di Live Store. Pastikan template aktif dan produk yang ingin kamu jual sudah dipublish.",
            },
            {
              type: "tip",
              text: "Setelah publish, hard-refresh halaman storefront. Favicon dan aset seringkali di-cache oleh browser.",
            },
          ],
        },
      ],
    },
  ],
}

const CONTENT: Record<Locale, DocsContent> = { en: EN, id: ID }

export function getDocsCategories(locale: Locale): DocsCategory[] {
  return CONTENT[locale].categories
}

export function getDocsArticles(locale: Locale): DocsArticle[] {
  return CONTENT[locale].articles
}

export function getCategoryById(locale: Locale, id: string): DocsCategory | undefined {
  return getDocsCategories(locale).find((c) => c.id === id)
}

export function getArticleBySlug(locale: Locale, slug: string): DocsArticle | undefined {
  return getDocsArticles(locale).find((a) => a.slug === slug)
}

export function getArticlesByCategory(locale: Locale, categoryId: string): DocsArticle[] {
  return getDocsArticles(locale).filter((a) => a.categoryId === categoryId)
}

/** Slugs are identical across locales — safe to read from any one locale. */
export function getAllArticleSlugs(): string[] {
  return EN.articles.map((a) => a.slug)
}

export function getArticleSlugParts(slug: string): string[] {
  return slug.split("/").filter(Boolean)
}

export function getAdjacentArticles(
  locale: Locale,
  slug: string,
): {
  prev: DocsArticle | null
  next: DocsArticle | null
} {
  const articles = getDocsArticles(locale)
  const index = articles.findIndex((a) => a.slug === slug)
  if (index < 0) return { prev: null, next: null }
  return {
    prev: index > 0 ? articles[index - 1]! : null,
    next: index < articles.length - 1 ? articles[index + 1]! : null,
  }
}

export function searchArticles(locale: Locale, query: string): DocsArticle[] {
  const articles = getDocsArticles(locale)
  const q = query.trim().toLowerCase()
  if (!q) return articles
  return articles.filter((article) => {
    const category = getCategoryById(locale, article.categoryId)
    const haystack = [
      article.title,
      article.description,
      article.slug,
      category?.title ?? "",
      ...article.sections.map((s) => s.heading),
    ]
      .join(" ")
      .toLowerCase()
    return haystack.includes(q)
  })
}
