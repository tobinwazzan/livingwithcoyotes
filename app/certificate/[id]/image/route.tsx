import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { getCertificate } from "@/lib/certificate";

export const runtime = "nodejs";

const DUSK = "#2e3528";
const SAND = "#f4f0e6";
const CLAY = "#b5764f";
const INK = "#3d352a";

function loadLogo(): string | null {
  try {
    const data = readFileSync(join(process.cwd(), "public/logo-ccc.png"));
    return `data:image/png;base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const cert = await getCertificate(params.id);
  const logo = loadLogo();

  const name = cert?.name ?? "Friend of the Council";
  const tier = cert?.tier ?? "Member";
  const since = cert?.since;
  const through = cert?.through;
  const valid = !!cert;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: SAND,
          padding: 40,
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Double frame */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: `3px solid ${DUSK}`,
            outline: `1px solid ${CLAY}`,
            outlineOffset: 6,
            padding: "54px 64px",
            textAlign: "center",
          }}
        >
          {/* Header */}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo && <img src={logo} width={72} height={72} alt="" />}
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: DUSK,
                letterSpacing: 1,
                marginTop: 12,
              }}
            >
              Coyote Coexistence Council
            </div>
            <div
              style={{
                fontSize: 16,
                color: CLAY,
                letterSpacing: 6,
                marginTop: 18,
                fontWeight: 700,
              }}
            >
              CERTIFICATE OF MEMBERSHIP
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 20, color: INK }}>This certifies that</div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: DUSK,
                marginTop: 14,
                marginBottom: 14,
              }}
            >
              {name}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 21,
                color: INK,
                maxWidth: 760,
                lineHeight: 1.5,
                textAlign: "center",
              }}
            >
              {valid
                ? `is a recognized ${tier} of the Coyote Coexistence Council, in support of evidence-first coexistence with the coyotes of our neighborhoods.`
                : "This certificate link is not valid. If you're a member, use the link in your welcome email."}
            </div>
            {valid && (
              <div
                style={{
                  marginTop: 22,
                  display: "flex",
                  borderRadius: 999,
                  border: `2px solid ${CLAY}`,
                  color: CLAY,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: 2,
                  padding: "8px 22px",
                }}
              >
                {tier.toUpperCase()}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontSize: 22, color: DUSK, fontWeight: 700 }}>
                {since ? `Member since ${since}` : ""}
              </div>
              <div style={{ fontSize: 15, color: INK, marginTop: 4 }}>
                {through ? `Active through ${through}` : ""}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  color: DUSK,
                  fontWeight: 700,
                  fontStyle: "italic",
                }}
              >
                The Coyote Coexistence Council
              </div>
              <div
                style={{
                  width: 240,
                  borderTop: `1px solid ${INK}`,
                  marginTop: 6,
                  paddingTop: 4,
                  fontSize: 13,
                  color: INK,
                }}
              >
                livingwithcoyotes.org
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 850 },
  );
}
