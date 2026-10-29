import Document, { Html, Head, Main, NextScript } from "next/document"
import { CONFIG } from "site.config"
import { dateLocale, toLocale } from "@libs/i18n"
import { timeThemeJs } from "@hooks/useTheme"

// Runs before paint so dark mode doesn't flash. "auto" uses the visitor's local time,
// unless they toggled manually and that choice hasn't expired yet.
const themeScript = `(function(){var c=${JSON.stringify(CONFIG.blog.theme)},t=c;if(c==="auto"){t=(${timeThemeJs})(new Date());try{if(Number(localStorage.themeUntil)>Date.now())t=localStorage.theme}catch(e){}}if(t==="dark")document.documentElement.classList.add("dark")})()`

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
