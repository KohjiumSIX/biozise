import { NextResponse } from "next/server";
import Parser from "rss-parser";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_HANDLE = process.env.YOUTUBE_HANDLE;
const TIKTOK_USERNAME = process.env.TIKTOK_USERNAME;

const parser = new Parser();

type Media = {
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string | null;
  platform: "YouTube" | "TikTok";
};

function parseIsoDurationToSeconds(duration: string): number {
  const match = duration.match(
    /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i
  );

  if (!match) return 0;

  return (
    (Number(match[1] || 0) * 86400) +
    (Number(match[2] || 0) * 3600) +
    (Number(match[3] || 0) * 60) +
    Number(match[4] || 0)
  );
}

async function getLatestYouTube(): Promise<Media | null> {
  try {
    const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelUrl.searchParams.set("part", "contentDetails");
    channelUrl.searchParams.set("forHandle", YOUTUBE_HANDLE!);
    channelUrl.searchParams.set("key", YOUTUBE_API_KEY!);

    const channelRes = await fetch(channelUrl.toString());
    const channelData = await channelRes.json();
    const uploads =
      channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploads) return null;

    const playlistUrl = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems"
    );
    playlistUrl.searchParams.set("part", "snippet,contentDetails");
    playlistUrl.searchParams.set("playlistId", uploads);
    playlistUrl.searchParams.set("maxResults", "10");
    playlistUrl.searchParams.set("key", YOUTUBE_API_KEY!);

    const playlistRes = await fetch(playlistUrl.toString());
    const playlistData = await playlistRes.json();

    const ids = playlistData.items
      .map((i: any) => i.snippet.resourceId.videoId)
      .join(",");

    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.set(
      "part",
      "snippet,contentDetails,liveStreamingDetails"
    );
    videosUrl.searchParams.set("id", ids);
    videosUrl.searchParams.set("key", YOUTUBE_API_KEY!);

    const videosRes = await fetch(videosUrl.toString());
    const videosData = await videosRes.json();

    const video = videosData.items.find((v: any) => {
      const title = v.snippet.title.toLowerCase();
      const duration = parseIsoDurationToSeconds(v.contentDetails.duration);

      if (v.liveStreamingDetails) return false;
      if (title.includes("live")) return false;
      if (duration < 70) return false;

      return true;
    });

    if (!video) return null;

    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails.high.url,
      platform: "YouTube",
    };
  } catch {
    return null;
  }
}

async function getLatestTikTok(): Promise<Media | null> {
  try {
    const feed = await parser.parseURL(
      `https://rsshub.app/tiktok/user/${TIKTOK_USERNAME}`
    );

    const item = feed.items?.[0];

    if (!item) return null;

    return {
      title: item.title || "TikTok",
      url: item.link!,
      publishedAt: item.pubDate!,
      thumbnail: null,
      platform: "TikTok",
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [yt, tt] = await Promise.all([
      getLatestYouTube(),
      getLatestTikTok(),
    ]);

    if (!yt && !tt) {
      return NextResponse.json({ error: "No media found" }, { status: 404 });
    }

    let latest = yt;

    if (tt && yt) {
      latest =
        new Date(tt.publishedAt) > new Date(yt.publishedAt) ? tt : yt;
    } else if (tt) {
      latest = tt;
    }

    return NextResponse.json(latest, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}