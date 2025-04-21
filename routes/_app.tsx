import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LesserNalsa</title>
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body class="bg-white text-lessernavy font-sans">
        <Header />
        <main class="max-w-4xl mx-auto px-4">
          <Component />
        </main>
        <Footer />
      </body>
    </html>
  );
}
