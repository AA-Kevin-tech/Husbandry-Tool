"use client";

import { useState } from "react";
import Link from "next/link";

type Section = { id: string; name: string };
type Species = { id: string; binomial: string | null; commonName: string | null };
type Animal = {
  id: string;
  name: string | null;
  disposition: string | null;
  section: Section;
  species: Species | null;
  birthDate: string | Date | null;
  gender: string | null;
};

export function AnimalList({
  initialAnimals,
  sections,
}: {
  initialAnimals: Animal[];
  sections: Section[];
  facilityId: string;
}) {
  const [animals, setAnimals] = useState(initialAnimals);
  const [dispositionFilter, setDispositionFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [q, setQ] = useState("");

  const filtered = animals.filter((a) => {
    if (dispositionFilter && a.disposition !== dispositionFilter) return false;
    if (sectionFilter && a.section.id !== sectionFilter) return false;
    if (q) {
      const search = q.toLowerCase();
      const match =
        (a.name?.toLowerCase().includes(search)) ||
        (a.species?.commonName?.toLowerCase().includes(search)) ||
        (a.species?.binomial?.toLowerCase().includes(search));
      if (!match) return false;
    }
    return true;
  });

  const bySection = filtered.reduce((acc, a) => {
    const name = a.section.name;
    if (!acc[name]) acc[name] = [];
    acc[name].push(a);
    return acc;
  }, {} as Record<string, Animal[]>);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="search"
          placeholder="Search name, species…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded px-3 py-2 w-56 text-black"
        />
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
        <select
          value={dispositionFilter}
          onChange={(e) => setDispositionFilter(e.target.value)}
          className="border rounded px-3 py-2 text-black"
        >
          <option value="">All dispositions</option>
          <option value="Alive">Alive / In Collection</option>
          <option value="Deceased">Deceased</option>
          <option value="On Loan">On Loan</option>
          <option value="Transferred">Transferred</option>
        </select>
        <Link
          href="/app/animals/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add animal
        </Link>
      </div>
      <div className="space-y-6">
        {Object.entries(bySection).map(([sectionName, list]) => (
          <div key={sectionName}>
            <h2 className="text-lg font-medium mb-2">{sectionName}</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a) => (
                <Link
                  key={a.id}
                  href={`/app/animals/${a.id}`}
                  className="block border rounded p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="font-medium">{a.name || "Unnamed"}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {a.species?.commonName || a.species?.binomial || "—"} · {a.disposition || "—"}
                  </div>
                  {(a.birthDate != null || a.gender) && (
                    <div className="text-xs text-gray-500 mt-1">
                      {a.birthDate != null && new Date(a.birthDate).toLocaleDateString()}
                      {a.gender && ` · ${a.gender}`}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-gray-500">No animals match the filters.</p>
      )}
    </div>
  );
}
