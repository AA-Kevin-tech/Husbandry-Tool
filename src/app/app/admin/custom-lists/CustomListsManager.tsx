"use client";

import { useState } from "react";

type Item = { id: string; value: string; sortOrder: number };
type ListType = { id: string; slug: string; name: string; items: Item[] };

export function CustomListsManager({
  initialListTypes,
}: {
  initialListTypes: ListType[];
}) {
  const [listTypes, setListTypes] = useState(initialListTypes);
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddType(e: React.FormEvent) {
    e.preventDefault();
    if (!newSlug.trim() || !newName.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/custom-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: newSlug.trim(), name: newName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || res.statusText);
        return;
      }
      const created = await res.json();
      setListTypes((prev) => [...prev, created]);
      setNewSlug("");
      setNewName("");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddItem(listTypeId: string) {
    const value = newValue[listTypeId]?.trim();
    if (!value) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/custom-lists/${listTypeId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || res.statusText);
        return;
      }
      const item = await res.json();
      setListTypes((prev) =>
        prev.map((lt) =>
          lt.id === listTypeId
            ? { ...lt, items: [...lt.items, item] }
            : lt
        )
      );
      setNewValue((prev) => ({ ...prev, [listTypeId]: "" }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddType} className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">New list slug</label>
          <input
            type="text"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            placeholder="e.g. disposition"
            className="border rounded px-3 py-2 text-black w-40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Display name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Disposition"
            className="border rounded px-3 py-2 text-black w-40"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Add list type
        </button>
      </form>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <div className="space-y-4">
        {listTypes.map((lt) => (
          <div key={lt.id} className="border rounded p-4">
            <h2 className="font-medium mb-2">{lt.name} ({lt.slug})</h2>
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-2">
              {lt.items.map((item) => (
                <li key={item.id}>{item.value}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={newValue[lt.id] ?? ""}
                onChange={(e) =>
                  setNewValue((prev) => ({ ...prev, [lt.id]: e.target.value }))
                }
                placeholder="New value"
                className="border rounded px-3 py-2 text-black w-48"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddItem(lt.id))
                }
              />
              <button
                type="button"
                onClick={() => handleAddItem(lt.id)}
                disabled={loading}
                className="px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
