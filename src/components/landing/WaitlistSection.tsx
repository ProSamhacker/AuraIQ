"use client";

import { useState } from "react";

export default function WaitlistSection() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus("loading");
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus("success");
                setMessage(data.message || "You're on the list! We'll notify you on launch day.");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong. Please try again.");
            }
        } catch {
            setStatus("error");
            setMessage("Network error. Please try again.");
        }
    }

    return (
        <section id="waitlist" className="scroll-mt-16 py-16 sm:py-24 px-4 bg-[#0d0d14] relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-[120px] glow-pulse" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="relative max-w-2xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-1.5 mb-6">
                    <span className="w-2 h-2 bg-violet-400 rounded-full radar-dot" />
                    <span className="text-sm font-medium text-violet-300">Early Access — Limited Spots</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight glow-text">
                    Get Early Access to AuraIQ
                </h2>
                <p className="text-gray-400 text-lg mb-3 leading-relaxed">
                    Join creators who are already on the list. Be the first to analyze competitor
                    channels, find untapped niches, and grow faster.
                </p>
                <p className="text-violet-300 text-sm font-medium mb-10">
                    🎉 300+ creators already signed up — spots filling fast
                </p>

                {/* Form */}
                {status === "success" ? (
                    <div className="glass-purple border border-violet-500/30 rounded-2xl px-8 py-10 animate-slide-up">
                        <div className="text-5xl mb-4">🎉</div>
                        <h3 className="text-xl font-bold text-white mb-2">You&apos;re on the list!</h3>
                        <p className="text-gray-400 text-sm">{message}</p>
                    </div>
                ) : (
                    <form
                        id="waitlist-form"
                        onSubmit={handleSubmit}
                        className="glass border border-white/8 rounded-2xl px-6 py-8 flex flex-col gap-4"
                    >
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                id="waitlist-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all text-sm"
                            />
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                id="waitlist-submit"
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all hover:shadow-xl hover:shadow-violet-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {status === "loading" ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Joining...
                                    </span>
                                ) : "Join Waitlist →"}
                            </button>
                        </div>
                        {status === "error" && (
                            <p className="text-red-400 text-sm">{message}</p>
                        )}
                        <p className="text-xs text-gray-600">
                            No spam, ever. We&apos;ll only email you when AuraIQ launches.
                        </p>
                    </form>
                )}

                {/* Bottom perks */}
                <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm text-gray-500">
                    {["Free early access", "No credit card", "First to get new features", "Priority support"].map(p => (
                        <div key={p} className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {p}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
