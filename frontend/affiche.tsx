import { Img, staticFile } from "remotion";

const FileTextIcon = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

export const Poster: React.FC = () => {
  return (
    <div
      style={{
        width: 2480,
        height: 3508,
        backgroundColor: "#eef2f7",
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Studio lighting radial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 50% at 50% 45%, rgba(255,255,255,0.75) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "100px 140px 240px 140px",
        }}
      >
        {/* Header - Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 100,
          }}
        >
          <div style={{ color: "#0f172a" }}>
            <FileTextIcon />
          </div>
          <span
            style={{
              fontSize: 120,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            sivee.pro
          </span>
        </div>

        {/* Hero text - centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 36,
            marginBottom: 220,
          }}
        >
          <h1
            style={{
              fontSize: 138,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.06,
              margin: 0,
              letterSpacing: "0.01em",
            }}
          >
            Fini Word et Canva. Voici le CV qui se met en page tout seul.
          </h1>
        </div>

        {/* Floating CVs - large, filling the space */}
        <div
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          {/* CV 1 - left, tilted back */}
          <div
            style={{
              position: "absolute",
              left: -40,
              top: -60,
              transform: "rotate(-5deg)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow:
                "0 60px 120px -30px rgba(15, 23, 42, 0.20), 0 30px 60px -15px rgba(15, 23, 42, 0.10), 0 0 0 1px rgba(15, 23, 42, 0.04)",
            }}
          >
            <Img
              src={staticFile("Alexandre.png")}
              style={{
                width: 1350,
                height: "auto",
                display: "block",
              }}
            />
          </div>

          {/* CV 2 - right, tilted opposite, overlapping */}
          <div
            style={{
              position: "absolute",
              right: -40,
              top: 20,
              transform: "rotate(4deg)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow:
                "0 70px 140px -35px rgba(15, 23, 42, 0.25), 0 35px 70px -18px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(15, 23, 42, 0.04)",
            }}
          >
            <Img
              src={staticFile("Alexandre_2.png")}
              style={{
                width: 1350,
                height: "auto",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: 120,
          }}
        >
          {/* Left - features */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 44,
              marginLeft: -60,
              marginTop: 60,
              transform: "translateY(100px)",
            }}
          >
            {[
              "Des modèles approuvés par les recruteurs.",
              "Déposez votre ancien CV, Sivee s'occupe du reste.",
            ].map((text) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: "#2563eb",
                    flexShrink: 0,
                    marginTop: 26,
                  }}
                />
                <span
                  style={{
                    fontSize: 84,
                    fontWeight: 600,
                    color: "#334155",
                    whiteSpace: "pre-line",
                    lineHeight: 1.3,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* QR + URL in white card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 56,
              backgroundColor: "#ffffff",
              border: "2px solid #e2e8f0",
              borderRadius: 32,
              padding: "56px 72px",
              boxShadow: "0 4px 20px -4px rgba(0,0,0,0.06)",
              transform: "translateY(100px)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 500,
                  color: "#64748b",
                }}
              >
                Testez <span style={{ fontWeight: 800 }}>gratuitement</span>,
                <br />
                tout de suite.
              </span>
              <span
                style={{
                  fontSize: 104,
                  fontWeight: 800,
                  color: "#2563eb",
                  letterSpacing: "-0.02em",
                }}
              >
                www.sivee.pro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
