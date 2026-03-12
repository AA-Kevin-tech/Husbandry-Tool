export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">About</h1>
      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Our mission</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We help animal care professionals manage animals, facilities, and teams in one place. Our goal is to make daily husbandry, medical records, and team communication simple and reliable.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What we offer</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Husbandry Tool provides animal inventory, medical records, daily reports, section management, and internal team chat. You can customize labels and dropdown lists to match your facility. Secure, web-based, and accessible from any device.
        </p>
      </section>
    </div>
  );
}
