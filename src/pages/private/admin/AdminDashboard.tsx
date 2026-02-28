// src/pages/private/admin/AdminDashboard.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard, Palette, Users, ShoppingBag,
  Settings, Eye, LogOut, Plus, Bell, Search,
  CheckCircle, Clock, XCircle, TrendingUp,
  TrendingDown, Package, ChevronRight, BarChart2,
  Image, RefreshCw, Sparkles, ArrowUpRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { authService } from "../../../services/authService";

// ── Design tokens (dark, matches Login/Contact) ──────────────
const C = {
  orange:  "#FF840E",
  pink:    "#CC59AD",
  purple:  "#8D4CCD",
  gold:    "#FFC110",
  blue:    "#79AAF5",
  bg:      "#0f0c1a",
  surface: "rgba(255,255,255,0.03)",
  border:  "rgba(255,255,255,0.08)",
  text:    "#ffffff",
  muted:   "rgba(255,255,255,0.45)",
  sidebar: "rgba(10,7,20,0.97)",
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const chartData = [
  { s:"S1", v:28, o:9  }, { s:"S2", v:34, o:12 },
  { s:"S3", v:22, o:8  }, { s:"S4", v:46, o:18 },
  { s:"S5", v:38, o:14 }, { s:"S6", v:61, o:24 },
  { s:"S7", v:54, o:20 }, { s:"S8", v:78, o:30 },
];

const statusCfg: Record<string, { label: string; color: string }> = {
  publicada: { label: "Publicada", color: C.orange },
  pendiente: { label: "Pendiente", color: C.gold   },
  rechazada: { label: "Rechazada", color: C.pink   },
  agotada:   { label: "Agotada",   color: C.muted  },
};

const NAV = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard, color:C.orange, path:"/admin"          },
  { id:"obras",     label:"Obras",     icon:Palette,         color:C.blue,   path:"/admin/obras"    },
  { id:"artistas",  label:"Artistas",  icon:Users,           color:C.pink,   path:"/admin/artistas" },
  { id:"ventas",    label:"Ventas",    icon:ShoppingBag,     color:C.purple, path:"/admin"          },
  { id:"reportes",  label:"Reportes",  icon:BarChart2,       color:C.gold,   path:"/admin"          },
];

// ── Custom chart tooltip ──────────────────────────────────────
const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(18,12,32,0.97)",
      border: `1px solid ${C.border}`,
      borderRadius: 10, padding: "10px 14px",
      fontSize: 12, backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ color: C.muted, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, fontWeight: 700, marginBottom: 2 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

