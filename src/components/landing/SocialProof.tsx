const testimonials = [
    {
        quote: "This showed me angles I completely overlooked. Found a gap with a 9.1 score that no one was covering.",
        author: "Beta Tech Creator",
        handle: "@techcreator",
        sub: "12k subscribers",
    },
    {
        quote: "Finally something beyond generic keyword suggestions. The statistical gap scoring is a game-changer.",
        author: "AI Reviewer",
        handle: "@aireviewer",
        sub: "Tech & AI niche",
    },
    {
        quote: "I found a gap with 8.9 score that had no competition. Posted the video — it hit 50k views in a week.",
        author: "Developer Educator",
        handle: "@deveducator",
        sub: "45k subscribers",
    },
    {
        quote: "Niice, it looks useful for sure!! Been looking for something like this for ages.",
        author: "Any_Fisherman_2877",
        handle: "r/NewTubers",
        sub: "Reddit community",
        isReddit: true,
    },
];

export default function SocialProof() {
    return (
        <section className="py-16 sm:py-24 px-4 bg-[#0a0a0f] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-600/8 rounded-full blur-[120px]" />
            </div>
            <div className="relative max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5">
                        <span className="text-sm font-medium text-gray-400">What People Say</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                        Early Creators{" "}
                        <span className="shimmer-text">Are Saying…</span>
                    </h2>
                    <p className="text-gray-400 text-lg">Real feedback from beta users and the Reddit community</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {testimonials.map((t) => (
                        <div
                            key={t.handle}
                            className={`gradient-border p-6 flex flex-col gap-4 hover:scale-[1.02] transition-all duration-300 group ${t.isReddit ? "bg-gradient-to-br from-orange-600/10 to-orange-600/5" : "bg-white/2"}`}
                            style={t.isReddit ? { boxShadow: "0 0 0 1px rgba(234,88,12,0.15)" } : {}}
                        >
                            {t.isReddit && (
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-orange-400 text-sm">🔴</span>
                                    <span className="text-xs font-semibold text-orange-400">From Reddit</span>
                                </div>
                            )}
                            <div className="text-violet-400 text-3xl font-serif leading-none">&ldquo;</div>
                            <p className="text-gray-300 text-sm leading-relaxed flex-1">{t.quote}</p>
                            <div className="flex items-center gap-2.5 pt-2 border-t border-white/8">
                                <div className="w-8 h-8 bg-violet-500/20 border border-violet-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-violet-300 text-xs font-bold">{t.author[0]}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">{t.author}</div>
                                    <div className="text-xs text-gray-500">{t.handle} · {t.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats bar */}
                <div className="mt-10 sm:mt-14 glass rounded-2xl px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:divide-x sm:divide-white/8 text-center">
                    {[
                        { value: "332+", label: "Reddit views in 24h" },
                        { value: "50K+", label: "Views from a single signal" },
                        { value: "9.1/10", label: "Top gap score found" },
                    ].map(s => (
                        <div key={s.label} className="px-4 first:pl-0 last:pr-0">
                            <div className="text-2xl font-extrabold shimmer-text">{s.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
