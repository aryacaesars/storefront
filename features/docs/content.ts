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
]

export const DOCS_ARTICLES: DocsArticle[] = [
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
