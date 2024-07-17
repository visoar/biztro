"use client"

import React, { useEffect } from "react"
import WebFont from "webfontloader"

export default function FontWrapper({
  fontFamily,
  children,
  className
}: {
  fontFamily: string | undefined
  children: React.ReactNode
  className?: string
}) {
  useEffect(() => {
    if (!fontFamily) return

    const isLoaded = hasFontLoaded(fontFamily)
    if (isLoaded) {
      // console.log(
      //   `Font ${fontFamily} is ${isLoaded ? "loaded" : "not loaded"}.`
      // )
      return
    }
    if (typeof window !== "undefined") {
      WebFont.load({
        google: {
          families: [`${fontFamily}:300,400,500,700`]
        }
      })
    }
  }, [fontFamily])

  return (
    <div
      className={className}
      style={{
        fontFamily: `'${fontFamily}'`
      }}
    >
      {children}
    </div>
  )
}

export function hasFontLoaded(fontFamily: string): boolean {
  const className = `wf-${fontFamily.toLowerCase().replace(/ /g, "")}-n4-active`
  // console.log("Checking for class", className)
  return document.documentElement.classList.contains(className)
}
