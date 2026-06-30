import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const templates = [
    {
      name: "Bold",
      slug: "bold",
      description: "Template modern dengan layout penuh dan tipografi kuat. Cocok untuk fashion, olahraga, dan lifestyle.",
      price: 2900,
      previewUrl: null,
      published: true,
    },
    {
      name: "Bento",
      slug: "bento",
      description: "Layout grid bento yang clean dan playful. Cocok untuk produk digital dan lifestyle brand.",
      price: 1900,
      previewUrl: null,
      published: true,
    },
    {
      name: "Minimal",
      slug: "minimal",
      description: "Design minimalis dengan fokus pada produk. Cocok untuk semua jenis store.",
      price: 0,
      previewUrl: null,
      published: true,
    },
  ]

  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    })
    console.log(`Seeded template: ${t.name}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
