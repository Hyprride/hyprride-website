import { contact, siteConfig } from "@/lib/site";
import { faqs, fleet, googleRating } from "@/lib/data";

/**
 * Structured data for rich results: LocalBusiness, the rentable fleet,
 * and the FAQ. Rendered server-side as a single JSON-LD graph.
 */
export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "AutoRental"],
        "@id": `${siteConfig.url}/#business`,
        name: siteConfig.legalName,
        alternateName: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        telephone: contact.phone,
        email: contact.email,
        image: `${siteConfig.url}/og.png`,
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        areaServed: { "@type": "City", name: "Hyderabad" },
        address: {
          "@type": "PostalAddress",
          streetAddress: `${contact.address.line1}, ${contact.address.line2}`,
          addressLocality: contact.address.city,
          postalCode: contact.address.postalCode,
          addressRegion: "Telangana",
          addressCountry: "IN",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "07:00",
          closes: "24:00",
        },
        sameAs: [contact.instagram],
        slogan: siteConfig.tagline,
        ...(googleRating.total > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: googleRating.rating.toFixed(1),
                reviewCount: googleRating.total,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
      },
      ...fleet.map((bike) => ({
        "@type": "Product",
        name: `${bike.name} ${bike.model}`,
        category: bike.category,
        description: `${bike.tagline} ${bike.highlight}`,
        brand: { "@type": "Brand", name: bike.name.split(" ")[0] },
        ...(bike.image ? { image: `${siteConfig.url}${bike.image}` } : {}),
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: bike.fromWeekday,
          availability: "https://schema.org/InStock",
          seller: { "@id": `${siteConfig.url}/#business` },
        },
      })),
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
