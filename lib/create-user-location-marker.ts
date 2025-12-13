/**
 * Creates a custom user location marker with a blue dot and pulse animation
 * Shows directional arrow when heading is available (mobile navigation)
 * @param map - Kakao Map instance
 * @param lat - Latitude
 * @param lng - Longitude
 * @param heading - Optional heading in degrees (0-360, where 0 = North)
 * @returns CustomOverlay instance
 */
const createUserLocationMarker = (
  map: any,
  lat: number,
  lng: number,
  heading?: number | null
): any => {
  const position = new window.kakao.maps.LatLng(lat, lng);

  // If heading is available, show directional arrow (for navigation)
  const showArrow = heading !== null && heading !== undefined && !isNaN(heading);

  // Create custom marker content
  const content = document.createElement("div");

  if (showArrow) {
    // Directional marker (arrow + dot)
    content.style.cssText = `
      width: 32px;
      height: 32px;
      position: relative;
      transform: rotate(${heading}deg);
      transition: transform 0.3s ease-out;
    `;

    // Blue dot center
    const dot = document.createElement("div");
    dot.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      background: #3b82f6;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      z-index: 2;
    `;
    content.appendChild(dot);

    // Directional arrow/cone (points up = North)
    const arrow = document.createElement("div");
    arrow.style.cssText = `
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 12px solid rgba(59, 130, 246, 0.6);
      z-index: 1;
    `;
    content.appendChild(arrow);
  } else {
    // Static blue dot (no heading)
    content.style.cssText = `
      width: 20px;
      height: 20px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      position: relative;
    `;
  }

  // Add pulse animation
  const pulse = document.createElement("div");
  if (showArrow) {
    // Pulse around the center dot for directional marker
    pulse.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      border: 2px solid #3b82f6;
      border-radius: 50%;
      animation: pulse-directional 1.5s ease-out infinite;
      opacity: 0.6;
      z-index: 1;
    `;
  } else {
    // Pulse around the static dot
    pulse.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 26px;
      height: 26px;
      border: 2px solid #3b82f6;
      border-radius: 50%;
      animation: pulse-static 1.5s ease-out infinite;
      opacity: 0.6;
      z-index: 0;
    `;
  }
  content.appendChild(pulse);

  // Add animation keyframes if not already added
  if (!document.getElementById("pulse-animation")) {
    const style = document.createElement("style");
    style.id = "pulse-animation";
    style.textContent = `
      @keyframes pulse-directional {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
      @keyframes pulse-static {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const customOverlay = new window.kakao.maps.CustomOverlay({
    position,
    content,
    zIndex: 99,
  });

  customOverlay.setMap(map);
  return customOverlay;
};

export default createUserLocationMarker;
