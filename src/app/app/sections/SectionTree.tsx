"use client";

import { useState } from "react";
import type { Section, SectionMember, User } from "@prisma/client";

export type SectionWithRelations = Section & {
  parent: { id: string; name: string } | null;
  children: (Section & { parent?: { id: string; name: string } | null; children?: unknown[]; members?: (SectionMember & { user: Pick<User, "name" | "email"> })[] })[];
  members: (SectionMember & { user: Pick<User, "name" | "email"> })[];
};

export function SectionTree({
  sections,
  rootSections,
  facilityId,
}: {
  sections: SectionWithRelations[];
  rootSections: SectionWithRelations[];
  facilityId: string;
}) {
  const [addingParentId, setAddingParentId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(parentId: string | null) {
    if (!newName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          parentId: parentId || undefined,
          dailyReportsEnabled: false,
          status: "Active",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || res.statusText);
        return;
      }
      setNewName("");
      setAddingParentId(null);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {rootSections.length === 0 && !addingParentId && (
        <p className="text-gray-500">No sections yet. Add one below.</p>
      )}
      {rootSections.map((s) => (
        <SectionNode
          key={s.id}
          section={s}
          sections={sections}
          onAddChild={(id) => {
            setAddingParentId(id);
            setNewName("");
          }}
          addingParentId={addingParentId}
          newName={newName}
          setNewName={setNewName}
          onSubmitAdd={handleAdd}
          onCancelAdd={() => {
            setAddingParentId(null);
            setNewName("");
          }}
          loading={loading}
        />
      ))}
      {addingParentId === null && (
        <div className="flex gap-2 items-center mt-4">
          <input
            type="text"
            placeholder="New section name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded px-3 py-2 w-64 text-black"
            onKeyDown={(e) => e.key === "Enter" && handleAdd(null)}
          />
          <button
            type="button"
            onClick={() => handleAdd(null)}
            disabled={loading || !newName.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Add section
          </button>
        </div>
      )}
    </div>
  );
}

function SectionNode({
  section,
  sections,
  onAddChild,
  addingParentId,
  newName,
  setNewName,
  onSubmitAdd,
  onCancelAdd,
  loading,
}: {
  section: SectionWithRelations;
  sections: SectionWithRelations[] | readonly SectionWithRelations[];
  onAddChild: (id: string) => void;
  addingParentId: string | null;
  newName: string;
  setNewName: (v: string) => void;
  onSubmitAdd: (parentId: string | null) => void;
  onCancelAdd: () => void;
  loading: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const children = sections.filter((s) => s.parentId === section.id);

  return (
    <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 py-1">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="text-gray-500"
        >
          {children.length > 0 ? (expanded ? "−" : "+") : " "}
        </button>
        <span className="font-medium">{section.name}</span>
        <span className="text-sm text-gray-500">
          ({section.status}, daily reports: {section.dailyReportsEnabled ? "on" : "off"})
        </span>
        {section.members.length > 0 && (
          <span className="text-xs text-gray-400">
            {section.members.map((m) => m.user.name || m.user.email).join(", ")}
          </span>
        )}
        <button
          type="button"
          onClick={() => onAddChild(section.id)}
          className="text-sm text-blue-600 hover:underline"
        >
          Add subsection
        </button>
      </div>
      {expanded && (
        <>
          {children.map((c) => (
            <SectionNode
              key={c.id}
              section={c}
              sections={sections}
              onAddChild={onAddChild}
              addingParentId={addingParentId}
              newName={newName}
              setNewName={setNewName}
              onSubmitAdd={onSubmitAdd}
              onCancelAdd={onCancelAdd}
              loading={loading}
            />
          ))}
          {addingParentId === section.id && (
            <div className="flex gap-2 items-center pl-6 py-2">
              <input
                type="text"
                placeholder="Subsection name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border rounded px-3 py-2 w-56 text-black"
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSubmitAdd(section.id);
                  if (e.key === "Escape") onCancelAdd();
                }}
              />
              <button
                type="button"
                onClick={() => onSubmitAdd(section.id)}
                disabled={loading || !newName.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
              <button
                type="button"
                onClick={onCancelAdd}
                className="px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
