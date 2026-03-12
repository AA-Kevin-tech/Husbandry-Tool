export default function FAQPage() {
  const faqs = [
    {
      q: "How do I get started?",
      a: "Register for an account. After signing in, you can create your facility, add sections, and start adding animals and daily reports.",
    },
    {
      q: "Can I use this on my phone?",
      a: "Yes. The app is responsive and works on tablets and smartphones so you can record notes from the field.",
    },
    {
      q: "Is my data secure?",
      a: "Yes. We use secure cloud hosting with encryption and role-based access. Each facility's data is isolated.",
    },
    {
      q: "Can I invite my team?",
      a: "Yes. Admins can add users and assign roles (Admin, Staff, Viewer). Team chat is available per team.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">FAQ</h1>
      <dl className="space-y-6">
        {faqs.map(({ q, a }) => (
          <div key={q}>
            <dt className="font-semibold text-lg">{q}</dt>
            <dd className="text-gray-600 dark:text-gray-400 mt-1">{a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
