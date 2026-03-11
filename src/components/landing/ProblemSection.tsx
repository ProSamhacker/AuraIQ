const problems = [
    "Random idea generation with no data",
    "Generic keyword tools that everyone uses",
    "Guessing based on trending topics",
    "Blindly copying competitor videos",
];

const solutions = [
    { icon: "⚡", label: "Velocity detection", desc: "Spot channels gaining momentum before they peak" },
    { icon: "😤", label: "Frustration mining", desc: "NLP analysis of comment pain points" },
    { icon: "🎯", label: "Underserved angle discovery", desc: "Find the exact gap your competitors miss" },
    { icon: "⏱", label: "Strategic timing insight", desc: "Know *when* to post for maximum impact" },
];

export default function ProblemSection() {
    return (
        <section className="py-16 sm:py-24 px-4 bg-[#0d0d14]">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
            </div>
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5">
                        <span className="text-sm font-medium text-gray-400">The Problem</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
                        You&apos;re Not Losing Views.
                        <br />
                        <span className="shimmer-text">You&apos;re Missing Signals.</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        By the time a topic &ldquo;looks hot,&rdquo; it&apos;s already saturated.
                        What you need is what others can&apos;t see yet.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* What most creators do */}
                    <div className="glass rounded-2xl p-8 border border-white/5">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="w-9 h-9 bg-red-500/15 border border-red-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-red-400 text-sm font-bold">✗</span>
                            </div>
                            <h3 className="font-semibold text-gray-300">What most creators rely on:</h3>
                        </div>
                        <ul className="space-y-4">
                            {problems.map((p) => (
                                <li key={p} className="flex items-start gap-3 text-gray-400">
                                    <span className="w-5 h-5 mt-0.5 rounded-full border border-gray-600 flex-shrink-0" />
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* What AuraIQ provides */}
                    <div className="glass-purple rounded-2xl p-8 border border-violet-500/20">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            <h3 className="font-semibold text-gray-200">What AuraIQ provides:</h3>
                        </div>
                        <ul className="space-y-5">
                            {solutions.map((s) => (
                                <li key={s.label} className="flex items-start gap-3">
                                    <span className="w-6 h-6 mt-0.5 rounded-full bg-violet-600 flex-shrink-0 flex items-center justify-center text-sm">
                                        {s.icon}
                                    </span>
                                    <div>
                                        <div className="text-sm font-semibold text-white">{s.label}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
