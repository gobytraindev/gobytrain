// components/SeoHead.tsx
import Head from "next/head";

const metaTitle = "GoByTrain — Find the best train routes in Europe";
const metaDesc =
  "Search, compare and book train journeys across Europe with GoByTrain. Fast, reliable results from trusted partners.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GoByTrain",
  url: "https://gobytrain.co/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://gobytrain.co/details?from={from}&to={to}&date={date}",
    "query-input": "required name=from required name=to optional name=date",
  },
};

export default function SeoHead() {
  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href="https://gobytrain.co/" />
      <meta name="robots" content="index,follow" />
      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://gobytrain.co/" />
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // @ts-ignore – vi skickar in en sträng här
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}