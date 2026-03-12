import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Animal care and facility management
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Manage animals, medical records, daily reports, and team chat in one
          place. Simple, customizable, and built for care teams.
        </p>
        <Link
          href="/register"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Get started — free trial
        </Link>
      </section>
      <section className="grid sm:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Daily reports</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Record behavior, diet, enrichment, and weather. Calendar view with importance and labels.
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Animal inventory</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Catalog animals with sections, species, disposition, and custom identifiers.
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Medical records</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Track vet visits, treatments, drugs, and vaccines linked to animals.
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Team chat</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Internal chat broken down by teams. Real-time messaging.
          </p>
        </div>
      </section>
    </div>
  );
}
