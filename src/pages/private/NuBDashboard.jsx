import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import {
  LayoutDashboard, Image, Users, ShoppingBag, Heart,
  TrendingUp, Bell, Search, Settings, ChevronRight,
  ArrowUpRight, ArrowDownRight, Eye, Star, Award,
  Palette, Package, Clock, MoreHorizontal, Filter,
  Zap, LogOut, User
} from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────
const T = {
  bg:        "#0f1117",
  surface:   "#14171e",
  surfaceAlt:"#1a1e28",
  border:    "rgba(255,255,255,0.055)",
  borderMid: "rgba(255,255,255,0.09)",

  blue:   "#79AAF5",
  orange: "#FF840E",
  pink:   "#CC59AD",
  purple: "#8D4CCD",
  gold:   "#FFC110",
  green:  "#4ADE80",
  cafe:   "#764E31",

  textPrimary:   "#eef2f8",
  textSecondary: "#8b95a8",
  textMuted:     "#3d4858",

  fontDisplay: "'Syne', 'Plus Jakarta Sans', sans-serif",
  fontBody:    "'DM Sans', 'Nunito Sans', sans-serif",
};

// ─── MOCK DATA ─────────────────────────────────────────────────
const revenueData = [
  { m: "Ago", v: 28, obras: 9  },
  { m: "Sep", v: 34, obras: 12 },
  { m: "Oct", v: 22, obras: 8  },
  { m: "Nov", v: 46, obras: 18 },
  { m: "Dic", v: 38, obras: 14 },
  { m: "Ene", v: 52, obras: 21 },
  { m: "Feb", v: 61, obras: 25 },
];

const categoryData = [
  { name: "Óleo",       pct: 38, color: T.blue   },
  { name: "Acuarela",   pct: 24, color: T.pink   },
  { name: "Fotografía", pct: 19, color: T.purple },
  { name: "Escultura",  pct: 12, color: T.orange },
  { name: "Grabado",    pct:  7, color: T.gold   },
];

const weekActivity = [
  { d: "L", val: 3 }, { d: "M", val: 7 }, { d: "X", val: 5 },
  { d: "J", val: 9 }, { d: "V", val: 6 }, { d: "S", val: 11 },{ d: "D", val: 4 },
];

const recentWorks = [
  { id:1, title:"Danza Huasteca",    artist:"María Colín",  price:"$4,200", status:"vendida",    cat:"Óleo"      },
  { id:2, title:"Sierra al Amanecer",artist:"Pedro Ramos",  price:"$2,800", status:"disponible", cat:"Fotografía"},
  { id:3, title:"Tejido Ancestral",  artist:"Ana Flores",   price:"$6,500", status:"reservada",  cat:"Artesanía" },
  { id:4, title:"Mercado de Colores",artist:"Luis Vega",    price:"$3,100", status:"disponible", cat:"Acuarela"  },
  { id:5, title:"Ritual del Maíz",   artist:"Carmen Díaz",  price:"$5,400", status:"vendida",    cat:"Óleo"      },
];

const STATUS = {
  vendida:    { label:"Vendida",    bg:"rgba(74,222,128,.10)", color: T.green,  dot: T.green  },
  disponible: { label:"Disponible", bg:"rgba(121,170,245,.10)",color: T.blue,   dot: T.blue   },
  reservada:  { label:"Reservada",  bg:"rgba(255,193,16,.10)", color: T.gold,   dot: T.gold   },
};

const NAV = [
  { id:"dashboard", icon:LayoutDashboard, label:"Dashboard"      },
  { id:"obras",     icon:Image,           label:"Obras"          },
  { id:"artistas",  icon:Palette,         label:"Artistas"       },
  { id:"pedidos",   icon:ShoppingBag,     label:"Pedidos"        },
  { id:"favoritos", icon:Heart,           label:"Favoritos"      },
  { id:"usuarios",  icon:Users,           label:"Usuarios"       },
];

// ─── ATOMS ────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ height:1, background: T.border, margin:"10px 0" }} />
);

