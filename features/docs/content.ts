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

export const DOCS_CATEGORIES: DocsCategory[] = [
  {
    id: "memulai",
    title: "Memulai",
    description: "Kenalan dengan Etalase dan buat toko pertama.",
  },
  {
    id: "template",
    title: "Template",
    description: "Pilih, aktifkan, dan kelola desain storefront.",
  },
  {
    id: "kustomisasi",
    title: "Kustomisasi",
    description: "Edit section, logo, warna, dan tampilan toko.",
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
    title: "Live store",
    description: "Subdomain, publikasi, dan toko yang sudah online.",
  },
]

export const DOCS_ARTICLES: DocsArticle[] = [
  {
    slug: "memulai/pengenalan",
    title: "Pengenalan Etalase",
    description:
      "Apa itu Etalase, siapa yang cocok menggunakannya, dan alur kerja dasar merchant.",
    categoryId: "memulai",
    sections: [
      {
        id: "apa-itu-etalase",
        heading: "Apa itu Etalase?",
        blocks: [
          {
            type: "paragraph",
            text: "Etalase adalah platform storefront builder multi-tenant. Kamu membuat toko online dengan subdomain sendiri, memilih template, mengatur katalog, lalu menerima pesanan — tanpa menulis kode.",
          },
          {
            type: "paragraph",
            text: "Dashboard Etalase dipakai merchant (pemilik toko). Pembeli berbelanja di storefront publik, misalnya namatoko.etalase.com.",
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
              "Daftar / masuk ke akun merchant",
              "Buat toko (nama + slug subdomain)",
              "Pilih & aktifkan template",
              "Kustomisasi brand dan konten halaman",
              "Tambah produk & kategori",
              "Bagikan subdomain toko ke pelanggan",
            ],
          },
          {
            type: "tip",
            text: "Mulai dari satu toko dulu. Setelah alur lancar, kamu bisa menambah toko lain dari dashboard yang sama.",
          },
        ],
      },
    ],
  },
  {
    slug: "memulai/buat-toko",
    title: "Membuat toko baru",
    description: "Cara membuat store, memilih slug, dan membuka dashboard toko.",
    categoryId: "memulai",
    sections: [
      {
        id: "langkah-buat",
        heading: "Langkah membuat toko",
        blocks: [
          {
            type: "paragraph",
            text: "Dari Dashboard, buka buat toko baru. Isi nama toko dan slug. Slug menjadi bagian subdomain storefront (contoh: slug sepatu-arya → sepatu-arya.etalase.com).",
          },
          {
            type: "bullets",
            items: [
              "Nama toko tampil di header storefront dan metadata halaman",
              "Slug harus unik, huruf kecil, tanpa spasi",
              "Setelah dibuat, toko muncul di sidebar Dashboard",
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
            text: "Masuk ke submenu toko untuk Dashboard toko, Template, Produk, Kategori, Order, Pelanggan, Kustomisasi, dan Pengaturan.",
          },
          {
            type: "tip",
            text: "Slug sulit diubah setelah toko sudah dipromosikan. Pilih slug yang singkat dan mudah diingat.",
          },
        ],
      },
    ],
  },
  {
    slug: "template/browse-dan-aktifkan",
    title: "Browse dan aktifkan template",
    description: "Cara memilih template marketplace dan mengaktifkannya di toko.",
    categoryId: "template",
    sections: [
      {
        id: "browse",
        heading: "Browse template",
        blocks: [
          {
            type: "paragraph",
            text: "Buka Browse Template dari sidebar, atau menu Template di dalam toko. Setiap template punya gaya visual berbeda (misalnya Bento, Bold, Fashion, Minimalist).",
          },
          {
            type: "bullets",
            items: [
              "Preview menampilkan halaman contoh sebelum diaktifkan",
              "Beberapa template mungkin berbayar lewat checkout",
              "Template aktif menentukan layout section storefront",
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
            text: "Dari halaman Template toko, pilih template lalu aktifkan. Setelah aktif, buka Kustomisasi untuk menyesuaikan konten, warna, dan logo.",
          },
          {
            type: "tip",
            text: "Mengganti template bisa mengubah struktur section. Simpan / publish perubahan kustomisasi setelah ganti template.",
          },
        ],
      },
    ],
  },
  {
    slug: "kustomisasi/editor",
    title: "Editor kustomisasi",
    description: "Cara memakai canvas editor untuk mengatur section dan konten halaman.",
    categoryId: "kustomisasi",
    sections: [
      {
        id: "membuka-editor",
        heading: "Membuka editor",
        blocks: [
          {
            type: "paragraph",
            text: "Dari submenu toko, buka Kustomisasi. Editor menampilkan preview storefront (desktop/mobile) beserta panel section dan pengaturan.",
          },
          {
            type: "bullets",
            items: [
              "Pilih section di canvas atau panel layers untuk mengedit",
              "Ubah teks, gambar, CTA, dan layout sesuai tema",
              "Simpan draft lalu publish agar perubahan tampil di live store",
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
              "Hero — judul, subtitle, gambar produk, tombol CTA",
              "Category grid — kartu kategori bento",
              "Product grid — produk trending / unggulan",
              "Call to action — banner promo",
            ],
          },
          {
            type: "tip",
            text: "Gunakan mode mobile di preview untuk memastikan tipografi dan CTA tetap terbaca di layar kecil.",
          },
        ],
      },
    ],
  },
  {
    slug: "kustomisasi/logo-dan-brand",
    title: "Logo dan brand",
    description: "Atur logo, nama toko, warna primary, dan tampilan brand di header.",
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
              "Logo muncul di header storefront dan favicon live store (jika mode bukan text-only)",
              "Tanpa gambar logo, favicon memakai inisial nama toko",
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
            text: "Primary color dipakai untuk aksen UI (tombol, badge, harga). Pilih warna yang kontras dengan background template agar tetap terbaca.",
          },
          {
            type: "tip",
            text: "Setelah ganti logo atau warna, publish tema agar favicon dan header di subdomain ikut terbarui.",
          },
        ],
      },
    ],
  },
  {
    slug: "katalog/produk",
    title: "Mengelola produk",
    description: "Tambah, edit, publish, dan susun produk di katalog toko.",
    categoryId: "katalog",
    sections: [
      {
        id: "tambah-produk",
        heading: "Menambah produk",
        blocks: [
          {
            type: "paragraph",
            text: "Buka Produk di submenu toko, lalu buat produk baru. Isi nama, slug, harga, deskripsi, gambar, dan status publish.",
          },
          {
            type: "bullets",
            items: [
              "Hanya produk yang dipublish yang tampil di storefront",
              "Slug produk dipakai di URL detail produk",
              "Hubungkan produk ke kategori agar filter/koleksi lebih rapi",
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
            text: "Pakai foto dengan rasio konsisten agar grid produk terlihat rapi di semua template.",
          },
          {
            type: "paragraph",
            text: "Produk yang sering terjual bisa muncul di section Trending di homepage, tergantung data penjualan toko.",
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
            text: "Dari menu Kategori, buat kategori baru dengan nama dan slug. Assign produk ke kategori dari form produk atau halaman kategori.",
          },
          {
            type: "bullets",
            items: [
              "Kategori membantu pembeli menelusuri katalog",
              "Beberapa template menampilkan kartu kategori di homepage",
              "Slug kategori harus unik per toko",
            ],
          },
        ],
      },
      {
        id: "struktur",
        heading: "Menyusun struktur",
        blocks: [
          {
            type: "tip",
            text: "Jaga jumlah kategori tetap fokus (misalnya 4–8) supaya grid homepage tidak ramai dan navigasi tetap jelas.",
          },
        ],
      },
    ],
  },
  {
    slug: "operasional/pesanan",
    title: "Mengelola pesanan",
    description: "Melihat order masuk dari storefront dan menindaklanjuti statusnya.",
    categoryId: "operasional",
    sections: [
      {
        id: "daftar-order",
        heading: "Daftar order",
        blocks: [
          {
            type: "paragraph",
            text: "Menu Order menampilkan pesanan dari pembeli di live store. Buka detail order untuk melihat item, total, dan data pelanggan.",
          },
          {
            type: "bullets",
            items: [
              "Order dibuat saat pembeli menyelesaikan checkout",
              "Status pembayaran mengikuti alur checkout (misalnya Stripe)",
              "Pantau order baru secara berkala dari dashboard toko",
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
            text: "Simpan kontak pelanggan dari detail order agar mudah konfirmasi pengiriman di luar dashboard bila diperlukan.",
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
            text: "Menu Pelanggan menampilkan end user yang punya akun di storefront toko. Dari sini kamu bisa melihat profil dan riwayat terkait.",
          },
          {
            type: "bullets",
            items: [
              "Pembeli bisa daftar/masuk di storefront (bukan akun merchant Etalase)",
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
            text: "Perlakukan data pelanggan sebagai informasi sensitif. Jangan membagikan email atau alamat di luar keperluan fulfillment.",
          },
        ],
      },
    ],
  },
  {
    slug: "live-store/subdomain-dan-publikasi",
    title: "Subdomain dan publikasi",
    description: "Cara toko live lewat subdomain, publish tema, dan cek hasil di browser.",
    categoryId: "live-store",
    sections: [
      {
        id: "subdomain",
        heading: "Subdomain toko",
        blocks: [
          {
            type: "paragraph",
            text: "Setiap toko punya subdomain dari slug-nya. Di development, biasanya memakai pola slug.localhost:3000. Di production, memakai slug pada domain root platform.",
          },
          {
            type: "bullets",
            items: [
              "Storefront publik beda host dengan dashboard (app / root domain)",
              "Favicon live store mengikuti logo atau inisial nama toko",
              "Judul tab browser memakai nama toko dari metadata tema",
            ],
          },
        ],
      },
      {
        id: "publish",
        heading: "Publish perubahan",
        blocks: [
          {
            type: "paragraph",
            text: "Perubahan di editor kustomisasi perlu dipublish agar tampil di live store. Pastikan template aktif dan produk yang ingin dijual sudah berstatus publish.",
          },
          {
            type: "tip",
            text: "Setelah publish, hard-refresh halaman storefront. Favicon dan asset sering tertahan di cache browser.",
          },
        ],
      },
    ],
  },
]

export function getCategoryById(id: string): DocsCategory | undefined {
  return DOCS_CATEGORIES.find((c) => c.id === id)
}

export function getArticleBySlug(slug: string): DocsArticle | undefined {
  return DOCS_ARTICLES.find((a) => a.slug === slug)
}

export function getArticlesByCategory(categoryId: string): DocsArticle[] {
  return DOCS_ARTICLES.filter((a) => a.categoryId === categoryId)
}

export function getArticleSlugParts(slug: string): string[] {
  return slug.split("/").filter(Boolean)
}

export function getAdjacentArticles(slug: string): {
  prev: DocsArticle | null
  next: DocsArticle | null
} {
  const index = DOCS_ARTICLES.findIndex((a) => a.slug === slug)
  if (index < 0) return { prev: null, next: null }
  return {
    prev: index > 0 ? DOCS_ARTICLES[index - 1]! : null,
    next: index < DOCS_ARTICLES.length - 1 ? DOCS_ARTICLES[index + 1]! : null,
  }
}

export function searchArticles(query: string): DocsArticle[] {
  const q = query.trim().toLowerCase()
  if (!q) return DOCS_ARTICLES
  return DOCS_ARTICLES.filter((article) => {
    const category = getCategoryById(article.categoryId)
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
