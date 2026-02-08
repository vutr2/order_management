"use client";

import { useState } from "react";
import { ChatBox } from "@/components/ai/chat-box";

export default function AskAIPage() {
  const [report, setReport] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);

  async function generateReport() {
    setLoadingReport(true);
    try {
      const res = await fetch("/api/ai/report");
      const data = await res.json();
      if (!res.ok) {
        setReport(data.error || "Failed to generate report.");
      } else {
        setReport(data.report);
      }
    } catch {
      setReport("Failed to connect. Please try again.");
    } finally {
      setLoadingReport(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ask AI</h1>
        <button
          onClick={generateReport}
          disabled={loadingReport}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          {loadingReport ? "Generating..." : "Weekly Report"}
        </button>
      </div>

      {report && (
        <div className="mb-6 p-6 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-purple-700 dark:text-purple-300">Weekly Report</h2>
            <button
              onClick={() => setReport("")}
              className="text-xs text-purple-500 hover:text-purple-700 transition"
            >
              Dismiss
            </button>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
            {report}
          </div>
        </div>
      )}

      <ChatBox />
    </div>
  );
}
