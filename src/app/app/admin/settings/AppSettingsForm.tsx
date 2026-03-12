"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AppSettingsForm({
  facilityId: _facilityId,
  initial,
}: {
  facilityId: string;
  initial: {
    startOfWeek: string;
    systemOfMeasurement: string;
    dateFormat: string;
    timeFormat: string;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initial);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/facility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            startOfWeek: form.startOfWeek,
            systemOfMeasurement: form.systemOfMeasurement,
            dateFormat: form.dateFormat,
            timeFormat: form.timeFormat,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || res.statusText);
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Start of week</label>
        <select
          value={form.startOfWeek}
          onChange={(e) => setForm((f) => ({ ...f, startOfWeek: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        >
          <option value="Sunday">Sunday</option>
          <option value="Monday">Monday</option>
          <option value="Saturday">Saturday</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">System of measurement</label>
        <select
          value={form.systemOfMeasurement}
          onChange={(e) => setForm((f) => ({ ...f, systemOfMeasurement: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        >
          <option value="Metric">Metric</option>
          <option value="Imperial">Imperial</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date format</label>
        <select
          value={form.dateFormat}
          onChange={(e) => setForm((f) => ({ ...f, dateFormat: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Time format</label>
        <select
          value={form.timeFormat}
          onChange={(e) => setForm((f) => ({ ...f, timeFormat: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        >
          <option value="12h">12-hour</option>
          <option value="24h">24-hour</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
