import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      title: "Daily reports",
      description: "Record behavior, diet, enrichment, medical treatment, projects, training, and weather. Calendar view with importance levels and labels.",
      href: "/app/daily-reports",
    },
    {
      title: "Animal inventory",
      description: "Catalog animals with acquisition info, physical characteristics, breeding status, and more. Customizable sections and search.",
      href: "/app/animals",
    },
    {
      title: "Medical records",
      description: "Track vaccinations, diagnostics, treatments, and neonate feedings. Weights, measurements, and comprehensive reporting.",
      href: "/app/medical",
    },
    {
      title: "Section management",
      description: "Build areas, sections, sub-sections, and enclosures. Assign staff and enable daily reports per section.",
      href: "/app/sections",
    },
    {
      title: "Team chat",
      description: "Internal chat broken down by teams. Real-time messaging for your facility.",
      href: "/app/chat",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Features</h1>
      <div className="space-y-8">
        {features.map((f) => (
          <section key={f.title}>
            <h2 className="text-xl font-semibold mb-2">{f.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{f.description}</p>
            <Link href={f.href} className="text-blue-600 hover:underline">
              Learn more →
            </Link>
          </section>
        ))}
      </div>
    </div>
  );
}
