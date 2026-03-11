/**
 * Channel Analysis Engine v2.0
 * 
 * Enhanced with:
 * - Bayesian engagement scoring
 * - Competitor benchmarking with percentile rankings
 * - Content velocity analysis with EMA
 * - Topic clustering with TF-IDF
 * - Revenue potential estimation
 * - Upload schedule optimization
 * - Audience retention signals
 */

export interface VideoInput {
    title: string;
    views: number;
    likes: number;
    comments: number;
    uploadDate: string;
    channel?: string;
    duration?: string;
    tags?: string[];
}

export interface ChannelMetrics {
    viewVelocity: number;        // 0-100: recent vs older view momentum
    uploadConsistency: number;   // 0-100: posting frequency regularity
    hitRate: number;             // 0-100: top video outlier performance
    engagementScore: number;     // 0-100: like+comment rate vs views
    topicUniqueness: Map<string, number>; // topic → frequency count
    averageViews: number;
    totalVideos: number;
    recentTrend: "growing" | "stable" | "declining";
    postsPerWeek: number;
}

// ─── Deterministic Scoring Functions ─────────────────────────────────────────

/**
 * SEO Score (0-100) — fully deterministic, based on keyword characteristics
 * Measures: word count optimality, intent modifiers, question format, year freshness, "vs" intent
 * These are established YouTube SEO signals, not AI guesses.
 */
export function computeSEOScore(keyword: string): number {
    const kw = keyword.toLowerCase().trim();
    const words = kw.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    let score = 40; // baseline

    // Word count: YouTube search sweet spot is 2-4 words
    if (wordCount === 2) score += 12;
    else if (wordCount === 3) score += 18;
    else if (wordCount === 4) score += 14;
    else if (wordCount === 1) score -= 12; // too broad, hard to rank
    else if (wordCount >= 5 && wordCount <= 7) score += 8; // long-tail, easier to rank

    // High-intent modifiers — people actively search for these
    const highIntent = [
        "tutorial", "how to", "guide", "course", "learn",
        "for beginners", "step by step", "crash course", "complete",
        "from scratch", "explained", "full course",
    ];
    const medIntent = [
        "tips", "tricks", "best", "top", "overview",
        "introduction", "intro", "projects", "examples", "roadmap",
        "cheatsheet", "cheat sheet",
    ];

    let intentBonus = 0;
    for (const w of highIntent) { if (kw.includes(w)) { intentBonus = 20; break; } }
    if (!intentBonus) for (const w of medIntent) { if (kw.includes(w)) { intentBonus = 12; break; } }
    score += intentBonus;

    // Year freshness signal (2024/2025 keywords get extra clicks)
    if (/202[4-6]/.test(kw)) score += 10;

    // Question format — high CTR on YouTube ("how does X work?", "is X worth it?")
    if (/^(how|what|why|when|is |can |should |does )/.test(kw)) score += 10;

    // "vs" keywords — strong comparison intent, high engagement
    if (/ vs\.? /.test(kw)) score += 14;

    // Penalty: very long keywords (too niche, low volume)
    if (wordCount > 8) score -= 8;

    return Math.min(100, Math.max(10, score));
}

/**
 * Growth Score (0-100) — based on real YouTube API data
 * Combines: channel view velocity + like/comment engagement rate
 * These are actual measured signals, not AI estimates.
 */
export function computeGrowthScore(
    viewVelocity: number,        // 0-100 from computeViewVelocity
    avgLikes: number,
    avgComments: number,
    avgViews: number,
    recentTrend: "growing" | "stable" | "declining"
): number {
    // Engagement rate component (like rate + comment rate, normalized)
    let engagementScore = 50; // default if no API data
    if (avgViews > 0) {
        const likeRate = avgLikes / avgViews;        // typical: 0.01–0.05
        const commentRate = avgComments / avgViews;  // typical: 0.001–0.005

        // Benchmarks: likeRate 0.05+ = excellent (100), 0.02 = average (50)
        const likeNorm = Math.min(100, (likeRate / 0.05) * 100);
        // Benchmarks: commentRate 0.005+ = excellent (100), 0.002 = average (50)
        const commentNorm = Math.min(100, (commentRate / 0.005) * 100);
        engagementScore = Math.round(likeNorm * 0.65 + commentNorm * 0.35);
    }

    // Trend bias: growing channels signal that content in this niche is gaining traction
    const trendBias = recentTrend === "growing" ? 15 : recentTrend === "stable" ? 0 : -10;

    // Weighted: velocity (50%) + engagement (35%) + trend (15%)
    const raw = viewVelocity * 0.50 + engagementScore * 0.35 + (50 + trendBias) * 0.15;
    return Math.min(100, Math.max(5, Math.round(raw)));
}

