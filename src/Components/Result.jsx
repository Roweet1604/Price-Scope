// Results.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import PRODUCTS from "../datas/products.json";

const Results = () => {
  const { term } = useParams();
  const routerLocation = useLocation();
  const userLocation = routerLocation.state?.location;

  const [searchQuery, setSearchQuery] = useState(
    term ? decodeURIComponent(term) : ""
  );
  const [submittedSearch, setSubmittedSearch] = useState(
    term ? decodeURIComponent(term) : ""
  );

  const searchRef = useRef(null);

  /* SYNC URL → STATE */
  useEffect(() => {
    if (term) {
      setSearchQuery(decodeURIComponent(term));
      setSubmittedSearch(decodeURIComponent(term));
    }
  }, [term]);

  /* LOAD TAILWIND + BOB ANIMATION */
  useEffect(() => {
    const tw = document.createElement("script");
    tw.src = "https://cdn.tailwindcss.com";
    tw.async = true;
    document.head.appendChild(tw);

    const style = document.createElement("style");
    style.innerHTML =
      "@keyframes bob { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }";
    document.head.appendChild(style);
  }, []);

  /* SEARCH HANDLERS */
  const triggerSearch = () => setSubmittedSearch(searchQuery);
  const handleKeyDown = (e) => { if (e.key === "Enter") triggerSearch(); };
  const handleReset = () => { setSearchQuery(""); setSubmittedSearch(""); };

  const hasSearched = submittedSearch.trim() !== "";

  const filteredProducts = !hasSearched
    ? []
    : PRODUCTS.filter((p) =>
        p.title.toLowerCase().includes(submittedSearch.toLowerCase())
      );

  const compare = [
    { name: "Blinkit",          price: 129, color: "#F7C200", link: "https://blinkit.com/s/?q=" },
    { name: "Swiggy Instamart", price: 135, color: "#FC8019", link: "https://www.swiggy.com/instamart/search?q=" },
    { name: "Zepto",            price: 119, color: "#7E22CE", link: "https://www.zeptonow.com/search?q=" },
    { name: "BigBasket",        price: 132, color: "#84C225", link: "https://www.bigbasket.com/ps/?q=" },
  ];

  const suggestions = [
    { label: "🥛 Milk",      query: "milk" },
    { label: "🍪 Biscuits",  query: "biscuits" },
    { label: "🍜 Noodles",   query: "noodles" },
    { label: "🌾 Atta",      query: "atta" },
    { label: "🧴 Shampoo",   query: "shampoo" },
    { label: "🍫 Chocolate", query: "chocolate" },
    { label: "🥚 Eggs",      query: "eggs" },
    { label: "☕ Coffee",    query: "coffee" },
  ];

  const handleSuggestion = (query) => {
    setSearchQuery(query);
    setSubmittedSearch(query);
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-white text-gray-800">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="px-4 py-3 flex items-center">

          {/* LOGO — far left, clickable resets to home */}
          <h1
            onClick={handleReset}
            className="text-2xl font-bold text-[#53d22c] cursor-pointer hover:opacity-75 transition-opacity shrink-0"
          >
            PriceScope
          </h1>

          {/* SEARCH BAR + BUTTON — truly centered in the page */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <input
              ref={searchRef}
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ color: "white" }}
              className="w-72 pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#53d22c] focus:border-transparent"
            />
            <button
              onClick={triggerSearch}
              className="px-5 py-2 bg-[#53d22c] text-white font-semibold rounded-lg hover:bg-[#43b822] active:scale-95 transition-all whitespace-nowrap"
            >
              Search
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="px-4 py-6 flex-grow">

        {/* ══ EMPTY STATE — nothing searched yet ══ */}
        {!hasSearched && (
          <div className="flex flex-col items-center justify-center py-16 gap-8 text-center select-none">

            {/* bouncing icons */}
            <div className="flex items-end justify-center gap-6">
              {[
                { icon: "🛒", delay: "0s" },
                { icon: "🔍", delay: "0.25s" },
                { icon: "💰", delay: "0.5s" },
              ].map(({ icon, delay }) => (
                <span
                  key={icon}
                  className="text-6xl"
                  style={{
                    display: "inline-block",
                    animation: `bob 2.2s ease-in-out ${delay} infinite`,
                  }}
                >
                  {icon}
                </span>
              ))}
            </div>

            {/* headline */}
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 leading-snug">
                Find the <span className="text-[#53d22c]">best price</span>
                <br />
                across all platforms
              </h2>
              <p className="mt-3 text-gray-500 text-base max-w-sm mx-auto">
                Type any grocery, snack or daily essential above — we'll compare
                prices on all major quick-commerce apps instantly.
              </p>
            </div>

            {/* platform pills */}
            {/* <div className="flex flex-wrap justify-center gap-3">
              {compare.map((p) => (
                <span
                  key={p.name}
                  className="px-4 py-2 rounded-full text-white text-sm font-semibold shadow"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name}
                </span>
              ))}
            </div> */}

            {/* divider */}
            <div className="flex items-center gap-3 w-full max-w-md">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                Popular searches
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* suggestion chips */}
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.query}
                  onClick={() => handleSuggestion(s.query)}
                  className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 hover:bg-[#e9fbe1] hover:text-[#2e8a14] hover:border-[#53d22c] active:scale-95 transition-all"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* footnote */}
            <p className="text-xs text-gray-400">
              🚀 No login needed · Prices compared across platforms
            </p>

          </div>
        )}

        {/* ══ RESULTS STATE — after search ══ */}
        {hasSearched && (
          <div>

            {/* location notice */}
            {userLocation ? (
              <p className="mb-4 text-sm text-green-600">
                📍 Showing results near your location
              </p>
            ) : (
              <p className="mb-4 text-sm text-yellow-600">
                ⚠ Showing general availability
              </p>
            )}

            {/* no match */}
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <span className="text-6xl">😕</span>
                <h3 className="text-xl font-bold text-gray-700">
                  No results for "{submittedSearch}"
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Try a different keyword — like "milk", "chips", or "shampoo".
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-5 py-2 bg-[#53d22c] text-white rounded-lg font-semibold hover:bg-[#43b822] transition-all active:scale-95"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* product grid */}
            {filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 border overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-40 object-contain bg-gray-50"
                    />
                    <div className="p-4">
                      <h2 className="font-semibold">{product.title}</h2>
                      <p className="text-sm text-gray-600">
                        Pack size: {product.quantity || "1"}
                      </p>
                      <div className="flex gap-3 mt-3 overflow-x-auto">
                        {compare.map((p) => (
                          <a
                            key={p.name}
                            href={`${p.link}${encodeURIComponent(product.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-32 flex-shrink-0 border rounded-lg"
                          >
                            <span
                              style={{ backgroundColor: p.color }}
                              className="block h-1 w-full rounded-t-lg"
                            />
                            <div className="p-2">
                              <p className="text-sm font-medium truncate">{p.name}</p>
                              <p className="font-semibold">₹{p.price}</p>
                              <p className="text-xs text-green-600">Available near you</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-100 border-t text-center py-4">
        <p className="text-sm text-gray-500">© 2026 PriceScope</p>
      </footer>

    </div>
  );
};

export default Results;