import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="zh-HK">
      <Head>
        <meta
          name="description"
          content="香港交通到站顯示 — 查詢港鐵實時到站時間"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="香港交通到站模擬器" />
        <meta
          property="og:description"
          content="香港交通到站顯示 — 查詢港鐵實時到站時間"
        />
        <meta name="theme-color" content="#1a3a5f" />
        {/* Google Fonts for MTR Board */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Oswald:wght@500;600&family=Noto+Serif+TC:wght@600&family=Open+Sans:wght@600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
