/**
 * Creates a custom user location marker with a blue dot and pulse animation
 * @param map - Kakao Map instance
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns CustomOverlay instance
 */
const createUserLocationMarker = (
  map: any,
  lat: number,
  lng: number
): any => {
  const position = new window.kakao.maps.LatLng(lat, lng);

  // Create custom marker content (blue dot with pulse)
  const content = document.createElement("div");
  content.style.cssText = `
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    position: relative;
  `;

  // Add pulse animation
  const pulse = document.createElement("div");
  pulse.style.cssText = `
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 2px solid #3b82f6;
    border-radius: 50%;
    animation: pulse 2s ease-out infinite;
    opacity: 0.6;
  `;
  content.appendChild(pulse);

  // Add animation keyframes if not already added
  if (!document.getElementById("pulse-animation")) {
    const style = document.createElement("style");
    style.id = "pulse-animation";
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 0.6;
        }
        100% {
          transform: scale(2);
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