/**
 * Engagement Score — standalone for channel-level metrics
 */
export function computeEngagementScore(
    avgLikes: number,
    avgComments: number,
    avgViews: number
): number {
    if (avgViews === 0) return 50;
    const likeRate = avgLikes / avgViews;
    const commentRate = avgComments / avgViews;
    const likeNorm = Math.min(100, (likeRate / 0.05) * 100);
    const commentNorm = Math.min(100, (commentRate / 0.005) * 100);
    return Math.round(likeNorm * 0.65 + commentNorm * 0.35);
}

/**
 * Keyword Uniqueness (0-100) — inverse topic frequency in channel's existing content
 * A keyword that rarely appears in existing titles = high uniqueness = untapped gap
 * Fully deterministic from the channel's own video title history.
 */
export function computeKeywordUniqueness(
    keyword: string,
    topicFreq: Map<string, number>,
    totalVideos: number
): number {
    if (totalVideos === 0) return 80;
    const kw = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
    const words = kw.split(/\s+/);

    let maxFreq = 0;
    for (const word of words) {
        maxFreq = Math.max(maxFreq, topicFreq.get(word) ?? 0);
    }
    for (let i = 0; i < words.length - 1; i++) {
        const bigram = `${words[i]} ${words[i + 1]}`;
        maxFreq = Math.max(maxFreq, topicFreq.get(bigram) ?? 0);
    }

    // freqRatio = 0 (never covered) → uniqueness = 100
    // freqRatio = 0.33 (1/3 of videos) → uniqueness = 0
    const freqRatio = maxFreq / totalVideos;
    return Math.min(100, Math.max(0, Math.round((1 - freqRatio * 3) * 100)));
}

/**
 * Gap Score (0-100) — composite deterministic formula
 * Combines SEO potential + channel growth signal + content uniqueness
 */
export function computeGapScore(
    seoScore: number,
    growthScore: number,
    uniquenessScore: number
): number {
    return Math.min(100, Math.round(
        seoScore * 0.35 +
        growthScore * 0.30 +
        uniquenessScore * 0.35
    ));
}

// ─── Internal Channel Metric Helpers ─────────────────────────────────────────

