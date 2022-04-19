import Head from "next/head"
import { Editor, Frame, Element } from "@craftjs/core"

import Text from "@/components/user/Text"
import Layout from "@/components/layouts/Layout"
import Toolbox from "@/components/editor/Toolbox"
import Container from "@/components/user/Container"
import { NextPageWithAuthAndLayout } from "@/lib/types"
import { RenderNode } from "@/components/editor/RenderNode"

const SiteEditor: NextPageWithAuthAndLayout = () => {
  return (
    <>
      <Head>
        <title>Bistro - Editor</title>
      </Head>
      <Editor resolver={{ Container, Text }} onRender={RenderNode}>
        <div className="flex flex-1 flex-col bg-gray-100">
          {/* Toolbar */}
          <div className="h-12 border-b bg-white"></div>
          <div className="flex flex-1">
            {/* Toolbox */}
            <div className="w-60 border-r bg-white">
              <Toolbox />
            </div>
            {/* Content */}
            <div className="flex grow items-center justify-center py-8">
              <div className="page-container"></div>
              <div className="craftjs-renderer h-full w-[384px] bg-white">
                <Frame>
                  <Element is={Container} bgColor="#eee" canvas>
                    Test
                  </Element>
                </Frame>
              </div>
            </div>
            {/* Settings */}
            <div className="w-60 border-l bg-white"></div>
          </div>
        </div>
      </Editor>
    </>
  )
}

SiteEditor.auth = true
SiteEditor.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default SiteEditor
