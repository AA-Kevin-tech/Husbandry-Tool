"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Animal = {
  id: string;
  name: string | null;
  section: { id: string; name: string };
  species: { commonName: string | null } | null;
};
type RecordItem = {
  id: string;
  recordDate: string | Date;
  problemDescription: string | null;
  diagnosis: string | null;
  vetVisit: boolean;
  animal: Animal;
  veterinarian: { id: string; name: string } | null;
};

export function MedicalList({
  initialRecords,
  sections,
  initialNextCursor,
}: {
  initialRecords: RecordItem[];
  sections: { id: string; name: string }[];
  initialNextCursor?: string | null;
}) {
  const [records, setRecords] = useState(initialRecords);
  const [sectionFilter, setSectionFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(initialNextCursor ?? null);

  useEffect(() => {
    setRecords(initialRecords);
  }, [initialRecords]);

  async function loadMore() {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const url = sectionFilter
        ? `/api/medical?limit=30&cursor=${cursor}&sectionId=${sectionFilter}`
        : `/api/medical?limit=30&cursor=${cursor}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setRecords((prev) => [...prev, ...(data.records ?? [])]);
      setCursor(data.nextCursor);
    } finally {
      setLoading(false);
    }
  }

  const filtered = sectionFilter
    ? records.filter((r) => r.animal.section.id === sectionFilter)
    : records;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="border rounded px-3 py-2 text-black"
        >
          <option value="">All sections</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <ul className="divide-y">
        {filtered.map((r) => (
          <li key={r.id} className="py-3">
            <Link
              href={`/app/medical/${r.id}`}
              className="block hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 py-1 rounded"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">
                    {r.animal.name || "Unnamed"} · {r.animal.section.name}
                  </span>
                  {r.animal.species?.commonName && (
                    <span className="text-gray-500 ml-2">
                      {r.animal.species.commonName}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(r.recordDate as string | Date).toLocaleDateString()}
                </span>
              </div>
              {(r.problemDescription || r.diagnosis) && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                  {r.problemDescription || r.diagnosis}
                </p>
              )}
              {r.vetVisit && (
                <span className="text-xs text-blue-600">Vet visit</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {cursor && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="text-sm text-blue-600 hover:underline disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
