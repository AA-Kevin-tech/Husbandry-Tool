"use client";

import Link from "next/link";

type Business = {
  id: string;
  type: string;
  name: string;
  contactName: string | null;
  contactEmail: string | null;
};

export function BusinessList({ businesses }: { businesses: Business[] }) {
  const byType = businesses.reduce((acc, b) => {
    const t = b.type || "Other";
    if (!acc[t]) acc[t] = [];
    acc[t].push(b);
    return acc;
  }, {} as Record<string, Business[]>);

  return (
    <div className="space-y-6">
      {Object.entries(byType).map(([type, list]) => (
        <div key={type}>
          <h2 className="font-medium mb-2">{type}</h2>
          <ul className="divide-y border rounded">
            {list.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/app/admin/businesses/${b.id}`}
                  className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="font-medium">{b.name}</span>
                  {(b.contactName || b.contactEmail) && (
                    <span className="text-sm text-gray-500 ml-2">
                      {b.contactName || b.contactEmail}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {businesses.length === 0 && (
        <p className="text-gray-500">No businesses yet. Add one to use as veterinarians or sources.</p>
      )}
    </div>
  );
}
