"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Section = { id: string; name: string };
type AnimalData = {
  sectionId: string;
  speciesId?: string | null;
  name?: string | null;
  disposition?: string | null;
  birthDate?: string | null;
  birthDateEstimate?: boolean;
  weight?: string | null;
  weightUnit?: string | null;
  gender?: string | null;
  breedingStatus?: string | null;
  note?: string | null;
};

export function AnimalForm({
  sections,
  facilityId,
  animalId,
  initial,
}: {
  sections: Section[];
  facilityId: string;
  animalId?: string;
  initial?: AnimalData | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [speciesOptions, setSpeciesOptions] = useState<{ id: string; binomial: string | null; commonName: string | null }[]>([]);
  const [form, setForm] = useState<AnimalData>({
    sectionId: initial?.sectionId ?? sections[0]?.id ?? "",
    speciesId: initial?.speciesId ?? null,
    name: initial?.name ?? "",
    disposition: initial?.disposition ?? "",
    birthDate: initial?.birthDate ? initial.birthDate.slice(0, 10) : "",
    birthDateEstimate: initial?.birthDateEstimate ?? false,
    weight: initial?.weight ?? "",
    weightUnit: initial?.weightUnit ?? "kg",
    gender: initial?.gender ?? "",
    breedingStatus: initial?.breedingStatus ?? "",
    note: initial?.note ?? "",
  });

  useEffect(() => {
    if (!speciesQuery.trim()) {
      setSpeciesOptions([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/species?q=${encodeURIComponent(speciesQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSpeciesOptions(data);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [speciesQuery]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = animalId ? `/api/animals/${animalId}` : "/api/animals";
      const method = animalId ? "PATCH" : "POST";
      const body: Record<string, unknown> = {
        sectionId: form.sectionId,
        speciesId: form.speciesId || null,
        name: form.name || null,
        disposition: form.disposition || null,
        birthDate: form.birthDate || null,
        birthDateEstimate: form.birthDateEstimate,
        weight: form.weight || null,
        weightUnit: form.weightUnit || null,
        gender: form.gender || null,
        breedingStatus: form.breedingStatus || null,
        note: form.note || null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || res.statusText);
        return;
      }
      router.push("/app/animals");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && (
        <p className="text-sm text-red-600" role="alert">{error}</p>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Section *</label>
        <select
          value={form.sectionId}
          onChange={(e) => setForm((f) => ({ ...f, sectionId: e.target.value }))}
          required
          className="w-full border rounded px-3 py-2 text-black"
        >
          <option value="">Select section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Species</label>
        <input
          type="text"
          value={speciesQuery}
          onChange={(e) => setSpeciesQuery(e.target.value)}
          placeholder="Search species…"
          className="w-full border rounded px-3 py-2 text-black"
        />
        {speciesOptions.length > 0 && (
          <ul className="mt-1 border rounded bg-white dark:bg-gray-900 max-h-40 overflow-y-auto">
            {speciesOptions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, speciesId: s.id }));
                    setSpeciesQuery(s.commonName || s.binomial || s.id);
                    setSpeciesOptions([]);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {s.commonName || s.binomial || s.id}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={form.name ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Disposition</label>
          <select
            value={form.disposition ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, disposition: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-black"
          >
            <option value="">—</option>
            <option value="Alive">Alive / In Collection</option>
            <option value="Deceased">Deceased</option>
            <option value="On Loan">On Loan</option>
            <option value="Transferred">Transferred</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <input
            type="text"
            value={form.gender ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-black"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Birth date</label>
          <input
            type="date"
            value={form.birthDate ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-black"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.birthDateEstimate}
              onChange={(e) => setForm((f) => ({ ...f, birthDateEstimate: e.target.checked }))}
            />
            <span className="text-sm">Estimate</span>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight</label>
          <input
            type="text"
            value={form.weight ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <select
            value={form.weightUnit ?? "kg"}
            onChange={(e) => setForm((f) => ({ ...f, weightUnit: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-black"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Breeding status</label>
        <input
          type="text"
          value={form.breedingStatus ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, breedingStatus: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Note</label>
        <textarea
          value={form.note ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          rows={3}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : animalId ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
