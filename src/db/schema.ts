import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").unique().notNull(),
    name: text("name"),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const waitlist = pgTable("waitlist", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").unique().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scans = pgTable("scans", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    competitors: jsonb("competitors").notNull().$type<string[]>(),
    rawData: jsonb("raw_data").$type<Record<string, unknown>>(),
    result: jsonb("result").$type<ScanResult>(),
    analytics: jsonb("analytics").$type<ScanAnalytics>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Scan = typeof scans.$inferSelect;
export type NewScan = typeof scans.$inferInsert;

export interface ScanResult {
    gaps: GapItem[];
    overallOpportunity?: string;
    recommendedNiche?: string;
}

export interface GapItem {
    title: string;
    gapScore: number;
    reasoning: string;
    hook: string;
    format: string;
    monetizationAngle: string;
    targetAudience?: string;
    contentOutline?: string[];
    seoTips?: string[];
    competitorWeakness?: string;
}

export interface ScanAnalytics {
    velocity: { score: number; insight: string; weeklyGrowthRate: number };
    saturation: { score: number; insight: string; competitionLevel: string };
    frustration: { score: number; topKeywords: string[]; painPoints: string[] };
    engagement: { score: number; avgLikeRate: number; avgCommentRate: number };
    trend: { score: number; trend: string; insight: string };
    competition: { score: number; difficulty: string; insight: string };
    uploadSchedule: { bestDay: string; bestHour: number; insight: string };
    revenueEstimate: { low: number; mid: number; high: number };
    suggestedTags: string[];
}
