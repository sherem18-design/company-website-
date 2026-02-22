import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ─────────────────────────────────────────────────────────────────────────────
   Cookie names
   - LITE_AUTO  : set by middleware when slow connection is detected
   - LITE_PREF  : set by the client when the user manually changes the mode
                  ("on" | "off") — always takes priority over LITE_AUTO
───────────────────────────────────────────────────────────────────────────── */
const LITE_AUTO = "lite_mode";
const LITE_PREF = "lite_mode_pref";

/* Threshold values */
const SLOW_DOWNLINK_MBPS = 1.5; // below this → lite
const SLOW_RTT_MS = 800;        // above this → lite
const SLOW_ECT = new Set(["slow-2g", "2g"]);

/* User-agent fragments that suggest very low-end / feature-phone browsers */
const LOW_END_UA_RE =
  /UCWEB|UCBrowser|NetFront|Opera Mini|MIDP|CLDC|Series60|SymbOS/i;

function isSlowConnection(req: NextRequest): { slow: boolean; reason: string } {
  const h = req.headers;

  /* 1. Explicit data-saver flag (Chrome on Android, Opera, Samsung Browser) */
  if (h.get("save-data") === "on") return { slow: true, reason: "save-data" };

  /* 2. Network Information API hints forwarded by the browser */
  const ect = h.get("ect") ?? "";
  if (SLOW_ECT.has(ect)) return { slow: true, reason: `ect:${ect}` };

  const downlink = parseFloat(h.get("downlink") ?? "NaN");
  if (!isNaN(downlink) && downlink < SLOW_DOWNLINK_MBPS)
    return { slow: true, reason: `downlink:${downlink}` };

  const rtt = parseInt(h.get("rtt") ?? "NaN", 10);
  if (!isNaN(rtt) && rtt > SLOW_RTT_MS)
    return { slow: true, reason: `rtt:${rtt}` };

  /* 3. User-agent heuristic for known low-bandwidth browsers */
  const ua = h.get("user-agent") ?? "";
  if (LOW_END_UA_RE.test(ua)) return { slow: true, reason: "ua-heuristic" };

  return { slow: false, reason: "" };
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  /* ── Skip static assets, Next.js internals and the /lite page itself ──── */
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/lite") ||
    /\.(?:ico|png|jpg|jpeg|gif|webp|svg|mp4|MP4|woff2?|ttf|otf|eot)$/i.test(pathname)
  ) {
    return res;
  }

  /* ── Honour explicit user preference — never override it ────────────────  */
  const userPref = req.cookies.get(LITE_PREF)?.value; // "on" | "off" | undefined
  if (userPref !== undefined) {
    /* If the preference already matches what middleware would set — nothing to do */
    return res;
  }

  /* ── No user preference yet — apply network-based auto-detection ────────  */
  const { slow, reason } = isSlowConnection(req);

  if (slow) {
    /* Set lite_mode=true; short-lived (session cookie, 1 hour) */
    res.cookies.set(LITE_AUTO, "true", {
      path: "/",
      maxAge: 600,
      sameSite: "lax",
      httpOnly: false, // client JS needs to read it to sync UI state
    });
    res.headers.set("X-Lite-Mode-Reason", reason); // for debugging / logging
  } else {
    /* Fast connection detected — ensure the auto cookie is cleared */
    const existing = req.cookies.get(LITE_AUTO)?.value;
    if (existing === "true") {
      res.cookies.set(LITE_AUTO, "", { path: "/", maxAge: 0 });
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Run on every request EXCEPT:
     * - Next.js static files (_next/static, _next/image)
     * - Public static assets (fonts, images, videos)
     * - Favicon
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|MP4|ico|woff2?|ttf|otf)).*)",
  ],
};
