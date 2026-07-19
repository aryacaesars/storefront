import { PrismaClient } from "@prisma/client"
import {
  syncMobileImagesFromDesktop,
  MOBILE_SETTINGS_KEY,
  mergeDeviceImages,
  resolveDeviceSettings,
  applyDevicePatch,
} from "../themes/engine/device-settings"

// smoke
{
  const desktop = [{ id: "a", src: "/new.png", x: 10, y: 10, width: 40, height: 50 }]
  const mobile = [
    { id: "a", src: "https://expired.r2.dev/old.png", x: 0, y: 5, width: 90, height: 70 },
  ]
  const merged = mergeDeviceImages(desktop, mobile) as { src: string; x: number }[]
  console.log("merge", merged[0]?.src, merged[0]?.x)

  const patched = applyDevicePatch(
    {
      images: [{ id: "old", src: "/old.png", x: 1 }],
      mobile: { images: [{ id: "old", src: "/old.png", x: 5 }] },
    },
    { images: [{ id: "new", src: "/fresh.png", x: 2, y: 2, width: 50, height: 50 }] },
    "desktop",
  )
  console.log("patch mobile", (patched.mobile as { images: unknown[] }).images)

  const resolved = resolveDeviceSettings(
    { images: desktop, mobile: { images: mobile, title1LabelXPct: 1 } },
    true,
  )
  console.log("resolve", (resolved?.images as { src: string }[])[0]?.src)
}

const prisma = new PrismaClient()

function walkBlocks(
  sections: Record<string, { blocks?: { settings?: Record<string, unknown> }[] }> | undefined,
): number {
  if (!sections) return 0
  let fixed = 0
  for (const section of Object.values(sections)) {
    for (const block of section.blocks ?? []) {
      const s = block.settings
      if (!s || typeof s !== "object") continue
      const mobile = s[MOBILE_SETTINGS_KEY]
      if (!mobile || typeof mobile !== "object") continue
      if (!Array.isArray(s.images)) continue
      const layer = mobile as Record<string, unknown>
      const before = JSON.stringify(layer.images)
      layer.images = syncMobileImagesFromDesktop(layer.images, s.images)
      if (JSON.stringify(layer.images) !== before) fixed++
    }
  }
  return fixed
}

async function main() {
  const stores = await prisma.storeThemeConfig.findMany()
  let fixed = 0
  for (const row of stores) {
    const cfg = row.configJson as {
      configs?: Record<
        string,
        { templates?: Record<string, { sections?: Record<string, unknown> }> }
      >
    }
    for (const theme of Object.values(cfg.configs ?? {})) {
      for (const page of Object.values(theme.templates ?? {})) {
        fixed += walkBlocks(
          page.sections as Record<
            string,
            { blocks?: { settings?: Record<string, unknown> }[] }
          >,
        )
      }
    }
    await prisma.storeThemeConfig.update({
      where: { storeId: row.storeId },
      data: { configJson: cfg },
    })
  }
  console.log("stores", stores.length, "blocks synced", fixed)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
