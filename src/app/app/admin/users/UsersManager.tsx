"use client";

import { useState } from "react";

type Member = {
  id: string;
  role: string;
  user: { id: string; email: string; name: string | null };
};

export function UsersManager({ members }: { members: Member[] }) {
  const [roleEdits, setRoleEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRoleChange(userId: string, role: string) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || res.statusText);
        return;
      }
      setRoleEdits((prev) => ({ ...prev, [userId]: role }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">User</th>
            <th className="text-left py-2">Email</th>
            <th className="text-left py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-b">
              <td className="py-2">{m.user.name || "—"}</td>
              <td className="py-2">{m.user.email}</td>
              <td className="py-2">
                <select
                  value={roleEdits[m.user.id] ?? m.role}
                  onChange={(e) => handleRoleChange(m.user.id, e.target.value)}
                  disabled={loading}
                  className="border rounded px-2 py-1 text-black"
                >
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
