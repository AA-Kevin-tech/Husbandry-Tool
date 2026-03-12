"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DailyReportForm({
  sections,
  defaultSectionId,
  defaultDate,
  reportId,
  initial,
}: {
  sections: { id: string; name: string }[];
  defaultSectionId?: string;
  defaultDate?: string;
  reportId?: string;
  initial?: {
    sectionId: string;
    date: string;
    importance: string;
    weather?: string | null;
    highTemp?: string | null;
    lowTemp?: string | null;
    humidity?: string | null;
    notes?: unknown;
  } | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    sectionId: initial?.sectionId ?? defaultSectionId ?? sections[0]?.id ?? "",
    date: initial?.date?.slice(0, 10) ?? defaultDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    importance: initial?.importance ?? "Normal",
    weather: initial?.weather ?? "",
    highTemp: initial?.highTemp ?? "",
    lowTemp: initial?.lowTemp ?? "",
    humidity: initial?.humidity ?? "",
    notes: (initial?.notes as string) ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (reportId) {
        const res = await fetch(`/api/daily-reports/${reportId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            importance: form.importance,
            weather: form.weather || null,
            highTemp: form.highTemp || null,
            lowTemp: form.lowTemp || null,
            humidity: form.humidity || null,
            notes: form.notes ? [{ type: "general", content: form.notes }] : undefined,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || res.statusText);
          return;
        }
      } else {
        const res = await fetch("/api/daily-reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionId: form.sectionId,
            date: form.date,
            importance: form.importance,
            weather: form.weather || null,
            highTemp: form.highTemp || null,
            lowTemp: form.lowTemp || null,
            humidity: form.humidity || null,
            notes: form.notes ? [{ type: "general", content: form.notes }] : undefined,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || res.statusText);
          return;
        }
      }
      router.push("/app/daily-reports");
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
          disabled={!!reportId}
          className="w-full border rounded px-3 py-2 text-black disabled:opacity-70"
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date *</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          required
          disabled={!!reportId}
          className="w-full border rounded px-3 py-2 text-black disabled:opacity-70"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Importance</label>
        <select
          value={form.importance}
          onChange={(e) => setForm((f) => ({ ...f, importance: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        >
          <option value="Normal">Normal</option>
          <option value="Important">Important</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Weather</label>
        <input
          type="text"
          value={form.weather}
          onChange={(e) => setForm((f) => ({ ...f, weather: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">High temp</label>
          <input
            type="text"
            value={form.highTemp}
            onChange={(e) => setForm((f) => ({ ...f, highTemp: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Low temp</label>
          <input
            type="text"
            value={form.lowTemp}
            onChange={(e) => setForm((f) => ({ ...f, lowTemp: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Humidity %</label>
          <input
            type="text"
            value={form.humidity}
            onChange={(e) => setForm((f) => ({ ...f, humidity: e.target.value }))}
            className="w-full border rounded px-3 py-2 text-black"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={4}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : reportId ? "Update" : "Create"}
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
