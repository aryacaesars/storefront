"use client"

import { useState } from "react"
import Link from "next/link"
import { Copy, Check, ExternalLink } from "lucide-react"
import { getStorefrontUrl } from "@/lib/tenant/storefront-url"

interface LiveEnvironmentCardProps {
  tenantSlug: string
  storefrontHost: string
}

export function LiveEnvironmentCard({
  tenantSlug,
  storefrontHost,
}: LiveEnvironmentCardProps) {
  const [copied, setCopied] = useState(false)
  const storefrontUrl = getStorefrontUrl(tenantSlug)

  async function handleCopy() {
    await navigator.clipboard.writeText(storefrontHost)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-indigo-600">
            Live Environment
          </p>
          <h2 className="text-lg font-semibold text-gray-900 leading-snug">
            Your Store is Running
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Live
        </span>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed -mt-2">
        Subdomain otomatis dari username bisnis Scalev Anda
        {tenantSlug ? (
          <>
            {" "}
            (<span className="font-medium text-gray-700">{tenantSlug}</span>).
          </>
        ) : (
          "."
        )}{" "}
        Atur detail di{" "}
        <Link href="/settings" className="font-medium text-indigo-600 hover:underline">
          Settings → Domain & URL
        </Link>
        .
      </p>

      <div className="flex items-center justify-between bg-gray-100 rounded-xl px-4 py-2.5 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </span>
          <span className="text-sm font-medium text-indigo-600 truncate">{storefrontHost}</span>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          aria-label="Copy subdomain"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <div className="flex gap-3">
        <a
          href={storefrontUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Visit Store
        </a>
        <Link
          href="/customize"
          className="flex-1 flex items-center justify-center py-2.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-sm font-semibold rounded-xl transition-colors"
        >
          Edit Storefront
        </Link>
      </div>
    </div>
  )
}