// ── Sidebar (220px, full labels) ──────────────────────────────
function Sidebar({ active, setActive, userName, onLogout, navigate }: any) {
  return (
    <div style={{
      width: 220, minHeight: "100vh",
      background: C.sidebar,
      borderRight: `1px solid ${C.border}`,
      backdropFilter: "blur(40px)",
      WebkitBackdropFilter: "blur(40px)",
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh", flexShrink: 0,
      zIndex: 40,
    }}>
      {/* Logo area */}
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 14px ${C.orange}40`,
            flexShrink: 0,
          }}>
            <Palette size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1 }}>Altar Studio</div>
            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2, letterSpacing: "0.04em" }}>Panel Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px 10px" }}>
          Navegación
        </div>
        {NAV.map(({ id, label, icon: Icon, color, path }) => {
          const on = active === id;
          return (
            <button
              key={id}
              onClick={() => { setActive(id); navigate(path); }}
              style={{
                width: "100%", border: "none", cursor: "pointer",
                background: on ? `${color}15` : "transparent",
                borderRadius: 10,
                padding: "10px 12px",
                display: "flex", alignItems: "center", gap: 10,
                transition: "all .15s",
                position: "relative",
                fontFamily: "'Outfit', sans-serif",
              }}
              onMouseEnter={e => { if (!on) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!on) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {on && (
                <div style={{
                  position: "absolute", left: 0, top: "20%", bottom: "20%",
                  width: 3, borderRadius: "0 3px 3px 0",
                  background: `linear-gradient(180deg, ${color}, ${color}80)`,
                }} />
              )}
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: on ? `${color}20` : "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background .15s",
              }}>
                <Icon size={16} color={on ? color : "rgba(255,255,255,0.35)"} strokeWidth={on ? 2.2 : 1.8} />
              </div>
              <span style={{
                fontSize: 13.5, fontWeight: on ? 700 : 500,
                color: on ? C.text : "rgba(255,255,255,0.45)",
                transition: "color .15s",
              }}>
                {label}
              </span>
              {on && (
                <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: color }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom: user + actions */}
      <div style={{ padding: "12px 10px 20px", borderTop: `1px solid ${C.border}` }}>
        <button
          style={{
            width: "100%", border: "none", cursor: "pointer",
            background: "transparent", borderRadius: 10,
            padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "'Outfit', sans-serif",
            transition: "background .15s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: "white",
          }}>
            {userName?.[0]?.toUpperCase() || "A"}
          </div>
          <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
            <div style={{ fontSize: 11, color: C.muted }}>Administrador</div>
          </div>
        </button>

        <div style={{ display: "flex", gap: 6, padding: "8px 12px 0" }}>
          <button
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "8px", borderRadius: 8, border: `1px solid ${C.border}`,
              background: "rgba(255,255,255,0.03)", cursor: "pointer",
              fontSize: 11.5, color: C.muted, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
              transition: "all .15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = C.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
          >
            <Settings size={13} strokeWidth={1.8} /> Config
          </button>
          <button
            onClick={onLogout}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "8px", borderRadius: 8, border: `1px solid rgba(204,89,173,0.2)`,
              background: "rgba(204,89,173,0.06)", cursor: "pointer",
              fontSize: 11.5, color: C.pink, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
              transition: "all .15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(204,89,173,0.14)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(204,89,173,0.06)"; }}
          >
            <LogOut size={13} strokeWidth={1.8} /> Salir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Topbar ────────────────────────────────────────────────────
function Topbar({ userName, navigate, onRefresh, loading }: any) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 28px",
      background: "rgba(10,7,20,0.8)",
      borderBottom: `1px solid ${C.border}`,
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      position: "sticky", top: 0, zIndex: 30,
      fontFamily: "'Outfit',sans-serif",
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 900, color: C.text, lineHeight: 1 }}>
          Dashboard
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
          Bienvenido de vuelta, <span style={{ color: C.orange, fontWeight: 600 }}>{userName}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: "9px 16px", cursor: "text",
          transition: "border-color .15s",
        }}>
          <Search size={14} color={C.muted} strokeWidth={1.8} />
          <span style={{ fontSize: 13, color: C.muted, userSelect: "none" }}>Buscar obras, artistas…</span>
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          title="Actualizar"
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: C.surface, border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all .15s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${C.orange}50`}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = C.border}
        >
          <RefreshCw
            size={15} color={C.muted} strokeWidth={1.8}
            style={{ animation: loading ? "spin 1s linear infinite" : "none" }}
          />
        </button>

        {/* Notifications */}
        <button style={{
          position: "relative", width: 38, height: 38, borderRadius: 10,
          background: C.surface, border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <Bell size={16} color={C.muted} strokeWidth={1.8} />
          <span style={{
            position: "absolute", top: 8, right: 8, width: 7, height: 7,
            background: C.orange, borderRadius: "50%",
            border: `2px solid #0f0c1a`,
          }} />
        </button>

        {/* CTA */}
        <button
          onClick={() => navigate("/admin/obras/crear")}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`,
            border: "none", color: "white",
            padding: "9px 18px", borderRadius: 10,
            fontWeight: 700, fontSize: 13, cursor: "pointer",
            fontFamily: "'Outfit',sans-serif",
            boxShadow: `0 6px 20px ${C.orange}35`,
            transition: "transform .15s, box-shadow .15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 28px ${C.orange}50`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${C.orange}35`;
          }}
        >
          <Plus size={15} strokeWidth={2.5} /> Nueva Obra
        </button>
      </div>
    </div>
  );
}

// ── KPI cards ─────────────────────────────────────────────────
function KpiCards({ kpis, loading }: { kpis: any; loading: boolean }) {
  const cards = [
    { value: kpis?.total_obras      ?? "—", label: "Total Obras",  sub: "en catálogo",   accent: C.orange, Icon: Palette,      trend: true  },
    { value: kpis?.obras_publicadas ?? "—", label: "Publicadas",   sub: "activas ahora", accent: C.blue,   Icon: CheckCircle,  trend: true  },
    { value: kpis?.obras_pendientes ?? "—", label: "Pendientes",   sub: "por revisar",   accent: C.gold,   Icon: Clock,        trend: false },
    { value: kpis?.obras_rechazadas ?? "—", label: "Rechazadas",   sub: "este período",  accent: C.pink,   Icon: XCircle,      trend: false },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
      {cards.map(({ value, label, sub, accent, Icon, trend }) => (
        <div
          key={label}
          style={{
            background: "rgba(18,12,32,0.8)",
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            padding: "24px 22px",
            position: "relative", overflow: "hidden",
            backdropFilter: "blur(20px)",
            transition: "border-color .2s, box-shadow .2s",
            cursor: "default",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${accent}12`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = C.border;
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: -40, right: -40, width: 120, height: 120,
            borderRadius: "50%", background: `radial-gradient(circle, ${accent}18, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, position: "relative" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: `${accent}18`,
              border: `1px solid ${accent}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={18} color={accent} strokeWidth={2} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {trend
                ? <TrendingUp size={13} color={accent} strokeWidth={2.5} />
                : <TrendingDown size={13} color={accent} strokeWidth={2.5} />
              }
              <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>{trend ? "+12%" : "−3%"}</span>
            </div>
          </div>

          <div style={{
            fontSize: 36, fontWeight: 900, color: loading ? "rgba(255,255,255,0.2)" : C.text,
            letterSpacing: "-1.5px", lineHeight: 1, marginBottom: 6,
            transition: "color .3s", position: "relative",
          }}>
            {loading ? "—" : value}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.65)", marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 11.5, color: C.muted }}>{sub}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main content (chart + recent obras) ───────────────────────
function MainContent({ obrasRecientes, loading, navigate }: any) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 24 }}>
      {/* Chart */}
      <div style={{
        background: "rgba(18,12,32,0.8)",
        border: `1px solid ${C.border}`,
        borderRadius: 18, padding: "24px",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Ventas & Obras</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Últimas 8 semanas</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[{ c: C.orange, l: "Ventas" }, { c: C.blue, l: "Obras" }].map(({ c, l }) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
                <span style={{ width: 20, height: 3, background: c, display: "inline-block", borderRadius: 2 }} />
                {l}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.orange} stopOpacity={0.22} />
                <stop offset="100%" stopColor={C.orange} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.blue} stopOpacity={0.18} />
                <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="s" stroke="transparent" tick={{ fill: C.muted, fontSize: 11 }} />
            <YAxis stroke="transparent" tick={{ fill: C.muted, fontSize: 11 }} />
            <Tooltip content={<ChartTip />} />
            <Area type="monotone" dataKey="v" name="Ventas" stroke={C.orange} strokeWidth={2.5} fill="url(#gO)" dot={false} />
            <Area type="monotone" dataKey="o" name="Obras" stroke={C.blue} strokeWidth={2.5} fill="url(#gB)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Obras recientes */}
      <div style={{
        background: "rgba(18,12,32,0.8)",
        border: `1px solid ${C.border}`,
        borderRadius: 18, padding: "24px",
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Obras Recientes</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Últimas subidas</div>
          </div>
          <button
            onClick={() => navigate("/admin/obras")}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: `${C.orange}15`, border: `1px solid ${C.orange}30`,
              borderRadius: 8, padding: "6px 12px",
              color: C.orange, fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Outfit',sans-serif",
              transition: "all .15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${C.orange}25`}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${C.orange}15`}
          >
            Ver todas <ChevronRight size={13} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 11, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 6, width: "65%" }} />
                  <div style={{ height: 9, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "40%" }} />
                </div>
                <div style={{ width: 64, height: 20, background: "rgba(255,255,255,0.06)", borderRadius: 20 }} />
              </div>
            ))
          ) : obrasRecientes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: C.muted, fontSize: 13 }}>
              Sin obras aún
            </div>
          ) : obrasRecientes.map((obra: any, i: number) => {
            const cfg = statusCfg[obra.estado] || statusCfg.pendiente;
            return (
              <div
                key={obra.id_obra}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 10px", borderRadius: 12,
                  borderBottom: i < obrasRecientes.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none",
                  cursor: "pointer", transition: "background .15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                onClick={() => navigate(`/admin/obras/editar/${obra.id_obra}`)}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${cfg.color}15`, overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${cfg.color}25`,
                }}>
                  {obra.imagen_principal
                    ? <img src={obra.imagen_principal} alt={obra.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : <Image size={15} color={cfg.color} strokeWidth={2} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{obra.titulo}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{obra.artista_alias || obra.artista_nombre}</div>
                </div>
                <span style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                  background: `${cfg.color}18`, color: cfg.color, flexShrink: 0,
                  border: `1px solid ${cfg.color}25`,
                }}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Bottom stat strip (3 cards, fusionadas) ───────────────────
function StatStrip({ strip, loading }: { strip: any; loading: boolean }) {
  const items = [
    {
      value: strip?.artistas_activos ?? "—",
      label: "Artistas activos",
      sub: "en la plataforma",
      accent: C.pink,
      Icon: Users,
      action: "Ver artistas →",
    },
    {
      value: strip?.categorias ?? "—",
      label: "Categorías",
      sub: "tipos de arte",
      accent: C.blue,
      Icon: Package,
      action: "Gestionar →",
    },
    {
      value: strip?.visitas_total ?? "—",
      label: "Visitas totales",
      sub: "a la galería",
      accent: C.purple,
      Icon: Eye,
      action: "Ver reportes →",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
      {items.map(({ value, label, sub, accent, Icon, action }) => (
        <div
          key={label}
          style={{
            background: "rgba(18,12,32,0.8)",
            border: `1px solid ${C.border}`,
            borderRadius: 18, padding: "22px 24px",
            display: "flex", alignItems: "center", gap: 18,
            backdropFilter: "blur(20px)",
            transition: "border-color .2s, box-shadow .2s",
            cursor: "default",
            position: "relative", overflow: "hidden",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${accent}10`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = C.border;
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          <div style={{
            position: "absolute", bottom: -30, right: -30, width: 120, height: 120,
            borderRadius: "50%", background: `radial-gradient(circle, ${accent}15, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: `${accent}18`, border: `1px solid ${accent}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={22} color={accent} strokeWidth={2} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 28, fontWeight: 900, color: loading ? "rgba(255,255,255,0.2)" : C.text,
              letterSpacing: "-1px", lineHeight: 1, marginBottom: 5, transition: "color .3s",
            }}>
              {loading ? "—" : value}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{label}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{sub}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4, color: accent, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            <ArrowUpRight size={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate  = useNavigate();
  const [userName, setUserName] = useState("");
  const [active,   setActive]   = useState("dashboard");
  const [loading,  setLoading]  = useState(true);
  const [stats,    setStats]    = useState<any>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/stats/dashboard`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch (err) { console.error("Error stats:", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!authService.isAuthenticated()) { navigate("/login"); return; }
    setUserName(authService.getUserName() || "Admin");
    fetchStats();
  }, [navigate, fetchStats]);

  const handleLogout = () => { authService.logout(); navigate("/login"); };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Outfit', sans-serif",
      color: C.text,
      position: "relative",
    }}>
      {/* Background orbs */}
      <div style={{ position: "fixed", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.pink}12, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: 200, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}10, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "40%", right: "30%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${C.orange}07, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <Sidebar active={active} setActive={setActive} userName={userName} onLogout={handleLogout} navigate={navigate} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>
        <Topbar userName={userName} navigate={navigate} onRefresh={fetchStats} loading={loading} />

        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {/* Page title */}
          <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "5px 14px", borderRadius: 100,
              background: `${C.orange}15`, border: `1px solid ${C.orange}30`,
              fontSize: 12, fontWeight: 700, color: C.orange,
            }}>
              <Sparkles size={12} /> Resumen general
            </div>
          </div>

          <KpiCards   kpis={stats?.kpis}               loading={loading} />
          <MainContent obrasRecientes={stats?.obras_recientes || []} loading={loading} navigate={navigate} />
          <StatStrip  strip={stats?.strip}             loading={loading} />
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}