const Badge = ({ children, color, bg }) => (
  <span style={{
    display:"inline-flex", alignItems:"center", gap:4,
    fontSize:11, fontWeight:600, padding:"3px 9px",
    borderRadius:20, background: bg || `${color}18`, color,
    fontFamily: T.fontBody,
  }}>{children}</span>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"#1c212e", border:`1px solid ${T.border}`,
      borderRadius:10, padding:"10px 14px",
      fontFamily: T.fontBody, fontSize:12,
    }}>
      <p style={{ color: T.textMuted, marginBottom:5, margin:"0 0 6px" }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color:p.color, margin:"2px 0", fontWeight:600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────
function Sidebar({ active, setActive }) {
  return (
    <aside style={{
      width:200, flexShrink:0, background: T.surface,
      borderRight:`1px solid ${T.border}`,
      display:"flex", flexDirection:"column",
      padding:"24px 0", position:"sticky",
      top:0, height:"100vh", overflowY:"auto",
    }}>
      {/* Logo */}
      <div style={{ padding:"0 18px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{
            width:32, height:32, borderRadius:9,
            background:`linear-gradient(135deg,${T.purple},${T.pink})`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Palette size={16} color="white" />
          </div>
          <div>
            <div style={{ fontFamily:T.fontDisplay, fontWeight:700, fontSize:14, color:T.textPrimary, letterSpacing:".5px" }}>
              NU-B STUDIO
            </div>
            <div style={{ fontSize:10, color:T.textMuted, letterSpacing:"1.5px", textTransform:"uppercase", marginTop:1 }}>
              Admin
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"0 10px" }}>
        <div style={{ fontSize:10, color:T.textMuted, letterSpacing:"1.2px", textTransform:"uppercase", padding:"0 8px 8px", fontFamily:T.fontBody }}>
          General
        </div>
        {NAV.map(({ id, icon:Icon, label }) => {
          const on = active === id;
          return (
            <button key={id} onClick={() => setActive(id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:9,
              padding:"8px 10px", borderRadius:7, border:"none",
              background: on ? `${T.blue}12` : "transparent",
              color: on ? T.blue : T.textSecondary,
              fontSize:13, fontWeight: on ? 600 : 400,
              cursor:"pointer", marginBottom:1, transition:"all .15s",
              fontFamily: T.fontBody, textAlign:"left",
              borderLeft: on ? `2px solid ${T.blue}` : "2px solid transparent",
            }}
            onMouseEnter={e=>{ if(!on){ e.currentTarget.style.background=`rgba(255,255,255,.035)`; e.currentTarget.style.color=T.textPrimary; }}}
            onMouseLeave={e=>{ if(!on){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.textSecondary; }}}
            >
              <Icon size={15} />
              {label}
              {on && <ChevronRight size={12} style={{ marginLeft:"auto", opacity:.5 }} />}
            </button>
          );
        })}

        <div style={{ height:1, background:T.border, margin:"12px 8px" }} />
        <div style={{ fontSize:10, color:T.textMuted, letterSpacing:"1.2px", textTransform:"uppercase", padding:"0 8px 8px", fontFamily:T.fontBody }}>
          Sistema
        </div>
        {[{icon:Bell,label:"Alertas"},{icon:Settings,label:"Config"}].map(({icon:Icon,label})=>(
          <button key={label} style={{
            width:"100%", display:"flex", alignItems:"center", gap:9,
            padding:"8px 10px", borderRadius:7, border:"none",
            background:"transparent", color:T.textSecondary,
            fontSize:13, cursor:"pointer", marginBottom:1,
            fontFamily:T.fontBody, textAlign:"left",
            borderLeft:"2px solid transparent", transition:"all .15s",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background=`rgba(255,255,255,.035)`; e.currentTarget.style.color=T.textPrimary; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.textSecondary; }}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </nav>

      {/* User chip */}
      <div style={{ padding:"16px 18px 0", borderTop:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{
            width:30, height:30, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.pink},${T.purple})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, fontWeight:700, color:"white", flexShrink:0,
          }}>G</div>
          <div>
            <div style={{ fontSize:12.5, fontWeight:600, color:T.textPrimary, fontFamily:T.fontBody }}>Gustavo</div>
            <div style={{ fontSize:10.5, color:T.textMuted, fontFamily:T.fontBody }}>Administrador</div>
          </div>
          <LogOut size={13} color={T.textMuted} style={{ marginLeft:"auto", cursor:"pointer" }} />
        </div>
      </div>
    </aside>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────
function Topbar() {
  return (
    <header style={{
      padding:"16px 28px",
      borderBottom:`1px solid ${T.border}`,
      display:"flex", justifyContent:"space-between", alignItems:"center",
      background: T.bg, position:"sticky", top:0, zIndex:20,
    }}>
      <div>
        <h1 style={{ margin:0, fontSize:17, fontWeight:700, color:T.textPrimary, fontFamily:T.fontDisplay }}>
          Dashboard
        </h1>
        <p style={{ margin:"2px 0 0", fontSize:12, color:T.textMuted, fontFamily:T.fontBody }}>
          Martes, 24 de febrero 2026
        </p>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{
          display:"flex", alignItems:"center", gap:7,
          background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:8, padding:"7px 13px",
        }}>
          <Search size={13} color={T.textMuted} />
          <span style={{ fontSize:12.5, color:T.textMuted, fontFamily:T.fontBody }}>Buscar obras…</span>
        </div>
        <button style={{
          position:"relative", width:34, height:34, borderRadius:7,
          background:T.surface, border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", color:T.textSecondary,
        }}>
          <Bell size={15} />
          <span style={{
            position:"absolute", top:6, right:6, width:6, height:6,
            background:T.orange, borderRadius:"50%",
          }} />
        </button>
      </div>
    </header>
  );
}

// ─── KPI CARD ─────────────────────────────────────────────────
function KpiCard({ label, value, sub, up, icon:Icon, accent }) {
  return (
    <div style={{
      background: T.surface, border:`1px solid ${T.border}`,
      borderRadius:12, padding:"20px 18px", position:"relative", overflow:"hidden",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div style={{
          width:34, height:34, borderRadius:8,
          background:`${accent}16`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon size={16} color={accent} />
        </div>
        <span style={{
          display:"flex", alignItems:"center", gap:3,
          fontSize:11, fontWeight:600, fontFamily:T.fontBody,
          color: up ? T.green : T.orange,
        }}>
          {up ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}
          {sub}
        </span>
      </div>
      <div style={{ fontSize:30, fontWeight:800, color:T.textPrimary, letterSpacing:"-1px", lineHeight:1, fontFamily:T.fontDisplay }}>
        {value}
      </div>
      <div style={{ fontSize:12, color:T.textMuted, marginTop:6, fontFamily:T.fontBody }}>{label}</div>
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:2,
        background:`linear-gradient(90deg,${accent}50,transparent)`,
      }} />
    </div>
  );
}

// ─── REVENUE CHART ────────────────────────────────────────────
function RevenueChart() {
  return (
    <div style={{
      background:T.surface, border:`1px solid ${T.border}`,
      borderRadius:12, padding:"22px 20px", flex:1,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div>
          <div style={{ fontSize:13.5, fontWeight:600, color:T.textPrimary, fontFamily:T.fontDisplay }}>Ingresos & Obras</div>
          <div style={{ fontSize:11.5, color:T.textMuted, marginTop:2, fontFamily:T.fontBody }}>Últimos 7 meses</div>
        </div>
        <div style={{ display:"flex", gap:14 }}>
          {[{c:T.blue,l:"MXN"},{c:T.pink,l:"Obras"}].map(({c,l})=>(
            <span key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11.5, color:T.textSecondary, fontFamily:T.fontBody }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:c, display:"inline-block" }} />
              {l}
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={revenueData} margin={{ top:5, right:4, bottom:0, left:-22 }}>
          <defs>
            <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.blue} stopOpacity={.18}/>
              <stop offset="100%" stopColor={T.blue} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gPink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.pink} stopOpacity={.13}/>
              <stop offset="100%" stopColor={T.pink} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="m" stroke="transparent" tick={{ fill:T.textMuted, fontSize:11, fontFamily:T.fontBody }} />
          <YAxis stroke="transparent" tick={{ fill:T.textMuted, fontSize:11, fontFamily:T.fontBody }} />
          <Tooltip content={<CustomTooltip/>} />
          <Area type="monotone" dataKey="v" name="MXN (k)" stroke={T.blue} strokeWidth={2} fill="url(#gBlue)" dot={false} />
          <Area type="monotone" dataKey="obras" name="Obras" stroke={T.pink} strokeWidth={2} fill="url(#gPink)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── ACTIVITY BARS ────────────────────────────────────────────
function ActivityBars() {
  return (
    <div style={{
      background:T.surface, border:`1px solid ${T.border}`,
      borderRadius:12, padding:"22px 20px", width:200,
    }}>
      <div style={{ fontSize:13.5, fontWeight:600, color:T.textPrimary, marginBottom:4, fontFamily:T.fontDisplay }}>Esta semana</div>
      <div style={{ fontSize:11.5, color:T.textMuted, marginBottom:20, fontFamily:T.fontBody }}>Visitas diarias</div>
      <ResponsiveContainer width="100%" height={148}>
        <BarChart data={weekActivity} barSize={14} margin={{ top:0, right:0, bottom:0, left:-28 }}>
          <XAxis dataKey="d" stroke="transparent" tick={{ fill:T.textMuted, fontSize:10, fontFamily:T.fontBody }} />
          <YAxis stroke="transparent" tick={{ fill:T.textMuted, fontSize:10 }} />
          <Tooltip content={<CustomTooltip/>} />
          <Bar dataKey="val" name="Visitas" radius={[4,4,0,0]}>
            {weekActivity.map((e,i)=>(
              <Cell key={i} fill={e.val === Math.max(...weekActivity.map(x=>x.val)) ? T.gold : `${T.blue}40`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── CATEGORY BREAKDOWN ───────────────────────────────────────
function CategoryBreakdown() {
  return (
    <div style={{
      background:T.surface, border:`1px solid ${T.border}`,
      borderRadius:12, padding:"22px 20px", width:220,
    }}>
      <div style={{ fontSize:13.5, fontWeight:600, color:T.textPrimary, marginBottom:4, fontFamily:T.fontDisplay }}>Por Categoría</div>
      <div style={{ fontSize:11.5, color:T.textMuted, marginBottom:20, fontFamily:T.fontBody }}>Distribución de obras</div>
      <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
        {categoryData.map(({name,pct,color})=>(
          <div key={name}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:12, color:T.textSecondary, fontFamily:T.fontBody }}>{name}</span>
              <span style={{ fontSize:12, fontWeight:700, color, fontFamily:T.fontBody }}>{pct}%</span>
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,.06)", borderRadius:4 }}>
              <div style={{ height:"100%", width:`${pct}%`, borderRadius:4, background:color, opacity:.85 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RECENT WORKS TABLE ───────────────────────────────────────
function RecentWorksTable() {
  return (
    <div style={{
      background:T.surface, border:`1px solid ${T.border}`,
      borderRadius:12, padding:"22px 20px",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:13.5, fontWeight:600, color:T.textPrimary, fontFamily:T.fontDisplay }}>Obras Recientes</div>
          <div style={{ fontSize:11.5, color:T.textMuted, marginTop:2, fontFamily:T.fontBody }}>Últimas piezas del catálogo</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={{
            display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
            background:`rgba(255,255,255,.04)`, border:`1px solid ${T.border}`,
            borderRadius:7, color:T.textSecondary, fontSize:12, cursor:"pointer", fontFamily:T.fontBody,
          }}>
            <Filter size={12}/> Filtrar
          </button>
          <button style={{
            display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
            background:`${T.blue}15`, border:`1px solid ${T.blue}30`,
            borderRadius:7, color:T.blue, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:T.fontBody,
          }}>
            Ver todas <ChevronRight size={12}/>
          </button>
        </div>
      </div>

      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ borderBottom:`1px solid ${T.border}` }}>
            {["Obra","Artista","Categoría","Precio","Estado",""].map(h=>(
              <th key={h} style={{
                textAlign:"left", padding:"0 0 10px", paddingRight:14,
                fontSize:10.5, color:T.textMuted, fontWeight:600,
                letterSpacing:".8px", textTransform:"uppercase", fontFamily:T.fontBody,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentWorks.map(({id,title,artist,price,status,cat})=>{
            const s = STATUS[status];
            return (
              <tr key={id}
                style={{ borderBottom:`1px solid rgba(255,255,255,.025)`, cursor:"default" }}
                onMouseEnter={e=>e.currentTarget.style.background=`rgba(255,255,255,.018)`}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <td style={{ padding:"13px 14px 13px 0" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <div style={{
                      width:30, height:30, borderRadius:7, flexShrink:0,
                      background:`rgba(255,255,255,.04)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <Eye size={13} color={T.textMuted}/>
                    </div>
                    <span style={{ fontSize:13, fontWeight:600, color:T.textPrimary, fontFamily:T.fontBody }}>{title}</span>
                  </div>
                </td>
                <td style={{ padding:"13px 14px 13px 0", fontSize:12.5, color:T.textSecondary, fontFamily:T.fontBody }}>{artist}</td>
                <td style={{ padding:"13px 14px 13px 0" }}>
                  <Badge color={T.pink}>{cat}</Badge>
                </td>
                <td style={{ padding:"13px 14px 13px 0", fontSize:13, fontWeight:700, color:T.gold, fontFamily:T.fontBody }}>{price}</td>
                <td style={{ padding:"13px 14px 13px 0" }}>
                  <span style={{
                    display:"inline-flex", alignItems:"center", gap:5,
                    fontSize:11.5, padding:"3px 9px", borderRadius:20, fontWeight:600,
                    background:s.bg, color:s.color,
                    border:`1px solid ${s.color}25`, fontFamily:T.fontBody,
                  }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, display:"inline-block" }}/>
                    {s.label}
                  </span>
                </td>
                <td style={{ padding:"13px 0 13px 0", textAlign:"right" }}>
                  <button style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", padding:3 }}>
                    <MoreHorizontal size={14}/>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── HIGHLIGHT STRIP ──────────────────────────────────────────
function HighlightStrip() {
  const items = [
    { icon:Zap,      color:T.purple, bg:`${T.purple}15`, label:"Obra destacada",    val:"Ritual del Maíz" },
    { icon:TrendingUp,color:T.green, bg:`${T.green}12`,  label:"Mejor mes",         val:"+18% vs enero"   },
    { icon:Award,    color:T.gold,   bg:`${T.gold}12`,   label:"Artista del mes",   val:"María Colín"     },
    { icon:Star,     color:T.orange, bg:`${T.orange}12`, label:"Favoritos nuevos",  val:"34 esta semana"  },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
      {items.map(({icon:Icon,color,bg,label,val})=>(
        <div key={label} style={{
          background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:10, padding:"14px 16px",
          display:"flex", alignItems:"center", gap:12,
        }}>
          <div style={{ width:36, height:36, borderRadius:9, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon size={17} color={color}/>
          </div>
          <div>
            <div style={{ fontSize:11, color:T.textMuted, fontFamily:T.fontBody }}>{label}</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.textPrimary, marginTop:1, fontFamily:T.fontBody }}>{val}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────
export default function NuBDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.bg, fontFamily:T.fontBody }}>
      <Sidebar active={activeNav} setActive={setActiveNav} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:"100vh", overflowX:"hidden" }}>
        <Topbar />

        <main style={{ flex:1, padding:"28px", overflowY:"auto" }}>

          {/* KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
            <KpiCard label="Ingresos del Mes"  value="$61k"  sub="+18%"  up={true}  icon={TrendingUp} accent={T.gold}  />
            <KpiCard label="Obras Vendidas"    value="25"    sub="+4"    up={true}  icon={Package}    accent={T.blue}  />
            <KpiCard label="Nuevos Artistas"   value="4"     sub="−1"    up={false} icon={Users}      accent={T.orange}/>
            <KpiCard label="Obras en Galería"  value="138"   sub="+9"    up={true}  icon={Image}      accent={T.purple}/>
          </div>

          {/* Highlights */}
          <HighlightStrip />

          {/* Charts Row */}
          <div style={{ display:"flex", gap:14, marginBottom:24, alignItems:"stretch" }}>
            <RevenueChart />
            <ActivityBars />
            <CategoryBreakdown />
          </div>

          {/* Table */}
          <RecentWorksTable />

        </main>
      </div>
    </div>
  );
}