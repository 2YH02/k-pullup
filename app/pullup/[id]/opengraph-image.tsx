import { ImageResponse } from "next/og";
import type { Marker } from "@/types/marker.types";

export const runtime = "edge";
export const alt = "철봉 위치";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://api.k-pullup.com/api/v1";

// Firefox 3 UA → Google Fonts returns TTF which Satori requires (modern UAs get WOFF2, IE6 gets EOT)
const loadKoreanFont = async (): Promise<ArrayBuffer | null> => {
  const response = await fetch(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.1) Gecko/2008070208 Firefox/3.0.1",
      },
    }
  );
  const css = await response.text();

  const match = css.match(
    /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/
  );
  if (!match) return null;

  const fontResponse = await fetch(match[1]);
  return fontResponse.arrayBuffer();
};

const fetchMarker = async (id: string) => {
  const response = await fetch(`${API_BASE}/markers/${id}/details`, {
    cache: "no-store",
  });
  const data: Marker = await response.json();
  return {
    address: data.address || data.addr || "철봉 위치",
    description: data.description || "",
    favCount: data.favCount ?? 0,
    photoUrl: data.photos?.[0]?.photoUrl ?? null,
  };
};

const OgImage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;

  const {
    address,
    description,
    favCount,
    photoUrl,
  } = await fetchMarker(id).catch(() => ({
    address: "철봉 위치",
    description: "",
    favCount: 0,
    photoUrl: null,
  }));

  const fontData = await loadKoreanFont().catch(() => null);
  const hasPhoto = !!photoUrl;
  const shortAddress = address.length > 22 ? address.slice(0, 22) + "…" : address;
  const shortDesc =
    description.length > 55 ? description.slice(0, 55) + "…" : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          backgroundColor: "#2a2920",
          fontFamily: "'Noto Sans KR', sans-serif",
          overflow: "hidden",
        }}
      >
        {!hasPhoto && (
          <div
            style={{
              position: "absolute",
              inset: "0",
              background:
                "linear-gradient(135deg, #2a2920 0%, #3d3c2e 50%, #4a4838 100%)",
              display: "flex",
            }}
          />
        )}

        {hasPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl!}
            alt=""
            style={{
              position: "absolute",
              inset: "0",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: "0",
            background: hasPhoto
              ? "linear-gradient(to top, rgba(32,26,18,0.97) 0%, rgba(32,26,18,0.62) 48%, rgba(32,26,18,0.08) 100%)"
              : "linear-gradient(to top, rgba(32,26,18,0.55) 0%, rgba(32,26,18,0.0) 100%)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "60px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(237,229,220,0.12)",
            border: "1px solid rgba(237,229,220,0.22)",
            borderRadius: "100px",
            padding: "10px 22px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#d07a4f",
              boxShadow: "0 0 0 3px rgba(208,122,79,0.28)",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "rgba(245,237,229,0.9)",
              letterSpacing: "0.3px",
            }}
          >
            대한민국 철봉 지도
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            padding: "0 60px 52px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: address.length > 18 ? "46px" : "56px",
              fontWeight: "700",
              color: "#f5ede5",
              lineHeight: "1.2",
              letterSpacing: "-0.5px",
              marginBottom: "14px",
            }}
          >
            {shortAddress}
          </div>

          {shortDesc ? (
            <div
              style={{
                fontSize: "26px",
                color: "rgba(222,206,192,0.72)",
                lineHeight: "1.5",
                marginBottom: "30px",
              }}
            >
              {shortDesc}
            </div>
          ) : (
            <div style={{ marginBottom: "30px" }} />
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "rgba(208,122,79,0.18)",
                border: "1px solid rgba(208,122,79,0.38)",
                borderRadius: "100px",
                padding: "10px 26px",
              }}
            >
              <span style={{ fontSize: "26px", color: "#d07a4f" }}>♥</span>
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  color: "#f5ede5",
                }}
              >
                {favCount}
              </span>
            </div>

            <span
              style={{
                fontSize: "22px",
                color: "rgba(165,165,143,0.55)",
                letterSpacing: "0.5px",
              }}
            >
              k-pullup.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Noto Sans KR", data: fontData, weight: 700 }]
        : [],
    }
  );
};

export default OgImage;
