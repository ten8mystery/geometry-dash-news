import React, { useEffect, useState } from "react";

// --- Particle Background Component ---
function ParticleBackground() {
  useEffect(() => {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    draw();

    window.onresize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
  }, []);

  return <canvas id="particles" className="fixed top-0 left-0 w-full h-full -z-10"></canvas>;
}

// --- Slide Panel Component (FIXED) ---
function SlidePanel({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex justify-end animate-slideLeft">
      <div className="w-80 h-full bg-[#111] border-l border-white/10 p-6 overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// --- Theme Option Component ---
function ThemeOption({ name, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-left transition"
    >
      <div className="font-semibold">{name} Theme</div>
    </button>
  );
}

export default function GeometryDashMenuUI() {
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showPlay, setShowPlay] = useState(false);
  const [showNewsPanel, setShowNewsPanel] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("/news.json")
      .then((res) => res.json())
      .then((data) => setNews(data.news || []))
      .catch(() => setNews([]));
  }, []);

  const themeClass =
    theme === "dark"
      ? "bg-gradient-to-b from-[#0a0a0e] to-[#14141c]"
      : theme === "neon"
      ? "bg-gradient-to-b from-[#190033] to-[#330066]"
      : "bg-gradient-to-b from-[#001a26] to-[#003344]";

  return (
    <div className={`min-h-screen w-full text-white flex flex-col items-center py-12 px-6 relative ${themeClass}`}>
      <ParticleBackground />

      {/* Logo */}
      <img
        src="https://assets-prd.ignimgs.com/2021/12/14/geometrydash-1639510868467.jpg?crop=1%3A1%2Csmart&format=jpg&auto=webp&quality=80"
        className="w-28 h-28 rounded-2xl shadow-2xl object-cover mb-8"
      />

      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight">Geometry Dash News</h1>
        <p className="text-slate-400 mt-2 text-sm tracking-widest uppercase">Modern Dashboard UI</p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl animate-slideUp">
          <div className="text-xl font-semibold mb-2">Featured</div>
          <div className="text-slate-300 text-sm">{news[0]?.title || "Loading..."}</div>
        </div>

        <div className="flex flex-col gap-4">
          <MenuButton label="Play Lite" onClick={() => setShowPlay(true)} />
          <MenuButton label="News" onClick={() => setShowNewsPanel(true)} />
          <MenuButton label="Theme Settings" onClick={() => setShowThemeSettings(true)} />
          <MenuButton label="Credits" onClick={() => setShowCredits(true)} />
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl h-full flex flex-col gap-4 animate-slideUp">
          <div className="text-lg font-semibold">Latest News</div>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[260px] pr-2">
            {news.slice(0, 5).map((n, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="font-medium">{n.title}</div>
                <div className="text-xs text-slate-300 mt-1">{n.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPlay && <FullScreenIframe onClose={() => setShowPlay(false)} src="https://gdl-eosin.vercel.app/" />}

      {showNewsPanel && (
        <SlidePanel title="News" onClose={() => setShowNewsPanel(false)}>
          {news.length === 0 && <div className="text-slate-400 text-sm">No news available.</div>}
          <div className="flex flex-col gap-5">
            {news.map((n, i) => (
              <div key={i} className="p-5 bg-white/5 rounded-xl border border-white/10">
                <div className="font-semibold text-lg">{n.title}</div>
                <p className="text-sm text-slate-300 mt-2">{n.desc}</p>
                <div className="text-xs opacity-50 mt-2">{n.date}</div>
              </div>
            ))}
          </div>
        </SlidePanel>
      )}

      {showThemeSettings && (
        <SlidePanel title="Theme Settings" onClose={() => setShowThemeSettings(false)}>
          <div className="flex flex-col gap-3">
            <ThemeOption name="Dark" onClick={() => setTheme("dark")} />
            <ThemeOption name="Neon" onClick={() => setTheme("neon")} />
            <ThemeOption name="Ocean" onClick={() => setTheme("ocean")} />
          </div>
        </SlidePanel>
      )}

      {showCredits && (
        <SlidePanel title="Credits" onClose={() => setShowCredits(false)}>
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            <div><strong>UI</strong>: Most code by ZincGMD</div>
            <div><strong>Player</strong>: gdl-eosin (embedded)</div>
            <div><strong>Assets</strong>: IGN image used as icon (linked)</div>
            <div><strong>Built with</strong>: React + TailwindCSS</div>
            <div className="mt-2 text-xs opacity-60">Made with ❤️ — thanks for using this site!.</div>
          </div>
        </SlidePanel>
      )}
    </div>
  );
}

// --- Menu Button ---
function MenuButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/5 hover:bg-white/10 transition shadow-lg shadow-black/30 px-5 py-4 rounded-xl flex justify-between items-center border border-white/10 backdrop-blur-md text-left"
    >
      <span className="font-semibold text-lg">{label}</span>
      <span className="opacity-40">›</span>
    </button>
  );
}

// --- Fullscreen Iframe ---
function FullScreenIframe({ src, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col animate-slideLeft">
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
        >
          Close
        </button>
      </div>
      <iframe
        src={src}
        className="w-full h-full border-0 rounded-none"
        allow="fullscreen"
      ></iframe>
    </div>
  );
}
