const steps = [
    {
        number: "01",
        title: "Channel Deep Analysis",
        description:
            "Analyze any YouTube channel with 500+ videos via YouTube API. Get view velocity, engagement rates, upload consistency, revenue estimates, and competitor benchmarking — all computed from real data.",
        details: ["Bayesian engagement scoring", "EMA trend detection", "Revenue estimation by niche CPM", "Upload schedule optimizer"],
        accent: "from-violet-600/20 to-violet-600/5",
        border: "border-violet-500/30",
        numColor: "text-violet-400",
        glow: "rgba(124,58,237,0.3)",
    },
    {
        number: "02",
        title: "Statistical Gap Detection",
        description:
            "Our 7-signal scoring engine uses Wilson score intervals, exponential decay weighting, and TF-IDF analysis to find content gaps with statistical confidence — not guesswork.",
        details: ["Wilson score engagement reliability", "Exponential decay velocity scoring", "TF-IDF keyword relevance", "Frustration NLP analysis"],
        accent: "from-sky-600/20 to-sky-600/5",
        border: "border-sky-500/30",
        numColor: "text-sky-400",
        glow: "rgba(14,165,233,0.3)",
    },
    {
        number: "03",
        title: "SEO & Tag Optimization",
        description:
            "Audit your video title, description, and tags with our deterministic SEO scorer. Get AI-improved titles, 50 optimized tags, and specific recommendations to maximise discoverability.",
        details: ["Title SEO scoring (0–100)", "Keyword density analysis", "50 AI-generated tags", "Competitor tag extraction"],
        accent: "from-emerald-600/20 to-emerald-600/5",
        border: "border-emerald-500/30",
        numColor: "text-emerald-400",
        glow: "rgba(16,185,129,0.3)",
    },
    {
        number: "04",
        title: "Thumbnail & Revenue Intelligence",
        description:
            "Get AI-generated thumbnail concepts with colour psychology, text overlay tips, and CTR benchmarks. Plus accurate revenue projections based on niche-specific CPM data.",
        details: ["3 AI thumbnail concepts", "CTR optimisation tips", "Niche CPM benchmarks", "Monthly revenue projections"],
        accent: "from-amber-600/20 to-amber-600/5",
        border: "border-amber-500/30",
        numColor: "text-amber-400",
        glow: "rgba(245,158,11,0.3)",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="scroll-mt-16 py-24 px-4 bg-[#0a0a0f] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-0 w-[350px] h-[350px] bg-violet-600/8 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-sky-600/8 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>
            <div className="relative max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5">
                        <span className="text-sm font-medium text-gray-400">How It Works</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                        From Noise to Opportunity{" "}
                        <span className="shimmer-text">in Minutes.</span>
                    </h2>
                    <p className="text-gray-400 text-lg">A hybrid deterministic + AI system. No guessing.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`gradient-border p-7 bg-gradient-to-br ${step.accent} hover:scale-[1.02] transition-all duration-300 group cursor-default`}
                            style={{ boxShadow: `0 0 0 1px ${step.glow.replace("0.3", "0.15")}, inset 0 0 30px ${step.glow.replace("0.3", "0.05")}` }}
                        >
                            <div className={`text-3xl font-extrabold mb-3 ${step.numColor} font-mono`}>
                                {step.number}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 mb-5 leading-relaxed text-sm">{step.description}</p>
                            <ul className="space-y-2">
                                {step.details.map((d) => (
                                    <li key={d} className="flex items-center gap-2 text-sm text-gray-300">
                                        <span className={`w-1.5 h-1.5 rounded-full bg-current ${step.numColor} flex-shrink-0`} />
                                        {d}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
