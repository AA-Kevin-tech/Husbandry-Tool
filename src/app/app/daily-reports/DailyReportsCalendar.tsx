"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Section = { id: string; name: string };
type Report = { id: string; date: string; importance: string };

export function DailyReportsCalendar({
  sections,
}: {
  sections: Section[];
}) {
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sectionId) {
      setReports([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 0);
    fetch(
      `/api/daily-reports?sectionId=${sectionId}&from=${from.toISOString().slice(0, 10)}&to=${to.toISOString().slice(0, 10)}`
    )
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setReports(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, [sectionId, year, month]);

  const reportByDate = reports.reduce((acc, r) => {
    acc[r.date.slice(0, 10)] = r;
    return acc;
  }, {} as Record<string, Report>);

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const cells: (Report | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(reportByDate[dateStr] ?? null);
  }

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const monthName = first.toLocaleString("default", { month: "long" });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          className="border rounded px-3 py-2 text-black"
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ←
          </button>
          <span className="px-2 font-medium min-w-[140px] text-center">
            {monthName} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-medium text-center py-1 text-gray-500">
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          const dayNum = i - startPad + 1;
          const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
          const dateStr = isCurrentMonth
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
            : "";
          const report = cell;
          return (
            <div
              key={i}
              className={`min-h-[44px] border rounded p-1 ${
                !isCurrentMonth ? "invisible" : ""
              }`}
            >
              {isCurrentMonth && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{dayNum}</span>
                    {report && (
                      <span
                        className={`text-xs ${
                          report.importance === "Critical"
                            ? "text-red-600"
                            : report.importance === "Important"
                            ? "text-orange-600"
                            : "text-gray-500"
                        }`}
                      >
                        {report.importance === "Critical"
                          ? "!"
                          : report.importance === "Important"
                          ? "•"
                          : ""}
                      </span>
                    )}
                  </div>
                  {report ? (
                    <Link
                      href={`/app/daily-reports/${report.id}`}
                      className="block text-xs text-blue-600 hover:underline mt-0.5"
                    >
                      View
                    </Link>
                  ) : (
                    <Link
                      href={`/app/daily-reports/new?sectionId=${sectionId}&date=${dateStr}`}
                      className="block text-xs text-gray-500 hover:underline mt-0.5"
                    >
                      Add
                    </Link>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {loading && <p className="text-sm text-gray-500">Loading…</p>}
    </div>
  );
}
