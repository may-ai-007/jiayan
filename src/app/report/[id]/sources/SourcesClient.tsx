"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, BarChart3 } from "lucide-react";
import { getMockSourceComments } from "@/lib/demo-data";

interface SourceItem {
  source: string;
  count: number;
}

interface SourcesClientProps {
  caseId: string;
  sources: SourceItem[];
}

export default function SourcesClient({ caseId, sources }: SourcesClientProps) {
  const [activeSource, setActiveSource] = useState(sources[0]?.source || "");

  const currentComments = useMemo(() => {
    return getMockSourceComments(activeSource, caseId);
  }, [activeSource, caseId]);

  const sentimentStats = useMemo(() => {
    const total = currentComments.length;
    if (total === 0) return { positive: 0, negative: 0, neutral: 0, total: 0 };
    const positive = currentComments.filter((c) => c.sentiment === "positive").length;
    const negative = currentComments.filter((c) => c.sentiment === "negative").length;
    const neutral = currentComments.filter((c) => c.sentiment === "neutral").length;
    return { positive, negative, neutral, total };
  }, [currentComments]);

  const activeSourceCount = sources.find((s) => s.source === activeSource)?.count || 0;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/report/${caseId}/`}
              className="flex items-center gap-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">返回</span>
            </Link>
            <div className="w-px h-4 bg-[var(--card-border)]" />
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="驾言" className="w-6 h-6 rounded" />
              <span className="font-bold text-[var(--foreground)]">驾言</span>
            </Link>
          </div>
          <span className="text-xs text-[var(--muted)] bg-[var(--card)] px-2 py-0.5 rounded-full border border-[var(--card-border)]">
            原始数据
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">数据源明细</h1>

        <div className="flex gap-6">
          {/* Platform Tabs - Left Sidebar */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--card-border)]">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                  数据平台
                </span>
              </div>
              <div className="p-1.5">
                {sources.map((src) => (
                  <button
                    key={src.source}
                    onClick={() => setActiveSource(src.source)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeSource === src.source
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{src.source}</span>
                      <span
                        className={`text-xs ${
                          activeSource === src.source
                            ? "text-[var(--accent)]"
                            : "text-[var(--muted)]"
                        }`}
                      >
                        {src.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comments Area */}
          <div className="flex-1 min-w-0">
            {/* Stats Summary */}
            {currentComments.length > 0 && (
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {activeSource}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--muted)]">
                    原始采集 {activeSourceCount} 条 · 当前展示 {currentComments.length} 条
                  </span>
                </div>
                {/* Sentiment Distribution Bar */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent3)]" />
                    <span className="text-[var(--muted)]">
                      正面 <strong className="text-[var(--accent3)]">{sentimentStats.positive}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--danger)]" />
                    <span className="text-[var(--muted)]">
                      负面 <strong className="text-[var(--danger)]">{sentimentStats.negative}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--muted)]" />
                    <span className="text-[var(--muted)]">
                      中性 <strong className="text-[var(--foreground)]">{sentimentStats.neutral}</strong>
                    </span>
                  </div>
                  {/* Mini progress bar */}
                  {sentimentStats.total > 0 && (
                    <div className="flex-1 max-w-[200px] h-1.5 rounded-full bg-[var(--background)] overflow-hidden ml-2">
                      <div className="flex h-full">
                        <div
                          className="bg-[var(--accent3)] h-full transition-all"
                          style={{
                            width: `${(sentimentStats.positive / sentimentStats.total) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-[var(--danger)] h-full transition-all"
                          style={{
                            width: `${(sentimentStats.negative / sentimentStats.total) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-[var(--muted)] h-full transition-all"
                          style={{
                            width: `${(sentimentStats.neutral / sentimentStats.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Comment List */}
            {currentComments.length > 0 ? (
              <div className="space-y-3">
                {currentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--card-border)]/70 transition-colors"
                  >
                    <p className="text-sm text-[var(--foreground)] leading-relaxed mb-3">
                      &ldquo;{comment.content}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          comment.sentiment === "positive"
                            ? "bg-[var(--accent3)]/10 text-[var(--accent3)]"
                            : comment.sentiment === "negative"
                            ? "bg-[var(--danger)]/10 text-[var(--danger)]"
                            : "bg-[var(--muted)]/10 text-[var(--muted)]"
                        }`}
                      >
                        {comment.sentiment === "positive"
                          ? "正面"
                          : comment.sentiment === "negative"
                          ? "负面"
                          : "中性"}
                      </span>
                      <span className="text-xs text-[var(--muted)]">{comment.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-12 text-center">
                <MessageSquare className="w-8 h-8 text-[var(--muted)]/40 mx-auto mb-3" />
                <p className="text-sm text-[var(--muted)]">该平台暂无展示数据</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}