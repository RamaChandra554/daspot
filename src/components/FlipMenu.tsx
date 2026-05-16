import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import daSpotLogo from "@/assets/da-spot-logo.jpeg";

/* ─── DATA ──────────────────────────────────────────────────── */

type Price = number | [number, number];

interface MenuItem {
  name: string;
  description?: string;
  price: Price;
}

interface Category {
  name: string;
  items: MenuItem[];
}

const categories: Category[] = [
  {
    name: "Starters — Vegetarian",
    items: [
      { name: "Shanghai Veg", description: "Exotic vegetables sautéed in sweet & spice sauce with sesame oil", price: 279 },
      { name: "Crispy Garden Farm", description: "Crispy fried vegetables tossed in sweet & sour spice", price: 299 },
      { name: "Paneer Sticks", description: "Crispy paneer pan fried with classic spices", price: 299 },
      { name: "Dragon Paneer", description: "Paneer tossed in sweet & sour spice", price: 299 },
      { name: "Sesame Paneer", description: "Paneer tossed with herbs, spices & sesame oil", price: 279 },
      { name: "Chilly Garlic Potato", description: "Finger potatoes sautéed in chilli garlic sauce", price: 249 },
      { name: "Honey Potato", description: "Potatoes sautéed with honey & sesame oil", price: 269 },
      { name: "Salt & Pepper Mushroom", description: "Crispy mushrooms tossed with spices", price: 269 },
    ],
  },
  {
    name: "Starters — Non Vegetarian",
    items: [
      { name: "Kung Pao Chicken", price: 369 },
      { name: "Thai Pai Chicken", price: 369 },
      { name: "Thai Chi Chicken", price: 369 },
      { name: "Devil Sesame Chicken", price: 369 },
    ],
  },
  {
    name: "Main Course",
    items: [
      { name: "Marry Me Chicken", description: "Grilled chicken with mashed potato & veggies in sundried tomato basil sauce", price: 499 },
      { name: "Lemon Butter Chicken", description: "Grilled chicken in lemon butter sauce", price: 499 },
      { name: "Buffalo Lemon Pepper Fish", price: 499 },
      { name: "Jerk Spiced Grilled Fish", price: 529 },
      { name: "Turkish Lahmacun", price: 549 },
      { name: "Mediterranean Lamb Bowl", price: 399 },
    ],
  },
  {
    name: "Pizzeria",
    items: [
      { name: "Margherita", price: [249, 329] },
      { name: "Veggies Blast", price: [299, 369] },
      { name: "Paneer Tikka Pizza", price: [299, 369] },
      { name: "Hawaiian Veg", price: [369, 449] },
      { name: "Chicken Tikka Pizza", price: [369, 449] },
      { name: "Peri Peri Chicken Pizza", price: [399, 499] },
    ],
  },
  {
    name: "Momos & Rolls",
    items: [
      { name: "Veg Momos", price: 149 },
      { name: "Chicken Momos", price: 199 },
      { name: "Charcoal Momos", price: [169, 199] },
      { name: "Tom Yum Momos", price: [169, 199] },
      { name: "Spinach Cheese Momos", price: [169, 199] },
      { name: "Dragon Chicken Roll", price: 199 },
      { name: "Prawn Roll", price: 229 },
    ],
  },
  {
    name: "Burgers & Sandwiches",
    items: [
      { name: "Classic Veg Burger", price: 299 },
      { name: "Curried Veg Burger", price: 299 },
      { name: "Classic Chicken Burger", price: 299 },
      { name: "Fish Burger", price: 299 },
      { name: "Shrimp Burger", price: 299 },
      { name: "Club Sandwich", price: 299 },
    ],
  },
  {
    name: "Asian Curries",
    items: [
      { name: "Thai Veg Curry", price: 379 },
      { name: "Mix Veg Bamboo Shoot", price: 379 },
      { name: "Paneer Black Bean Sauce", price: 379 },
      { name: "Hunan Mushroom Broccoli", price: 379 },
      { name: "Thai Non-Veg Curry", price: 449 },
      { name: "Schezwan Chicken", price: 499 },
    ],
  },
  {
    name: "Seafood & Meat",
    items: [
      { name: "Tom Yum Prawn", price: 429 },
      { name: "Butter Fry Prawn", price: 429 },
      { name: "Tempura Prawn", price: 429 },
      { name: "Wasabi Prawn", price: 429 },
      { name: "Phuket Fish", price: 449 },
      { name: "Mongolian Lamb", price: 499 },
    ],
  },
  {
    name: "Rice & Noodles",
    items: [
      { name: "Thai Basil Fried Rice", price: 379 },
      { name: "Pineapple Fried Rice", price: 379 },
      { name: "Five Spice Fried Rice", price: 379 },
      { name: "Chicken Fried Rice", price: 449 },
      { name: "Veg Hakka Noodles", price: 299 },
      { name: "Chicken Hakka Noodles", price: 399 },
      { name: "Pad Thai Noodles", price: 329 },
    ],
  },
  {
    name: "Desserts",
    items: [
      { name: "Chocolate Brownie", price: 249 },
      { name: "Apricot Delight", price: 249 },
      { name: "Blueberry Cheesecake", price: 249 },
      { name: "Choco Lava", price: 249 },
      { name: "Red Velvet Molten", price: 249 },
      { name: "Russian Honey Cake", price: 249 },
      { name: "Chocolate Bomb", price: 249 },
      { name: "Fried Ice Cream", price: 249 },
    ],
  },
];

