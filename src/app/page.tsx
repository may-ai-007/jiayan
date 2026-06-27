"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { demoCases } from "@/lib/demo-data";
import {
  Search,
  BarChart3,
  Zap,
  ChevronRight,
  Sparkles,
  Clock,
  FileText,
  History,
} from "lucide-react";

interface HistoryItem {
  id: string;
  question: string;
  type: string;
  date: string;
}

const examples = [
  "20-30万纯电轿车里，语音助手体验怎么样？主要槽点在哪？",
  "理想L7的车机交互设计有什么值得学习的地方？",
  "最近半年OTA升级后，车主对辅助驾驶的评价变化趋势是怎样的？",
];

const HISTORY_KEY = "jiaYanHistory";
const MAX_HISTORY = 10;

function getTypeLabel(type: string): string {
  switch (type) {
    case "competitive":
      return "竞争分析";
    case "diagnostic":
      return "质量诊断";
    case "opportunity":
      return "机会发现";
    default:
      return type || "调研";
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case "competitive":
      return "bg-[var(--accent)]/10 text-[var(--accent)]";
    case "diagnostic":
      return "bg-[var(--accent2)]/10 text-[var(--accent2)]";
    case "opportunity":
      return "bg-[var(--accent3)]/10 text-[var(--accent3)]";
    default:
      return "bg-[var(--muted)]/10 text-[var(--muted)]";
  }
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString("zh-CN", {
      month: "numeric",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Migrate old report-* ids to case-* ids
          const migrated = parsed.map((item: HistoryItem) => {
            if (item.id.startsWith("report-")) {
              return { ...item, id: item.id.replace("report-", "case-") };
            }
            return item;
          });
          setHistory(migrated);
          localStorage.setItem(HISTORY_KEY, JSON.stringify(migrated));
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsPlanning(true);
    // 导航到流程页，由流程页处理调研流程后跳转到报告
    const encoded = encodeURIComponent(query.trim());
    router.push(`/flow/?q=${encoded}`);
  };

  const handleExampleClick = (ex: string) => {
    setQuery(ex);
  };

  const handleDemoCaseClick = (caseQuestion: string) => {
    const encoded = encodeURIComponent(caseQuestion);
    router.push(`/flow/?q=${encoded}`);
  };

  const handleHistoryClick = (item: HistoryItem) => {
    router.push(`/report/${item.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="驾言" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-lg text-[var(--foreground)]">
              驾言
            </span>
            <span className="text-xs text-[var(--muted)] bg-[var(--card)] px-2 py-0.5 rounded-full border border-[var(--card-border)]">
              AI 自主调研引擎
            </span>
          </div>
          <span className="text-xs text-[var(--muted)] bg-[var(--card)] px-2 py-0.5 rounded-full border border-[var(--card-border)]">
            演示数据
          </span>
        </div>
      </header>

      <main className="flex-1">
        {/* Recent History */}
        {history.length > 0 && (
          <section className="pt-6 pb-2 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  最近调研
                </h2>
                <span className="text-xs text-[var(--muted)]">
                  {history.length} 条记录
                </span>
              </div>
              <div className="relative group">
                <div
                  id="history-scroll"
                  className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none scroll-smooth"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistoryClick(item)}
                      className="flex-shrink-0 w-64 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 text-left hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/80 transition-all group/card"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(
                            item.type
                          )}`}
                        >
                          {getTypeLabel(item.type)}
                        </span>
                        <span className="text-xs text-[var(--muted)]/70">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--foreground)] leading-snug line-clamp-2 group-hover/card:text-[var(--accent)] transition-colors">
                        {item.question}
                      </p>
                    </button>
                  ))}
                </div>
                {/* Scroll hint */}
                {history.length > 3 && (
                  <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-[var(--muted)] animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Hero */}
        <section className="pt-16 pb-12 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              面向汽车座舱产品经理的智能调研系统
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4 leading-tight">
              输入一个问题
              <br />
              <span className="text-[var(--accent)]">生成一份深度调研报告</span>
            </h1>
            <p className="text-[var(--muted)] text-lg mb-10 max-w-xl mx-auto">
              自动采集多源用户反馈，AI 结构化分析，输出带证据锚定的决策级报告
            </p>

            {/* Input */}
            <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="输入你想调研的问题，例如：20-30万纯电轿车语音助手体验怎么样？"
                  className="w-full pl-12 pr-32 py-4 bg-[var(--card)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                />
                <button
                  type="submit"
                  disabled={isPlanning || !query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--background)] px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  {isPlanning ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      跳转中...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      开始调研
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Examples */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-[var(--muted)]">试试：</span>
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(ex)}
                  className="text-sm text-[var(--accent)] hover:text-[var(--accent)]/80 bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 border border-[var(--accent)]/10 rounded-full px-3 py-1 transition-colors"
                >
                  {ex.length > 20 ? ex.slice(0, 20) + "..." : ex}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Cases */}
        <section className="py-12 px-6 border-t border-[var(--card-border)]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                演示案例
              </h2>
              <span className="text-xs text-[var(--muted)] bg-[var(--card)] px-2 py-0.5 rounded-full border border-[var(--card-border)]">
                演示数据
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {demoCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleDemoCaseClick(c.question)}
                  className="group bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 text-left hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/80 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        c.type === "competitive"
                          ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                          : c.type === "diagnostic"
                          ? "bg-[var(--accent2)]/10 text-[var(--accent2)]"
                          : "bg-[var(--accent3)]/10 text-[var(--accent3)]"
                      }`}
                    >
                      {c.type === "competitive"
                        ? "竞争分析"
                        : c.type === "diagnostic"
                        ? "质量诊断"
                        : "机会发现"}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-2 text-sm leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[var(--muted)] mb-3 line-clamp-2">
                    {c.question}
                  </p>
                  <p className="text-xs text-[var(--muted)]/70">
                    {c.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 px-6 border-t border-[var(--card-border)]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-[var(--foreground)] text-center mb-8">
              核心能力
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: <Search className="w-6 h-6" />,
                  title: "多源采集",
                  desc: "自动采集微博、懂车帝、汽车之家等多平台用户反馈",
                },
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "17维分析",
                  desc: "覆盖座舱、智驾、整车三大层的结构化分析体系",
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "证据锚定",
                  desc: "每条结论附带原始评论引用，可追溯可验证",
                },
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  title: "竞品洞察",
                  desc: "同维度横向对比，发现差异化产品机会",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="text-center p-5 bg-[var(--card)]/50 border border-[var(--card-border)] rounded-xl"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1 text-sm">
                    {f.title}
                  </h3>
                  <p className="text-xs text-[var(--muted)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-6 px-6">
        <div className="max-w-5xl mx-auto text-center text-xs text-[var(--muted)]">
          <p>驾言 -- AI 自主调研引擎 | 演示版本，数据为虚构</p>
        </div>
      </footer>
    </div>
  );
}