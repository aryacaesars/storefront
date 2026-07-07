import type { PageTemplate } from "@/themes/engine/schema"

export const DEFAULT_MINIMALIST_ABOUT: PageTemplate = {
  order: ["creative-direction", "milestones"],
  sections: {
    "creative-direction": {
      type: "creative-direction",
      blocks: [
        {
          id: "tm-1",
          type: "team-member",
          settings: {
            name: "Aurora Chen",
            role: "Creative Director",
            imageClass: "bg-gradient-to-br from-stone-300 to-stone-500",
            bio: "Trained in Milan, Aurora brings a decade of editorial experience to every collection.",
          },
        },
        {
          id: "tm-2",
          type: "team-member",
          settings: {
            name: "Marcus Lin",
            role: "Head of Design",
            imageClass: "bg-gradient-to-br from-slate-400 to-slate-600",
            bio: "Obsessed with proportion and restraint, Marcus shapes the silhouettes that define the brand.",
          },
        },
        {
          id: "tm-3",
          type: "team-member",
          settings: {
            name: "Sofia Valdez",
            role: "Lead Developer",
            imageClass: "bg-gradient-to-br from-neutral-300 to-neutral-500",
            bio: "Sofia bridges craft and code, ensuring the digital experience matches the tactile quality of every piece.",
          },
        },
      ],
    },
    milestones: {
      type: "milestones",
      blocks: [
        {
          id: "ms-1",
          type: "milestone",
          settings: {
            year: "2020",
            title: "Founded",
            description:
              "Aurora Minimal began as a vision for quiet luxury — objects that outlast trends.",
            imageClass: "bg-gradient-to-br from-stone-200 to-stone-400",
          },
        },
        {
          id: "ms-2",
          type: "milestone",
          settings: {
            year: "2022",
            title: "Aurora Capsule",
            description:
              "Our debut collection sold out in 48 hours, signalling a hunger for intentional design.",
            imageClass: "bg-gradient-to-br from-slate-300 to-slate-500",
          },
        },
        {
          id: "ms-3",
          type: "milestone",
          settings: {
            year: "2024",
            title: "Global Reach",
            description:
              "Expanded to 12 countries, each market embraced the philosophy of less but better.",
            imageClass: "bg-gradient-to-br from-neutral-200 to-neutral-400",
          },
        },
        {
          id: "ms-4",
          type: "milestone",
          settings: {
            year: "2026",
            title: "Digital Storefront",
            description:
              "Launched our own platform to bring the full Aurora experience directly to customers worldwide.",
            imageClass: "bg-gradient-to-br from-stone-400 to-stone-600",
          },
        },
      ],
    },
  },
}
