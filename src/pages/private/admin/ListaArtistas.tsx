// src/pages/private/admin/ListaArtistas.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Palette, Users, ShoppingBag, BarChart2,
  Settings, Search, RefreshCw, X, Eye, Edit2, Trash2,
  CheckCircle, Clock, XCircle, UserPlus, Phone, Mail,
  ChevronLeft, ChevronRight, AlertTriangle, Image as ImageIcon,
  Star, LogOut, Check, Ban, Bell
} from "lucide-react";
import { authService } from "../../../services/authService";

const C = {
  orange: "#FF840E", pink: "#CC59AD", purple: "#8D4CCD",
  gold: "#FFC110", blue: "#79AAF5", green: "#4ADE80",
  red: "#F87171", bg: "#0f0c1a",
  surface: "rgba(18,12,32,0.9)", border: "rgba(255,255,255,0.08)",
  text: "#ffffff", muted: "rgba(255,255,255,0.45)",
  sidebar: "rgba(10,7,20,0.97)", rowHover: "rgba(255,255,255,0.03)",
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const ESTADOS: Record<string, { label: string; color: string; icon: any }> = {
  activo:     { label: "Activo",     color: C.green,  icon: CheckCircle },
  pendiente:  { label: "Pendiente",  color: C.gold,   icon: Clock       },
  inactivo:   { label: "Inactivo",   color: C.muted,  icon: XCircle     },
  rechazado:  { label: "Rechazado",  color: C.red,    icon: Ban         },
  suspendido: { label: "Suspendido", color: C.pink,   icon: XCircle     },
};

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: C.orange, path: "/admin" },
  { id: "obras",     label: "Obras",     icon: Palette,         color: C.blue,   path: "/admin/obras" },
  { id: "artistas",  label: "Artistas",  icon: Users,           color: C.pink,   path: "/admin/artistas" },
  { id: "ventas",    label: "Ventas",    icon: ShoppingBag,     color: C.purple, path: "/admin" },
  { id: "reportes",  label: "Reportes",  icon: BarChart2,       color: C.muted,  path: "/admin" },
];

