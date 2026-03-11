import type { GapCandidate } from "./scoring";

/**
 * Builds an enhanced token-optimized prompt for Groq.
 * Sends: top 5 candidates, all statistical metrics, frustration signals, trend data.
 * Requests: refined titles, hooks, content outlines, SEO tips, competitor weaknesses.
 */
export function buildAnalysisPrompt(
  keyword: string,
  candidates: GapCandidate[]
): string {
  const candidatesSummary = candidates
    .map(
      (c, i) =>
        `${i + 1}. Title Template: "${c.title}"
   Angle: ${c.angle}
   Composite Gap Score: ${c.scores.compositeScore}/10 (confidence: ${(c.scores.confidence * 100).toFixed(0)}%)
   Velocity: ${c.scores.velocityScore.toFixed(1)}/10 — ${c.velocityInsight}
   Saturation: ${c.scores.saturationScore.toFixed(1)}/10 — ${c.saturationInsight}
   Frustration: ${c.scores.frustrationScore.toFixed(1)}/10
   Abandonment: ${c.scores.abandonmentScore.toFixed(1)}/10
   Engagement: ${c.scores.engagementScore.toFixed(1)}/10
   Trend Momentum: ${c.scores.trendMomentum.toFixed(1)}/10 — ${c.trendInsight}
   Competition: ${c.scores.competitionScore.toFixed(1)}/10 — ${c.competitionInsight}
   Top Audience Pain Keywords: ${c.topFrustrationKeywords.join(", ")}
   Estimated Views: ${c.estimatedViews.low.toLocaleString()}–${c.estimatedViews.high.toLocaleString()}
   Best Upload: ${c.bestUploadDay} at ${c.bestUploadHour}:00 UTC`
    )
    .join("\n\n");

  return `You are a senior YouTube growth strategist and SEO expert specializing in Tech, AI, and Programming channels.

TASK: Analyze these 5 data-backed content gap candidates for the keyword "${keyword}". Select and refine the TOP 3 highest-opportunity gaps. Produce concrete, actionable output that a creator can implement immediately.

GAP CANDIDATES (ranked by composite score):
${candidatesSummary}

INSTRUCTIONS:
- Pick the 3 best gaps and refine them with specific, compelling titles (use power words, numbers, year)
- gapScore must reflect the data (use composite scores as baseline, adjust based on your analysis)
- reasoning must cite specific signals (velocity, saturation, frustration, trend momentum)
- hook must be a strong opening line the creator can use verbatim (creates curiosity or addresses pain)
- format must be specific (e.g., "15-min tutorial with 5 chapters and timestamps", "comparison deep-dive with pros/cons table")
- monetizationAngle must name specific tools/sponsors/affiliate products relevant to the topic
- targetAudience: describe the specific viewer persona (e.g., "junior developers with 1-2 years experience")
- contentOutline: 5-7 specific section titles for the video
- seoTips: 3-5 specific YouTube SEO recommendations for this video
- competitorWeakness: what specific gap or weakness exists in current top-ranking videos

You MUST respond with ONLY this exact JSON structure, no additional text:
{
  "gaps": [
    {
      "title": "string",
      "gapScore": number,
      "reasoning": "string",
      "hook": "string",
      "format": "string",
      "monetizationAngle": "string",
      "targetAudience": "string",
      "contentOutline": ["string", "string", "string", "string", "string"],
      "seoTips": ["string", "string", "string"],
      "competitorWeakness": "string"
    }
  ],
  "overallOpportunity": "string",
  "recommendedNiche": "string"
}`;
}
