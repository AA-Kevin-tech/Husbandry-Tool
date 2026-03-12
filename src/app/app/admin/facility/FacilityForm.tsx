"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Facility = {
  id: string;
  name: string;
  dba: string | null;
  owner: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  mailingAddress: string | null;
};

export function FacilityForm({ facility }: { facility: Facility }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: facility.name,
    dba: facility.dba ?? "",
    owner: facility.owner ?? "",
    contactName: facility.contactName ?? "",
    contactEmail: facility.contactEmail ?? "",
    contactPhone: facility.contactPhone ?? "",
    mailingAddress: facility.mailingAddress ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/facility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          dba: form.dba || null,
          owner: form.owner || null,
          contactName: form.contactName || null,
          contactEmail: form.contactEmail || null,
          contactPhone: form.contactPhone || null,
          mailingAddress: form.mailingAddress || null,
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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Facility name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">D.B.A.</label>
        <input
          type="text"
          value={form.dba}
          onChange={(e) => setForm((f) => ({ ...f, dba: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Owner</label>
        <input
          type="text"
          value={form.owner}
          onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contact name</label>
        <input
          type="text"
          value={form.contactName}
          onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contact email</label>
        <input
          type="email"
          value={form.contactEmail}
          onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contact phone</label>
        <input
          type="text"
          value={form.contactPhone}
          onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mailing address</label>
        <textarea
          value={form.mailingAddress}
          onChange={(e) => setForm((f) => ({ ...f, mailingAddress: e.target.value }))}
          rows={2}
          className="w-full border rounded px-3 py-2 text-black"
        />
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
