import { SiteHeader, SiteFooter } from "@/ui/Chrome";
import { StaticPortfolio } from "@/ui/StaticPortfolio";
import { Backdrop } from "@/ui/Backdrop";
import { person, education, projects, papers } from "@/content/portfolio.data";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    url: person.url,
    email: person.email,
    telephone: person.phone,
    jobTitle: person.role,
    description: person.statement,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressCountry: "IN",
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
    sameAs: [person.github, person.linkedin, person.ieee],
    knowsAbout: [
      "Machine Learning",
      "Large Language Models",
      "Retrieval-Augmented Generation",
      "Backend Engineering",
      "Full Stack Development",
      "Eye Tracking",
    ],
    subjectOf: papers.map((p) => ({
      "@type": "ScholarlyArticle",
      headline: p.title,
      datePublished: p.iso,
    })),
    workExample: projects
      .filter((p) => p.featured)
      .map((p) => ({
        "@type": "CreativeWork",
        name: p.title,
        description: p.tagline,
        url: `${person.url}/projects/${p.slug}`,
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Backdrop />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-6 sm:px-6">
        <StaticPortfolio />
      </main>
      <SiteFooter />
    </>
  );
}
