import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildVisitorHash, getRequestIp, sha256 } from "@/lib/views";

type Body = {
  profileSlug?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const profileSlug = body.profileSlug?.trim();

    if (!profileSlug) {
      return NextResponse.json(
        { error: "profileSlug is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const ip = await getRequestIp();
    const userAgent = req.headers.get("user-agent") || "unknown";
    const visitorHash = buildVisitorHash({ ip, userAgent });
    const ipHash = sha256(ip);

    const { data: existing, error: existingError } = await supabase
      .from("profile_views")
      .select("id, visit_count")
      .eq("profile_slug", profileSlug)
      .eq("visitor_hash", visitorHash)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      );
    }

    let isNewUniqueVisitor = false;

    if (existing) {
      const { error: updateError } = await supabase
        .from("profile_views")
        .update({
          visit_count: existing.visit_count + 1,
          last_seen_at: new Date().toISOString(),
          user_agent: userAgent,
          ip_hash: ipHash,
        })
        .eq("id", existing.id);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }
    } else {
      isNewUniqueVisitor = true;

      const { error: insertError } = await supabase
        .from("profile_views")
        .insert({
          profile_slug: profileSlug,
          visitor_hash: visitorHash,
          ip_hash: ipHash,
          user_agent: userAgent,
          visit_count: 1,
        });

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      unique: isNewUniqueVisitor,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}