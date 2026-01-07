// ToasterClient.tsx
"use client"

import { Toaster } from "sonner" // or your toast library

export default function ToasterClient() {
  return (
    <Toaster
      position="top-center" // ✅ change from default bottom-right
      toastOptions={{
        duration: 3000, // optional: how long toast stays
        style: {
          fontSize: "14px",
          borderRadius: "8px",
          padding: "12px 16px",
        },
      }}
    />
  )
}