/* ─── PAGE BUILDING ─────────────────────────────────────────── */

type PageKind = "cover" | "welcome" | "category" | "back-cover" | "blank";

interface PageData {
  kind: PageKind;
  categoryName?: string;
  items?: MenuItem[];
}

function fmtPrice(p: Price): string {
  return Array.isArray(p) ? `₹${p[0]} / ₹${p[1]}` : `₹${p}`;
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function buildPages(): PageData[] {
  const pages: PageData[] = [{ kind: "cover" }, { kind: "welcome" }];
  for (const cat of categories) {
    for (const slice of chunk(cat.items, 6)) {
      pages.push({ kind: "category", categoryName: cat.name, items: slice });
    }
  }
  pages.push({ kind: "back-cover" });
  if (pages.length % 2 !== 0) pages.push({ kind: "blank" });
  return pages;
}

function buildSpreads(pages: PageData[]): [PageData, PageData][] {
  const out: [PageData, PageData][] = [];
  for (let i = 0; i < pages.length; i += 2) {
    out.push([pages[i], pages[i + 1] ?? { kind: "blank" }]);
  }
  return out;
}

const allPages = buildPages();
const spreads = buildSpreads(allPages);

/* ─── PAGE RENDERER ─────────────────────────────────────────── */

function Page({ data, side }: { data: PageData; side: "L" | "R" }) {
  const bg = side === "L" ? "#0c0c0c" : "#0f0f0f";

  if (data.kind === "cover") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative"
        style={{ background: "linear-gradient(150deg,#110000 0%,#0a0a0a 60%,#0d0000 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,rgba(255,46,46,0.03) 0,rgba(255,46,46,0.03) 1px,transparent 0,transparent 50%)", backgroundSize: "18px 18px" }} />
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg,transparent,#ff2e2e,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg,transparent,#ff2e2e,transparent)" }} />
        <img src={daSpotLogo} alt="DA SPOT"
          className="w-[110px] h-[110px] rounded-full object-cover mb-6"
          style={{ boxShadow: "0 0 40px rgba(255,46,46,0.35)", border: "1px solid rgba(255,46,46,0.3)" }} />
        <p className="text-[#ff2e2e] tracking-[0.5em] text-[11px] font-sans mb-1">ESTD</p>
        <h2 className="font-serif text-[42px] font-bold tracking-[0.15em] text-[#f5f0e8]">Da</h2>
        <h1 className="font-serif text-[64px] font-bold tracking-[0.2em] text-[#f5f0e8] leading-none">SPOT</h1>
        <div className="w-14 h-px bg-[#ff2e2e] my-5" />
        <p className="text-[#f5f0e8]/35 text-[11px] tracking-[0.4em] font-sans uppercase">Menu Collection</p>
        <p className="text-[#ff2e2e] text-[11px] tracking-[0.3em] font-sans mt-2">2024</p>
      </div>
    );
  }

  if (data.kind === "back-cover") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative"
        style={{ background: "linear-gradient(210deg,#110000 0%,#0a0a0a 60%,#0d0000 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(-45deg,rgba(255,46,46,0.03) 0,rgba(255,46,46,0.03) 1px,transparent 0,transparent 50%)", backgroundSize: "18px 18px" }} />
        <div className="w-10 h-px bg-[#ff2e2e] mb-6" />
        <p className="font-serif italic text-[#f5f0e8]/40 text-[16px] leading-relaxed text-center px-10 mb-8">
          "Where every dish tells a story."
        </p>
        <p className="text-[#ff2e2e] tracking-[0.45em] text-[11px] font-sans uppercase">DA SPOT</p>
        <p className="text-[#f5f0e8]/25 tracking-[0.3em] text-[10px] font-sans mt-2">Est. 2024</p>
        <div className="w-10 h-px bg-[#ff2e2e] mt-6" />
      </div>
    );
  }

  if (data.kind === "welcome") {
    return (
      <div className="w-full h-full flex flex-col justify-center px-12 py-12" style={{ background: bg }}>
        <p className="text-[#ff2e2e] tracking-[0.4em] text-[11px] font-sans uppercase mb-5">— Welcome —</p>
        <h3 className="font-serif text-[32px] font-bold text-[#f5f0e8] leading-snug mb-6">
          A Journey<br />Through Flavour
        </h3>
        <div className="w-10 h-px bg-[#ff2e2e] mb-6" />
        <p className="text-[#f5f0e8]/45 font-sans text-[15px] leading-relaxed">
          Each dish at DA SPOT is crafted with precision and passion. From bold Asian starters to elegant mains — every plate is an experience.
        </p>
        <div className="mt-auto pt-6 border-t border-white/[0.04]">
          <p className="text-[#f5f0e8]/20 text-[10px] tracking-[0.3em] uppercase font-sans">Wok to Fork</p>
        </div>
      </div>
    );
  }

  if (data.kind === "category" && data.items) {
    const [section, title] = (data.categoryName ?? "").includes("—")
      ? (data.categoryName ?? "").split("—").map((s) => s.trim())
      : ["", data.categoryName ?? ""];

    return (
      <div className="w-full h-full flex flex-col py-10 px-10" style={{ background: bg }}>
        <div className="mb-5 pb-4" style={{ borderBottom: "1px solid rgba(255,46,46,0.12)" }}>
          {section && (
            <p className="text-[#ff2e2e] tracking-[0.35em] text-[10px] font-sans uppercase mb-1">
              {section}
            </p>
          )}
          <h3 className="font-serif text-[22px] font-bold text-[#f5f0e8] leading-tight">{title || section}</h3>
        </div>

        <div className="flex-1 flex flex-col gap-[18px] overflow-hidden">
          {data.items.map((item, i) => (
            <div key={i}>
              <div className="flex items-center gap-2">
                <span className="font-serif text-[16px] text-[#f5f0e8] flex-1 leading-tight pr-2">
                  {item.name}
                </span>
                <span className="shrink-0 text-[#ff2e2e] font-serif text-[15px] font-medium">
                  {fmtPrice(item.price)}
                </span>
              </div>
              {item.description && (
                <p className="text-[12px] text-[#f5f0e8]/35 font-sans mt-1 leading-relaxed line-clamp-1">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <span className="text-[10px] tracking-[0.3em] text-[#f5f0e8]/15 font-sans uppercase">DA SPOT</span>
          <div className="flex gap-[4px]">
            {[0.25, 0.5, 0.25].map((o, i) => (
              <div key={i} className="w-[6px] h-[6px] rounded-full" style={{ background: `rgba(255,46,46,${o})` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-full h-full" style={{ background: bg }} />;
}

/* ─── MOBILE SLIDE VARIANTS ─────────────────────────────────── */
const mobileVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

/* ─── FLIP BOOK ──────────────────────────────────────────────── */

const FLIP_MS = 700;

export function FlipMenu() {

  /* mobile detection */
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* mobile single-page state */
  const [mobilePageIndex, setMobilePageIndex] = useState(0);
  const [mobileDir, setMobileDir] = useState(1);
  const totalPages = allPages.length;
  const mobileTouchX = useRef<number | null>(null);

  /* desktop spread state */
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<"fwd" | "bwd">("fwd");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx]     = useState(1);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);
  const touchX = useRef<number | null>(null);
  const total = spreads.length;

  const canNext = !flipping && spreadIndex < total - 1;
  const canPrev = !flipping && spreadIndex > 0;

  /* ── mobile callbacks ── */
  const mobileNext = useCallback(() => {
    if (mobilePageIndex >= totalPages - 1) return;
    setMobileDir(1);
    setMobilePageIndex((p) => p + 1);
  }, [mobilePageIndex, totalPages]);

  const mobilePrev = useCallback(() => {
    if (mobilePageIndex <= 0) return;
    setMobileDir(-1);
    setMobilePageIndex((p) => p - 1);
  }, [mobilePageIndex]);

  const onMobileTouchStart = useCallback((e: React.TouchEvent) => {
    mobileTouchX.current = e.touches[0].clientX;
  }, []);
  const onMobileTouchEnd = useCallback((e: React.TouchEvent) => {
    if (mobileTouchX.current === null) return;
    const dx = e.changedTouches[0].clientX - mobileTouchX.current;
    mobileTouchX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) mobileNext(); else mobilePrev();
  }, [mobileNext, mobilePrev]);

  /* ── desktop callbacks ── */
  const goNext = useCallback(() => {
    if (!canNext) return;
    const target = spreadIndex + 1;
    setFromIdx(spreadIndex);
    setToIdx(target);
    setFlipDir("fwd");
    setFlipping(true);
    setTimeout(() => {
      setSpreadIndex(target);
      setFlipping(false);
    }, FLIP_MS);
  }, [canNext, spreadIndex]);

  const goPrev = useCallback(() => {
    if (!canPrev) return;
    const target = spreadIndex - 1;
    setFromIdx(spreadIndex);
    setToIdx(target);
    setFlipDir("bwd");
    setFlipping(true);
    setTimeout(() => {
      setSpreadIndex(target);
      setFlipping(false);
    }, FLIP_MS);
  }, [canPrev, spreadIndex]);

  /* keyboard */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isMobile) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, isMobile]);

  const onTouchStart = useCallback((e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; }, []);
  const onTouchEnd   = useCallback((e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) goNext(); else goPrev();
  }, [goNext, goPrev]);

  /* ── derived spread pages ── */
  const cur  = spreads[spreadIndex];
  const from = spreads[fromIdx];
  const to   = spreads[toIdx];

  /*
   * During forward flip:   static left = from[0], static right = to[1]
   *   flip element covers right half: front = from[1], back = to[0]
   * During backward flip:  static left = to[0],   static right = from[1]
   *   flip element covers left half:  front = from[0], back = to[1]
   */
  const staticLeft  = flipping ? (flipDir === "fwd" ? from[0] : to[0])   : cur[0];
  const staticRight = flipping ? (flipDir === "fwd" ? to[1]   : from[1]) : cur[1];
  const flipFront   = flipDir === "fwd" ? from[1] : from[0];
  const flipBack    = flipDir === "fwd" ? to[0]   : to[1];

  /* ══════════════════════════════════════════
     MOBILE RENDER
  ══════════════════════════════════════════ */
  if (isMobile) {
    const page = allPages[mobilePageIndex];
    const canMobileNext = mobilePageIndex < totalPages - 1;
    const canMobilePrev = mobilePageIndex > 0;

    return (
      <div className="flex flex-col items-center w-full">
        <div
          className="relative"
          onTouchStart={onMobileTouchStart}
          onTouchEnd={onMobileTouchEnd}
        >
          <div className="w-full h-[2px] mb-1"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,46,46,0.4),transparent)" }} />

          <div
            className="relative overflow-hidden"
            style={{
              width: "min(400px, 92vw)",
              height: "min(560px, 135vw)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <div className="absolute left-0 right-0 top-0 h-[5px] pointer-events-none z-10"
              style={{ background: "linear-gradient(to bottom,rgba(255,255,255,0.06),transparent)" }} />
            <div className="absolute left-0 right-0 bottom-0 h-[5px] pointer-events-none z-10"
              style={{ background: "linear-gradient(to top,rgba(0,0,0,0.45),transparent)" }} />

            <AnimatePresence initial={false} custom={mobileDir} mode="wait">
              <motion.div
                key={mobilePageIndex}
                custom={mobileDir}
                variants={mobileVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Page data={page} side="L" />
              </motion.div>
            </AnimatePresence>

            {/* Tap zones — left 35% prev, right 35% next */}
            <button
              onClick={mobilePrev}
              disabled={!canMobilePrev}
              aria-label="Previous page"
              style={{ position: "absolute", left: 0, top: 0, width: "35%", height: "100%", zIndex: 15, background: "transparent", border: "none", cursor: canMobilePrev ? "pointer" : "default" }}
            >
              <span style={{ position: "absolute", left: "18%", top: "50%", transform: "translateY(-50%)", opacity: canMobilePrev ? 0.35 : 0, color: "#ff2e2e", fontSize: 22, fontFamily: "serif", pointerEvents: "none", userSelect: "none", transition: "opacity 0.2s" }}>‹</span>
            </button>
            <button
              onClick={mobileNext}
              disabled={!canMobileNext}
              aria-label="Next page"
              style={{ position: "absolute", right: 0, top: 0, width: "35%", height: "100%", zIndex: 15, background: "transparent", border: "none", cursor: canMobileNext ? "pointer" : "default" }}
            >
              <span style={{ position: "absolute", right: "18%", top: "50%", transform: "translateY(-50%)", opacity: canMobileNext ? 0.35 : 0, color: "#ff2e2e", fontSize: 22, fontFamily: "serif", pointerEvents: "none", userSelect: "none", transition: "opacity 0.2s" }}>›</span>
            </button>
          </div>

          <div className="w-full h-[2px] mt-1"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,46,46,0.4),transparent)" }} />
        </div>

        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={mobilePrev}
            disabled={!canMobilePrev}
            className="flex items-center gap-1 text-[11px] tracking-widest uppercase font-sans transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ color: canMobilePrev ? "#ff2e2e" : "rgba(245,240,232,0.3)" }}
          >
            <ChevronLeft size={14} /> Prev
          </button>

          <div className="flex items-center gap-[5px]">
            {allPages.map((_, i) => (
              <button
                key={i}
                onClick={() => { setMobileDir(i > mobilePageIndex ? 1 : -1); setMobilePageIndex(i); }}
                style={{
                  width: i === mobilePageIndex ? 18 : 5,
                  height: 2,
                  background: i === mobilePageIndex ? "#ff2e2e" : "rgba(255,255,255,0.15)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            ))}
          </div>

          <button
            onClick={mobileNext}
            disabled={!canMobileNext}
            className="flex items-center gap-1 text-[11px] tracking-widest uppercase font-sans transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ color: canMobileNext ? "#ff2e2e" : "rgba(245,240,232,0.3)" }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>

        <p className="mt-3 text-[9px] tracking-[0.35em] font-sans uppercase"
          style={{ color: "rgba(245,240,232,0.45)" }}>
          tap sides or swipe to turn
        </p>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     DESKTOP RENDER — CSS keyframe flip
  ══════════════════════════════════════════ */
  return (
    <div className="flex flex-col items-center w-full">

      {/* Book container — perspective must be on the parent */}
      <div
        style={{ perspective: "2500px", perspectiveOrigin: "50% 40%" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        data-testid="flip-book"
      >
        <div
          style={{
            position: "relative",
            width: "min(1100px, 96vw)",
            height: "min(680px, 62vw)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* ── Static left page ── */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", overflow: "hidden", zIndex: 1 }}>
            <Page data={staticLeft} side="L" />
          </div>

          {/* ── Static right page ── */}
          <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", overflow: "hidden", zIndex: 1 }}>
            <Page data={staticRight} side="R" />
          </div>

          {/* ── Flipping page (CSS keyframe 3D) ── */}
          {flipping && (
            <div
              style={{
                position: "absolute",
                top: 0,
                height: "100%",
                width: "50%",
                zIndex: 10,
                transformStyle: "preserve-3d",
                ...(flipDir === "fwd"
                  ? {
                      left: "50%",
                      transformOrigin: "0% 50%",
                      animation: `daspot-flip-fwd ${FLIP_MS}ms cubic-bezier(0.645,0.045,0.355,1.000) forwards`,
                    }
                  : {
                      left: 0,
                      transformOrigin: "100% 50%",
                      animation: `daspot-flip-bwd ${FLIP_MS}ms cubic-bezier(0.645,0.045,0.355,1.000) forwards`,
                    }),
              }}
            >
              {/* Front face — visible at start of animation */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                <Page data={flipFront} side={flipDir === "fwd" ? "R" : "L"} />
                {/* Page-curl shadow on spine edge */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: flipDir === "fwd"
                    ? "linear-gradient(to left, rgba(0,0,0,0.0) 70%, rgba(0,0,0,0.35) 100%)"
                    : "linear-gradient(to right, rgba(0,0,0,0.0) 70%, rgba(0,0,0,0.35) 100%)",
                  pointerEvents: "none",
                }} />
              </div>

              {/* Back face — revealed as page flips */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <Page data={flipBack} side={flipDir === "fwd" ? "L" : "R"} />
              </div>
            </div>
          )}

          {/* ── Spine ── */}
          <div style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: 3,
            height: "100%",
            zIndex: 20,
            background: "linear-gradient(to right,#1a0000,#2d0000,#1a0000)",
            boxShadow: "0 0 12px rgba(0,0,0,0.9)",
            pointerEvents: "none",
          }} />

          {/* ── Clickable side zones (35% width, full height) with hover arrow hints ── */}
          <button
            onClick={goNext}
            disabled={!canNext}
            aria-label="Next page"
            onMouseEnter={() => setHoverSide("right")}
            onMouseLeave={() => setHoverSide(null)}
            style={{ position: "absolute", right: 0, top: 0, width: "35%", height: "100%", zIndex: 25, background: "transparent", border: "none", cursor: canNext ? "pointer" : "default" }}
          >
            <span style={{
              position: "absolute", right: "18%", top: "50%",
              transform: "translateY(-50%)",
              opacity: hoverSide === "right" && canNext ? 1 : 0,
              transition: "opacity 0.2s",
              color: "rgba(255,46,46,0.75)",
              fontSize: 32, fontFamily: "serif",
              pointerEvents: "none", userSelect: "none",
              textShadow: "0 0 12px rgba(255,46,46,0.4)",
            }}>›</span>
          </button>
          <button
            onClick={goPrev}
            disabled={!canPrev}
            aria-label="Previous page"
            onMouseEnter={() => setHoverSide("left")}
            onMouseLeave={() => setHoverSide(null)}
            style={{ position: "absolute", left: 0, top: 0, width: "35%", height: "100%", zIndex: 25, background: "transparent", border: "none", cursor: canPrev ? "pointer" : "default" }}
          >
            <span style={{
              position: "absolute", left: "18%", top: "50%",
              transform: "translateY(-50%)",
              opacity: hoverSide === "left" && canPrev ? 1 : 0,
              transition: "opacity 0.2s",
              color: "rgba(255,46,46,0.75)",
              fontSize: 32, fontFamily: "serif",
              pointerEvents: "none", userSelect: "none",
              textShadow: "0 0 12px rgba(255,46,46,0.4)",
            }}>‹</span>
          </button>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center gap-10 mt-8">
        <button
          onClick={goPrev}
          disabled={!canPrev}
          data-testid="flip-prev"
          className="flex items-center gap-2 text-[11px] tracking-widest uppercase font-sans transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ color: canPrev ? "#ff2e2e" : "rgba(245,240,232,0.3)" }}
        >
          <ChevronLeft size={14} /> Prev
        </button>

        <div className="flex items-center gap-[5px]">
          {spreads.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (flipping || i === spreadIndex) return;
                setFromIdx(spreadIndex);
                setToIdx(i);
                setFlipDir(i > spreadIndex ? "fwd" : "bwd");
                setFlipping(true);
                setTimeout(() => { setSpreadIndex(i); setFlipping(false); }, FLIP_MS);
              }}
              style={{
                width: i === spreadIndex ? 18 : 5,
                height: 2,
                background: i === spreadIndex ? "#ff2e2e" : "rgba(255,255,255,0.18)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.3s, background 0.3s",
              }}
              aria-label={`Go to spread ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={!canNext}
          data-testid="flip-next"
          className="flex items-center gap-2 text-[11px] tracking-widest uppercase font-sans transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ color: canNext ? "#ff2e2e" : "rgba(245,240,232,0.3)" }}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>

      <p className="mt-3 text-[9px] tracking-[0.35em] font-sans uppercase"
        style={{ color: "rgba(245,240,232,0.45)" }}>
        click corners or use arrow keys to turn pages
      </p>
    </div>
  );
}
