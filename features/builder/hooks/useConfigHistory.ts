"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ThemeConfig } from "@/themes/engine/schema"
import type { PageType } from "@/themes/engine/resolve-page"
import {
  isPreviewScrollLocked,
  subscribePreviewScrollLock,
} from "@/features/builder/components/canvas/visual-frame"

const HISTORY_LIMIT = 50
const CHECKPOINT_DELAY_MS = 500

export interface HistoryEntry {
  config: ThemeConfig
  page: PageType
}

export interface ConfigHistory {
  config: ThemeConfig
  page: PageType
  setConfig: (next: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => void
  setPage: (next: PageType) => void
  undo: () => HistoryEntry | null
  redo: () => HistoryEntry | null
  canUndo: boolean
  canRedo: boolean
}

/**
 * Snapshot history for the builder config.
 *
 * A burst of edits (drag RAF commits, color slider, resize) collapses into a
 * single undo step: the baseline is captured on the first change and only
 * committed after the burst goes quiet, or as soon as a canvas drag releases.
 */
export function useConfigHistory(initial: HistoryEntry): ConfigHistory {
  const [config, setConfigState] = useState<ThemeConfig>(initial.config)
  const [page, setPageState] = useState<PageType>(initial.page)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  // Refs mirror the latest values so the stacks stay consistent even when
  // several edits land inside one React batch.
  const configRef = useRef(initial.config)
  const pageRef = useRef(initial.page)

  const pastRef = useRef<HistoryEntry[]>([])
  const futureRef = useRef<HistoryEntry[]>([])
  const pendingBaselineRef = useRef<HistoryEntry | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const syncFlags = useCallback(() => {
    setCanUndo(pastRef.current.length > 0 || pendingBaselineRef.current !== null)
    setCanRedo(futureRef.current.length > 0)
  }, [])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const commitCheckpoint = useCallback(() => {
    clearTimer()
    const baseline = pendingBaselineRef.current
    if (!baseline) return
    pendingBaselineRef.current = null

    pastRef.current = [...pastRef.current, baseline].slice(-HISTORY_LIMIT)
    futureRef.current = []
    syncFlags()
  }, [clearTimer, syncFlags])

  const setConfig = useCallback(
    (next: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: ThemeConfig) => ThemeConfig)(configRef.current)
          : next

      // No-op updaters (guards returning `prev`) must not open a checkpoint.
      if (resolved === configRef.current) return

      if (!pendingBaselineRef.current) {
        pendingBaselineRef.current = {
          config: configRef.current,
          page: pageRef.current,
        }
        // Any new edit invalidates the redo branch immediately, so the button
        // state matches what the user sees.
        futureRef.current = []
        syncFlags()
      }

      configRef.current = resolved
      setConfigState(resolved)

      clearTimer()
      timerRef.current = setTimeout(commitCheckpoint, CHECKPOINT_DELAY_MS)
    },
    [clearTimer, commitCheckpoint, syncFlags],
  )

  const setPage = useCallback((next: PageType) => {
    pageRef.current = next
    setPageState(next)
  }, [])

  const applyEntry = useCallback((entry: HistoryEntry) => {
    configRef.current = entry.config
    pageRef.current = entry.page
    setConfigState(entry.config)
    setPageState(entry.page)
  }, [])

  const undo = useCallback((): HistoryEntry | null => {
    commitCheckpoint()
    const past = pastRef.current
    if (past.length === 0) return null

    const entry = past[past.length - 1]
    pastRef.current = past.slice(0, -1)
    futureRef.current = [
      ...futureRef.current,
      { config: configRef.current, page: pageRef.current },
    ]
    applyEntry(entry)
    syncFlags()
    return entry
  }, [applyEntry, commitCheckpoint, syncFlags])

  const redo = useCallback((): HistoryEntry | null => {
    commitCheckpoint()
    const future = futureRef.current
    if (future.length === 0) return null

    const entry = future[future.length - 1]
    futureRef.current = future.slice(0, -1)
    pastRef.current = [
      ...pastRef.current,
      { config: configRef.current, page: pageRef.current },
    ].slice(-HISTORY_LIMIT)
    applyEntry(entry)
    syncFlags()
    return entry
  }, [applyEntry, commitCheckpoint, syncFlags])

  // A canvas drag commits once per frame — close the checkpoint the moment the
  // gesture releases instead of waiting out the debounce.
  useEffect(() => {
    let wasLocked = isPreviewScrollLocked()
    return subscribePreviewScrollLock(() => {
      const locked = isPreviewScrollLocked()
      if (wasLocked && !locked) commitCheckpoint()
      wasLocked = locked
    })
  }, [commitCheckpoint])

  useEffect(() => () => clearTimer(), [clearTimer])

  return {
    config,
    page,
    setConfig,
    setPage,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
