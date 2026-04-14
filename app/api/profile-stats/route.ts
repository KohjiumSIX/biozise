import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ProfileViewRow = {
  visit_count: number | null;
};

type SocialStatsRow = {
  tiktok_views: number | null;
  tiktok_followers: number | null;
  twitch_views: number | null;
  twitch_followers: number | null;
  discord_members: number | null;
  youtube_views: number | null;
  youtube_subscribers: number | null;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileSlug = searchParams.get("profileSlug")?.trim();

    if (!profileSlug) {
      return NextResponse.json(
        { error: "profileSlug is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Busca em paralelo (mais rápido)
    const [
      { data: viewsData, error: viewsError },
      { data: socialData, error: socialError },
    ] = await Promise.all([
      supabase
        .from("profile_views")
        .select("visit_count")
        .eq("profile_slug", profileSlug),

      supabase
        .from("social_stats")
        .select(
          `
          tiktok_views,
          tiktok_followers,
          twitch_views,
          twitch_followers,
          discord_members,
          youtube_views,
          youtube_subscribers
        `
        )
        .eq("profile_slug", profileSlug)
        .maybeSingle(),
    ]);

    if (viewsError) {
      return NextResponse.json(
        { error: viewsError.message },
        { status: 500 }
      );
    }

    if (socialError) {
      return NextResponse.json(
        { error: socialError.message },
        { status: 500 }
      );
    }

    const viewRows = (viewsData ?? []) as ProfileViewRow[];

    // 🔹 Views únicas (IPs únicos)
    const uniqueViews = viewRows.length;

    // 🔹 Total de visitas do site
    const siteViews = viewRows.reduce(
      (sum, row) => sum + (row.visit_count ?? 0),
      0
    );

    const social = (socialData ?? {
      tiktok_views: 0,
      tiktok_followers: 0,
      twitch_views: 0,
      twitch_followers: 0,
      discord_members: 0,
      youtube_views: 0,
      youtube_subscribers: 0,
    }) as SocialStatsRow;

    // 🔹 Soma manual das redes
    const socialTotal =
      (social.tiktok_views ?? 0) +
      (social.tiktok_followers ?? 0) +
      (social.twitch_views ?? 0) +
      (social.twitch_followers ?? 0) +
      (social.discord_members ?? 0) +
      (social.youtube_views ?? 0) +
      (social.youtube_subscribers ?? 0);

    // 🔹 TOTAL GERAL
    const grandTotal = siteViews + socialTotal;

    return NextResponse.json({
      uniqueViews,
      siteViews,
      socialTotal,
      grandTotal,

      // opcional (pra usar depois em UI mais detalhada)
      socialBreakdown: {
        tiktokViews: social.tiktok_views ?? 0,
        tiktokFollowers: social.tiktok_followers ?? 0,
        twitchViews: social.twitch_views ?? 0,
        twitchFollowers: social.twitch_followers ?? 0,
        discordMembers: social.discord_members ?? 0,
        youtubeViews: social.youtube_views ?? 0,
        youtubeSubscribers: social.youtube_subscribers ?? 0,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}