import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const BigBasketLogo = "/Images/Bigbasket.png";
const BlinkitLogo   = "/Images/BlinkIt.png";
const SwiggyLogo    = "/Images/Swiggy-Instamart.png";
const ZeptoLogo     = "/Images/Zepto.png";

const COLOR = {
  primary: "#53d22c",
  secondary: "#f8fafc",
  textPrimary: "#1f2937",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
};

const partnerLogos = [
  { alt: "Blinkit",          src: BlinkitLogo },
  { alt: "Swiggy Instamart", src: SwiggyLogo },
  { alt: "Zepto",            src: ZeptoLogo },
  { alt: "BigBasket",        src: BigBasketLogo },
];

// ── Reverse-geocode: lat/lng → address string ──────────
function useReverseGeocode(location) {
  const [address, setAddress] = useState("Detecting...");
  useEffect(() => {
    if (!location) return;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
    )
      .then((r) => r.json())
      .then((data) => {
        const a = data.address;
        const area     = a.suburb || a.neighbourhood || a.town || a.village || a.city || "";
        const city     = a.city || a.town || a.county || "";
        const postcode = a.postcode || "";
        setAddress(
          `${area}${area && city ? ", " : ""}${city}${postcode ? " – " + postcode : ""}`
        );
      })
      .catch(() => setAddress("Location detected"));
  }, [location]);
  return address;
}

// ── Location search with suggestions ──────────────────
function LocationSearch({ onSelect, compact }) {
  const [query, setQuery]           = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]       = useState(false);
  const debounceRef                 = useRef(null);

  const search = (val) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&addressdetails=1&limit=5&countrycodes=in`
      )
        .then((r) => r.json())
        .then((results) => { setSuggestions(results); setLoading(false); })
        .catch(() => setLoading(false));
    }, 400);
  };

  const select = (item) => {
    const a        = item.address;
    const area     = a.suburb || a.neighbourhood || a.town || a.village || a.city || "";
    const city     = a.city || a.town || a.county || "";
    const postcode = a.postcode || "";
    const label    = `${area}${area && city ? ", " : ""}${city}${postcode ? " – " + postcode : ""}`;
    setQuery(label);
    setSuggestions([]);
    onSelect({ lat: parseFloat(item.lat), lng: parseFloat(item.lon), label });
  };

  return (
    <div style={{ position: "relative", width: compact ? 260 : 340 }}>
      {/* Input row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: `1px solid ${COLOR.border}`,
          borderRadius: 9999,
          padding: "0 14px",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          height: compact ? 40 : 44,
        }}
      >
        <span style={{ fontSize: 14, marginRight: 6 }}>🔎</span>
        <input
          type="text"
          value={query}
          onChange={(e) => search(e.target.value)}
          placeholder="Search area or pincode..."
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: compact ? 13 : 14,
            color: COLOR.textPrimary,
            background: "transparent",
          }}
        />
        {loading && (
          <span style={{ fontSize: 11, color: COLOR.textSecondary }}>...</span>
        )}
      </div>

      {/* Dropdown suggestions */}
      {suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: compact ? 46 : 52,
            left: 0,
            right: 0,
            background: "#fff",
            border: `1px solid ${COLOR.border}`,
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 200,
            overflow: "hidden",
          }}
        >
          {suggestions.map((item) => (
            <div
              key={item.place_id}
              onClick={() => select(item)}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: 13,
                color: COLOR.textPrimary,
                borderBottom: `1px solid ${COLOR.border}`,
                textAlign: "left",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              📍 {item.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────
export default function Home() {
  const [location, setLocation]           = useState(null);
  const [locationError, setLocationError] = useState("");
  const [manualLocation, setManualLocation] = useState(null);

  const navigate    = useNavigate();
  const autoAddress = useReverseGeocode(location);

  const activeLocation   = manualLocation || location;
  const displayAddress   = manualLocation
    ? manualLocation.label
    : location
    ? autoAddress
    : null;

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "#fff";
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) { setLocationError("Location not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Location permission denied")
    );
  };

  const S = {
    page: {
      minHeight: "100vh",
      width: "100vw",
      overflowX: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: '"Manrope","Noto Sans",sans-serif',
      background: COLOR.secondary,
    },
    header: {
      background: "#fff",
      borderBottom: `1px solid ${COLOR.border}`,
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    hero: {
      flex: 1,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      background: "#fff",
      textAlign: "center",
    },
    h1: { fontSize: "3rem", fontWeight: 700, color: COLOR.textPrimary, margin: 0 },
    highlight: { color: COLOR.primary },
    trustedTxt: { marginTop: 40, fontSize: ".875rem", color: COLOR.textSecondary, fontWeight: 500 },
    logoRow: { marginTop: 16, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 },
    logo: { height: 32, transition: "transform 0.3s ease", borderRadius: "12px", cursor: "pointer" },
  };

  return (
    <div style={S.page}>

      {/* ── HEADER ── */}
      <header style={S.header}>

        {/* Logo — left */}
        <h2 style={{ color: COLOR.primary, fontSize: 28, fontWeight: 700, margin: 0 }}>
          PriceScope
        </h2>

        {/* Location search bar — right side of header only */}
        <LocationSearch onSelect={(loc) => setManualLocation(loc)} compact />

      </header>

      {/* ── HERO ── */}
      <main style={S.hero}>
        <h1 style={S.h1}>
          Find the lowest price—<span style={S.highlight}>in one tap.</span>
        </h1>

        <button
          onClick={() => navigate("/results/xyz")}
          style={{
            marginTop: 32,
            height: 56,
            padding: "0 48px",
            fontSize: "1rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #53d22c, #3db520)",
            color: "#fff",
            border: "none",
            borderRadius: 9999,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(83, 210, 44, 0.45)",
            letterSpacing: "0.5px",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 28px rgba(83, 210, 44, 0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(83, 210, 44, 0.45)";
          }}
        >
          Compare Prices →
        </button>

        {/* ── Detected address pill ── */}
        {displayAddress && (
          <div style={{
            marginTop: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 9999,
            padding: "8px 16px",
          }}>
            <span style={{ fontSize: 16 }}>📍</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#15803d" }}>
              {displayAddress}
            </span>
            <span
              onClick={() => { setManualLocation(null); setLocation(null); setLocationError(""); detectLocation(); }}
              style={{ fontSize: 11, color: "#15803d", cursor: "pointer", textDecoration: "underline", marginLeft: 4 }}
            >
              change
            </span>
          </div>
        )}

        {locationError && !manualLocation && (
          <p style={{ marginTop: 8, fontSize: 13, color: "#ef4444" }}>
            Could not detect location. Search above to set manually.
          </p>
        )}

        <p style={S.trustedTxt}>Trusted by users of your favorite apps</p>
        <div style={S.logoRow}>
          {partnerLogos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              style={S.logo}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.2)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(58,57,57,0.71)";
                e.currentTarget.style.border = "1px solid rgba(0,0,0,0.96)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.border = "none";
              }}
            />
          ))}
        </div>
      </main>

    </div>
  );
}