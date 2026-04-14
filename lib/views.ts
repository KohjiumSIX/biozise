import crypto from "node:crypto";
import { headers } from "next/headers";

export async function getRequestIp() {
  const h = await headers();

  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = h.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function buildVisitorHash(params: {
  ip: string;
  userAgent: string;
}) {
  const salt = process.env.VIEW_HASH_SALT || "fallback-salt-change-this";
  return sha256(`${params.ip}|${params.userAgent}|${salt}`);
}