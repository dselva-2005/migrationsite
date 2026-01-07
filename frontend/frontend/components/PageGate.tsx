// components/PageGate.tsx
"use client"

import { usePageContent } from "@/providers/PageContentProvider"
import GlobalSpinner from "./GlobalSpinner"

export function PageGate({ children }: { children: React.ReactNode }) {
  const { loading } = usePageContent()

  return (
    <>
      {children}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="animate-spinner-delay">
            <GlobalSpinner />
          </div>
        </div>
      )}
    </>
  )
}
