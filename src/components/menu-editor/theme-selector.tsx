"use client"

import { useEffect, useState } from "react"
import { useEditor } from "@craftjs/core"
import type { Prisma } from "@prisma/client"
import { PopoverAnchor } from "@radix-ui/react-popover"
import { hexToRgba } from "@uiw/react-color"
import { useAtom } from "jotai"
import { ChevronsUpDown } from "lucide-react"

import { useSetUnsavedChanges } from "@/components/dashboard/unsaved-changes-provider"
import FontWrapper from "@/components/menu-editor/font-wrapper"
import SideSection from "@/components/menu-editor/side-section"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import type { getMenuById } from "@/server/actions/menu/queries"
import { colorThemeAtom, fontThemeAtom } from "@/lib/atoms"
import { colorThemes, fontThemes } from "@/lib/types"
import { ColorThemeEditor } from "./color-theme-editor"

export default function ThemeSelector({
  menu
}: {
  menu: Prisma.PromiseReturnType<typeof getMenuById>
}) {
  const { nodes, actions } = useEditor(state => ({
    nodes: state.nodes
  }))

  const [fontThemeId, setFontThemeId] = useAtom(fontThemeAtom)

  const [selectedFontTheme, setSelectedFontTheme] = useState<
    (typeof fontThemes)[0] | undefined
  >(undefined)

  const [colorThemeId, setColorThemeId] = useAtom(colorThemeAtom)
  const [selectedColorTheme, setSelectedColorTheme] = useState<
    (typeof colorThemes)[0] | undefined
  >(undefined)

  useEffect(() => {
    // When the theme changes, set the CSS variables to the new theme
    const selectedTheme = fontThemes.find(theme => theme.name === fontThemeId)
    if (!selectedTheme) return

    console.log("selectedTheme", selectedTheme)
    setSelectedFontTheme(selectedTheme)

    // traverse each node and update the theme
    if (!nodes) return

    for (const [key, value] of Object.entries(nodes)) {
      if (value.data?.props) {
        const { setProp: setIgnoreProp } = actions.history.ignore()
        switch (value.data.name) {
          case "HeaderBlock":
            setIgnoreProp(key, props => {
              return (props = Object.assign(props, {
                fontFamily: selectedTheme.fontDisplay
              }))
            })
            break
          case "CategoryBlock":
            setIgnoreProp(key, props => {
              return (props = Object.assign(props, {
                categoryFontFamily: selectedTheme.fontDisplay,
                itemFontFamily: selectedTheme.fontDisplay,
                priceFontFamily: selectedTheme.fontText,
                descriptionFontFamily: selectedTheme.fontText
              }))
            })
            break
          case "TextElement":
            setIgnoreProp(key, props => {
              return (props = Object.assign(props, {
                fontFamily: selectedTheme.fontText
              }))
            })
            break
          case "HeadingElement":
            setIgnoreProp(key, props => {
              return (props = Object.assign(props, {
                fontFamily: selectedTheme.fontDisplay
              }))
            })
            break
          default:
            break
        }
      }
    }
  }, [fontThemeId])

  useEffect(() => {
    const selectedTheme = colorThemes.find(theme => theme.name === colorThemeId)
    if (!selectedTheme) return

    setSelectedColorTheme(selectedTheme)

    // traverse each node and update the theme
    if (!nodes) return

    for (const [key, value] of Object.entries(nodes)) {
      if (value.data?.props) {
        const { setProp: setIgnoreProp } = actions.history.ignore()
        switch (value.data.name) {
          case "ContainerBlock":
            setIgnoreProp(key, props => {
              return (props = Object.assign(props, {
                color: hexToRgba(selectedTheme.textColor),
                backgroundColor: hexToRgba(selectedTheme.surfaceColor)
              }))
            })
            break
          case "HeaderBlock":
            setIgnoreProp(key, props => {
              return (props = Object.assign(props, {
                color: hexToRgba(selectedTheme.textColor),
                accentColor: hexToRgba(selectedTheme.brandColor)
              }))
            })
            break
          case "CategoryBlock":
            setIgnoreProp(key, props => {
              return (props = Object.assign(props, {
                categoryColor: hexToRgba(selectedTheme.accentColor),
                itemColor: hexToRgba(selectedTheme.textColor),
                priceColor: hexToRgba(selectedTheme.brandColor),
                descriptionColor: hexToRgba(selectedTheme.mutedColor)
              }))
            })
            break
          case "TextElement":
            setIgnoreProp(key, props => {
              return (props = Object.assign(props, {
                color: hexToRgba(selectedTheme.textColor)
              }))
            })
            break
          case "HeadingElement":
            setIgnoreProp(key, props => {
              return (props = Object.assign(props, {
                color: hexToRgba(selectedTheme.accentColor)
              }))
            })
            break
          default:
            break
        }
      }
    }
  }, [colorThemeId])

  // Verify if the menu theme has changed
  const { setUnsavedChanges, clearUnsavedChanges } = useSetUnsavedChanges()

  useEffect(() => {
    if (menu) {
      if (
        menu?.fontTheme !== fontThemeId ||
        menu?.colorTheme !== colorThemeId
      ) {
        setUnsavedChanges({
          message:
            "Tienes cambios sin guardar ¿Estás seguro de salir del Editor?",
          dismissButtonLabel: "Cancelar",
          proceedLinkLabel: "Descartar cambios",
          proceedAction: () => {
            setFontThemeId(menu.fontTheme)
            setColorThemeId(menu.colorTheme)
          }
        })
      } else {
        clearUnsavedChanges()
      }
    }
  }, [
    menu,
    fontThemeId,
    colorThemeId,
    setUnsavedChanges,
    setFontThemeId,
    setColorThemeId,
    clearUnsavedChanges
  ])

  return (
    <div className="flex flex-col py-3">
      <SideSection title="Tipografía">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex w-full flex-row items-center justify-between rounded-lg border border-gray-300 px-4 py-2 text-left shadow-sm transition-colors hover:border-violet-500">
              <div>
                <FontWrapper fontFamily={selectedFontTheme?.fontDisplay}>
                  <span className="text-base font-medium">
                    {selectedFontTheme?.fontDisplay}
                  </span>
                </FontWrapper>
                <FontWrapper fontFamily={selectedFontTheme?.fontText}>
                  <span className="text-sm">{selectedFontTheme?.fontText}</span>
                </FontWrapper>
              </div>
              <ChevronsUpDown className="size-4 text-gray-500" />
            </button>
          </PopoverTrigger>
          <PopoverAnchor asChild>
            <div className="-ml-44 size-4" />
          </PopoverAnchor>
          <PopoverContent className="-mt-20">
            <Label className="mb-4 block">Tipografías</Label>
            <div className="relative min-h-[400px]">
              <div className="no-scrollbar absolute inset-0 overflow-y-scroll overscroll-contain">
                <div className="flex flex-col items-center gap-2">
                  <RadioGroup
                    value={fontThemeId}
                    onValueChange={setFontThemeId}
                    className="w-full"
                  >
                    {fontThemes.map(theme => (
                      <label
                        key={theme.name}
                        className="cursor-pointer [&:has([data-state=checked])>div]:border-violet-500"
                      >
                        <RadioGroupItem
                          value={theme.name}
                          className="sr-only"
                        />
                        <div className="w-full rounded-lg border border-gray-300 px-4 py-2 hover:border-gray-500">
                          <FontWrapper fontFamily={theme.fontDisplay}>
                            <span className="text-base font-medium">
                              {theme.fontDisplay}
                            </span>
                          </FontWrapper>
                          <FontWrapper fontFamily={theme.fontText}>
                            <span className="text-sm">{theme.fontText}</span>
                          </FontWrapper>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </SideSection>
      <SideSection title="Colores">
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex w-full flex-row items-center justify-between rounded-lg border border-gray-300 px-4 py-2 text-left shadow-sm transition-colors hover:border-violet-500">
                <div className="isolate flex -space-x-1 overflow-hidden">
                  <ColorChip color={selectedColorTheme?.surfaceColor} />
                  <ColorChip color={selectedColorTheme?.brandColor} />
                  <ColorChip color={selectedColorTheme?.accentColor} />
                  <ColorChip color={selectedColorTheme?.textColor} />
                  <ColorChip color={selectedColorTheme?.mutedColor} />
                </div>
                <ChevronsUpDown className="size-4 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverAnchor asChild>
              <div className="-ml-32 size-4" />
            </PopoverAnchor>
            <PopoverContent className="-mt-20 max-w-[200px]">
              <Label className="mb-4 block">Colores</Label>
              <div className="relative h-[300px]">
                <div className="no-scrollbar absolute inset-0 overflow-y-scroll overscroll-contain">
                  <div className="flex flex-col items-center gap-2">
                    <RadioGroup
                      value={colorThemeId}
                      onValueChange={setColorThemeId}
                      className="w-full"
                    >
                      {colorThemes.map(theme => (
                        <label
                          key={theme.name}
                          className="cursor-pointer [&:has([data-state=checked])>div]:border-violet-500"
                        >
                          <RadioGroupItem
                            value={theme.name}
                            className="sr-only"
                          />
                          <div className="flex w-full flex-row justify-center space-y-1 rounded-lg border border-gray-300 px-4 py-2 hover:border-gray-500">
                            {/* <span className="text-sm font-medium">
                              {theme.name}
                            </span> */}
                            <div className="isolate flex -space-x-1 overflow-hidden">
                              <ColorChip color={theme.surfaceColor} />
                              <ColorChip color={theme.brandColor} />
                              <ColorChip color={theme.accentColor} />
                              <ColorChip color={theme.textColor} />
                              <ColorChip color={theme.mutedColor} />
                            </div>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          {selectedColorTheme && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="w-full">
                  Crear nuevo tema
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Crear nuevo tema</SheetTitle>
                  <SheetDescription>
                    Personaliza los colores de tu menú
                  </SheetDescription>
                </SheetHeader>
                <ColorThemeEditor
                  menu={menu}
                  theme={selectedColorTheme}
                  setTheme={(theme: (typeof colorThemes)[0]) => {
                    const randomId = Math.random().toString(36).substring(7)
                    theme.name = "CUSTOM-" + randomId
                    // If custom theme already exists, remove it
                    const customThemeIndex = colorThemes.findIndex(theme =>
                      theme.name.startsWith("CUSTOM")
                    )
                    if (customThemeIndex !== -1) {
                      colorThemes.splice(customThemeIndex, 1)
                    }
                    colorThemes.push(theme)
                    // setSelectedColorTheme(theme)
                    setColorThemeId(theme.name)
                  }}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </SideSection>
    </div>
  )
}

function ColorChip({ color }: { color: string | undefined }) {
  return (
    <div
      className="h-6 w-6 rounded-full border border-black/10"
      style={{
        backgroundColor: color
      }}
    />
  )
}