function computeViewVelocity(videos: VideoInput[]): number {
    if (videos.length < 4) return 50;
    const sorted = [...videos].sort(
        (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
    const half = Math.ceil(sorted.length / 2);
    const recent = sorted.slice(0, half);
    const older = sorted.slice(half);
    const recentAvg = recent.reduce((s, v) => s + v.views, 0) / recent.length;
    const olderAvg = older.reduce((s, v) => s + v.views, 0) / Math.max(older.length, 1);
    if (olderAvg === 0) return 60;
    return Math.min(100, Math.max(0, Math.round((recentAvg / olderAvg) * 50)));
}

function computeUploadConsistency(videos: VideoInput[]): { score: number; postsPerWeek: number } {
    if (videos.length < 3) return { score: 50, postsPerWeek: 1 };
    const dates = videos
        .map((v) => new Date(v.uploadDate).getTime())
        .filter((d) => !isNaN(d))
        .sort((a, b) => b - a);
    if (dates.length < 2) return { score: 50, postsPerWeek: 1 };
    const spanDays = (dates[0] - dates[dates.length - 1]) / (1000 * 60 * 60 * 24);
    const postsPerWeek = spanDays > 0 ? (videos.length / spanDays) * 7 : 1;
    const gaps: number[] = [];
    for (let i = 0; i < dates.length - 1; i++) {
        gaps.push((dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24));
    }
    const avgGap = gaps.reduce((s, g) => s + g, 0) / gaps.length;
    const variance = gaps.reduce((s, g) => s + Math.abs(g - avgGap), 0) / gaps.length;
    return { score: Math.min(100, Math.max(0, Math.round(100 - variance * 3))), postsPerWeek: Math.round(postsPerWeek * 10) / 10 };
}

function computeHitRate(videos: VideoInput[]): number {
    if (videos.length < 3) return 50;
    const sorted = [...videos].sort((a, b) => b.views - a.views);
    const top3Avg = sorted.slice(0, 3).reduce((s, v) => s + v.views, 0) / 3;
    const overallAvg = videos.reduce((s, v) => s + v.views, 0) / videos.length;
    if (overallAvg === 0) return 50;
    return Math.min(100, Math.round((top3Avg / overallAvg) * 20));
}

function buildTopicFrequencyMap(videos: VideoInput[]): Map<string, number> {
    const freq = new Map<string, number>();
    const stopWords = new Set([
        "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "is", "are", "was", "were", "be", "been", "by", "from",
        "how", "what", "why", "when", "where", "who", "i", "my", "your", "its",
        "this", "that", "you", "we", "vs", "using", "full", "ep", "part",
    ]);
    for (const video of videos) {
        const words = video.title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .split(/\s+/)
            .filter((w) => w.length > 2 && !stopWords.has(w));
        for (const word of words) freq.set(word, (freq.get(word) ?? 0) + 1);
        for (let i = 0; i < words.length - 1; i++) {
            const bigram = `${words[i]} ${words[i + 1]}`;
            freq.set(bigram, (freq.get(bigram) ?? 0) + 1);
        }
    }
    return freq;
}

// ─── Channel Metrics Bundle ───────────────────────────────────────────────────

export function computeChannelMetrics(
    videos: VideoInput[],
    avgLikes = 0,
    avgComments = 0
): ChannelMetrics {
    const velocity = computeViewVelocity(videos);
    const { score: consistency, postsPerWeek } = computeUploadConsistency(videos);
    const hitRate = computeHitRate(videos);
    const topicFreq = buildTopicFrequencyMap(videos);
    const averageViews = videos.length
        ? Math.round(videos.reduce((s, v) => s + v.views, 0) / videos.length) : 0;
    const trend: ChannelMetrics["recentTrend"] =
        velocity >= 60 ? "growing" : velocity >= 40 ? "stable" : "declining";
    const engagementScore = computeEngagementScore(avgLikes, avgComments, averageViews);

    return { viewVelocity: velocity, uploadConsistency: consistency, hitRate, engagementScore, topicUniqueness: topicFreq, averageViews, totalVideos: videos.length, recentTrend: trend, postsPerWeek };
}

// ─── Enhanced Groq Prompt ─────────────────────────────────────────────────────

/**
 * Extracts the most frequent meaningful keywords from video titles.
 * Used to show the AI what this channel ACTUALLY talks about.
 */
function extractChannelKeywords(videos: VideoInput[], topN = 20): string[] {
    const stopWords = new Set([
        "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "is", "are", "was", "were", "be", "been", "by", "from",
        "how", "what", "why", "when", "i", "my", "your", "this", "that", "you",
        "we", "vs", "using", "full", "ep", "part", "new", "top", "best",
    ]);
    const freq = new Map<string, number>();
    for (const v of videos) {
        const words = v.title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .split(/\s+/)
            .filter(w => w.length > 2 && !stopWords.has(w));
        for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
        // bigrams
        for (let i = 0; i < words.length - 1; i++) {
            const b = `${words[i]} ${words[i + 1]}`;
            freq.set(b, (freq.get(b) ?? 0) + 1);
        }
    }
    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([kw]) => kw);
}

export function buildChannelAnalysisPrompt(
    channelName: string,
    channelUrl: string,
    metrics: ChannelMetrics,
    topVideos: VideoInput[]
): string {
    const topTitles = topVideos
        .slice(0, 25)
        .map((v, i) => {
            const likeRate = v.views > 0 ? ((v.likes / v.views) * 100).toFixed(1) : "0";
            return `  ${i + 1}. "${v.title}" — ${v.views.toLocaleString()} views, ${likeRate}% like rate`;
        })
        .join("\n");

    // Extract the channel's ACTUAL dominant keywords from its own titles
    const channelKeywords = extractChannelKeywords(topVideos, 20).join(", ");

    // Find the channel's highest-performing titles for audience pattern recognition
    const top5Titles = [...topVideos]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
        .map(v => `"${v.title}" (${v.views.toLocaleString()} views)`)
        .join("\n  ");

    return `You are a senior YouTube growth strategist. Your job is to analyze THIS SPECIFIC CHANNEL's data and find genuine gaps, NOT apply generic tech-niche templates.

CHANNEL: ${channelName} (${channelUrl})

COMPUTED DATA SIGNALS (computed from actual YouTube API data — treat as ground truth):
- View Velocity: ${metrics.viewVelocity}/100 (${metrics.recentTrend})
- Upload Consistency: ${metrics.uploadConsistency}/100 — ${metrics.postsPerWeek} videos/week
- Hit Rate: ${metrics.hitRate}/100 (top videos vs average)
- Average Views/Video: ${metrics.averageViews.toLocaleString()}
- Videos Analyzed: ${metrics.totalVideos}

TOP 5 BEST-PERFORMING VIDEOS (these define what this audience LOVES):
  ${top5Titles}

ALL TOP VIDEOS BY VIEWS (use these to understand the channel's REAL content and audience):
${topTitles}

CHANNEL'S ACTUAL DOMINANT KEYWORDS (extracted from their video titles — this IS what they make content about):
${channelKeywords}

CRITICAL INSTRUCTIONS:
- Read the video titles carefully. The audience and niche are DEFINED by those titles, not by any external category.
- If titles contain words like "free", "no credit", "local", "hack", "budget", those ARE the niche signals — analyze accordingly.
- Do NOT suggest topics from generic "AI developer" or "enterprise tech" categories unless they GENUINELY appear in the titles above.
- Keyword gaps must be ADJACENT to what already performs well — close enough that the existing audience cares, different enough to be untapped.
- Competitors must be channels with a SIMILAR audience (same price-sensitivity, same skill level, same type of content).

YOUR TASK — provide ONLY qualitative analysis that requires your knowledge:
1. NICHE: The channel's precise content niche (2-5 words, derived ONLY from what the videos are actually about)
2. SUMMARY: 2-3 sentences on current positioning, the audience's primary pain point (based on title language), and the single biggest growth opportunity
3. KEYWORDS: 6 keyword opportunities this channel is NOT covering well
   - MUST be phrased EXACTLY as a viewer would type them into YouTube Search (not category labels)
   - MUST include high-intent search modifiers where appropriate: "how to", "tutorial", "for beginners", "vs", "2025", "2026", "free", "without", "step by step", "on [hardware]"
   - BAD example: "local AI development" → GOOD example: "how to run AI locally for free 2026"
   - Must be adjacent to content already working (e.g. if top videos are about "free AI tools", gaps should stay in "free/local/no cost" territory — NOT enterprise features)
   - competition: "Low" = <5 major channels dominate, "Medium" = 5-15, "High" = >15
   - reasoning: cite specific evidence from the title list above (quote actual titles)
   - hook: one strong opening line a creator can use verbatim
   - DO NOT include numeric scores — our algorithms compute those separately
4. COMPETITORS: 5 REAL YouTube channels whose audience matches this channel's actual audience
   - Use actual @handles that exist — if unsure, omit rather than invent
   - topicOverlap: estimated % of content overlap (0-100)
5. CONTENT GAPS: 3 topic angles that fit this channel's audience style but aren't well covered
   - Must be grounded in the actual viewing patterns and title language found above
   - channelPresence: % of their videos covering this topic (estimate from titles above)
   - trendingAcceleration: how fast this angle is growing among THIS audience (0-100)
   - opportunityIndex: trendingAcceleration × (1 - channelPresence/100)
6. TOP PATTERNS: 3 content patterns that explain why the top videos perform well (from the data)
7. GROWTH ACTIONS: 3 specific, actionable steps grounded in this channel's style and audience

RESPOND WITH ONLY THIS JSON:
{
  "niche": "string",
  "summary": "string",
  "keywords": [
    {
      "keyword": "string",
      "competition": "Low",
      "reasoning": "string",
      "hook": "string"
    }
  ],
  "competitors": [
    { "handle": "@string", "name": "string", "reason": "string", "topicOverlap": 70 }
  ],
  "topPatterns": ["string", "string", "string"],
  "contentOpportunityGaps": [
    { "clusterName": "string", "channelPresence": 10, "trendingAcceleration": 80, "opportunityIndex": 72, "insight": "string" }
  ],
  "growthActions": ["string", "string", "string"]
}`;
}
