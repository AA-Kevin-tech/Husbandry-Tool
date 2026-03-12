"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Team = { id: string; name: string; slug: string };
type Sender = { id: string; name: string | null; email: string };
type Message = {
  id: string;
  body: string;
  createdAt: string;
  sender: Sender;
};

export function ChatUI({
  facilityId,
  userId,
}: {
  facilityId: string;
  userId: string;
}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendBody, setSendBody] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/teams");
      if (!res.ok || cancelled) return;
      const data = await res.json();
      setTeams(data);
      if (data.length > 0 && !selectedTeamId) setSelectedTeamId(data[0].id);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once on mount to load teams
  }, []);

  const loadMessages = useCallback(async (teamId: string, cursor?: string) => {
    const url = cursor
      ? `/api/teams/${teamId}/messages?limit=50&cursor=${cursor}`
      : `/api/teams/${teamId}/messages?limit=50`;
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    if (cursor) {
      setMessages((prev) => [...data.messages, ...prev]);
    } else {
      setMessages(data.messages);
    }
    setNextCursor(data.nextCursor);
  }, []);

  useEffect(() => {
    if (!selectedTeamId) return;
    loadMessages(selectedTeamId);
    const teamId = selectedTeamId;
    const channel = supabase.channel(`team:${teamId}`);
    channel.on("broadcast", { event: "message" }, ({ payload }) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === payload.id)) return prev;
        return [...prev, payload];
      });
    });
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- loadMessages and supabase omitted to avoid re-subscribe churn
  }, [selectedTeamId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTeamId || !sendBody.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/teams/${selectedTeamId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: sendBody.trim() }),
      });
      if (res.ok) {
        setSendBody("");
        const msg = await res.json();
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      }
    } finally {
      setSending(false);
    }
  }

  if (loading) return <p className="text-gray-500">Loading teams…</p>;
  if (teams.length === 0)
    return (
      <p className="text-gray-500">
        No teams yet. Create a team from Admin or use the default General team
        after adding one in the database.
      </p>
    );

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg">
      <div className="flex gap-2 p-2 border-b">
        <label htmlFor="team-select" className="sr-only">
          Select team
        </label>
        <select
          id="team-select"
          value={selectedTeamId ?? ""}
          onChange={(e) => setSelectedTeamId(e.target.value || null)}
          className="border rounded px-3 py-2 text-black"
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col">
            <span className="text-sm font-medium">
              {m.sender.name || m.sender.email}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 break-words">
              {m.body}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(m.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-2 border-t flex gap-2">
        <input
          type="text"
          value={sendBody}
          onChange={(e) => setSendBody(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border rounded px-3 py-2 text-black"
          maxLength={4000}
        />
        <button
          type="submit"
          disabled={sending || !sendBody.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
