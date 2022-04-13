import { useMemo, useState } from "react"
import Head from "next/head"
import toast from "react-hot-toast"
import useSWR, { mutate } from "swr"
import { useSession } from "next-auth/react"
import { PlusIcon } from "@heroicons/react/outline"

import fetcher from "@/lib/fetcher"
import Table from "@/components/Table"
import Button from "@/components/Button"
import Loader from "@/components/Loader"
import ItemForm from "@/components/ItemForm"
import SidePanel from "@/components/SidePanel"
import PageHeader from "@/components/PageHeader"
import Layout from "@/components/layouts/Layout"

import { HttpMethod, NextPageWithAuthAndLayout } from "@/lib/types"
import type { Site, Item } from "@prisma/client"

interface SiteItemData {
  items: Array<Item>
  site: Site | null
}

const Items: NextPageWithAuthAndLayout = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Producto",
        accessor: "title"
      },
      {
        Header: "Descripcion",
        accessor: "description"
      },
      {
        Header: "Precio",
        accessor: "price"
      },
      {
        Header: "Extras",
        accessor: "extras"
      }
    ],
    []
  )

  const [open, setOpen] = useState(false)
  const [itemId, setItemId] = useState(null)
  const { data: session } = useSession()
  const sessionId = session?.user?.id

  const { data: site } = useSWR<Site>(sessionId && "/api/site", fetcher)
  const { data, error } = useSWR<SiteItemData>(
    site?.id && `/api/item?siteId=${site?.id}`,
    fetcher
  )

  async function onCreateItem(siteId: string) {
    try {
      const res = await fetch(`/api/item?siteId=${siteId}`, {
        method: HttpMethod.POST,
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (res.ok) {
        const data = await res.json()
        setItemId(data.itemId)
        setOpen(true)
        mutate(`/api/item?siteId=${site?.id}`)
      } else {
        toast.error("Algo salió mal")
      }
    } catch (error) {
      console.error(error)
      toast.error("Algo salió mal")
    }
  }

  function openSidePanelItem(itemId: string) {
    setOpen(true)
    setItemId(itemId)
  }

  if (!data && !error) {
    return <Loader />
  }

  return (
    <>
      <Head>
        <title>Bistro - Productos</title>
      </Head>
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <PageHeader title={"Productos"}></PageHeader>
        </div>
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <Table
            columns={columns}
            data={data.items}
            getRowProps={row => ({
              onClick: () => openSidePanelItem(row.original.id)
            })}
            toolbar={
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusIcon />}
                onClick={() => onCreateItem(site.id)}
              >
                Crear Producto
              </Button>
            }
          ></Table>
          <SidePanel open={open} setOpen={setOpen} title="Modificar Producto">
            <ItemForm itemId={itemId} />
          </SidePanel>
        </div>
      </div>
    </>
  )
}

Items.auth = true
Items.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Items
