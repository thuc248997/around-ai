import Header from "./Header"
import Footer from "./Footer"
import MetaConfig, { MetaConfigProps } from "./MetaConfig"

type Props = {
  children: React.ReactNode
  metaConfig: MetaConfigProps
}

const Layout: React.FC<Props> = ({ children, metaConfig }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <MetaConfig {...metaConfig} />
      <a
        href="#content"
        className="sr-only z-50 rounded bg-term-green px-3 py-2 text-sm text-term-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="content" className="w-full flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
