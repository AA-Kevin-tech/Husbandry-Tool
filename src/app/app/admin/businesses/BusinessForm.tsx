"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BusinessForm({
  businessId,
  initial,
}: {
  businessId?: string;
  initial?: {
    type: string;
    name: string;
    owner: string | null;
    contactName: string | null;
    contactEmail: string | null;
    mailingAddress: string | null;
    websiteUrl: string | null;
    note: string | null;
  } | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: initial?.type ?? "Veterinarian",
    name: initial?.name ?? "",
    owner: initial?.owner ?? "",
    contactName: initial?.contactName ?? "",
    contactEmail: initial?.contactEmail ?? "",
    mailingAddress: initial?.mailingAddress ?? "",
    websiteUrl: initial?.websiteUrl ?? "",
    note: initial?.note ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const url = businessId ? `/api/businesses/${businessId}` : "/api/businesses";
      const method = businessId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || res.statusText);
        return;
      }
      router.push("/app/admin/businesses");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          className="w-full border rounded px-3 py-2 text-black"
        >
          <option value="Veterinarian">Veterinarian</option>
          <option value="Exhibitor">Exhibitor</option>
          <option value="Dealer">Dealer</option>
          <option value="Individual">Individual</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
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
        <label className="block text-sm font-medium mb-1">Mailing address</label>
        <textarea
          value={form.mailingAddress}
          onChange={(e) => setForm((f) => ({ ...f, mailingAddress: e.target.value }))}
          rows={2}
          className="w-full border rounded px-3 py-2 text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Website URL</label>
        <input
          type="url"
          value={form.websiteUrl}
          onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
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
          {loading ? "Saving…" : businessId ? "Update" : "Create"}
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
