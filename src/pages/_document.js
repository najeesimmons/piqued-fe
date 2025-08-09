import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=2"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=2"
        />
        {/* <link rel="alternate icon" href="/favicon.ico" /> */}
      </Head>
      <body className="antialiased">
        <div id="modal-root"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
