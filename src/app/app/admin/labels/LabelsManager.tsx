"use client";

import { useState } from "react";

const LABEL_TYPES = [
  "general",
  "section",
  "medical",
  "business",
  "animal",
  "daily_report",
] as const;

type LabelType = (typeof LABEL_TYPES)[number];

type Label = {
  id: string;
  type: string;
  text: string | null;
  color: string;
};

export function LabelsManager({ initialLabels }: { initialLabels: Label[] }) {
  const [labels, setLabels] = useState(initialLabels);
  const [type, setType] = useState<LabelType>(LABEL_TYPES[0]);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#6b7280");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, text: text || null, color }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || res.statusText);
        return;
      }
      const label = await res.json();
      setLabels((prev) => [...prev, label]);
      setText("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LabelType)}
            className="border rounded px-3 py-2 text-black"
          >
            {LABEL_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Optional"
            className="border rounded px-3 py-2 text-black w-40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-14 border rounded cursor-pointer"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <div className="space-y-4">
        {LABEL_TYPES.map((t) => {
          const list = labels.filter((l) => l.type === t);
          if (list.length === 0) return null;
          return (
            <div key={t}>
              <h2 className="font-medium mb-2">{t.replace("_", " ")}</h2>
              <div className="flex flex-wrap gap-2">
                {list.map((l) => (
                  <span
                    key={l.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm text-white"
                    style={{ backgroundColor: l.color }}
                  >
                    {l.text || l.type}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
