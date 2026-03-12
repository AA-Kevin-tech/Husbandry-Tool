"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Animal = {
  id: string;
  name: string | null;
  section: { name: string };
  species: { commonName: string | null; binomial: string | null } | null;
};
type Business = { id: string; name: string; type: string };

export function MedicalForm({
  animals,
  businesses,
  recordId,
  initial,
}: {
  animals: Animal[];
  businesses: Business[];
  recordId?: string;
  initial?: {
    animalId: string;
    veterinarianId?: string | null;
    vetVisit: boolean;
    routineVaccination: boolean;
    recordDate: string;
    weight?: string | null;
    problemDescription?: string | null;
    diagnosis?: string | null;
    treatmentDescription?: string | null;
    note?: string | null;
  } | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    animalId: initial?.animalId ?? animals[0]?.id ?? "",
    veterinarianId: initial?.veterinarianId ?? "",
    vetVisit: initial?.vetVisit ?? false,
    routineVaccination: initial?.routineVaccination ?? false,
    recordDate: initial?.recordDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    weight: initial?.weight ?? "",
    problemDescription: initial?.problemDescription ?? "",
    diagnosis: initial?.diagnosis ?? "",
    treatmentDescription: initial?.treatmentDescription ?? "",
    note: initial?.note ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = recordId ? `/api/medical/${recordId}` : "/api/medical";
      const method = recordId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animalId: form.animalId,
          veterinarianId: form.veterinarianId || null,
          vetVisit: form.vetVisit,
          routineVaccination: form.routineVaccination,
          recordDate: form.recordDate,
          weight: form.weight || null,
          problemDescription: form.problemDescription || null,
          diagnosis: form.diagnosis || null,
          treatmentDescription: form.treatmentDescription || null,
          note: form.note || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || res.statusText);
        return;
      }
      router.push("/app/medical");
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
        <label className="block text-sm font-medium mb-1">Animal *</label>
        <select
          value={form.animalId}
          onChange={(e) => setForm((f) => ({ ...f, animalId: e.target.value }))}
          required
          className="w-full border rounded px-3 py-2 text-black"
        >
          <option value="">Select animal</option>
          {animals.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name || "Unnamed"} · {a.section.name}
              {a.species?.commonName || a.species?.binomial
                ? ` (${a.species.commonName || a.species.binomial})`
                : ""}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Record date *</label>
        <input
          type="date"
          value={form.recordDate}
          onChange={(e) => setForm((f) => ({ ...f, recordDate: e.target.value }))}
          required
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.vetVisit}
            onChange={(e) => setForm((f) => ({ ...f, vetVisit: e.target.checked }))}
          />
          Vet visit
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.routineVaccination}
            onChange={(e) => setForm((f) => ({ ...f, routineVaccination: e.target.checked }))}
          />
          Routine vaccination
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Veterinarian</label>
        <select
          value={form.veterinarianId}
          onChange={(e) => setForm((f) => ({ ...f, veterinarianId: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        >
          <option value="">—</option>
          {businesses.filter((b) => b.type === "Veterinarian" || !b.type).map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Weight</label>
        <input
          type="text"
          value={form.weight}
          onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Problem description</label>
        <textarea
          value={form.problemDescription}
          onChange={(e) => setForm((f) => ({ ...f, problemDescription: e.target.value }))}
          rows={2}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Diagnosis</label>
        <textarea
          value={form.diagnosis}
          onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))}
          rows={2}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Treatment</label>
        <textarea
          value={form.treatmentDescription}
          onChange={(e) => setForm((f) => ({ ...f, treatmentDescription: e.target.value }))}
          rows={2}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Note</label>
        <textarea
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          rows={2}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : recordId ? "Update" : "Create"}
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
