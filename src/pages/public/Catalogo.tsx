// src/pages/public/Catalogo.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, Filter, X, ChevronLeft, ChevronRight,
  RefreshCw, Image as ImageIcon, SlidersHorizontal,
  Eye, ShoppingBag, Sparkles, Tag
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const C = {
  orange:"#FF840E", blue:"#79AAF5", pink:"#CC59AD",
  purple:"#8D4CCD", gold:"#FFC110",
  text:"#1C1F26", muted:"#9CA3AF",
  bg:"#F8F6F2", surface:"#FFFFFF", border:"#E8EAF0",
};

interface Obra {
  id_obra: number; titulo: string; slug: string;
  imagen_principal: string; precio_base: number; precio_minimo: number;
  categoria_nombre: string; categoria_slug: string;
  artista_nombre: string; artista_alias: string;
  anio_creacion: number; vistas: number; estado: string;
}

interface Categoria { id_categoria: number; nombre: string; slug: string; }

const ORDENAR = [
  { val:"recientes", label:"Más recientes" },
  { val:"antiguos",  label:"Más antiguos"  },
  { val:"nombre",    label:"A → Z"         },
  { val:"precio_asc", label:"Precio: menor a mayor" },
  { val:"precio_desc",label:"Precio: mayor a menor" },
];

