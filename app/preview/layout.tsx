import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Preview Template" }

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Link
        href="/templates"
        aria-label="Kembali ke daftar template"
        className="fixed top-6 left-6 z-[100] flex items-center justify-center rounded-full border border-gray-200 bg-white/80 p-3 text-gray-800 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      {children}
    </>
  )
}