// ── Sidebar ──────────────────────────────────────────────────
function Sidebar({ navigate, pendientes }: { navigate: any; pendientes: number }) {
  const active = "artistas";
  const userName = authService.getUserName?.() || "A";
  return (
    <div style={{ width: 220, minHeight: "100vh", background: C.sidebar, borderRight: `1px solid ${C.border}`, backdropFilter: "blur(40px)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0, zIndex: 40 }}>
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
            <button key={id} onClick={() => navigate(path)} style={{ width: "100%", border: "none", cursor: "pointer", background: on ? `${color}15` : "transparent", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, transition: "all .15s", position: "relative", fontFamily: "'Outfit', sans-serif" }}
              onMouseEnter={e => { if (!on) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!on) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {on && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: "0 3px 3px 0", background: `linear-gradient(180deg, ${color}, ${color}80)` }} />}
              <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: on ? `${color}20` : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={on ? color : "rgba(255,255,255,0.35)"} strokeWidth={on ? 2.2 : 1.8} />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: on ? 700 : 500, color: on ? C.text : "rgba(255,255,255,0.45)" }}>{label}</span>
              {/* Badge pendientes en artistas */}
              {id === "artistas" && pendientes > 0 && (
                <div style={{ marginLeft: "auto", minWidth: 20, height: 20, borderRadius: 10, background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#000", padding: "0 5px" }}>
                  {pendientes}
                </div>
              )}
              {on && pendientes === 0 && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: color }} />}
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

// ── Modal eliminar ────────────────────────────────────────────
function ModalEliminar({ artista, onConfirm, onCancel }: { artista: any; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,5,18,0.75)", backdropFilter: "blur(8px)" }}>
      <div style={{ background: "rgba(18,12,32,0.98)", border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 20, padding: "32px", maxWidth: 420, width: "90%", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", animation: "modalIn .25s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: `${C.pink}18`, border: `1px solid ${C.pink}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <AlertTriangle size={22} color={C.pink} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>¿Eliminar artista?</div>
        <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 28, lineHeight: 1.7 }}>
          Vas a eliminar a <strong style={{ color: C.text }}>{artista?.nombre_completo}</strong>. Sus obras seguirán en el sistema.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.04)", color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = C.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
          >Cancelar</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 6px 20px ${C.pink}35` }}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal aprobar/rechazar ────────────────────────────────────
function ModalAprobacion({ artista, onConfirm, onCancel }: { artista: any; onConfirm: (accion: "activo" | "rechazado") => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,5,18,0.8)", backdropFilter: "blur(10px)" }}>
      <div style={{ background: "rgba(18,12,32,0.99)", border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 22, padding: "36px", maxWidth: 460, width: "90%", boxShadow: "0 40px 80px rgba(0,0,0,0.7)", animation: "modalIn .25s cubic-bezier(0.16,1,0.3,1)" }}>
        {/* Icono */}
        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${C.gold}18`, border: `1px solid ${C.gold}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Bell size={24} color={C.gold} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 6 }}>Solicitud de artista</div>
        <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 24, lineHeight: 1.7 }}>
          Revisa la solicitud de <strong style={{ color: C.text }}>{artista?.nombre_completo}</strong>
          {artista?.nombre_artistico && <> (<span style={{ color: C.gold }}>✦ {artista.nombre_artistico}</span>)</>}
        </div>

        {/* Info artista */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
          {[
            { label: "Correo",     value: artista?.correo },
            { label: "Teléfono",   value: artista?.telefono || "—" },
            { label: "Categoría",  value: artista?.categoria_nombre || "—" },
            { label: "Biografía",  value: artista?.biografia },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, lineHeight: 1.5 }}>
              <span style={{ color: C.muted, minWidth: 80, fontWeight: 600 }}>{label}:</span>
              <span style={{ color: C.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)", color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.text; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.muted; (e.currentTarget as HTMLElement).style.borderColor = C.border; }}
          >Cerrar</button>
          <button onClick={() => onConfirm("rechazado")} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${C.red}30`, background: `${C.red}12`, color: C.red, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${C.red}25`}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${C.red}12`}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Ban size={14} /> Rechazar</span>
          </button>
          <button onClick={() => onConfirm("activo")} style={{ flex: 1.3, padding: "11px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.green}cc, #22c55e)`, color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 6px 20px ${C.green}30` }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Check size={14} /> Aprobar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function ListaArtistas() {
  const navigate = useNavigate();
  const [artistas,      setArtistas]      = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [filtroEstado,  setFiltroEstado]  = useState("todos");
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);
  const [total,         setTotal]         = useState(0);
  const [pendientes,    setPendientes]    = useState(0);
  const [modalEliminar, setModalEliminar] = useState<any>(null);
  const [modalAprob,    setModalAprob]    = useState<any>(null);

  const cargarArtistas = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/artistas?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      const json = await res.json();
      if (json.success) {
        let data = json.data || [];
        // contar pendientes (siempre del total, no del filtro)
        setPendientes(data.filter((a: any) => a.estado === "pendiente").length);
        if (filtroEstado !== "todos") data = data.filter((a: any) => a.estado === filtroEstado);
        if (search.trim()) data = data.filter((a: any) =>
          a.nombre_completo?.toLowerCase().includes(search.toLowerCase()) ||
          a.nombre_artistico?.toLowerCase().includes(search.toLowerCase()) ||
          a.correo?.toLowerCase().includes(search.toLowerCase())
        );
        setArtistas(data);
        setTotal(json.pagination?.total || data.length);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, filtroEstado, search]);

  useEffect(() => { cargarArtistas(); }, [cargarArtistas]);

  // Eliminar
  const handleEliminar = async () => {
    if (!modalEliminar) return;
    try {
      await fetch(`${API_URL}/api/artistas/${modalEliminar.id_artista}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      setModalEliminar(null);
      cargarArtistas();
    } catch (err) { console.error(err); }
  };

  // Aprobar / rechazar
  const handleAprobacion = async (accion: "activo" | "rechazado") => {
    if (!modalAprob) return;
    try {
      await fetch(`${API_URL}/api/artistas/${modalAprob.id_artista}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authService.getToken()}` },
        body: JSON.stringify({ ...modalAprob, estado: accion }),
      });
      setModalAprob(null);
      cargarArtistas();
    } catch (err) { console.error(err); }
  };

  // Toggle activo/inactivo (solo para artistas ya activos)
  const handleToggleEstado = async (artista: any) => {
    if (artista.estado === "pendiente") { setModalAprob(artista); return; }
    const nuevoEstado = artista.estado === "activo" ? "inactivo" : "activo";
    try {
      await fetch(`${API_URL}/api/artistas/${artista.id_artista}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authService.getToken()}` },
        body: JSON.stringify({ ...artista, estado: nuevoEstado }),
      });
      cargarArtistas();
    } catch (err) { console.error(err); }
  };

  const getInitials = (nombre: string) =>
    nombre?.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase() || "?";
  const getAvatarColor = (id: number) =>
    [C.orange, C.blue, C.pink, C.purple, C.gold][id % 5];

  const FILTROS = [
    { key: "todos",    label: "Todos" },
    { key: "pendiente",label: "Pendientes" },
    { key: "activo",   label: "Activos" },
    { key: "inactivo", label: "Inactivos" },
    { key: "rechazado",label: "Rechazados" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text, position: "relative" }}>
      <div style={{ position: "fixed", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.pink}12, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: 200, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}10, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      {modalEliminar && <ModalEliminar artista={modalEliminar} onConfirm={handleEliminar} onCancel={() => setModalEliminar(null)} />}
      {modalAprob    && <ModalAprobacion artista={modalAprob} onConfirm={handleAprobacion} onCancel={() => setModalAprob(null)} />}

      <Sidebar navigate={navigate} pendientes={pendientes} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>
        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", background: "rgba(10,7,20,0.8)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 30 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.text, lineHeight: 1 }}>Gestión de Artistas</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
              <span style={{ color: C.pink, fontWeight: 600 }}>{total}</span> artistas registrados
              {pendientes > 0 && <span style={{ marginLeft: 10, color: C.gold, fontWeight: 700 }}>· {pendientes} pendiente{pendientes > 1 ? "s" : ""} de revisión</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={cargarArtistas} style={{ width: 38, height: 38, borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <RefreshCw size={15} color={C.muted} strokeWidth={1.8} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            </button>
            <button onClick={() => navigate("/admin/artistas/crear")} style={{ display: "flex", alignItems: "center", gap: 7, background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, border: "none", color: "white", padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 6px 20px ${C.pink}35` }}>
              <UserPlus size={15} strokeWidth={2.5} /> Nuevo Artista
            </button>
          </div>
        </div>

        <main style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>

          {/* Banner pendientes */}
          {pendientes > 0 && filtroEstado === "todos" && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", marginBottom: 20, background: `${C.gold}10`, border: `1px solid ${C.gold}30`, borderRadius: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.gold}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Bell size={18} color={C.gold} strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>
                  {pendientes} solicitud{pendientes > 1 ? "es" : ""} pendiente{pendientes > 1 ? "s" : ""} de aprobación
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  Haz clic en el badge <strong style={{ color: C.gold }}>Pendiente</strong> de cada artista para aprobar o rechazar
                </div>
              </div>
              <button onClick={() => setFiltroEstado("pendiente")} style={{ padding: "7px 14px", borderRadius: 8, background: `${C.gold}20`, border: `1px solid ${C.gold}40`, color: C.gold, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap" }}>
                Ver pendientes
              </button>
            </div>
          )}

          {/* Filtros */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 220, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px" }}>
              <Search size={14} color={C.muted} strokeWidth={1.8} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nombre, alias o correo…"
                style={{ border: "none", outline: "none", fontSize: 13.5, color: C.text, background: "transparent", width: "100%", fontFamily: "'Outfit',sans-serif" }} />
              {search && <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2, display: "flex" }}><X size={13} color={C.muted} /></button>}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FILTROS.map(({ key, label }) => {
                const cfg = ESTADOS[key];
                const on = filtroEstado === key;
                const col = cfg?.color || C.pink;
                const cnt = key === "pendiente" ? pendientes : undefined;
                return (
                  <button key={key} onClick={() => { setFiltroEstado(key); setPage(1); }} style={{ padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${on ? `${col}60` : C.border}`, background: on ? `${col}15` : "rgba(255,255,255,0.02)", color: on ? col : C.muted, fontWeight: on ? 700 : 400, fontSize: 12.5, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all .15s", display: "flex", alignItems: "center", gap: 6 }}>
                    {label}
                    {cnt !== undefined && cnt > 0 && <span style={{ background: C.gold, color: "#000", borderRadius: 10, padding: "0 5px", fontSize: 10, fontWeight: 800 }}>{cnt}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabla */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden", backdropFilter: "blur(20px)" }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 220, color: C.muted, gap: 10, fontSize: 13 }}>
                <RefreshCw size={18} strokeWidth={1.8} style={{ animation: "spin 1s linear infinite" }} /> Cargando artistas…
              </div>
            ) : artistas.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220, color: C.muted, gap: 10 }}>
                <Users size={40} strokeWidth={1} style={{ opacity: 0.2 }} />
                <div style={{ fontSize: 14 }}>No se encontraron artistas</div>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Artista", "Contacto", "Categoría", "Comisión", "Obras", "Estado", "Acciones"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "13px 16px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, background: "rgba(255,255,255,0.02)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {artistas.map((artista, i) => {
                    const estado     = ESTADOS[artista.estado] || ESTADOS.pendiente;
                    const EstadoIcon = estado.icon;
                    const avatarCol  = getAvatarColor(artista.id_artista);
                    const esPendiente = artista.estado === "pendiente";
                    return (
                      <tr key={artista.id_artista}
                        style={{ borderBottom: i < artistas.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none", transition: "background .12s", background: esPendiente ? `${C.gold}06` : "transparent" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = esPendiente ? `${C.gold}10` : C.rowHover}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = esPendiente ? `${C.gold}06` : "transparent"}
                      >
                        {/* Artista */}
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, background: artista.foto_perfil ? "transparent" : `${avatarCol}18`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${esPendiente ? C.gold + "40" : avatarCol + "30"}` }}>
                              {artista.foto_perfil
                                ? <img src={artista.foto_perfil} alt={artista.nombre_completo} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                : <span style={{ fontSize: 14, fontWeight: 800, color: avatarCol }}>{getInitials(artista.nombre_completo)}</span>
                              }
                            </div>
                            <div>
                              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{artista.nombre_completo}</div>
                              {artista.nombre_artistico && <div style={{ fontSize: 11.5, color: C.muted, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><Star size={9} strokeWidth={2} color={C.gold} /> {artista.nombre_artistico}</div>}
                              {artista.matricula && <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>{artista.matricula}</div>}
                            </div>
                          </div>
                        </td>
                        {/* Contacto */}
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {artista.correo && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}><Mail size={11} strokeWidth={1.8} color={C.blue} /><span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artista.correo}</span></div>}
                            {artista.telefono && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}><Phone size={11} strokeWidth={1.8} color={C.purple} /> {artista.telefono}</div>}
                          </div>
                        </td>
                        {/* Categoría */}
                        <td style={{ padding: "14px 16px" }}>
                          {artista.categoria_nombre
                            ? <span style={{ fontSize: 12, padding: "4px 11px", borderRadius: 20, background: `${C.blue}15`, border: `1px solid ${C.blue}25`, color: C.blue, fontWeight: 600 }}>{artista.categoria_nombre}</span>
                            : <span style={{ color: C.muted, fontSize: 13 }}>—</span>}
                        </td>
                        {/* Comisión */}
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: C.gold }}>{artista.porcentaje_comision || 15}%</span>
                        </td>
                        {/* Obras */}
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.muted }}>
                            <ImageIcon size={13} strokeWidth={1.8} /> {artista.total_obras || 0}
                          </div>
                        </td>
                        {/* Estado — clic abre modal si es pendiente */}
                        <td style={{ padding: "14px 16px" }}>
                          <button onClick={() => handleToggleEstado(artista)} title={esPendiente ? "Clic para revisar solicitud" : "Clic para activar/desactivar"}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: `${estado.color}15`, border: `1px solid ${estado.color}40`, color: estado.color, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all .15s", boxShadow: esPendiente ? `0 0 12px ${C.gold}25` : "none" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${estado.color}28`}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${estado.color}15`}
                          >
                            <EstadoIcon size={12} strokeWidth={2.5} /> {estado.label}
                          </button>
                        </td>
                        {/* Acciones */}
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            {esPendiente && (
                              <button onClick={() => setModalAprob(artista)} title="Revisar solicitud"
                                style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, background: `${C.gold}15`, border: `1px solid ${C.gold}30`, color: C.gold, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${C.gold}28`}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${C.gold}15`}
                              ><Bell size={11} /> Revisar</button>
                            )}
                            {[
                              { icon: Eye,    color: C.purple, action: () => navigate(`/admin/artistas/${artista.id_artista}`),         title: "Ver detalle" },
                              { icon: Edit2,  color: C.blue,   action: () => navigate(`/admin/artistas/editar/${artista.id_artista}`),  title: "Editar" },
                              { icon: Trash2, color: C.pink,   action: () => setModalEliminar(artista),                                 title: "Eliminar" },
                            ].map(({ icon: Icon, color, action, title }) => (
                              <button key={title} onClick={action} title={title} style={{ width: 32, height: 32, borderRadius: 8, background: `${color}12`, border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .15s" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}28`; (e.currentTarget as HTMLElement).style.borderColor = `${color}50`; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}12`; (e.currentTarget as HTMLElement).style.borderColor = `${color}20`; }}
                              ><Icon size={13} color={color} strokeWidth={2} /></button>
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
              <div style={{ fontSize: 13, color: C.muted }}>Página <span style={{ color: C.text, fontWeight: 600 }}>{page}</span> de <span style={{ color: C.text, fontWeight: 600 }}>{totalPages}</span></div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>
                  <ChevronLeft size={15} color={C.muted} strokeWidth={2} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  const active = p === page;
                  return (
                    <button key={p} onClick={() => setPage(p)} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${active ? `${C.pink}60` : C.border}`, background: active ? `linear-gradient(135deg, ${C.pink}, ${C.purple})` : "rgba(255,255,255,0.03)", color: active ? "white" : C.muted, fontWeight: active ? 700 : 400, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: active ? `0 4px 14px ${C.pink}35` : "none" }}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>
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
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}