function ObraCard({ obra, navigate }: { obra: Obra; navigate: any }) {
  const precio = obra.precio_minimo || obra.precio_base;
  return (
    <div
      onClick={() => navigate(`/obras/${obra.slug}`)}
      style={{ background:C.surface, borderRadius:16, overflow:"hidden", cursor:"pointer", border:`1px solid ${C.border}`, transition:"all .2s", position:"relative" }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform="translateY(-4px)"; el.style.boxShadow="0 12px 40px rgba(0,0,0,0.1)"; el.style.borderColor=C.orange; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform="none"; el.style.boxShadow="none"; el.style.borderColor=C.border; }}
    >
      {/* imagen */}
      <div style={{ height:220, background:`${C.blue}10`, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative" }}>
        {obra.imagen_principal ? (
          <img src={obra.imagen_principal} alt={obra.titulo} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .3s" }}
            onMouseEnter={e => (e.target as HTMLImageElement).style.transform="scale(1.05)"}
            onMouseLeave={e => (e.target as HTMLImageElement).style.transform="scale(1)"}
          />
        ) : (
          <ImageIcon size={40} color={C.blue} strokeWidth={1.2} style={{ opacity:.3 }} />
        )}
        {/* overlay acciones */}
        <div className="obra-overlay" style={{ position:"absolute", inset:0, background:"rgba(28,31,38,0.5)", display:"flex", alignItems:"center", justifyContent:"center", gap:12, opacity:0, transition:"opacity .2s" }}>
          <button style={{ width:40, height:40, borderRadius:10, background:"white", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Eye size={16} color={C.orange} strokeWidth={2} />
          </button>
          <button style={{ width:40, height:40, borderRadius:10, background:C.orange, border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <ShoppingBag size={16} color="white" strokeWidth={2} />
          </button>
        </div>
        {/* categoría badge */}
        <div style={{ position:"absolute", top:10, left:10 }}>
          <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,0.92)", color:C.orange, fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>
            {obra.categoria_nombre}
          </span>
        </div>
      </div>

      {/* info */}
      <div style={{ padding:"16px" }}>
        <div style={{ fontSize:14.5, fontWeight:700, color:C.text, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'Outfit',sans-serif" }}>
          {obra.titulo}
        </div>
        <div style={{ fontSize:12.5, color:C.muted, marginBottom:10, fontFamily:"'Outfit',sans-serif" }}>
          {obra.artista_alias || obra.artista_nombre}
          {obra.anio_creacion ? ` · ${obra.anio_creacion}` : ""}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            {precio ? (
              <>
                <div style={{ fontSize:10, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>Desde</div>
                <div style={{ fontSize:16, fontWeight:900, color:C.orange, fontFamily:"'Outfit',sans-serif" }}>
                  ${Number(precio).toLocaleString("es-MX")}
                  <span style={{ fontSize:11, fontWeight:500, color:C.muted }}> MXN</span>
                </div>
              </>
            ) : (
              <div style={{ fontSize:13, color:C.muted, fontStyle:"italic", fontFamily:"'Outfit',sans-serif" }}>Precio a consultar</div>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:C.muted }}>
            <Eye size={12} strokeWidth={1.8} /> {obra.vistas || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Catalogo() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [obras,      setObras]      = useState<Obra[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search,    setSearch]    = useState(searchParams.get("q") || "");
  const [catActiva, setCatActiva] = useState<number|null>(searchParams.get("categoria") ? Number(searchParams.get("categoria")) : null);
  const [ordenar,   setOrdenar]   = useState(searchParams.get("ordenar") || "recientes");
  const [page,      setPage]      = useState(Number(searchParams.get("page")) || 1);
  const [showFiltros, setShowFiltros] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/categorias`)
      .then(r => r.json())
      .then(j => setCategorias(j.data || []))
      .catch(() => {});
  }, []);

  const cargarObras = useCallback(async () => {
    setLoading(true);
    try {
      if (search.trim().length >= 2) {
        const res  = await fetch(`${API_URL}/api/obras/buscar?q=${encodeURIComponent(search)}&page=${page}&limit=12`);
        const json = await res.json();
        setObras(json.data || []);
        setTotal(json.pagination?.total || 0);
        setTotalPages(json.pagination?.totalPages || 1);
      } else {
        const params = new URLSearchParams({ page:String(page), limit:"12", ordenar });
        if (catActiva) params.set("categoria", String(catActiva));
        const res  = await fetch(`${API_URL}/api/obras?${params}`);
        const json = await res.json();
        setObras(json.data || []);
        setTotal(json.pagination?.total || 0);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch { setObras([]); }
    finally { setLoading(false); }
  }, [search, catActiva, ordenar, page]);

  useEffect(() => { cargarObras(); }, [cargarObras]);

  const handleCat = (id: number | null) => { setCatActiva(id); setPage(1); };
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleOrdenar = (val: string) => { setOrdenar(val); setPage(1); };

  const catNombre = catActiva ? categorias.find(c => c.id_categoria === catActiva)?.nombre : null;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit',sans-serif" }}>

      {/* hero strip */}
      <div className="catalogo-hero" style={{ background:`linear-gradient(135deg, #1C1F26 0%, #2d1b4e 50%, #1a1230 100%)`, padding:"48px 0 40px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", background:`${C.orange}12` }} />
        <div style={{ position:"absolute", bottom:-80, left:-40, width:250, height:250, borderRadius:"50%", background:`${C.purple}15` }} />
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Sparkles size={16} color={C.gold} strokeWidth={2} />
            <span style={{ fontSize:12, fontWeight:700, color:C.gold, letterSpacing:"1.5px", textTransform:"uppercase" }}>Colección Nu-B Studio</span>
          </div>
          <h1 style={{ fontSize:36, fontWeight:900, color:"white", margin:"0 0 10px", lineHeight:1.1 }}>
            Catálogo de <span style={{ color:C.orange }}>Arte Huasteco</span>
          </h1>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.6)", margin:"0 0 28px", maxWidth:520 }}>
            Descubre obras únicas de artistas locales. Cada pieza es un puente entre la tradición ancestral y el arte contemporáneo.
          </p>

          {/* búsqueda */}
          <div style={{ display:"flex", gap:10, maxWidth:600 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.08)", border:"1.5px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"12px 16px", backdropFilter:"blur(10px)" }}>
              <Search size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.8} />
              <input value={search} onChange={e => handleSearch(e.target.value)}
                placeholder="Buscar obras, artistas, técnicas…"
                style={{ border:"none", outline:"none", background:"transparent", color:"white", fontSize:14, flex:1, fontFamily:"'Outfit',sans-serif" }}
              />
              {search && <button onClick={() => handleSearch("")} style={{ background:"transparent", border:"none", cursor:"pointer", padding:2 }}><X size={14} color="rgba(255,255,255,0.4)" /></button>}
            </div>
            <button onClick={() => setShowFiltros(!showFiltros)} style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 18px", borderRadius:12, background: showFiltros ? C.orange : "rgba(255,255,255,0.08)", border:`1.5px solid ${showFiltros ? C.orange : "rgba(255,255,255,0.12)"}`, color:"white", fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .15s" }}>
              <SlidersHorizontal size={16} strokeWidth={2} /> Filtros
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px" }}>

        {/* filtros expandibles */}
        {showFiltros && (
          <div style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, padding:"20px", marginBottom:20, display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:8 }}>Ordenar por</div>
              <select value={ordenar} onChange={e => handleOrdenar(e.target.value)}
                style={{ padding:"8px 12px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, color:C.text, fontFamily:"'Outfit',sans-serif", outline:"none", background:C.surface, cursor:"pointer" }}>
                {ORDENAR.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* categorías */}
        <div className="cats-row" style={{ alignItems:"center" }}>
          <button onClick={() => handleCat(null)}
            style={{ padding:"7px 16px", borderRadius:20, border:`1.5px solid ${catActiva===null ? C.orange : C.border}`, background: catActiva===null ? C.orange : C.surface, color: catActiva===null ? "white" : C.muted, fontWeight: catActiva===null ? 700 : 400, fontSize:13, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .15s" }}>
            Todas
          </button>
          {categorias.map(c => (
            <button key={c.id_categoria} onClick={() => handleCat(c.id_categoria)}
              style={{ padding:"7px 16px", borderRadius:20, border:`1.5px solid ${catActiva===c.id_categoria ? C.orange : C.border}`, background: catActiva===c.id_categoria ? C.orange : C.surface, color: catActiva===c.id_categoria ? "white" : C.muted, fontWeight: catActiva===c.id_categoria ? 700 : 400, fontSize:13, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .15s" }}>
              {c.nombre}
            </button>
          ))}
        </div>

        {/* info resultados */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div style={{ fontSize:13.5, color:C.muted }}>
            {loading ? "Cargando…" : (
              <>
                <strong style={{ color:C.text }}>{total}</strong> obras encontradas
                {catNombre && <> en <strong style={{ color:C.orange }}>{catNombre}</strong></>}
                {search && <> para "<strong style={{ color:C.text }}>{search}</strong>"</>}
              </>
            )}
          </div>
          {(catActiva || search) && (
            <button onClick={() => { handleCat(null); handleSearch(""); }}
              style={{ display:"flex", alignItems:"center", gap:5, fontSize:12.5, color:C.orange, background:"transparent", border:"none", cursor:"pointer", fontWeight:600, fontFamily:"'Outfit',sans-serif" }}>
              <X size={13} strokeWidth={2.5} /> Limpiar filtros
            </button>
          )}
        </div>

        {/* grid */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:"80px 0", gap:12, color:C.muted }}>
            <RefreshCw size={22} style={{ animation:"spin 1s linear infinite" }} />
            <span style={{ fontSize:15 }}>Cargando obras…</span>
          </div>
        ) : obras.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:C.muted }}>
            <ImageIcon size={48} strokeWidth={1} style={{ opacity:.2, marginBottom:16 }} />
            <div style={{ fontSize:17, fontWeight:600, color:C.text, marginBottom:8 }}>Sin resultados</div>
            <div style={{ fontSize:14 }}>Intenta con otro término o categoría</div>
          </div>
        ) : (
          <div className="obras-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:20 }}>
            {obras.map(obra => <ObraCard key={obra.id_obra} obra={obra} navigate={navigate} />)}
          </div>
        )}

        {/* paginación */}
        {totalPages > 1 && !loading && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:40 }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              style={{ width:38, height:38, borderRadius:10, border:`1px solid ${C.border}`, background: page===1 ? "#f9f9f9" : C.surface, display:"flex", alignItems:"center", justifyContent:"center", cursor: page===1 ? "not-allowed" : "pointer", opacity: page===1 ? .4 : 1 }}>
              <ChevronLeft size={16} color={C.muted} strokeWidth={2} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page-2, totalPages-4)) + i;
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width:38, height:38, borderRadius:10, border:`1.5px solid ${p===page ? C.orange : C.border}`, background: p===page ? C.orange : C.surface, color: p===page ? "white" : C.text, fontWeight: p===page ? 800 : 400, fontSize:14, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .15s" }}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{ width:38, height:38, borderRadius:10, border:`1px solid ${C.border}`, background: page===totalPages ? "#f9f9f9" : C.surface, display:"flex", alignItems:"center", justifyContent:"center", cursor: page===totalPages ? "not-allowed" : "pointer", opacity: page===totalPages ? .4 : 1 }}>
              <ChevronRight size={16} color={C.muted} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .obra-overlay:hover { opacity: 1 !important; }
        div:hover > div > .obra-overlay { opacity: 1 !important; }

        /* ── categorías scroll horizontal en móvil ── */
        .cats-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        @media (max-width: 640px) {
          .cats-row {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 8px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .cats-row::-webkit-scrollbar { display: none; }
          .cats-row button { flex-shrink: 0; }

          /* hero strip padding */
          .catalogo-hero { padding: 32px 0 28px !important; }
          .catalogo-hero h1 { font-size: 26px !important; }

          /* grid 1 col en móvil */
          .obras-grid {
            grid-template-columns: 1fr !important;
          }

          /* filtros full width */
          .catalogo-search-row {
            flex-direction: column;
          }
          .catalogo-search-row > div:first-child { width: 100% !important; }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .obras-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}