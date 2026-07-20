"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowUpRight, Box, ChartLine, ShoppingCart, Users } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMessages } from "@/features/i18n/LocaleProvider"
import { dashboardCard, dashboardSectionTitle } from "./dashboard-ui"

type StoreDashboardBentoStats = {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalCustomers: number
  totalSoldItems: number
  revenueTotal: number
}

const OUTER_CIRC = 390
const INNER_CIRC = 276

function formatCurrency(value: number) {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`
}

function KpiCard({
  title,
  value,
  sublabel,
  icon: Icon,
  tone = "default",
  index = 0,
}: {
  title: string
  value: string
  sublabel?: string
  icon: LucideIcon
  tone?: "default" | "primary"
  index?: number
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        dashboardCard,
        "relative overflow-hidden p-5",
        tone === "primary"
          ? "border-transparent bg-linear-to-br from-[#3f4fe0] via-[#4e4cff] to-[#6a54ff] text-white"
          : "",
      )}
    >
      {tone === "primary" && (
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/12 via-transparent to-[#1f2ecf]/25"
          aria-hidden
        />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={cn("text-xs font-medium", tone === "primary" ? "text-white/80" : "text-dash-muted")}>
            {title}
          </p>
          <p
            className={cn(
              "mt-2 truncate text-3xl font-bold tabular-nums tracking-tight",
              tone === "primary" ? "text-white" : "text-dash-ink",
            )}
          >
            {value}
          </p>
          {sublabel && (
            <p className={cn("mt-1 text-xs", tone === "primary" ? "text-white/75" : "text-dash-muted")}>
              {sublabel}
            </p>
          )}
        </div>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            tone === "primary" ? "bg-white/15 text-white" : "bg-dash-primary-light text-dash-primary",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
    </motion.article>
  )
}

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(dashboardCard, "p-5")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-dash-ink">{title}</p>
          {subtitle && <p className="mt-1 text-xs text-dash-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </motion.section>
  )
}

function ProductStatistic({
  soldItems,
  categories,
  labels,
}: {
  soldItems: number
  categories: number
  labels: {
    productStat: string
    sold: string
    totalProductsSold: string
    soldItems: string
    categories: string
  }
}) {
  const reduceMotion = useReducedMotion()
  const denominator = Math.max(soldItems + categories, 1)
  const soldPercent = Math.round((soldItems / denominator) * 100)
  const catPercent = 100 - soldPercent
  const outerDash = Math.round((soldPercent / 100) * OUTER_CIRC)
  const innerDash = Math.round((catPercent / 100) * INNER_CIRC)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center">
      <div className="flex items-center justify-center">
        <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label={labels.productStat}>
          <circle cx="90" cy="90" r="62" fill="none" stroke="rgba(232,234,239,1)" strokeWidth="14" />
          <motion.circle
            cx="90"
            cy="90"
            r="62"
            fill="none"
            stroke="rgba(91,75,255,1)"
            strokeWidth="14"
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            initial={
              reduceMotion
                ? false
                : { strokeDasharray: `0 ${OUTER_CIRC}`, opacity: 0.4 }
            }
            animate={{
              strokeDasharray: `${outerDash} ${OUTER_CIRC}`,
              opacity: 1,
            }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.circle
            cx="90"
            cy="90"
            r="44"
            fill="none"
            stroke="rgba(91,75,255,0.38)"
            strokeWidth="14"
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            initial={
              reduceMotion
                ? false
                : { strokeDasharray: `0 ${INNER_CIRC}`, opacity: 0.4 }
            }
            animate={{
              strokeDasharray: `${innerDash} ${INNER_CIRC}`,
              opacity: 1,
            }}
            transition={{ duration: 1.05, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.text
            x="90"
            y="86"
            textAnchor="middle"
            className="fill-dash-ink"
            style={{ fontSize: 22, fontWeight: 700 }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.75 }}
          >
            {soldPercent}%
          </motion.text>
          <motion.text
            x="90"
            y="106"
            textAnchor="middle"
            className="fill-dash-muted"
            style={{ fontSize: 10, fontWeight: 500 }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.9 }}
          >
            {labels.sold}
          </motion.text>
        </svg>
      </div>
      <motion.div
        className="space-y-3"
        initial={reduceMotion ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p className="text-3xl font-bold tabular-nums tracking-tight text-dash-ink">
            {soldItems.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-dash-muted">{labels.totalProductsSold}</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-dash-ink">
              <span className="h-2 w-2 rounded-full bg-[#5b4bff]" aria-hidden />
              {labels.soldItems}
            </span>
            <span className="tabular-nums text-dash-ink">{soldItems.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-dash-ink">
              <span className="h-2 w-2 rounded-full bg-[#5b4bff]/40" aria-hidden />
              {labels.categories}
            </span>
            <span className="tabular-nums text-dash-ink">{categories.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function StoreDashboardBento({
  storeId,
  stats,
}: {
  storeId: string
  stats: StoreDashboardBentoStats
}) {
  const t = useMessages().pages.storeHome

  return (
    <div className="grid grid-cols-12 gap-5 lg:gap-6">
      <div className="col-span-12 lg:col-span-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <KpiCard
            title={t.totalSales}
            value={formatCurrency(stats.revenueTotal)}
            sublabel={t.totalSalesHint}
            icon={ChartLine}
            tone="primary"
            index={0}
          />
          <KpiCard
            title={t.totalOrders}
            value={stats.totalOrders.toLocaleString("id-ID")}
            sublabel={t.totalOrdersHint}
            icon={ShoppingCart}
            index={1}
          />
          <KpiCard
            title={t.totalSold}
            value={stats.totalSoldItems.toLocaleString("id-ID")}
            sublabel={t.totalSoldHint}
            icon={Box}
            index={2}
          />
          <KpiCard
            title={t.totalCustomers}
            value={stats.totalCustomers.toLocaleString("id-ID")}
            sublabel={t.totalCustomersHint}
            icon={Users}
            index={3}
          />
        </div>

        <div className="mt-5 lg:mt-6">
          <p className={dashboardSectionTitle}>Quick Actions</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { href: `/stores/${storeId}/products`, label: t.quickProducts },
              { href: `/stores/${storeId}/orders`, label: t.quickOrders },
              { href: `/stores/${storeId}/customers`, label: t.quickCustomers },
              { href: `/stores/${storeId}/customize`, label: t.quickCustomize },
              { href: `/stores/${storeId}/settings`, label: t.quickSettings },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex items-center gap-1 rounded-full bg-dash-surface px-4 py-2 text-sm font-medium text-dash-ink shadow-[0_1px_1.5px_rgba(0,0,0,0.08)] hover:bg-dash-primary-light/40"
              >
                {action.label}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <div className="grid gap-5 lg:gap-6">
          <Panel
            title={t.productStat}
            subtitle={t.productStatHint}
            action={
              <span className="rounded-full bg-dash-bg px-3 py-1 text-[11px] font-semibold text-dash-muted">
                {t.realData}
              </span>
            }
          >
            <ProductStatistic
              soldItems={stats.totalSoldItems}
              categories={stats.totalCategories}
              labels={{
                productStat: t.productStat,
                sold: t.sold,
                totalProductsSold: t.totalProductsSold,
                soldItems: t.soldItems,
                categories: t.categories,
              }}
            />
          </Panel>
        </div>
      </div>
    </div>
  )
}
