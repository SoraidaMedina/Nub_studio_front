// src/pages/public/Artistas.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, RefreshCw, ImageIcon, Palette,
  Mail, Award, Sparkles, X, ChevronRight
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const C = {
  orange:"#FF840E", blue:"#79AAF5", pink:"#CC59AD",
  purple:"#8D4CCD", gold:"#FFC110",
  text:"#1C1F26", muted:"#9CA3AF",
  bg:"#F8F6F2", surface:"#FFFFFF", border:"#E8EAF0",
};

const AVATAR_COLORS = [C.orange, C.pink, C.purple, C.blue, C.gold];

interface Artista {
  id_artista: number;
  nombre_completo: string;
  nombre_artistico: string;
  biografia: string;
  foto_perfil: string;
  categoria_nombre: string;
  total_obras: number;
  estado: string;
}

function AvatarCard({ artista, navigate }: { artista: Artista; navigate: any }) {
  const color    = AVATAR_COLORS[artista.id_artista % AVATAR_COLORS.length];
  const initials = artista.nombre_completo?.split(" ").slice(0,2).map((n:string)=>n[0]).join("").toUpperCase() || "?";
  const alias    = artista.nombre_artistico || artista.nombre_completo;

  return (
    <div
      onClick={() => navigate(`/artistas/${artista.id_artista}`)}
      style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:"hidden", cursor:"pointer", transition:"all .2s" }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform="translateY(-5px)"; el.style.boxShadow=`0 16px 40px rgba(0,0,0,0.1)`; el.style.borderColor=color; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform="none"; el.style.boxShadow="none"; el.style.borderColor=C.border; }}
    >
      {/* banner */}
      <div style={{ height:90, background:`linear-gradient(135deg, ${color}25, ${color}10)`, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(circle at 20% 50%, ${color}15 0%, transparent 60%)` }} />
      </div>

      {/* avatar */}
      <div style={{ padding:"0 20px", marginTop:-36, position:"relative", zIndex:2 }}>
        <div style={{ width:72, height:72, borderRadius:18, border:`3px solid ${C.surface}`, overflow:"hidden", background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 16px ${color}30` }}>
          {artista.foto_perfil
            ? <img src={artista.foto_perfil} alt={artista.nombre_completo} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : <span style={{ fontSize:24, fontWeight:900, color }}>{initials}</span>
          }
        </div>
      </div>

      {/* info */}
      <div style={{ padding:"12px 20px 20px" }}>
        <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:2, fontFamily:"'Outfit',sans-serif" }}>{artista.nombre_completo}</div>
        {artista.nombre_artistico && (
          <div style={{ fontSize:13, color, fontWeight:600, marginBottom:8, fontFamily:"'Outfit',sans-serif" }}>✦ {artista.nombre_artistico}</div>
        )}
        {artista.categoria_nombre && (
          <span style={{ display:"inline-block", fontSize:11.5, padding:"3px 10px", borderRadius:20, background:`${color}12`, color, fontWeight:700, marginBottom:10, fontFamily:"'Outfit',sans-serif" }}>
            {artista.categoria_nombre}
          </span>
        )}
        {artista.biografia && (
          <p style={{ fontSize:13, color:C.muted, lineHeight:1.6, margin:"0 0 12px", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", fontFamily:"'Outfit',sans-serif" }}>
            {artista.biografia}
          </p>
        )}

        {/* footer */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12, borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>
            <Palette size={13} color={color} strokeWidth={2} />
            <span><strong style={{ color:C.text }}>{artista.total_obras || 0}</strong> obras</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12.5, color, fontWeight:600, fontFamily:"'Outfit',sans-serif" }}>
            Ver perfil <ChevronRight size={13} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Artistas() {
  const navigate = useNavigate();
  const [artistas,  setArtistas]  = useState<Artista[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [catActiva, setCatActiva] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API_URL}/api/artistas`);
        const json = await res.json();
        setArtistas(json.data || []);
      } catch { setArtistas([]); }
      finally { setLoading(false); }
    })();
  }, []);

  const categorias = [...new Set(artistas.map(a => a.categoria_nombre).filter(Boolean))];

  const filtrados = artistas.filter(a => {
    const matchSearch = !search || [a.nombre_completo, a.nombre_artistico, a.biografia]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchCat = !catActiva || a.categoria_nombre === catActiva;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit',sans-serif" }}>

      {/* hero */}
      <div style={{ background:`linear-gradient(135deg, #1C1F26 0%, #2d1b4e 50%, #1a1230 100%)`, padding:"52px 0 44px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:320, height:320, borderRadius:"50%", background:`${C.pink}10` }} />
        <div style={{ position:"absolute", bottom:-60, left:-40, width:260, height:260, borderRadius:"50%", background:`${C.purple}12` }} />
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Sparkles size={16} color={C.gold} strokeWidth={2} />
            <span style={{ fontSize:12, fontWeight:700, color:C.gold, letterSpacing:"1.5px", textTransform:"uppercase" }}>Nu-B Studio</span>
          </div>
          <h1 style={{ fontSize:36, fontWeight:900, color:"white", margin:"0 0 10px", lineHeight:1.1 }}>
            Nuestros <span style={{ color:C.pink }}>Artistas</span>
          </h1>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.6)", margin:"0 0 28px", maxWidth:500 }}>
            Conoce a los creadores que dan vida a la cultura huasteca. Artistas locales con talento y trayectoria certificada.
          </p>

          {/* buscador */}
          <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.08)", border:"1.5px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"12px 16px", maxWidth:500, backdropFilter:"blur(10px)" }}>
            <Search size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.8} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar artistas…"
              style={{ border:"none", outline:"none", background:"transparent", color:"white", fontSize:14, flex:1, fontFamily:"'Outfit',sans-serif" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background:"transparent", border:"none", cursor:"pointer" }}>
                <X size={14} color="rgba(255,255,255,0.4)" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 24px" }}>

        {/* categorías */}
        {categorias.length > 0 && (
          <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
            <button
              onClick={() => setCatActiva(null)}
              style={{ padding:"7px 16px", borderRadius:20, border:`1.5px solid ${!catActiva ? C.pink : C.border}`, background:!catActiva ? C.pink : C.surface, color:!catActiva ? "white" : C.muted, fontWeight:!catActiva ? 700 : 400, fontSize:13, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .15s" }}>
              Todos
            </button>
            {categorias.map(cat => (
              <button key={cat}
                onClick={() => setCatActiva(catActiva === cat ? null : cat)}
                style={{ padding:"7px 16px", borderRadius:20, border:`1.5px solid ${catActiva===cat ? C.pink : C.border}`, background:catActiva===cat ? C.pink : C.surface, color:catActiva===cat ? "white" : C.muted, fontWeight:catActiva===cat ? 700 : 400, fontSize:13, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .15s" }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* conteo */}
        <div style={{ fontSize:13.5, color:C.muted, marginBottom:20 }}>
          {loading ? "Cargando…" : <><strong style={{ color:C.text }}>{filtrados.length}</strong> artistas encontrados</>}
        </div>

        {/* grid */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:"80px 0", gap:12, color:C.muted }}>
            <RefreshCw size={22} style={{ animation:"spin 1s linear infinite" }} />
            <span>Cargando artistas…</span>
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:C.muted }}>
            <ImageIcon size={48} strokeWidth={1} style={{ opacity:.2, marginBottom:16 }} />
            <div style={{ fontSize:17, fontWeight:600, color:C.text, marginBottom:8 }}>Sin resultados</div>
            <div style={{ fontSize:14 }}>Intenta con otro término</div>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20 }}>
            {filtrados.map(a => <AvatarCard key={a.id_artista} artista={a} navigate={navigate} />)}
          </div>
        )}

        {/* stats bottom */}
        {!loading && filtrados.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16, marginTop:48, maxWidth:600, margin:"48px auto 0" }}>
            {[
              { label:"Artistas activos", value:artistas.length,                                        color:C.pink   },
              { label:"Obras en galería", value:artistas.reduce((s,a)=>s+Number(a.total_obras||0),0),   color:C.orange },
              { label:"Categorías",       value:categorias.length,                                      color:C.purple },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, padding:"20px 16px", textAlign:"center" }}>
                <div style={{ fontSize:28, fontWeight:900, color }}>{value}</div>
                <div style={{ fontSize:12.5, color:C.muted, marginTop:4, fontWeight:500 }}>{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}