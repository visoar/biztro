import * as ToggleGroup from "@radix-ui/react-toggle-group"
import React from "react"

export const ToolbarToggleGroup = ({
  children,
  ...props
}: ToggleGroup.ToggleGroupSingleProps) => {
  return (
    <ToggleGroup.Root
      {...props}
      className="inline-flex rounded bg-gray-100 p-0.5"
    >
      {children}
    </ToggleGroup.Root>
  )
}

export const ToolbarToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroup.ToggleGroupItemProps
>(({ children, ...props }, forwardRef) => {
  return (
    <ToggleGroup.ToggleGroupItem
      ref={forwardRef}
      {...props}
      className="flex h-6 w-6 items-center justify-center rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-600 radix-state-on:bg-white radix-state-on:shadow"
    >
      {children}
    </ToggleGroup.ToggleGroupItem>
  )
})

ToolbarToggleGroupItem.displayName = "ToolbarToggleGroupItem"
