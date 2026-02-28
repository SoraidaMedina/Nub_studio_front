// src/pages/private/admin/ListaObras.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Palette, Users, ShoppingBag, BarChart2,
  Settings, Plus, Search, Edit2, Trash2,
  CheckCircle, Clock, XCircle, Package, Eye,
  ChevronLeft, ChevronRight, AlertTriangle, X,
  RefreshCw, Image as ImageIcon, LogOut
} from "lucide-react";
import { obraService } from "../../../services/obraService";
import { authService } from "../../../services/authService";

// ── Design tokens ─────────────────────────────────────────────
const C = {
  orange:  "#FF840E",
  pink:    "#CC59AD",
  purple:  "#8D4CCD",
  gold:    "#FFC110",
  blue:    "#79AAF5",
  bg:      "#0f0c1a",
  surface: "rgba(18,12,32,0.9)",
  border:  "rgba(255,255,255,0.08)",
  text:    "#ffffff",
  muted:   "rgba(255,255,255,0.45)",
  sidebar: "rgba(10,7,20,0.97)",
  rowHover:"rgba(255,255,255,0.03)",
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const ESTADOS: Record<string, { label: string; color: string; icon: any }> = {
  pendiente: { label: "Pendiente", color: C.gold,   icon: Clock       },
  publicada: { label: "Publicada", color: C.orange, icon: CheckCircle },
  rechazada: { label: "Rechazada", color: C.pink,   icon: XCircle     },
  agotada:   { label: "Agotada",   color: C.muted,  icon: Package     },
};

const NAV = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard, color:C.orange, path:"/admin"          },
  { id:"obras",     label:"Obras",     icon:Palette,         color:C.blue,   path:"/admin/obras"    },
  { id:"artistas",  label:"Artistas",  icon:Users,           color:C.pink,   path:"/admin/artistas" },
  { id:"ventas",    label:"Ventas",    icon:ShoppingBag,     color:C.purple, path:"/admin"          },
  { id:"reportes",  label:"Reportes",  icon:BarChart2,       color:C.muted,  path:"/admin"          },
];

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ navigate }: { navigate: any }) {
  const active   = "obras";
  const userName = authService.getUserName?.() || "A";

  return (
    <div style={{
      width: 220, minHeight: "100vh",
      background: C.sidebar,
      borderRight: `1px solid ${C.border}`,
      backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh", flexShrink: 0, zIndex: 40,
    }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${C.orange}40` }}>
            <Palette size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1 }}>Altar Studio</div>
            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2, letterSpacing: "0.04em" }}>Panel Admin</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px 10px" }}>Navegación</div>
        {NAV.map(({ id, label, icon: Icon, color, path }) => {
          const on = active === id;
          return (
            <button key={id} onClick={() => navigate(path)} style={{
              width: "100%", border: "none", cursor: "pointer",
              background: on ? `${color}15` : "transparent",
              borderRadius: 10, padding: "10px 12px",
              display: "flex", alignItems: "center", gap: 10,
              transition: "all .15s", position: "relative",
              fontFamily: "'Outfit', sans-serif",
            }}
              onMouseEnter={e => { if (!on) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!on) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {on && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: "0 3px 3px 0", background: `linear-gradient(180deg, ${color}, ${color}80)` }} />}
              <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: on ? `${color}20` : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={on ? color : "rgba(255,255,255,0.35)"} strokeWidth={on ? 2.2 : 1.8} />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: on ? 700 : 500, color: on ? C.text : "rgba(255,255,255,0.45)" }}>{label}</span>
              {on && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: color }} />}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "12px 10px 20px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white" }}>
            {userName?.[0]?.toUpperCase() || "A"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
            <div style={{ fontSize: 11, color: C.muted }}>Administrador</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, padding: "8px 12px 0" }}>
          <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)", cursor: "pointer", fontSize: 11.5, color: C.muted, fontWeight: 600, fontFamily: "'Outfit',sans-serif", transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = C.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
          ><Settings size={13} strokeWidth={1.8} /> Config</button>
          <button onClick={() => { authService.logout(); navigate("/login"); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 8, border: `1px solid rgba(204,89,173,0.2)`, background: "rgba(204,89,173,0.06)", cursor: "pointer", fontSize: 11.5, color: C.pink, fontWeight: 600, fontFamily: "'Outfit',sans-serif", transition: "all .15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(204,89,173,0.14)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(204,89,173,0.06)"}
          ><LogOut size={13} strokeWidth={1.8} /> Salir</button>
        </div>
      </div>
    </div>
  );
}

// ── Modal eliminar (dark) ─────────────────────────────────────
function ModalEliminar({ obra, onConfirm, onCancel }: { obra: any; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,5,18,0.75)", backdropFilter: "blur(8px)" }}>
      <div style={{ background: "rgba(18,12,32,0.98)", border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 20, padding: "32px", maxWidth: 420, width: "90%", boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", animation: "modalIn .25s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: `${C.pink}18`, border: `1px solid ${C.pink}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <AlertTriangle size={22} color={C.pink} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>¿Eliminar obra?</div>
        <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 28, lineHeight: 1.7 }}>
          Vas a eliminar <strong style={{ color: C.text }}>"{obra?.titulo}"</strong>. Esta acción no se puede deshacer.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.04)", color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = C.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
          >Cancelar</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 6px 20px ${C.pink}35`, transition: "transform .15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
          >Sí, eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ── Modal cambiar estado (dark) ───────────────────────────────
function ModalEstado({ obra, onConfirm, onCancel }: { obra: any; onConfirm: (estado: string) => void; onCancel: () => void }) {
  const [selected, setSelected] = useState(obra?.estado || "pendiente");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,5,18,0.75)", backdropFilter: "blur(8px)" }}>
      <div style={{ background: "rgba(18,12,32,0.98)", border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 20, padding: "32px", maxWidth: 400, width: "90%", boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", animation: "modalIn .25s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.text }}>Cambiar estado</div>
          <button onClick={onCancel} style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={15} color={C.muted} />
          </button>
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>
          Obra: <strong style={{ color: C.text }}>{obra?.titulo}</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {Object.entries(ESTADOS).map(([key, { label, color, icon: Icon }]) => {
            const on = selected === key;
            return (
              <button key={key} onClick={() => setSelected(key)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 12,
                border: `1.5px solid ${on ? `${color}50` : C.border}`,
                background: on ? `${color}12` : "rgba(255,255,255,0.02)",
                cursor: "pointer", textAlign: "left",
                fontFamily: "'Outfit',sans-serif", transition: "all .15s",
              }}
                onMouseEnter={e => { if (!on) (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; }}
                onMouseLeave={e => { if (!on) (e.currentTarget as HTMLElement).style.borderColor = C.border; }}
              >
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={14} color={color} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: on ? 700 : 400, color: on ? C.text : C.muted }}>{label}</span>
                {on && <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />}
              </button>
            );
          })}
        </div>
        <button onClick={() => onConfirm(selected)} style={{
          width: "100%", padding: "12px", borderRadius: 10, border: "none",
          background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`,
          color: "white", fontWeight: 700, fontSize: 14,
          cursor: "pointer", fontFamily: "'Outfit',sans-serif",
          boxShadow: `0 6px 20px ${C.orange}35`, transition: "transform .15s, box-shadow .15s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 28px ${C.orange}50`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${C.orange}35`; }}
        >
          Guardar cambio
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function ListaObras() {
  const navigate = useNavigate();
  const [obras,           setObras]           = useState<any[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [search,          setSearch]          = useState("");
  const [filtroEstado,    setFiltroEstado]    = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [categorias,      setCategorias]      = useState<any[]>([]);
  const [page,            setPage]            = useState(1);
  const [totalPages,      setTotalPages]      = useState(1);
  const [total,           setTotal]           = useState(0);
  const [modalEliminar,   setModalEliminar]   = useState<any>(null);
  const [modalEstado,     setModalEstado]     = useState<any>(null);

  const cargarObras = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "10", solo_publicadas: "false" };
      if (filtroCategoria !== "todas") params.categoria = filtroCategoria;
      const res  = await fetch(`${API_URL}/api/obras?${new URLSearchParams(params)}`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      if (res.ok) {
        const json = await res.json();
        let data = json.data || [];
        if (filtroEstado !== "todos") data = data.filter((o: any) => o.estado === filtroEstado);
        if (search.trim()) data = data.filter((o: any) =>
          o.titulo?.toLowerCase().includes(search.toLowerCase()) ||
          o.artista_nombre?.toLowerCase().includes(search.toLowerCase())
        );
        setObras(data);
        setTotal(json.pagination?.total || data.length);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, filtroEstado, filtroCategoria, search]);

  useEffect(() => { cargarObras(); }, [cargarObras]);
  useEffect(() => {
    obraService.getCategorias().then(r => setCategorias(r.categorias || [])).catch(() => {});
  }, []);

  const handleEliminar = async () => {
    if (!modalEliminar) return;
    try {
      await fetch(`${API_URL}/api/obras/${modalEliminar.id_obra}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      setModalEliminar(null); cargarObras();
    } catch (err) { console.error(err); }
  };

  const handleCambiarEstado = async (nuevoEstado: string) => {
    if (!modalEstado) return;
    try {
      await fetch(`${API_URL}/api/obras/${modalEstado.id_obra}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authService.getToken()}` },
        body: JSON.stringify({ ...modalEstado, estado: nuevoEstado }),
      });
      setModalEstado(null); cargarObras();
    } catch (err) { console.error(err); }
  };

  const FILTROS = [
    { key: "todos", label: "Todos" },
    ...Object.entries(ESTADOS).map(([k, v]) => ({ key: k, label: v.label })),
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text, position: "relative" }}>

      {/* Background orbs */}
      <div style={{ position: "fixed", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.pink}12, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: 200, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}10, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      {modalEliminar && <ModalEliminar obra={modalEliminar} onConfirm={handleEliminar} onCancel={() => setModalEliminar(null)} />}
      {modalEstado   && <ModalEstado   obra={modalEstado}   onConfirm={handleCambiarEstado} onCancel={() => setModalEstado(null)} />}

      <Sidebar navigate={navigate} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>

        {/* Topbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 28px",
          background: "rgba(10,7,20,0.8)",
          borderBottom: `1px solid ${C.border}`,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.text, lineHeight: 1 }}>Gestión de Obras</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
              <span style={{ color: C.blue, fontWeight: 600 }}>{total}</span> obras en total
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={cargarObras}
              style={{ width: 38, height: 38, borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color .15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${C.orange}50`}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = C.border}
            >
              <RefreshCw size={15} color={C.muted} strokeWidth={1.8} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            </button>
            <button onClick={() => navigate("/admin/obras/crear")}
              style={{ display: "flex", alignItems: "center", gap: 7, background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, border: "none", color: "white", padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 6px 20px ${C.orange}35`, transition: "transform .15s, box-shadow .15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 28px ${C.orange}50`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${C.orange}35`; }}
            >
              <Plus size={15} strokeWidth={2.5} /> Nueva Obra
            </button>
          </div>
        </div>

        <main style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>

          {/* Filtros */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 220, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px" }}>
              <Search size={14} color={C.muted} strokeWidth={1.8} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Buscar por título o artista…"
                style={{ border: "none", outline: "none", fontSize: 13.5, color: C.text, background: "transparent", width: "100%", fontFamily: "'Outfit',sans-serif" }}
              />
              {search && <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2, display: "flex" }}><X size={13} color={C.muted} /></button>}
            </div>

            {/* Categoría select */}
            <select value={filtroCategoria} onChange={e => { setFiltroCategoria(e.target.value); setPage(1); }}
              style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, fontSize: 13, color: C.text, cursor: "pointer", fontFamily: "'Outfit',sans-serif", outline: "none" }}>
              <option value="todas">Todas las categorías</option>
              {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
            </select>

            {/* Estado pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FILTROS.map(({ key, label }) => {
                const cfg = ESTADOS[key];
                const on  = filtroEstado === key;
                const col = cfg?.color || C.orange;
                return (
                  <button key={key} onClick={() => { setFiltroEstado(key); setPage(1); }} style={{
                    padding: "8px 16px", borderRadius: 100,
                    border: `1.5px solid ${on ? `${col}60` : C.border}`,
                    background: on ? `${col}15` : "rgba(255,255,255,0.02)",
                    color: on ? col : C.muted,
                    fontWeight: on ? 700 : 400, fontSize: 12.5,
                    cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all .15s",
                  }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden", backdropFilter: "blur(20px)" }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 220, color: C.muted, gap: 10, fontSize: 13 }}>
                <RefreshCw size={18} strokeWidth={1.8} style={{ animation: "spin 1s linear infinite" }} />
                Cargando obras…
              </div>
            ) : obras.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220, color: C.muted, gap: 10 }}>
                <ImageIcon size={40} strokeWidth={1} style={{ opacity: 0.2 }} />
                <div style={{ fontSize: 14 }}>No se encontraron obras</div>
                <button onClick={() => navigate("/admin/obras/crear")} style={{ fontSize: 13, color: C.orange, background: "transparent", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>
                  + Crear primera obra
                </button>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Obra", "Artista", "Categoría", "Precio", "Estado", "Vistas", "Acciones"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "13px 16px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, background: "rgba(255,255,255,0.02)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {obras.map((obra, i) => {
                    const estado     = ESTADOS[obra.estado] || ESTADOS.pendiente;
                    const EstadoIcon = estado.icon;
                    return (
                      <tr key={obra.id_obra}
                        style={{ borderBottom: i < obras.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none", transition: "background .12s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.rowHover}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                      >
                        {/* Obra */}
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 10, background: `${C.blue}15`, border: `1px solid ${C.blue}25`, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {obra.imagen_principal
                                ? <img src={obra.imagen_principal} alt={obra.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                : <ImageIcon size={16} color={C.blue} strokeWidth={1.8} />
                              }
                            </div>
                            <div>
                              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{obra.titulo}</div>
                              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{obra.anio_creacion || "—"}</div>
                            </div>
                          </div>
                        </td>

                        {/* Artista */}
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                          {obra.artista_alias || obra.artista_nombre || "—"}
                        </td>

                        {/* Categoría */}
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 12, padding: "4px 11px", borderRadius: 20, background: `${C.blue}15`, border: `1px solid ${C.blue}25`, color: C.blue, fontWeight: 600 }}>
                            {obra.categoria_nombre || "—"}
                          </span>
                        </td>

                        {/* Precio */}
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>
                            {obra.precio_minimo
                              ? `$${Number(obra.precio_minimo).toLocaleString("es-MX")}`
                              : obra.precio_base
                              ? `$${Number(obra.precio_base).toLocaleString("es-MX")}`
                              : "—"
                            }
                          </span>
                        </td>

                        {/* Estado */}
                        <td style={{ padding: "14px 16px" }}>
                          <button onClick={() => setModalEstado(obra)} title="Click para cambiar estado"
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: `${estado.color}15`, border: `1px solid ${estado.color}30`, color: estado.color, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all .15s" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${estado.color}28`}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${estado.color}15`}
                          >
                            <EstadoIcon size={12} strokeWidth={2.5} />
                            {estado.label}
                          </button>
                        </td>

                        {/* Vistas */}
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.muted }}>
                            <Eye size={13} strokeWidth={1.8} />
                            {obra.vistas || 0}
                          </div>
                        </td>

                        {/* Acciones */}
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            {[
                              { icon: Edit2,  color: C.blue, action: () => navigate(`/admin/obras/editar/${obra.id_obra}`), title: "Editar" },
                              { icon: Trash2, color: C.pink, action: () => setModalEliminar(obra), title: "Eliminar" },
                            ].map(({ icon: Icon, color, action, title }) => (
                              <button key={title} onClick={action} title={title} style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: `${color}12`, border: `1px solid ${color}20`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "all .15s",
                              }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}28`; (e.currentTarget as HTMLElement).style.borderColor = `${color}50`; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}12`; (e.currentTarget as HTMLElement).style.borderColor = `${color}20`; }}
                              >
                                <Icon size={13} color={color} strokeWidth={2} />
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
              <div style={{ fontSize: 13, color: C.muted }}>
                Página <span style={{ color: C.text, fontWeight: 600 }}>{page}</span> de <span style={{ color: C.text, fontWeight: 600 }}>{totalPages}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, transition: "all .15s" }}>
                  <ChevronLeft size={15} color={C.muted} strokeWidth={2} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p      = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  const active = p === page;
                  return (
                    <button key={p} onClick={() => setPage(p)} style={{
                      width: 34, height: 34, borderRadius: 8,
                      border: `1px solid ${active ? `${C.orange}60` : C.border}`,
                      background: active ? `linear-gradient(135deg, ${C.orange}, ${C.pink})` : "rgba(255,255,255,0.03)",
                      color: active ? "white" : C.muted,
                      fontWeight: active ? 700 : 400, fontSize: 13,
                      cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                      boxShadow: active ? `0 4px 14px ${C.orange}35` : "none",
                      transition: "all .15s",
                    }}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, transition: "all .15s" }}>
                  <ChevronRight size={15} color={C.muted} strokeWidth={2} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        select option { background: #1a1030; color: #ffffff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}