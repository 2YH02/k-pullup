import { ImageResponse } from "next/og";
import sharp from "sharp";
import type { Marker } from "@/types/marker.types";

export const runtime = "nodejs";
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

// Satori는 WebP를 디코딩하지 못하므로 sharp로 JPEG 변환 후 data URL로 전달
const fetchPhotoAsDataUrl = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const jpeg = await sharp(buf)
      .resize(1200, 630, { fit: "cover", position: "center" })
      // 밝은 사진도 텍스트가 읽히도록 밝기 70% + 채도 85% 처리
      // CSS 오버레이만으로는 밝은 이미지를 제압하기 어려워 이미지 자체를 조정
      .modulate({ brightness: 0.70, saturation: 0.85 })
      .jpeg({ quality: 85 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
};

const OgImage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;

  const [{ address, description, favCount, photoUrl }, fontData] =
    await Promise.all([
      fetchMarker(id).catch(() => ({
        address: "철봉 위치",
        description: "",
        favCount: 0,
        photoUrl: null,
      })),
      loadKoreanFont().catch(() => null),
    ]);

  const bgDataUrl = photoUrl
    ? await fetchPhotoAsDataUrl(photoUrl).catch(() => null)
    : null;
  const hasPhoto = !!bgDataUrl;
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
          backgroundColor: "#0f0e0a",
          fontFamily: "'Noto Sans KR', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* ── 배경 ── */}
        {!hasPhoto && (
          <>
            <div
              style={{
                position: "absolute",
                inset: "0",
                background: "linear-gradient(150deg, #141210 0%, #1c1a12 55%, #111008 100%)",
                display: "flex",
              }}
            />
            {/* 앰비언트 오브 - 우상단 웜 오렌지 */}
            <div
              style={{
                position: "absolute",
                width: "580px",
                height: "580px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at center, rgba(210,90,40,0.22) 0%, rgba(210,90,40,0) 68%)",
                top: "-180px",
                right: "-80px",
                display: "flex",
              }}
            />
            {/* 앰비언트 오브 - 좌하단 쿨 그린 */}
            <div
              style={{
                position: "absolute",
                width: "440px",
                height: "440px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at center, rgba(65,88,52,0.20) 0%, rgba(65,88,52,0) 68%)",
                bottom: "-110px",
                left: "-20px",
                display: "flex",
              }}
            />
          </>
        )}
        {hasPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgDataUrl!}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: "cover",
            }}
          />
        )}

        {/* ── 스크림 1: 전체 기본 어둠 ── */}
        {hasPhoto && (
          <div
            style={{
              position: "absolute",
              inset: "0",
              backgroundColor: "rgba(0,0,0,0.18)",
              display: "flex",
            }}
          />
        )}

        {/* ── 스크림 2: 상단 (배지 구역) ── */}
        <div
          style={{
            position: "absolute",
            inset: "0",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.14) 30%, rgba(0,0,0,0) 52%)",
            display: "flex",
          }}
        />

        {/* ── 스크림 3: 하단 (텍스트 구역) ── */}
        <div
          style={{
            position: "absolute",
            inset: "0",
            background:
              "linear-gradient(to top, rgba(8,6,3,0.98) 0%, rgba(8,6,3,0.90) 22%, rgba(8,6,3,0.55) 48%, rgba(8,6,3,0.04) 70%, rgba(8,6,3,0) 100%)",
            display: "flex",
          }}
        />

        {/* ── 스크림 4: 좌우 비네트 ── */}
        <div
          style={{
            position: "absolute",
            inset: "0",
            background:
              "linear-gradient(to right, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.28) 100%)",
            display: "flex",
          }}
        />

        {/* ── 상단 바: 브랜드(좌) + 즐겨찾기(우) ── */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "60px",
            right: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* 브랜드 배지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(0,0,0,0.52)",
              border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: "100px",
              padding: "10px 20px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#e07a4f",
                boxShadow: "0 0 0 3px rgba(224,122,79,0.28)",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "rgba(255,248,238,0.92)",
                letterSpacing: "0.3px",
              }}
            >
              대한민국 철봉 지도
            </span>
          </div>

          {/* 즐겨찾기 배지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(0,0,0,0.52)",
              border: "1px solid rgba(224,122,79,0.38)",
              borderRadius: "100px",
              padding: "10px 20px",
            }}
          >
            <span style={{ fontSize: "19px", color: "#e07a4f" }}>♥</span>
            <span
              style={{
                fontSize: "19px",
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {favCount}
            </span>
          </div>
        </div>

        {/* ── 하단 콘텐츠 ── */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            padding: "0 60px 50px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 오렌지 액센트 바 */}
          <div
            style={{
              width: "40px",
              height: "4px",
              backgroundColor: "#e07a4f",
              borderRadius: "2px",
              marginBottom: "16px",
            }}
          />

          {/* 주소 */}
          <div
            style={{
              fontSize: address.length > 18 ? "46px" : "58px",
              fontWeight: "700",
              color: "#ffffff",
              lineHeight: "1.15",
              letterSpacing: "-0.5px",
              marginBottom: "12px",
            }}
          >
            {shortAddress}
          </div>

          {/* 설명 */}
          {shortDesc ? (
            <div
              style={{
                fontSize: "24px",
                color: "rgba(218,206,188,0.75)",
                lineHeight: "1.5",
                marginBottom: "28px",
              }}
            >
              {shortDesc}
            </div>
          ) : (
            <div style={{ marginBottom: "20px" }} />
          )}

          {/* 도메인 */}
          <span
            style={{
              fontSize: "18px",
              color: "rgba(190,180,160,0.48)",
              letterSpacing: "0.8px",
            }}
          >
            k-pullup.com
          </span>
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
