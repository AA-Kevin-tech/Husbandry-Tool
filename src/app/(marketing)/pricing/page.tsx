import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Pricing</h1>
      <div className="border rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Simple pricing</h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
          <li>Free trial: 60 days</li>
          <li>Commitment: Month-to-month</li>
          <li>Subscription: Starting at $19.99/month</li>
          <li>Setup cost: FREE</li>
          <li>Ongoing support: FREE</li>
          <li>Secure cloud hosting</li>
        </ul>
        <Link
          href="/register"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Start free trial
        </Link>
      </div>
    </div>
  );
}
