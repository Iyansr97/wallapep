import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <meta name="description" content="Wallapep, second-hand marketplace between individuals" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
