import { NextResponse } from "next/server";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_LOGIN = process.env.TWITCH_LOGIN;

type TwitchLiveResponse = {
  live: boolean;
  platform: "Twitch";
  title: string | null;
  viewerCount: number | null;
  startedAt: string | null;
  thumbnail: string | null;
  url: string;
};

async function getAppAccessToken() {
  const tokenUrl = new URL("https://id.twitch.tv/oauth2/token");
  tokenUrl.searchParams.set("client_id", TWITCH_CLIENT_ID!);
  tokenUrl.searchParams.set("client_secret", TWITCH_CLIENT_SECRET!);
  tokenUrl.searchParams.set("grant_type", "client_credentials");

  const response = await fetch(tokenUrl.toString(), {
    method: "POST",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to get Twitch app access token");
  }

  const data = await response.json();
  return data.access_token as string;
}

export async function GET() {
  try {
    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET || !TWITCH_LOGIN) {
      return NextResponse.json(
        { error: "Missing Twitch environment variables" },
        { status: 500 }
      );
    }

    const accessToken = await getAppAccessToken();

    const streamUrl = new URL("https://api.twitch.tv/helix/streams");
    streamUrl.searchParams.set("user_login", TWITCH_LOGIN);

    const response = await fetch(streamUrl.toString(), {
      headers: {
        "Client-Id": TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Twitch stream status" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const stream = data?.data?.[0];

    if (!stream) {
      const payload: TwitchLiveResponse = {
        live: false,
        platform: "Twitch",
        title: null,
        viewerCount: null,
        startedAt: null,
        thumbnail: null,
        url: `https://www.twitch.tv/${TWITCH_LOGIN}`,
      };

      return NextResponse.json(payload, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    const thumbnail =
      typeof stream.thumbnail_url === "string"
        ? stream.thumbnail_url
            .replace("{width}", "640")
            .replace("{height}", "360")
        : null;

    const payload: TwitchLiveResponse = {
      live: true,
      platform: "Twitch",
      title: stream.title ?? null,
      viewerCount:
        typeof stream.viewer_count === "number" ? stream.viewer_count : null,
      startedAt: stream.started_at ?? null,
      thumbnail,
      url: `https://www.twitch.tv/${TWITCH_LOGIN}`,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("twitch/live route error:", error);

    return NextResponse.json(
      { error: "Unexpected error while fetching Twitch live status" },
      { status: 500 }
    );
  }
}