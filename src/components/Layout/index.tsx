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
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-grow px-4 sm:px-6">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
