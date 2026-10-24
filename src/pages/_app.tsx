import "@styles/globals.css"
import { Inter, JetBrains_Mono } from "next/font/google"
import useGtagEffect from "@hooks/useGtagEffect"
import Scripts from "@components/Scripts"
import { NextPage } from "next"
import { ReactElement, ReactNode } from "react"
import { AppProps } from "next/app"

const sans = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" })
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono" })

export type NextPageWithLayout<PageProps = {}> = NextPage<PageProps> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)
  useGtagEffect()

  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${sans.style.fontFamily};
          --font-mono: ${mono.style.fontFamily};
        }
      `}</style>
      <Scripts />
      {getLayout(<Component {...pageProps} />)}
    </>
  )
}

export default MyApp
