"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getDemoCaseIdByKeyword,
  getResearchPlanByCaseId,
  type ResearchPlan,
} from "@/lib/demo-data";
import { FileText, Search, Sparkles } from "lucide-react";

// ─── Step Configuration ────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface PlatformProgress {
  name: string;
  estimatedCount: number;
  progress: number;
  collectedCount: number;
}

// ─── Inner Component (needs Suspense for useSearchParams) ───────────────────

function FlowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1 state - use number to track which lines to show
  const [step1VisibleCount, setStep1VisibleCount] = useState(0);

  // Step 2 state
  const [platforms, setPlatforms] = useState<PlatformProgress[]>([]);

  // Step 3 state
  const [step3VisibleCount, setStep3VisibleCount] = useState(0);

  // Use refs to avoid effect re-triggering
  const planRef = useRef<ResearchPlan | null>(null);
  const hasRedirected = useRef(false);
  const step2Started = useRef(false);
  const step1Started = useRef(false);
  const step3Started = useRef(false);
  const initDone = useRef(false);

  // ── Initialize research plan (runs once per query) ────────────────────────
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const caseId = getDemoCaseIdByKeyword(query);
    const p = getResearchPlanByCaseId(caseId);
    planRef.current = p;

    setPlatforms(
      p.sources.map((pl) => ({
        name: pl.name,
        estimatedCount: pl.estimatedCount,
        progress: 0,
        collectedCount: 0,
      }))
    );
  }, [query]);

  // ── Step 1: Planning animation ────────────────────────────────────────────
  useEffect(() => {
    if (currentStep !== 1 || step1Started.current || !planRef.current) return;
    step1Started.current = true;

    const t1 = setTimeout(() => setStep1VisibleCount(1), 400);
    const t2 = setTimeout(() => setStep1VisibleCount(2), 1200);
    const t3 = setTimeout(() => setStep1VisibleCount(3), 2000);
    const t4 = setTimeout(() => setStep1VisibleCount(4), 2800);
    const t5 = setTimeout(() => setCurrentStep(2), 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [currentStep]);

  // ── Step 2: Data collection animation ─────────────────────────────────────
  useEffect(() => {
    if (currentStep !== 2 || platforms.length === 0 || step2Started.current) return;
    step2Started.current = true;

    const speeds = platforms.map(() => 0.6 + Math.random() * 0.8);
    let animFrameId: number;
    let advanceTimeout: ReturnType<typeof setTimeout>;
    let running = true;

    function animate() {
      if (!running) return;
      setPlatforms((prev) => {
        let allDone = true;
        const next = prev.map((p, i) => {
          if (p.progress >= 100) return p;
          allDone = false;
          const rawSpeed = speeds[i % speeds.length];
          const factor = 1 - p.progress / 120;
          const increment = rawSpeed * factor * 3.5;
          const newProgress = Math.min(100, p.progress + increment);
          const collected = Math.round((newProgress / 100) * p.estimatedCount);
          return { ...p, progress: newProgress, collectedCount: collected };
        });

        if (allDone) {
          advanceTimeout = setTimeout(() => setCurrentStep(3), 800);
        } else {
          animFrameId = requestAnimationFrame(animate);
        }
        return next;
      });
    }

    animFrameId = requestAnimationFrame(animate);

    return () => {
      running = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (advanceTimeout) clearTimeout(advanceTimeout);
    };
  }, [currentStep, platforms.length]);

  // ── Step 3: Analysis generation animation ─────────────────────────────────
  useEffect(() => {
    if (currentStep !== 3 || step3Started.current) return;
    step3Started.current = true;

    const t1 = setTimeout(() => setStep3VisibleCount(1), 400);
    const t2 = setTimeout(() => setStep3VisibleCount(2), 1100);
    const t3 = setTimeout(() => setStep3VisibleCount(3), 1800);
    const t4 = setTimeout(() => setStep3VisibleCount(4), 2500);
    const t5 = setTimeout(() => setStep3VisibleCount(5), 3200);
    const t6 = setTimeout(() => {
      if (!hasRedirected.current && planRef.current) {
        hasRedirected.current = true;
        router.push(`/report/${planRef.current.caseId}/`);
      }
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [currentStep, router]);

  // ── Step 1 lines ──────────────────────────────────────────────────────────
  const step1Lines = planRef.current
    ? [
        "正在分析调研问题...",
        `确定分析维度：${planRef.current.dimensions.length}个维度`,
        `规划数据源：${planRef.current.sources.length}个平台`,
        "调研方案已生成 ✅",
      ]
    : [];

  // ── Step 3 lines ──────────────────────────────────────────────────────────
  const step3Lines = [
    "正在聚合多源数据...",
    "执行17维结构化分析...",
    "计算维度健康分...",
    "生成关键发现与结论...",
    "报告生成完成 ✅",
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="驾言" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-lg text-[var(--foreground)]">驾言</span>
          </div>
          <span className="text-xs text-[var(--muted)] bg-[var(--card)] px-2 py-0.5 rounded-full border border-[var(--card-border)]">
            AI 自主调研引擎
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          {/* Question display */}
          {query && (
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-5 py-3 text-sm text-[var(--muted)] max-w-full">
                <Search className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                <span className="truncate">{query}</span>
              </div>
            </div>
          )}

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {([1, 2, 3] as const).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-500 ${
                    currentStep === s
                      ? "bg-[var(--accent)] text-[var(--background)] shadow-lg shadow-[var(--accent)]/25 scale-110"
                      : currentStep > s
                      ? "bg-[var(--accent3)] text-[var(--background)]"
                      : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--muted)]"
                  }`}
                >
                  {currentStep > s ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < 3 && (
                  <div
                    className={`w-10 h-0.5 rounded transition-colors duration-500 ${
                      currentStep > s ? "bg-[var(--accent3)]" : "bg-[var(--card-border)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step titles */}
          <p className="text-center text-xs text-[var(--muted)] mb-8">
            {currentStep === 1 && "步骤 1/3 — 调研规划中"}
            {currentStep === 2 && "步骤 2/3 — 数据采集中"}
            {currentStep === 3 && "步骤 3/3 — 分析生成中"}
          </p>

          {/* ─── Step 1 Card ─── */}
          {currentStep === 1 && (
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="font-bold text-[var(--foreground)]">调研规划中</h2>
                  <p className="text-xs text-[var(--muted)]">AI正在分析问题并制定调研方案</p>
                </div>
              </div>

              <div className="space-y-3">
                {step1Lines.slice(0, step1VisibleCount).map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                      {text.includes("✅") ? (
                        <svg className="w-3 h-3 text-[var(--accent3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                      )}
                    </span>
                    <span className={`text-sm ${text.includes("✅") ? "text-[var(--accent3)] font-semibold" : "text-[var(--foreground)]"}`}>
                      {text}
                    </span>
                  </div>
                ))}

                {step1VisibleCount < step1Lines.length && (
                  <div className="flex items-center gap-2 pl-9">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Step 2 Card ─── */}
          {currentStep === 2 && (
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent2)]/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-[var(--accent2)]" />
                </div>
                <div>
                  <h2 className="font-bold text-[var(--foreground)]">数据采集中</h2>
                  <p className="text-xs text-[var(--muted)]">自动采集多平台用户反馈数据</p>
                </div>
              </div>

              <div className="space-y-5">
                {platforms.map((p, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">{p.name}</span>
                        <span className="text-xs text-[var(--muted)]">
                          {p.collectedCount.toLocaleString()} / {p.estimatedCount.toLocaleString()} 条
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[var(--accent2)]">{Math.round(p.progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--background)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-200 ease-out"
                        style={{
                          width: `${p.progress}%`,
                          background:
                            p.progress >= 100
                              ? "linear-gradient(90deg, #10b981, #34d399)"
                              : "linear-gradient(90deg, #06b6d4, #f59e0b)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {platforms.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[var(--card-border)]">
                  <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>总体进度</span>
                    <span>
                      {Math.round(platforms.reduce((s, p) => s + p.progress, 0) / platforms.length)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--background)] rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full transition-all duration-200 ease-out"
                      style={{
                        width: `${platforms.reduce((s, p) => s + p.progress, 0) / platforms.length}%`,
                        background: "linear-gradient(90deg, #06b6d4, #f59e0b, #10b981)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Step 3 Card ─── */}
          {currentStep === 3 && (
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent3)]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--accent3)]" />
                </div>
                <div>
                  <h2 className="font-bold text-[var(--foreground)]">分析生成中</h2>
                  <p className="text-xs text-[var(--muted)]">AI正在执行多维度结构化分析</p>
                </div>
              </div>

              <div className="space-y-3">
                {step3Lines.slice(0, step3VisibleCount).map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[var(--accent3)]/10 flex items-center justify-center flex-shrink-0">
                      {text.includes("✅") ? (
                        <svg className="w-3 h-3 text-[var(--accent3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[var(--accent3)] animate-pulse" />
                      )}
                    </span>
                    <span className={`text-sm ${text.includes("✅") ? "text-[var(--accent3)] font-semibold" : "text-[var(--foreground)]"}`}>
                      {text}
                    </span>
                  </div>
                ))}

                {step3VisibleCount < step3Lines.length && (
                  <div className="flex items-center gap-2 pl-9">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent3)] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent3)] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent3)] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Page Export (wraps FlowContent in Suspense) ────────────────────────────

export default function FlowPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
              <img src="/logo.png" alt="驾言" className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-sm text-[var(--muted)]">加载中...</span>
          </div>
        </div>
      }
    >
      <FlowContent />
    </Suspense>
  );
}
