import type { PageTemplate } from "@/themes/engine/schema"

export const DEFAULT_BENTO_ABOUT: PageTemplate = {
  order: ["creative-direction", "milestones"],
  sections: {
    "creative-direction": {
      type: "creative-direction",
      blocks: [
        {
          id: "tm-1",
          type: "team-member",
          settings: {
            name: "Lina Hartono",
            role: "Product Designer",
            imageClass: "bg-gradient-to-br from-[#b8c4e8] to-[#8fa3d4]",
            bio: "Shapes tactile interfaces where every surface invites touch and exploration.",
          },
        },
        {
          id: "tm-2",
          type: "team-member",
          settings: {
            name: "Rafi Kusuma",
            role: "Design Systems Lead",
            imageClass: "bg-gradient-to-br from-[#c5cdd8] to-[#9aa8bc]",
            bio: "Builds depth through shadow, light, and restraint — never decoration for its own sake.",
          },
        },
        {
          id: "tm-3",
          type: "team-member",
          settings: {
            name: "Maya Siregar",
            role: "Frontend Engineer",
            imageClass: "bg-gradient-to-br from-[#d0d8e8] to-[#a8b4cc]",
            bio: "Translates soft UI principles into performant, accessible storefront experiences.",
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
            year: "2021",
            title: "Studio Founded",
            description:
              "SoftForm began as a design lab exploring depth, light, and material honesty in digital commerce.",
            imageClass: "bg-gradient-to-br from-[#c8d0e0] to-[#9aaccc]",
          },
        },
        {
          id: "ms-2",
          type: "milestone",
          settings: {
            year: "2023",
            title: "First Collection",
            description:
              "Our debut line proved that soft interfaces can carry premium product storytelling.",
            imageClass: "bg-gradient-to-br from-[#b8c4e0] to-[#8a9ec4]",
          },
        },
        {
          id: "ms-3",
          type: "milestone",
          settings: {
            year: "2025",
            title: "Global Launch",
            description:
              "Expanded to twelve markets with a unified tactile design language across every touchpoint.",
            imageClass: "bg-gradient-to-br from-[#d0d6e4] to-[#a0aec4]",
          },
        },
      ],
    },
  },
}
