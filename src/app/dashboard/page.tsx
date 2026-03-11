import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/db/queries";
import { getUserScans } from "@/db/queries";
import Link from "next/link";
import type { GapItem, ScanAnalytics } from "@/db/schema";

export const metadata = {
    title: "Dashboard — AuraIQ",
};

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
    return (
        <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-slate-500 w-24 flex-shrink-0 font-medium">{label}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${score}%` }}
                />
            </div>
            <span className="text-xs font-bold text-slate-400 w-8 text-right tabular-nums">{score}%</span>
        </div>
    );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
    value, label, icon, color,
}: { value: string; label: string; icon: string; color: string }) {
    return (
        <div className={`rounded-2xl p-4 text-center border ${color} bg-white/[0.03]`}>
            <div className="text-xl mb-1">{icon}</div>
            <div className="text-2xl font-black text-white tabular-nums leading-none">{value}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{label}</div>
        </div>
    );
}

// ─── Gap Card ─────────────────────────────────────────────────────────────────

function GapCard({ gap, rank }: { gap: GapItem; rank: number }) {
    const scoreColor = gap.gapScore >= 8
        ? "border-violet-500/40 bg-violet-500/5"
        : gap.gapScore >= 6
            ? "border-blue-500/30 bg-blue-500/5"
            : gap.gapScore >= 4
                ? "border-amber-500/30 bg-amber-500/5"
                : "border-white/5 bg-white/[0.02]";

    const badgeColor = gap.gapScore >= 8
        ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
        : gap.gapScore >= 6
            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
            : gap.gapScore >= 4
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-white/5 text-slate-400 border border-white/10";

    return (
        <div className={`rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-500/10 overflow-hidden ${scoreColor}`}>
            {/* Card header */}
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Gap #{rank}</span>
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badgeColor}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    {gap.gapScore}/10
                </div>
            </div>

            <div className="p-5 space-y-3">
                {/* Title */}
                <h3 className="font-semibold text-white text-sm leading-snug">{gap.title}</h3>

                {/* Reasoning */}
                <p className="text-xs text-slate-500 leading-relaxed">{gap.reasoning}</p>

                {/* Hook */}
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3">
                    <div className="text-xs font-semibold text-violet-400 mb-1">🎣 Hook</div>
                    <p className="text-xs text-slate-300 italic">&ldquo;{gap.hook}&rdquo;</p>
                </div>

                {/* Target Audience */}
                {gap.targetAudience && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2">
                        <div className="text-xs font-semibold text-blue-400 mb-1">👥 Target Audience</div>
                        <p className="text-xs text-slate-300">{gap.targetAudience}</p>
                    </div>
                )}

                {/* Content Outline */}
                {gap.contentOutline && gap.contentOutline.length > 0 && (
                    <div>
                        <div className="text-xs font-semibold text-slate-500 mb-2">📋 Content Outline</div>
                        <div className="space-y-1.5">
                            {gap.contentOutline.map((item, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                    <span className="w-4 h-4 bg-violet-500/20 text-violet-400 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Competitor Weakness */}
                {gap.competitorWeakness && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                        <div className="text-xs font-semibold text-red-400 mb-1">🎯 Competitor Weakness</div>
                        <p className="text-xs text-slate-300">{gap.competitorWeakness}</p>
                    </div>
                )}

                {/* Format + Monetization */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
                        <div className="text-xs font-semibold text-slate-600 mb-1">📹 Format</div>
                        <p className="text-xs text-slate-300">{gap.format}</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
                        <div className="text-xs font-semibold text-slate-600 mb-1">💰 Angle</div>
                        <p className="text-xs text-slate-300">{gap.monetizationAngle}</p>
                    </div>
                </div>

                {/* SEO Tips */}
                {gap.seoTips && gap.seoTips.length > 0 && (
                    <div>
                        <div className="text-xs font-semibold text-slate-500 mb-2">🔍 SEO Tips</div>
                        <div className="space-y-1">
                            {gap.seoTips.map((tip, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                    <span className="text-emerald-400 flex-shrink-0">✓</span>
                                    {tip}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Analytics Panel ───────────────────────────────────────────────────────────

function AnalyticsPanel({ analytics }: { analytics: ScanAnalytics }) {
    const metrics = [
        { value: analytics.velocity.score.toFixed(1), label: "Velocity", icon: "📈", color: "border-blue-500/20" },
        { value: analytics.saturation.score.toFixed(1), label: "Opportunity", icon: "🎯", color: "border-emerald-500/20" },
        { value: analytics.frustration.score.toFixed(1), label: "Frustration", icon: "😤", color: "border-orange-500/20" },
        { value: analytics.trend.score.toFixed(1), label: "Trend", icon: "📊", color: "border-violet-500/20" },
    ];

    return (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span>📡</span> Gap Signal Metrics
                <span className="text-xs font-normal text-slate-600 ml-1">(higher = stronger opportunity)</span>
            </h3>

            {/* Score cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {metrics.map(m => (
                    <MetricCard key={m.label} {...m} />
                ))}
            </div>

            {/* Score bars */}
            <div className="mb-4">
                <ScoreBar label="Velocity" score={Math.round(analytics.velocity.score * 10)} color="bg-gradient-to-r from-blue-600 to-blue-400" />
                <ScoreBar label="Opportunity" score={Math.round(analytics.saturation.score * 10)} color="bg-gradient-to-r from-emerald-600 to-emerald-400" />
                <ScoreBar label="Frustration" score={Math.round(analytics.frustration.score * 10)} color="bg-gradient-to-r from-orange-600 to-orange-400" />
                <ScoreBar label="Trend" score={Math.round(analytics.trend.score * 10)} color="bg-gradient-to-r from-violet-600 to-violet-400" />
                <ScoreBar label="Competition" score={Math.round(analytics.competition.score * 10)} color="bg-gradient-to-r from-cyan-600 to-cyan-400" />
                <ScoreBar label="Engagement" score={Math.round(analytics.engagement.score * 10)} color="bg-gradient-to-r from-pink-600 to-pink-400" />
            </div>

            {/* Insight row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Upload schedule */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <div className="text-xs font-semibold text-slate-500 mb-1">📅 Best Upload Window</div>
                    <div className="text-sm font-bold text-white">{analytics.uploadSchedule.bestDay} · {analytics.uploadSchedule.bestHour}:00 UTC</div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">{analytics.uploadSchedule.insight}</div>
                </div>
                {/* Velocity insight */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <div className="text-xs font-semibold text-slate-500 mb-1">📈 Velocity Signal</div>
                    <div className="text-xs text-slate-300 leading-relaxed">{analytics.velocity.insight}</div>
                </div>
            </div>

            {/* Pain points */}
            {analytics.frustration.painPoints.length > 0 && (
                <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-500 mb-2">😤 Audience Pain Points</div>
                    <div className="flex flex-wrap gap-1.5">
                        {analytics.frustration.painPoints.map((p, i) => (
                            <span key={i} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2.5 py-0.5">⚡ {p}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Tags */}
            {analytics.suggestedTags.length > 0 && (
                <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-500 mb-2">🏷️ Suggested Tags</div>
                    <div className="flex flex-wrap gap-1.5">
                        {analytics.suggestedTags.slice(0, 12).map((tag, i) => (
                            <span key={i} className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-2.5 py-0.5">{tag}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/auth/signin");
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
        redirect("/auth/signin");
    }

    const scans = await getUserScans(user.id);

    // Aggregate stats
    const totalGaps = scans.reduce((s, scan) => {
        const result = scan.result as { gaps: GapItem[] } | null;
        return s + (result?.gaps?.length ?? 0);
    }, 0);
    const allGaps = scans.flatMap(s => (s.result as { gaps: GapItem[] } | null)?.gaps ?? []);
    const avgGapScore = allGaps.length > 0
        ? (allGaps.reduce((s, g) => s + g.gapScore, 0) / allGaps.length).toFixed(1)
        : "—";
    const uniqueKeywords = new Set(scans.map(s => s.keyword)).size;

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-indigo-600/6 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-10 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <img src="/auraiq-logo.png" alt="AuraIQ Logo" className="w-9 h-9 object-contain" />
                        <span className="text-base font-bold text-white">AuraIQ</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-1.5">
                            <span className="text-xs text-violet-300 font-medium">📡 Use Chrome Extension to run scans</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {session.user.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={session.user.image} alt={session.user.name ?? "User"} className="w-7 h-7 rounded-full ring-1 ring-violet-500/40" />
                            )}
                            <span className="text-sm text-slate-300 hidden sm:block">{session.user.name}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Stats Overview */}
                {scans.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { value: scans.length.toString(), label: "Total Scans", icon: "📡", color: "border-violet-500/20" },
                            { value: totalGaps.toString(), label: "Gaps Found", icon: "🎯", color: "border-blue-500/20" },
                            { value: avgGapScore.toString(), label: "Avg Gap Score", icon: "📊", color: "border-emerald-500/20" },
                            { value: uniqueKeywords.toString(), label: "Keywords Analyzed", icon: "🔍", color: "border-orange-500/20" },
                        ].map(stat => (
                            <div key={stat.label} className={`bg-white/[0.03] border rounded-2xl p-5 text-center ${stat.color}`}>
                                <div className="text-2xl mb-1">{stat.icon}</div>
                                <div className="text-3xl font-black text-white tabular-nums">{stat.value}</div>
                                <div className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Page header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Your Gap Scans</h1>
                        <p className="text-slate-500 text-sm mt-1">
                            {scans.length === 0
                                ? "No scans yet. Run your first scan with the Chrome Extension."
                                : `${scans.length} scan${scans.length === 1 ? "" : "s"} saved`}
                        </p>
                    </div>
                </div>

                {/* Empty state */}
                {scans.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">📡</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No scans yet</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
                            Install the AuraIQ Chrome Extension, navigate to a YouTube channel, and run your first gap scan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="#"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
                            >
                                📡 Get Chrome Extension
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 text-slate-400 px-6 py-3 rounded-xl font-medium text-sm hover:border-violet-500/30 hover:text-white transition-all"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-14">
                        {[...scans].reverse().map((scan) => {
                            const result = scan.result as { gaps: GapItem[]; overallOpportunity?: string; recommendedNiche?: string } | null;
                            const analytics = scan.analytics as ScanAnalytics | null;
                            if (!result?.gaps?.length) return null;

                            return (
                                <div key={scan.id}>
                                    {/* Scan header */}
                                    <div className="flex items-start justify-between mb-5">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <span className="text-xl font-bold text-white">
                                                    &ldquo;{scan.keyword}&rdquo;
                                                </span>
                                                {result.recommendedNiche && (
                                                    <span className="text-xs bg-violet-500/15 text-violet-300 border border-violet-500/25 rounded-full px-2.5 py-0.5 font-medium">
                                                        {result.recommendedNiche}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                                                <span>{new Date(scan.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                                <span>·</span>
                                                <span>{result.gaps.length} gaps found</span>
                                                {scan.competitors && (
                                                    <>
                                                        <span>·</span>
                                                        <span>{(scan.competitors as string[]).length} channels analyzed</span>
                                                    </>
                                                )}
                                            </div>
                                            {result.overallOpportunity && (
                                                <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">{result.overallOpportunity}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Analytics */}
                                    {analytics && <AnalyticsPanel analytics={analytics} />}

                                    {/* Gap Cards */}
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {result.gaps.map((gap, i) => (
                                            <GapCard key={i} gap={gap} rank={i + 1} />
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-b border-white/[0.04] mt-10" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
