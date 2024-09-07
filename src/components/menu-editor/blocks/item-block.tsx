import { useNode } from "@craftjs/core"
import type { Prisma } from "@prisma/client"
import type { RgbaColor } from "@uiw/react-color"
import Image from "next/image"

import ItemSettings from "@/components/menu-editor/blocks/item-settings"
import FontWrapper from "@/components/menu-editor/font-wrapper"
import type { getMenuItemsWithoutCategory } from "@/server/actions/item/queries"
import { cn } from "@/lib/utils"

export type ItemBlockProps = {
  item: Prisma.PromiseReturnType<typeof getMenuItemsWithoutCategory>[0]
  backgroundMode: "dark" | "light" | "none"
  itemFontSize?: number
  itemColor?: RgbaColor
  itemFontWeight?: string
  itemFontFamily?: string
  priceFontSize?: number
  priceColor?: RgbaColor
  priceFontWeight?: string
  priceFontFamily?: string
  descriptionFontFamily?: string
  descriptionColor?: RgbaColor
  showImage?: boolean
}

export default function ItemBlock({
  item,
  backgroundMode,
  itemFontSize,
  itemColor,
  itemFontWeight,
  itemFontFamily,
  priceFontSize,
  priceColor,
  priceFontWeight,
  priceFontFamily,
  descriptionFontFamily,
  descriptionColor,
  showImage
}: ItemBlockProps) {
  const {
    connectors: { connect }
  } = useNode()

  return (
    <div
      ref={ref => {
        if (ref) {
          connect(ref)
        }
      }}
      className={cn(backgroundMode === "none" ? "px-2 py-0" : "p-2")}
    >
      {item && (
        <ItemView
          {...{
            item,
            backgroundMode,
            itemFontSize,
            itemColor,
            itemFontWeight,
            itemFontFamily,
            priceFontSize,
            priceColor,
            priceFontWeight,
            priceFontFamily,
            descriptionFontFamily,
            descriptionColor,
            showImage
          }}
        />
      )}
    </div>
  )
}

ItemBlock.craft = {
  displayName: "Producto",
  props: {
    backgroundMode: "none",
    categoryFontSize: 20,
    categoryColor: { r: 38, g: 50, b: 56, a: 1 },
    categoryFontWeight: "700",
    categoryFontFamily: "Inter",
    categoryTextAlign: "left",
    itemFontSize: 16,
    itemColor: { r: 38, g: 50, b: 56, a: 1 },
    itemFontWeight: "500",
    itemFontFamily: "Inter",
    priceFontSize: 14,
    priceColor: { r: 38, g: 50, b: 56, a: 1 },
    priceFontWeight: "400",
    priceFontFamily: "Inter",
    descriptionFontFamily: "Inter",
    descriptionColor: { r: 38, g: 50, b: 56, a: 1 },
    showImage: true
  },
  related: {
    settings: ItemSettings
  }
}

export function ItemView({
  item,
  backgroundMode,
  itemFontSize,
  itemColor,
  itemFontWeight,
  itemFontFamily,
  priceFontSize,
  priceColor,
  priceFontWeight,
  priceFontFamily,
  descriptionFontFamily,
  descriptionColor,
  showImage
}: ItemBlockProps) {
  const hasVariants = item.variants.length > 1
  return (
    <div
      className={cn(
        "rounded-xl p-3",
        backgroundMode === "dark" && "bg-black/50 backdrop-blur-lg",
        backgroundMode === "light" && "bg-white/50 backdrop-blur-lg"
      )}
    >
      <div
        className={cn(
          "flex flex-row justify-between gap-2",
          hasVariants ? "items-start" : "items-center"
        )}
      >
        <div
          className={cn(
            "flex gap-3",
            hasVariants ? "flex-col-reverse" : "flex-row items-center"
          )}
        >
          {item.image && showImage && (
            <Image
              src={item.image}
              width={128}
              height={96}
              alt={item.name}
              layout="fixed"
              className="h-16 w-20 rounded object-cover"
              unoptimized
            ></Image>
          )}
          <div>
            <FontWrapper fontFamily={itemFontFamily}>
              <h3
                style={{
                  fontSize: `${itemFontSize}px`,
                  color: `rgba(${Object.values(itemColor ?? { r: 0, g: 0, b: 0, a: 1 })}`,
                  fontWeight: itemFontWeight
                }}
              >
                {item.name}
              </h3>
            </FontWrapper>
            <FontWrapper fontFamily={descriptionFontFamily}>
              <span
                className="line-clamp-3 text-pretty text-sm"
                style={{
                  color: `rgba(${Object.values(descriptionColor ?? { r: 0, g: 0, b: 0, a: 1 })}`
                }}
              >
                {item.description}
              </span>
            </FontWrapper>
          </div>
        </div>
        {item.variants.length > 1 ? (
          <div className="flex flex-col justify-end gap-1 self-end">
            {item.variants.map(variant => (
              <div
                key={variant.id}
                className="grid grid-cols-[1fr_60px] gap-1 text-right"
              >
                <FontWrapper fontFamily={descriptionFontFamily}>
                  <span
                    className="text-sm"
                    style={{
                      color: `rgba(${Object.values(descriptionColor ?? { r: 0, g: 0, b: 0, a: 1 })}`
                    }}
                  >
                    {variant.name}
                  </span>
                </FontWrapper>
                <FontWrapper fontFamily={priceFontFamily}>
                  <span
                    style={{
                      fontFamily: priceFontFamily,
                      fontSize: `${priceFontSize}px`,
                      color: `rgba(${Object.values(priceColor ?? { r: 0, g: 0, b: 0, a: 1 })}`,
                      fontWeight: priceFontWeight
                    }}
                  >
                    {variant.price % 1 === 0
                      ? variant.price
                      : variant.price.toFixed(2)}
                  </span>
                </FontWrapper>
              </div>
            ))}
          </div>
        ) : (
          <FontWrapper fontFamily={priceFontFamily}>
            <span
              style={{
                fontFamily: priceFontFamily,
                fontSize: `${priceFontSize}px`,
                color: `rgba(${Object.values(priceColor ?? { r: 0, g: 0, b: 0, a: 1 })}`,
                fontWeight: priceFontWeight
              }}
            >
              {/* If it has decimal values, show them in the price as well with 2 decimal places */}
              {(item.variants[0]?.price ?? 0) % 1 === 0
                ? item.variants[0]?.price
                : item.variants[0]?.price.toFixed(2)}
            </span>
          </FontWrapper>
        )}
      </div>
    </div>
  )
}
