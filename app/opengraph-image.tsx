import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Branded social-share card (the preview shown when the link is pasted into
// Nextdoor, texts, etc.). Generated from the brand — no external design tool.
export const runtime = "nodejs";
export const alt =
  "Coyote Coexistence Council — working together to keep our neighborhoods safe and our coyotes wild";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = readFileSync(join(process.cwd(), "public/logo-ccc.png"));
const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#20251b",
          padding: "72px",
          textAlign: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={144} height={144} alt="" />
        <div
          style={{
            fontSize: 66,
            fontWeight: 800,
            color: "#f4f0e6",
            letterSpacing: "-1px",
            lineHeight: 1.05,
            marginTop: 36,
          }}
        >
          Coyote Coexistence Council
        </div>
        <div
          style={{
            fontSize: 30,
            color: "rgba(244,240,230,0.78)",
            marginTop: 22,
            maxWidth: 880,
            lineHeight: 1.35,
          }}
        >
          Working together to keep our neighborhoods safe and our coyotes wild.
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#cd8a5f",
            marginTop: 40,
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          livingwithcoyotes.org · Orange County, CA
        </div>
      </div>
    ),
    { ...size },
  );
}
