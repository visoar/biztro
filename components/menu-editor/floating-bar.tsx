import { useState } from "react"
import { useEditor } from "@craftjs/core"
import {
  Clipboard,
  ClipboardPaste,
  Lock,
  LockOpen,
  Redo2,
  TabletSmartphone,
  Undo2
} from "lucide-react"

import { TooltipHelper } from "@/components/dashboard/tooltip-helper"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function FloatingBar() {
  const { enabled, canUndo, canRedo, actions, query, selectedNodeId } =
    useEditor((state, query) => ({
      enabled: state.options.enabled,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
      selectedNodeId: state.events.selected
    }))
  const [propsCopy, setPropsCopy] = useState<{ [x: string]: unknown } | null>(
    null
  )

  const onPasteProps = (clonedProps: unknown) => {
    const values = selectedNodeId.values()
    const nodeId = values.next()
    actions.setProp(nodeId.value, props => {
      return (props = Object.assign(props, clonedProps))
    })
  }

  const onCopyProps = () => {
    const values = selectedNodeId.values()
    const nodeId = values.next()
    if (selectedNodeId) {
      const node = query.node(nodeId.value).get()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, text, ...props } = node.data.props
      setPropsCopy(props)
    }
  }

  return (
    <div className="fixed bottom-8 left-1/2 flex h-12 min-w-[200px] -translate-x-1/2 flex-row items-center justify-between rounded-full bg-gray-800 px-1 text-white shadow-lg">
      <TooltipHelper content="Deshacer">
        <Button
          disabled={!canUndo}
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => actions.history.undo()}
        >
          <Undo2 className="size-4" />
        </Button>
      </TooltipHelper>
      <TooltipHelper content="Rehacer">
        <Button
          disabled={!canRedo}
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => actions.history.redo()}
        >
          <Redo2 className="size-4" />
        </Button>
      </TooltipHelper>
      <Separator orientation="vertical" className="mx-1 h-6 bg-gray-500" />
      <TooltipHelper content="Tamaño vista previa">
        <Button variant="ghost" size="icon" className="rounded-full">
          <TabletSmartphone className="size-4" />
        </Button>
      </TooltipHelper>
      <Separator orientation="vertical" className="mx-1 h-6 bg-gray-500" />
      <TooltipHelper content="Copiar estilo">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => onCopyProps()}
        >
          <Clipboard className="size-4" />
        </Button>
      </TooltipHelper>
      <TooltipHelper content="Pegar estilo">
        <Button
          disabled={!propsCopy}
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => onPasteProps(propsCopy)}
        >
          <ClipboardPaste className="size-4" />
        </Button>
      </TooltipHelper>
      <Separator orientation="vertical" className="mx-1 h-6 bg-gray-500" />
      <TooltipHelper content="Restringir cambios">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() =>
            actions.setOptions(options => (options.enabled = !enabled))
          }
        >
          {enabled ? (
            <LockOpen className="size-4" />
          ) : (
            <Lock className="size-4" />
          )}
        </Button>
      </TooltipHelper>
    </div>
  )
}
