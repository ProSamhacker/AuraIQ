import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { waitlist } from "@/db/schema";
import { eq } from "drizzle-orm";

const schema = z.object({
    email: z.string().email("Please enter a valid email address."),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid email." },
                { status: 400 }
            );
        }

        const { email } = parsed.data;

        // Check if already on waitlist
        const existing = await db
            .select()
            .from(waitlist)
            .where(eq(waitlist.email, email))
            .limit(1);

        if (existing.length > 0) {
            return NextResponse.json(
                { message: "You're already on the waitlist! We'll be in touch soon. 🎉" },
                { status: 200 }
            );
        }

        // Add to waitlist
        await db.insert(waitlist).values({ email });

        return NextResponse.json(
            { message: "You're on the list! We'll notify you the moment AuraIQ launches. 🚀" },
            { status: 200 }
        );
    } catch (error) {
        console.error("[waitlist] error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
