"use client";

import Link from "next/link";
import { DIMENSIONS } from "@/lib/dimensions";
import {
  ArrowLeft, BarChart3, TrendingUp, TrendingDown, Minus,
  AlertTriangle, Lightbulb, ShieldAlert, MessageSquare,
  CheckCircle2, XCircle, HelpCircle, ChevronRight,
  ArrowDown, Info, ArrowUp, Activity, Download, Eye, EyeOff, Camera, FileText, MousePointerClick,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import type { DimensionFinding, ResearchReport } from "@/lib/types";

// Dynamic import recharts with ssr: false to avoid static export issues
const RadarChart = dynamic(
  () => import("recharts").then((mod) => mod.RadarChart),
  { ssr: false }
);
const PolarGrid = dynamic(
  () => import("recharts").then((mod) => mod.PolarGrid),
  { ssr: false }
);
const PolarAngleAxis = dynamic(
  () => import("recharts").then((mod) => mod.PolarAngleAxis),
  { ssr: false }
);
const PolarRadiusAxis = dynamic(
  () => import("recharts").then((mod) => mod.PolarRadiusAxis),
  { ssr: false }
);
const Radar = dynamic(
  () => import("recharts").then((mod) => mod.Radar),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const PieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  { ssr: false }
);
const Pie = dynamic(
  () => import("recharts").then((mod) => mod.Pie),
  { ssr: false }
);
const Cell = dynamic(
  () => import("recharts").then((mod) => mod.Cell),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { ssr: false }
);
const Bar = dynamic(
  () => import("recharts").then((mod) => mod.Bar),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
);
const Legend = dynamic(
  () => import("recharts").then((mod) => mod.Legend),
  { ssr: false }
);

const COLORS = {
  positive: "#10b981",
  negative: "#ef4444",
  neutral: "#6b7280",
  accent: "#06b6d4",
  accent2: "#f59e0b",
  accent3: "#10b981",
};

const BAR_COLORS = [
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f59e0b", // amber
];

export default function ReportClient({
  report,
  demoCaseType,
  caseId,
}: {
  report: ResearchReport;
  demoCaseType: string;
  caseId: string;
}) {
  // Save to history on mount
  useEffect(() => {
    try {
      const historyKey = "jiaYanHistory";
      const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
      const newItem = {
        id: caseId,
        question: report.question,
        type: demoCaseType,
        date: new Date().toISOString(),
      };
      // Remove duplicate if exists
      const filtered = existing.filter((item: { id: string }) => item.id !== caseId);
      const updated = [newItem, ...filtered].slice(0, 10);
      localStorage.setItem(historyKey, JSON.stringify(updated));
    } catch (e) {
      // localStorage not available, ignore
    }
  }, [caseId, report.question, demoCaseType]);

  // Back to top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = useCallback(() => {
    setShowBackToTop(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Radar chart data
  const radarDimensions =
    report.vehicleHealthScores[0]?.dimensions.map((d) => ({
      dimension:
        DIMENSIONS.find((dim) => dim.id === d.dimensionId)?.name || d.dimensionId,
      ...report.vehicleHealthScores.reduce(
        (acc, v) => ({
          ...acc,
          [v.vehicleName]:
            v.dimensions.find((vd) => vd.dimensionId === d.dimensionId)?.score || 0,
        }),
        {} as Record<string, number>
      ),
    })) || [];

  const vehicleNames = report.vehicleHealthScores.map((v) => v.vehicleName);
  const radarColors = [COLORS.accent, COLORS.accent2, COLORS.accent3, "#8b5cf6"];

  // Vehicle filter state for competitive matrix
  const [visibleVehicles, setVisibleVehicles] = useState<Set<string>>(
    new Set(report.vehicleHealthScores.map((v) => v.vehicleId))
  );
  const toggleVehicle = useCallback((vehicleId: string) => {
    setVisibleVehicles((prev) => {
      const next = new Set(prev);
      if (next.has(vehicleId)) {
        if (next.size > 1) next.delete(vehicleId);
      } else {
        next.add(vehicleId);
      }
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                // Add print-watermark class to trigger watermark in print CSS
                const reportEl = document.getElementById('report-content');
                if (reportEl) {
                  reportEl.classList.add('print-watermark');
                }
                // Trigger browser print dialog (user can save as PDF)
                window.print();
                // Remove class after print dialog closes
                setTimeout(() => {
                  if (reportEl) reportEl.classList.remove('print-watermark');
                }, 1000);
              }}
              className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              title="导出报告为PDF（通过浏览器打印功能保存）"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">导出PDF</span>
            </button>
            <button
              onClick={async () => {
                try {
                  const reportEl = document.getElementById('report-content');
                  if (!reportEl) return;

                  // Show loading feedback
                  const btn = document.activeElement as HTMLButtonElement;
                  const originalText = btn?.innerText || '导出图片';
                  if (btn) btn.innerText = '生成中...';

                  // Use html2canvas-pro which supports modern CSS color functions
                  const html2canvas = (await import('html2canvas-pro')).default;

                  // Pre-process: inline all CSS custom properties to hex values
                  // This avoids oklab parsing issues entirely
                  const computedStyles = window.getComputedStyle(document.body);
                  const colorMap: Record<string, string> = {
                    '--background': computedStyles.getPropertyValue('--background').trim() || '#0f172a',
                    '--foreground': computedStyles.getPropertyValue('--foreground').trim() || '#f1f5f9',
                    '--card': computedStyles.getPropertyValue('--card').trim() || '#1e293b',
                    '--card-border': computedStyles.getPropertyValue('--card-border').trim() || '#334155',
                    '--muted': computedStyles.getPropertyValue('--muted').trim() || '#94a3b8',
                    '--accent': computedStyles.getPropertyValue('--accent').trim() || '#06b6d4',
                    '--accent2': computedStyles.getPropertyValue('--accent2').trim() || '#f59e0b',
                    '--accent3': computedStyles.getPropertyValue('--accent3').trim() || '#10b981',
                    '--danger': computedStyles.getPropertyValue('--danger').trim() || '#ef4444',
                  };

                  // Create clone and replace CSS vars with static colors
                  const clone = reportEl.cloneNode(true) as HTMLElement;
                  clone.style.position = 'absolute';
                  clone.style.left = '-9999px';
                  clone.style.top = '0';
                  clone.style.width = reportEl.offsetWidth + 'px';
                  document.body.appendChild(clone);

                  // Replace all CSS var() usages in inline styles and classes
                  const allElements = clone.querySelectorAll('*');
                  allElements.forEach((el) => {
                    const htmlEl = el as HTMLElement;
                    // Replace inline styles containing var()
                    if (htmlEl.style.cssText.includes('var(')) {
                      Object.entries(colorMap).forEach(([key, val]) => {
                        htmlEl.style.cssText = htmlEl.style.cssText.replace(
                          new RegExp(`var\\(${key}\\)`, 'g'),
                          val
                        );
                      });
                    }
                  });

                  // Inject comprehensive style override to eliminate all var() references
                  const styleTag = document.createElement('style');
                  styleTag.textContent = `
                    #${clone.id}, #${clone.id} * {
                      background-color: ${colorMap['--background']} !important;
                      color: ${colorMap['--foreground']} !important;
                      border-color: ${colorMap['--card-border']} !important;
                    }
                    #${clone.id} .bg-\[var\(--card\)\] { background-color: ${colorMap['--card']} !important; }
                    #${clone.id} .text-\[var\(--accent\)\] { color: ${colorMap['--accent']} !important; }
                    #${clone.id} .text-\[var\(--accent2\)\] { color: ${colorMap['--accent2']} !important; }
                    #${clone.id} .text-\[var\(--accent3\)\] { color: ${colorMap['--accent3']} !important; }
                    #${clone.id} .text-\[var\(--danger\)\] { color: ${colorMap['--danger']} !important; }
                    #${clone.id} .text-\[var\(--muted\)\] { color: ${colorMap['--muted']} !important; }
                    #${clone.id} .border-\[var\(--card-border\)\] { border-color: ${colorMap['--card-border']} !important; }
                    #${clone.id} .bg-\[var\(--accent\)\]\/10 { background-color: ${colorMap['--accent']}19 !important; }
                    #${clone.id} .bg-\[var\(--accent2\)\]\/10 { background-color: ${colorMap['--accent2']}19 !important; }
                    #${clone.id} .bg-\[var\(--accent3\)\]\/10 { background-color: ${colorMap['--accent3']}19 !important; }
                    #${clone.id} .bg-\[var\(--danger\)\]\/10 { background-color: ${colorMap['--danger']}19 !important; }
                    #${clone.id} .bg-\[var\(--muted\)\]\/10 { background-color: ${colorMap['--muted']}19 !important; }
                    #${clone.id} .bg-\[var\(--accent\)\]\/8 { background-color: ${colorMap['--accent']}14 !important; }
                    #${clone.id} .border-\[var\(--accent\)\]\/20 { border-color: ${colorMap['--accent']}33 !important; }
                    #${clone.id} .border-\[var\(--accent\)\]\/25 { border-color: ${colorMap['--accent']}40 !important; }
                    #${clone.id} .border-\[var\(--accent\)\]\/30 { border-color: ${colorMap['--accent']}4d !important; }
                    #${clone.id} .border-\[var\(--accent2\)\]\/10 { border-color: ${colorMap['--accent2']}1a !important; }
                    #${clone.id} .border-\[var\(--accent3\)\]\/20 { border-color: ${colorMap['--accent3']}33 !important; }
                    #${clone.id} .border-\[var\(--danger\)\]\/20 { border-color: ${colorMap['--danger']}33 !important; }
                    #${clone.id} .border-\[var\(--muted\)\]\/20 { border-color: ${colorMap['--muted']}33 !important; }
                  `;
                  clone.appendChild(styleTag);

                  const canvas = await html2canvas(clone, {
                    backgroundColor: colorMap['--background'],
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    allowTaint: true,
                    foreignObjectRendering: false,
                  });

                  document.body.removeChild(clone);
                  const link = document.createElement('a');
                  link.download = `驾言调研报告_${report.question.slice(0, 20)}.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();

                  if (btn) btn.innerText = originalText;
                } catch (err) {
                  console.error('导出图片失败:', err);
                  alert('导出图片失败，请尝试使用「导出PDF」功能');
                  const btn = document.activeElement as HTMLButtonElement;
                  if (btn) btn.innerText = '导出图片';
                }
              }}
              className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              title="导出报告为图片"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">导出图片</span>
            </button>
            <span className="text-xs text-[var(--muted)] bg-[var(--card)] px-2 py-0.5 rounded-full border border-[var(--card-border)]">
              演示数据
            </span>
          </div>
        </div>
      </header>

      <main id="report-content" className="max-w-6xl mx-auto px-6 py-8">
        {/* Cover */}
        <section className="mb-10">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  demoCaseType === "competitive"
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : demoCaseType === "diagnostic"
                    ? "bg-[var(--accent2)]/10 text-[var(--accent2)]"
                    : "bg-[var(--accent3)]/10 text-[var(--accent3)]"
                }`}
              >
                {demoCaseType === "competitive"
                  ? "竞争分析"
                  : demoCaseType === "diagnostic"
                  ? "质量诊断"
                  : "机会发现"}
              </span>
              <span className="text-xs text-[var(--muted)]">
                生成时间：{new Date(report.createdAt).toLocaleString("zh-CN")}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
              {report.question}
            </h1>
            <p className="text-[var(--muted)] leading-relaxed mb-6">{report.summary}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-[var(--muted)]">
                <MessageSquare className="w-4 h-4" />
                <span>{report.totalFeedback.toLocaleString()} 条反馈</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent3)]" />
                <span>{report.sourceBreakdown.length} 个平台</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                <span>
                  {report.timeRange.start} ~ {report.timeRange.end}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 1: Executive Summary */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-sm font-bold">
              1
            </span>
            执行摘要
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="总采集量"
              value={report.overallStats.totalFeedback.toLocaleString()}
              unit="条"
              icon={<MessageSquare className="w-5 h-5" />}
              tooltip="本次调研从多平台采集的用户反馈总条数，数据量越大分析结果越可靠"
            />
            <StatCard
              label="正面占比"
              value={`${report.overallStats.sentimentDistribution.positive}%`}
              icon={<CheckCircle2 className="w-5 h-5 text-[var(--accent3)]" />}
              tooltip="用户表达满意或认可的反馈占比。低于30%说明整体口碑偏负面，需重点关注"
            />
            <StatCard
              label="Top 痛点"
              value={String(report.overallStats.topPainPoints)}
              unit="个"
              icon={<AlertTriangle className="w-5 h-5 text-[var(--accent2)]" />}
              tooltip="AI识别出的高频核心痛点数量。点击跳转到「深度分析」查看每个痛点的详细拆解"
              onClick={() => scrollToSection("deep-analysis")}
              clickable
            />
            <StatCard
              label="发现机会"
              value={String(report.overallStats.opportunitiesFound)}
              unit="个"
              icon={<Lightbulb className="w-5 h-5 text-[var(--accent)]" />}
              tooltip="基于痛点反向推导出的产品机会数量。点击跳转到「机会清单」查看优先级排序和行动建议"
              onClick={() => scrollToSection("opportunities")}
              clickable
            />
          </div>

          {/* Radar Chart */}
          {radarDimensions.length > 0 && (
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  维度健康分雷达图
                </h3>
              </div>
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent2)]/10 border border-[var(--accent)]/25 shadow-sm">
                <MousePointerClick className="w-4 h-4 text-[var(--accent)] flex-shrink-0 animate-pulse" />
                <span className="text-xs font-semibold text-[var(--accent)]">
                  点击雷达图上的<span className="underline decoration-dotted underline-offset-2 decoration-[var(--accent)]">青色维度名称</span>，可快速跳转到该维度的详细分析
                </span>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarDimensions}>
                    <PolarGrid stroke="var(--card-border)" />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={(props: any) => {
                        const { x, y, payload } = props;
                        const dim = DIMENSIONS.find((d) => d.name === payload.value);
                        const isClickable = !!dim;
                        return (
                          <g transform={`translate(${x},${y})`}>
                            {/* Background pill for clickable items */}
                            {isClickable && (
                              <rect
                                x={-((payload.value.length * 12) / 2 + 6)}
                                y={-10}
                                width={payload.value.length * 12 + 12}
                                height={20}
                                rx={10}
                                fill="var(--accent)"
                                opacity={0.08}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  if (dim) {
                                    scrollToSection(`dimension-${dim.id}`);
                                  }
                                }}
                              />
                            )}
                            <text
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill={isClickable ? "var(--accent)" : "var(--muted)"}
                              fontSize={isClickable ? 13 : 12}
                              fontWeight={isClickable ? 700 : 400}
                              style={{
                                cursor: isClickable ? "pointer" : "default",
                                textDecoration: isClickable ? "underline" : "none",
                                textUnderlineOffset: "3px",
                                textDecorationColor: "var(--accent)",
                                textDecorationStyle: "dotted",
                              }}
                              onClick={() => {
                                if (dim) {
                                  scrollToSection(`dimension-${dim.id}`);
                                }
                              }}
                            >
                              {payload.value}
                            </text>
                            {/* Click indicator dot above text */}
                            {isClickable && (
                              <circle
                                cx={0}
                                cy={-14}
                                r={2.5}
                                fill="var(--accent)"
                                opacity={0.7}
                              />
                            )}
                            {/* Small hand cursor icon hint */}
                            {isClickable && (
                              <text
                                x={((payload.value.length * 13) / 2) + 4}
                                y={-2}
                                textAnchor="start"
                                dominantBaseline="central"
                                fontSize={9}
                                fill="var(--accent)"
                                opacity={0.5}
                              >
                                ↗
                              </text>
                            )}
                          </g>
                        );
                      }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "var(--muted)", fontSize: 10 }}
                    />
                    {report.vehicleHealthScores
                      .filter((v) => visibleVehicles.has(v.vehicleId))
                      .map((v, i) => (
                        <Radar
                          key={v.vehicleName}
                          name={v.vehicleName}
                          dataKey={v.vehicleName}
                          stroke={radarColors[i % radarColors.length]}
                          fill={radarColors[i % radarColors.length]}
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      ))}
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

        {/* Chapter 2: Competitive Scan */}
        {report.competitiveInsights.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-sm font-bold">
                2
              </span>
              横向扫描
            </h2>

            {/* Competitive Matrix */}
            <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  竞品优劣势矩阵
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)]">显示车型：</span>
                  {report.vehicleHealthScores.map((v) => (
                    <button
                      key={v.vehicleId}
                      onClick={() => toggleVehicle(v.vehicleId)}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all cursor-pointer ${
                        visibleVehicles.has(v.vehicleId)
                          ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30"
                          : "bg-[var(--card)] text-[var(--muted)] border-[var(--card-border)] opacity-50"
                      }`}
                    >
                      {visibleVehicles.has(v.vehicleId) ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {v.vehicleName}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--card-border)]">
                      <th className="text-left py-3 px-4 text-[var(--muted)] font-medium">
                        车型
                      </th>
                      <th className="text-center py-3 px-4 text-[var(--muted)] font-medium">
                        综合得分
                      </th>
                      {report.vehicleHealthScores[0]?.dimensions.map((d) => (
                        <th
                          key={d.dimensionId}
                          className="text-center py-3 px-4 text-[var(--muted)] font-medium"
                        >
                          {DIMENSIONS.find((dim) => dim.id === d.dimensionId)?.name || d.dimensionId}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.vehicleHealthScores
                      .filter((v) => visibleVehicles.has(v.vehicleId))
                      .map((v) => (
                        <tr
                          key={v.vehicleId}
                          className="border-b border-[var(--card-border)]/50 hover:bg-[var(--background)]/50"
                        >
                          <td className="py-3 px-4 font-medium text-[var(--foreground)]">
                            {v.vehicleName}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <ScoreBadge score={v.overall} />
                          </td>
                          {v.dimensions.map((d) => (
                            <td key={d.dimensionId} className="py-3 px-4 text-center">
                              <button
                                onClick={() => scrollToSection(`dimension-${d.dimensionId}`)}
                                className={`text-sm font-medium cursor-pointer hover:underline transition-colors ${
                                  d.score >= 70
                                    ? "text-[var(--accent3)]"
                                    : d.score >= 50
                                    ? "text-[var(--accent2)]"
                                    : "text-[var(--danger)]"
                                }`}
                              >
                                {d.score}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weakness Observations */}
            {report.weaknessObservations.length > 0 && (
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--accent2)]" />
                  竞品薄弱环节观察
                  <span className="text-xs text-[var(--muted)] font-normal">（待验证假设）</span>
                </h3>
                <div className="space-y-4">
                  {report.weaknessObservations.map((wo, i) => (
                    <div
                      key={i}
                      className="border-l-2 border-[var(--accent2)]/40 pl-4 py-1"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {wo.dimensionName}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            wo.confidence === "high"
                              ? "bg-[var(--accent3)]/10 text-[var(--accent3)]"
                              : wo.confidence === "medium"
                              ? "bg-[var(--accent2)]/10 text-[var(--accent2)]"
                              : "bg-[var(--muted)]/10 text-[var(--muted)]"
                          }`}
                        >
                          置信度：{wo.confidence === "high" ? "高" : wo.confidence === "medium" ? "中" : "低"}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--muted)]">{wo.description}</p>
                      <p className="text-xs text-[var(--muted)]/70 mt-1">
                        涉及车型：{wo.affectedVehicles
                          .map((vid) => report.vehicles.find((v) => v.id === vid)?.model || vid)
                          .join("、")}
                        · 证据：{wo.evidenceCount} 条
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Chapter 3: Deep Analysis */}
        <section id="deep-analysis" className="mb-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-sm font-bold">
              {report.competitiveInsights.length > 0 ? "3" : "2"}
            </span>
            深度分析
          </h2>

          <div className="space-y-6">
            {report.dimensionFindings.map((df) => (
              <div key={df.dimensionId} id={`dimension-${df.dimensionId}`}>
                <DimensionAnalysisCard finding={df} />
              </div>
            ))}
          </div>
        </section>

        {/* Chapter 4: Opportunities */}
        <section id="opportunities" className="mb-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-sm font-bold">
              {report.competitiveInsights.length > 0 ? "4" : "3"}
            </span>
            机会清单
          </h2>

          <div className="space-y-4">
            {report.opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 hover:border-[var(--accent)]/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
                    <h3 className="font-semibold text-[var(--foreground)]">{opp.title}</h3>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      opp.priority === "high"
                        ? "bg-[var(--danger)]/10 text-[var(--danger)]"
                        : opp.priority === "medium"
                        ? "bg-[var(--accent2)]/10 text-[var(--accent2)]"
                        : "bg-[var(--muted)]/10 text-[var(--muted)]"
                    }`}
                  >
                    {opp.priority === "high" ? "高优先级" : opp.priority === "medium" ? "中优先级" : "低优先级"}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted)] mb-3">{opp.description}</p>
                <div className="bg-[var(--background)] rounded-lg p-3 mb-3">
                  <p className="text-xs text-[var(--muted)]">
                    <span className="text-[var(--accent)]">证据：</span>
                    {opp.evidence}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ChevronRight className="w-4 h-4 text-[var(--accent3)]" />
                  <span className="text-[var(--foreground)]">建议行动：</span>
                  <span className="text-[var(--muted)]">{opp.actionSuggestion}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Chapter 5: Risks */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-sm font-bold">
              {report.competitiveInsights.length > 0 ? "5" : "4"}
            </span>
            风险与建议
          </h2>

          <div className="space-y-4">
            {report.risks.map((risk) => (
              <div
                key={risk.id}
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert
                      className={`w-5 h-5 ${
                        risk.severity === "high"
                          ? "text-[var(--danger)]"
                          : risk.severity === "medium"
                          ? "text-[var(--accent2)]"
                          : "text-[var(--muted)]"
                      }`}
                    />
                    <h3 className="font-semibold text-[var(--foreground)]">{risk.title}</h3>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      risk.severity === "high"
                        ? "bg-[var(--danger)]/10 text-[var(--danger)]"
                        : risk.severity === "medium"
                        ? "bg-[var(--accent2)]/10 text-[var(--accent2)]"
                        : "bg-[var(--muted)]/10 text-[var(--muted)]"
                    }`}
                  >
                    {risk.severity === "high" ? "高风险" : risk.severity === "medium" ? "中风险" : "低风险"}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted)] mb-3">{risk.description}</p>
                <div className="bg-[var(--background)] rounded-lg p-3">
                  <p className="text-sm text-[var(--foreground)]">
                    <span className="text-[var(--accent3)]">缓解措施：</span>
                    {risk.mitigation}
                  </p>
                </div>
                <p className="text-xs text-[var(--muted)]/70 mt-2">
                  基于 {risk.evidenceCount} 条反馈分析
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Appendix */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[var(--card-border)] flex items-center justify-center text-[var(--muted)] text-sm font-bold">
              附
            </span>
            附录
          </h2>

          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">数据源明细</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {report.sourceBreakdown.map((s, i) => (
                <Link
                  key={i}
                  href={`/report/${caseId}/sources/`}
                  className="text-center p-3 bg-[var(--background)] rounded-lg hover:border-[var(--accent)]/50 border border-transparent transition-colors"
                >
                  <div className="text-lg font-bold text-[var(--foreground)]">{s.count}</div>
                  <div className="text-xs text-[var(--muted)]">{s.source}</div>
                </Link>
              ))}
            </div>
            <div className="mb-6">
              <Link
                href={`/report/${caseId}/sources/`}
                className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline transition-colors"
              >
                查看原始数据
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">方法论说明</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              本报告基于大语言模型（LLM）对多源用户反馈进行结构化分析。分析维度覆盖智能座舱、辅助驾驶、整车基础三大层共17个维度。
              每个维度的健康分由情感分布（40%）、提及频率（25%）、负面严重度（25%）、趋势变化（10%）四个子分加权合成，并标注置信度区间。
              所有结论均锚定原始评论证据，可追溯验证。
            </p>

            <div className="mt-4 p-3 bg-[var(--accent2)]/5 border border-[var(--accent2)]/10 rounded-lg">
              <p className="text-xs text-[var(--accent2)]">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                免责声明：本报告为 AI 生成内容，仅供决策参考。建议结合专业判断和内部数据验证后使用。
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--card-border)] shadow-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)]/50 transition-all cursor-pointer"
          aria-label="返回顶部"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function StatCard({
  label,
  value,
  unit,
  icon,
  tooltip,
  onClick,
  clickable,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
  clickable?: boolean;
}) {
  const Wrapper = clickable ? "button" : "div";
  const wrapperProps = clickable
    ? {
        onClick,
        className:
          "bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 text-left w-full hover:border-[var(--accent)]/50 hover:bg-[var(--card)]/80 transition-all cursor-pointer group relative",
      }
    : {
        className:
          "bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 group relative",
      };

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex items-center gap-2 text-[var(--muted)] mb-2">
        {icon}
        <span className="text-xs">{label}</span>
        {tooltip && (
          <div className="relative ml-auto">
            <Info className="w-3.5 h-3.5 text-[var(--muted)]/50 group-hover:text-[var(--accent)] transition-colors" />
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 w-56 p-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
              <p className="text-xs text-[var(--muted)] leading-relaxed">{tooltip}</p>
              {clickable && (
                <div className="flex items-center gap-1 mt-1.5 text-[var(--accent)]">
                  <ArrowDown className="w-3 h-3" />
                  <span className="text-[10px]">点击查看详情</span>
                </div>
              )}
              {/* Arrow */}
              <div className="absolute top-full right-3 -mt-1 w-2 h-2 bg-[var(--background)] border-r border-b border-[var(--card-border)] rotate-45" />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-[var(--foreground)]">{value}</span>
        {unit && <span className="text-sm text-[var(--muted)]">{unit}</span>}
      </div>
      {clickable && (
        <div className="mt-2 flex items-center gap-1 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px]">查看详情</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      )}
    </Wrapper>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
        score >= 70
          ? "bg-[var(--accent3)]/10 text-[var(--accent3)]"
          : score >= 50
          ? "bg-[var(--accent2)]/10 text-[var(--accent2)]"
          : "bg-[var(--danger)]/10 text-[var(--danger)]"
      }`}
    >
      <BarChart3 className="w-3 h-3" />
      {score}
    </span>
  );
}

function DimensionAnalysisCard({ finding }: { finding: DimensionFinding }) {
  const [showConfidenceTip, setShowConfidenceTip] = useState(false);

  const pieData = [
    { name: "正面", value: finding.sentimentDistribution.positive, color: COLORS.positive },
    { name: "负面", value: finding.sentimentDistribution.negative, color: COLORS.negative },
    { name: "中性", value: finding.sentimentDistribution.neutral, color: COLORS.neutral },
  ];

  return (
    <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
      {/* Header */}
      <div className="mb-4">
        {/* Row 1: Title + Score + Trend */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-lg font-bold text-[var(--foreground)]">{finding.dimensionName}</h3>
          <ScoreBadge score={finding.score} />
          {finding.trend === "up" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent3)]/15 text-[var(--accent3)] border border-[var(--accent3)]/20">
              <TrendingUp className="w-3.5 h-3.5" /> 趋势改善
            </span>
          ) : finding.trend === "down" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--danger)]/15 text-[var(--danger)] border border-[var(--danger)]/20">
              <TrendingDown className="w-3.5 h-3.5" /> 趋势恶化
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--muted)]/15 text-[var(--muted)] border border-[var(--muted)]/20">
              <Minus className="w-3.5 h-3.5" /> 趋势平稳
            </span>
          )}
        </div>
        {/* Row 2: Confidence + Pie Chart */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted)]">置信度 {Math.round(finding.confidence * 100)}%</span>
            <button
              onClick={() => setShowConfidenceTip(!showConfidenceTip)}
              className="relative text-[var(--muted)]/50 hover:text-[var(--accent)] transition-colors cursor-pointer"
              aria-label="置信度说明"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showConfidenceTip && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-3 bg-[var(--background)] border border-[var(--card-border)] rounded-lg shadow-lg z-50">
                  <p className="text-xs text-[var(--muted)] leading-relaxed mb-2">
                    置信度表示该维度分析结果的可信程度。由以下因素综合评定：
                  </p>
                  <ul className="text-xs text-[var(--muted)] leading-relaxed space-y-1 mb-2">
                    <li>• 数据量充足度（反馈条数是否达到统计显著阈值）</li>
                    <li>• 情感分布一致性（正面/负面比例是否稳定）</li>
                    <li>• 时间跨度覆盖度（数据时间范围是否足够长）</li>
                    <li>• 来源多样性（覆盖平台数量是否充分）</li>
                  </ul>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    置信度 ≥80% 为高，60-80% 为中，&lt;60% 为低
                  </p>
                  {/* Arrow */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-[var(--background)] border-l border-t border-[var(--card-border)] rotate-45" />
                </div>
              )}
            </button>
          </div>
          {/* Right: pie chart - tightly packed */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={14}
                    outerRadius={30}
                    dataKey="value"
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[10px] text-[var(--muted)]">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">关键发现</h4>
        <ul className="space-y-2">
          {finding.keyFindings.map((kf, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 flex-shrink-0" />
              {kf}
            </li>
          ))}
        </ul>
      </div>

      {/* Evidence */}
      {finding.evidence.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">典型反馈引用</h4>
          <div className="space-y-2">
            {finding.evidence.slice(0, 3).map((ev) => (
              <div
                key={ev.id}
                className="bg-[var(--background)] rounded-lg p-3 border-l-2 border-[var(--card-border)]"
              >
                <p className="text-sm text-[var(--foreground)] mb-1">&ldquo;{ev.content}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      ev.sentiment === "positive"
                        ? "bg-[var(--accent3)]/10 text-[var(--accent3)]"
                        : ev.sentiment === "negative"
                        ? "bg-[var(--danger)]/10 text-[var(--danger)]"
                        : "bg-[var(--muted)]/10 text-[var(--muted)]"
                    }`}
                  >
                    {ev.sentiment === "positive" ? "正面" : ev.sentiment === "negative" ? "负面" : "中性"}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{ev.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Mentions */}
      {finding.featureMentions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">功能提及分布</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={finding.featureMentions.slice(0, 5)}
                layout="vertical"
                margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fill: "var(--foreground)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                  fill={BAR_COLORS[0]}
                >
                  {finding.featureMentions.slice(0, 5).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
