import { ImageResponse } from "next/og";

export const alt = "Festive Clock: live countdowns to Indian festivals";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#fbf5e9",
          color: "#202b25",
        }}
      >
        <div style={{ display: "flex", color: "#d27833", fontSize: 30, letterSpacing: 6 }}>LIVE INDIAN FESTIVAL COUNTDOWNS</div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 112, fontWeight: 700 }}>Festive Clock</div>
        <div style={{ display: "flex", marginTop: 24, color: "#565e54", fontSize: 38 }}>
          Diwali · Holi · Eid · Rakhi · Independence Day · New Year
        </div>
      </div>
    ),
    size,
  );
}
