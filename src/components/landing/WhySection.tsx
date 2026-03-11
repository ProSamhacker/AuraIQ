const vsComparison = [
    { feature: "Channel Analysis (500+ videos)", gapradar: true, vidiq: true,  tubebuddy: false },
    { feature: "Statistical Gap Detection",       gapradar: true, vidiq: false, tubebuddy: false },
    { feature: "Wilson Score Engagement",          gapradar: true, vidiq: false, tubebuddy: false },
    { feature: "SEO Audit (Title + Desc + Tags)", gapradar: true, vidiq: true,  tubebuddy: true  },
    { feature: "AI Tag Generator (50 tags)",      gapradar: true, vidiq: true,  tubebuddy: true  },
    { feature: "Thumbnail AI Concepts",           gapradar: true, vidiq: false, tubebuddy: false },
    { feature: "Upload Schedule Optimizer",       gapradar: true, vidiq: false, tubebuddy: false },
    { feature: "Audience Frustration Analysis",   gapradar: true, vidiq: false, tubebuddy: false },
    { feature: "Content Outline Generator",       gapradar: true, vidiq: false, tubebuddy: false },
    { feature: "Abandonment Signal Detection",    gapradar: true, vidiq: false, tubebuddy: false },
    { feature: "Free to use",                     gapradar: true, vidiq: false, tubebuddy: false },
];

const Check = ({ on, highlight }: { on: boolean; highlight?: boolean }) =>
    on ? (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${highlight ? "bg-violet-500/20 text-violet-400" : "text-gray-400"} font-bold text-sm`}>✓</span>
    ) : (
        <span className="text-gray-700 text-sm">—</span>
    );

export default function WhySection() {
    return (
        <section id="why-auraiq" className="scroll-mt-16 py-16 sm:py-24 px-4 bg-[#0d0d14]">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5">
                        <span className="text-sm font-medium text-gray-400">Comparison</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                        Why AuraIQ Beats{" "}
                        <span className="shimmer-text">VidIQ &amp; TubeBuddy.</span>
                    </h2>
                    <p className="text-gray-400 text-base sm:text-lg">More features. Statistical accuracy. Free.</p>
                </div>

                {/* Scrollable table wrapper on mobile */}
                <div className="glass rounded-2xl overflow-hidden border border-white/8">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[480px]">
                            <thead>
                                <tr className="border-b border-white/8 bg-white/5">
                                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/2">Feature</th>
                                    <th className="px-3 py-3 text-center">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-xs font-bold text-violet-300 whitespace-nowrap">
                                            ✨ AuraIQ
                                        </span>
                                    </th>
                                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">VidIQ</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">TubeBuddy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vsComparison.map((row, i) => (
                                    <tr key={row.feature} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                                        <td className="px-4 py-3 text-sm text-gray-300">{row.feature}</td>
                                        <td className="px-3 py-3 text-center"><Check on={row.gapradar} highlight /></td>
                                        <td className="px-3 py-3 text-center"><Check on={row.vidiq} /></td>
                                        <td className="px-3 py-3 text-center"><Check on={row.tubebuddy} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
                    * VidIQ and TubeBuddy require paid plans for most features. AuraIQ is free during early access.
                </p>
            </div>
        </section>
    );
}
