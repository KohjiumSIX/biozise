import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

type SpotifyTrackResponse = {
  item?: {
    name?: string;
    duration_ms?: number;
    external_urls?: {
      spotify?: string;
    };
    album?: {
      images?: Array<{
        url: string;
        width?: number;
        height?: number;
      }>;
      name?: string;
    };
    artists?: Array<{
      name?: string;
    }>;
  };
  is_playing?: boolean;
  progress_ms?: number;
};

type SpotifyRecentResponse = {
  items?: Array<{
    played_at?: string;
    track?: {
      name?: string;
      duration_ms?: number;
      external_urls?: {
        spotify?: string;
      };
      album?: {
        images?: Array<{
          url: string;
          width?: number;
          height?: number;
        }>;
        name?: string;
      };
      artists?: Array<{
        name?: string;
      }>;
    };
  }>;
};

function getLargestImage(
  images?: Array<{ url: string; width?: number; height?: number }>
) {
  if (!images?.length) return null;
  return [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ?? null;
}

async function getAccessToken() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Missing Spotify env variables");
  }

  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to refresh Spotify token: ${text}`);
  }

  const data = await response.json();

  if (!data?.access_token) {
    throw new Error("Spotify token response missing access_token");
  }

  return data.access_token as string;
}

async function getCurrentlyPlaying(accessToken: string) {
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed currently-playing request: ${text}`);
  }

  const data = (await response.json()) as SpotifyTrackResponse;
  const item = data.item;

  if (!item?.name) return null;

  return {
    source: "currently_playing" as const,
    isPlaying: Boolean(data.is_playing),
    title: item.name ?? "Unknown track",
    artists: item.artists?.map((artist) => artist.name).filter(Boolean).join(", ") || "Unknown artist",
    album: item.album?.name ?? null,
    albumImage: getLargestImage(item.album?.images),
    progressMs: data.progress_ms ?? 0,
    durationMs: item.duration_ms ?? 0,
    url: item.external_urls?.spotify ?? null,
    playedAt: null as string | null,
  };
}

async function getRecentlyPlayed(accessToken: string) {
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed recently-played request: ${text}`);
  }

  const data = (await response.json()) as SpotifyRecentResponse;
  const recent = data.items?.[0];
  const track = recent?.track;

  if (!track?.name) return null;

  return {
    source: "recently_played" as const,
    isPlaying: false,
    title: track.name ?? "Unknown track",
    artists: track.artists?.map((artist) => artist.name).filter(Boolean).join(", ") || "Unknown artist",
    album: track.album?.name ?? null,
    albumImage: getLargestImage(track.album?.images),
    progressMs: 0,
    durationMs: track.duration_ms ?? 0,
    url: track.external_urls?.spotify ?? null,
    playedAt: recent?.played_at ?? null,
  };
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const current = await getCurrentlyPlaying(accessToken);

    if (current) {
      return NextResponse.json(current, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    const recent = await getRecentlyPlayed(accessToken);

    if (recent) {
      return NextResponse.json(recent, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    return NextResponse.json(
      { error: "No Spotify playback data found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("[spotify-now-playing]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected Spotify error",
      },
      { status: 500 }
    );
  }
}