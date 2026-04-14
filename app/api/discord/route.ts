import { NextResponse } from "next/server";

const DISCORD_ID = process.env.DISCORD_ID;

export async function GET() {
  try {
    if (!DISCORD_ID) {
      return NextResponse.json(
        { error: "Missing DISCORD_ID in env" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Discord data" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const discord = data.data;

    const avatarHash = discord?.discord_user?.avatar;
    const userId = discord?.discord_user?.id;
    const discriminator = discord?.discord_user?.discriminator;

    let avatar: string;

    if (avatarHash && userId) {
      const extension = avatarHash.startsWith("a_") ? "gif" : "png";
      avatar = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=512`;
    } else {
      avatar = `https://cdn.discordapp.com/embed/avatars/${Number(discriminator) % 5}.png`;
    }

    return NextResponse.json({
      status: discord.discord_status,
      avatar,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}