import Document, { Html, Head, Main, NextScript } from "next/document"
import { CONFIG } from "site.config"
import { dateLocale, toLocale } from "@libs/i18n"

// Runs before paint so dark mode doesn't flash
const themeScript = `(function(){try{var c=${JSON.stringify(CONFIG.blog.theme)};var t=c!=="auto"?c:(localStorage.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`

class MyDocument extends Document {
  render() {
    return (
      <Html lang={dateLocale(toLocale(this.props.locale))}>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="192x192" href="/apple-touch-icon.png" />
          <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="/feed" />

          {/* google search console */}
          {CONFIG.googleSearchConsole.enable === true && (
            <meta
              name="google-site-verification"
              content={CONFIG.googleSearchConsole.config.siteVerification}
            />
          )}
        </Head>
        <body className="font-mono text-term-fg antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
