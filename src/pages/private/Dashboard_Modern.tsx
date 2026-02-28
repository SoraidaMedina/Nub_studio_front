import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from "recharts";

// ─── TOKENS ─────────────────────────────────────────────────────
const C = {
  bg:          "#111318",
  surface:     "#16191f",
  surfaceHigh: "#1c202a",
  borderSub:   "rgba(255,255,255,0.05)",
  borderMid:   "rgba(255,255,255,0.09)",

  blue:   "#79AAF5",
  orange: "#FF840E",
  pink:   "#CC59AD",
  pinkAlt:"#CC4EA1",
  purple: "#8D4CCD",
  purpleHi:"#D363FF",
  gold:   "#FFC110",
  cafe:   "#764E31",
  green:  "#4ADE80",

  t1: "#f0f4fc",
  t2: "#8b95a8",
  t3: "#464f61",
  t4: "#2a3040",
};

// ─── DATA ────────────────────────────────────────────────────────
const salesFlow = [
  { w:"S1", ingresos:38, obras:14, visitas:210 },
  { w:"S2", ingresos:52, obras:19, visitas:284 },
  { w:"S3", ingresos:44, obras:16, visitas:251 },
  { w:"S4", ingresos:67, obras:25, visitas:340 },
  { w:"S5", ingresos:59, obras:22, visitas:298 },
  { w:"S6", ingresos:81, obras:31, visitas:412 },
  { w:"S7", ingresos:74, obras:28, visitas:380 },
  { w:"S8", ingresos:93, obras:35, visitas:467 },
];

const topArtists = [
  { name:"María Colín",   obras:18, ingresos:42, color: C.blue   },
  { name:"Pedro Ramos",   obras:14, ingresos:31, color: C.purple },
  { name:"Ana Flores",    obras:11, ingresos:28, color: C.pink   },
  { name:"Carmen Díaz",   obras: 9, ingresos:22, color: C.gold   },
  { name:"Luis Vega",     obras: 7, ingresos:17, color: C.green  },
];

const techBreakdown = [
  { t:"Óleo",       v:38 },
  { t:"Acuarela",   v:24 },
  { t:"Fotografía", v:19 },
  { t:"Escultura",  v:12 },
  { t:"Grabado",    v: 7 },
];

const techColors = [C.blue, C.pink, C.purple, C.orange, C.gold];

const recentTx = [
  { obra:"Danza Huasteca",     artista:"M. Colín",  precio:"$4,200", tipo:"venta",    ts:"Hace 2h"  },
  { obra:"Ritual del Maíz",    artista:"C. Díaz",   precio:"$5,400", tipo:"venta",    ts:"Hace 5h"  },
  { obra:"Sierra Amanecer",    artista:"P. Ramos",  precio:"$2,800", tipo:"reserva",  ts:"Hace 8h"  },
  { obra:"Tejido Ancestral",   artista:"A. Flores", precio:"$6,500", tipo:"pendiente",ts:"Ayer"     },
  { obra:"Mercado de Colores", artista:"L. Vega",   precio:"$3,100", tipo:"venta",    ts:"Ayer"     },
];

const txConfig = {
  venta:    { color: C.green,  bg:`${C.green}14`,  label:"Venta"     },
  reserva:  { color: C.gold,   bg:`${C.gold}14`,   label:"Reserva"   },
  pendiente:{ color: C.orange, bg:`${C.orange}14`, label:"Pendiente" },
};

// ─── SHARED COMPONENTS ──────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.surface,
    border: `1px solid ${C.borderSub}`,
    borderRadius: 14,
    ...style,
  }}>{children}</div>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.4px",
    textTransform: "uppercase",
    color: C.t3,
    marginBottom: 16,
    fontFamily: "inherit",
  }}>{children}</div>
);

const MetricPill = ({ label, value, color }) => (
  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
    <span style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0 }} />
    <span style={{ fontSize:11.5, color:C.t2 }}>{label}</span>
    <span style={{ fontSize:11.5, fontWeight:700, color, marginLeft:"auto" }}>{value}</span>
  </div>
);

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.surfaceHigh,
      border: `1px solid ${C.borderMid}`,
      borderRadius: 9,
      padding: "9px 13px",
      fontSize: 12,
    }}>
      <div style={{ color:C.t3, marginBottom:5 }}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{ color:p.color, fontWeight:600, margin:"2px 0" }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"overview", label:"Overview",   emoji:"◈" },
  { id:"obras",    label:"Obras",      emoji:"⬡" },
  { id:"artistas", label:"Artistas",   emoji:"◉" },
  { id:"pedidos",  label:"Pedidos",    emoji:"◫" },
  { id:"reportes", label:"Reportes",   emoji:"◳" },
];

function Sidebar({ active, setActive }) {
  return (
    <aside style={{
      width: 192,
      background: C.bg,
      borderRight: `1px solid ${C.borderSub}`,
      display: "flex",
      flexDirection: "column",
      padding: "28px 0",
      position: "sticky",
      top: 0,
      height: "100vh",
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ padding:"0 20px 32px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:30, height:30, borderRadius:8, flexShrink:0,
            background:`${C.purple}22`,
            border:`1px solid ${C.purple}40`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14,
          }}>✦</div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:C.t1, letterSpacing:".3px" }}>NU·B</div>
            <div style={{ fontSize:9.5, color:C.t3, letterSpacing:"2px", textTransform:"uppercase" }}>Studio</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding:"0 10px", flex:1 }}>
        <div style={{ fontSize:9.5, color:C.t4, letterSpacing:"1.5px", textTransform:"uppercase", padding:"0 10px", marginBottom:8 }}>
          Workspace
        </div>
        {NAV_ITEMS.map(({id,label,emoji})=>{
          const on = active===id;
          return (
            <button key={id} onClick={()=>setActive(id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:9,
              padding:"8px 10px", borderRadius:8, border:"none",
              background: on ? `${C.blue}0f` : "transparent",
              color: on ? C.blue : C.t3,
              fontSize:13, fontWeight: on ? 600 : 400,
              cursor:"pointer", marginBottom:2,
              textAlign:"left",
              borderLeft: `2px solid ${on ? C.blue : "transparent"}`,
              transition:"all .12s",
            }}
            onMouseEnter={e=>{ if(!on){ e.currentTarget.style.color=C.t2; e.currentTarget.style.background=`rgba(255,255,255,.03)`; }}}
            onMouseLeave={e=>{ if(!on){ e.currentTarget.style.color=C.t3; e.currentTarget.style.background="transparent"; }}}
            >
              <span style={{ fontSize:13, opacity:.7 }}>{emoji}</span>
              {label}
            </button>
          );
        })}

        <div style={{ height:1, background:C.borderSub, margin:"14px 10px" }} />
        <div style={{ fontSize:9.5, color:C.t4, letterSpacing:"1.5px", textTransform:"uppercase", padding:"0 10px", marginBottom:8 }}>
          Sistema
        </div>
        {[{e:"◎",l:"Ajustes"},{e:"◷",l:"Historial"}].map(({e,l})=>(
          <button key={l} style={{
            width:"100%", display:"flex", alignItems:"center", gap:9,
            padding:"8px 10px", borderRadius:8, border:"none",
            background:"transparent", color:C.t3,
            fontSize:13, cursor:"pointer", marginBottom:2, textAlign:"left",
            borderLeft:"2px solid transparent", transition:"all .12s",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.color=C.t2; e.currentTarget.style.background=`rgba(255,255,255,.03)`; }}
          onMouseLeave={e=>{ e.currentTarget.style.color=C.t3; e.currentTarget.style.background="transparent"; }}
          >
            <span style={{ fontSize:13, opacity:.7 }}>{e}</span>{l}
          </button>
        ))}
      </div>

      {/* User */}
      <div style={{ padding:"16px 20px 0", borderTop:`1px solid ${C.borderSub}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{
            width:28, height:28, borderRadius:"50%", flexShrink:0,
            background:`${C.pink}30`, border:`1px solid ${C.pink}40`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, fontWeight:700, color:C.pink,
          }}>G</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:C.t1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Gustavo</div>
            <div style={{ fontSize:10.5, color:C.t3 }}>Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── TOPBAR ──────────────────────────────────────────────────────
function Topbar() {
  return (
    <header style={{
      padding:"14px 28px",
      borderBottom:`1px solid ${C.borderSub}`,
      display:"flex", justifyContent:"space-between", alignItems:"center",
      background:C.bg, position:"sticky", top:0, zIndex:30,
    }}>
      <div>
        <h1 style={{ margin:0, fontSize:16, fontWeight:700, color:C.t1, letterSpacing:"-.2px" }}>
          Overview
        </h1>
        <p style={{ margin:"1px 0 0", fontSize:11.5, color:C.t3 }}>
          Semana 8 · Feb 17 – 24, 2026
        </p>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {/* Search */}
        <div style={{
          display:"flex", alignItems:"center", gap:7,
          background:C.surface, border:`1px solid ${C.borderSub}`,
          borderRadius:8, padding:"6px 12px",
        }}>
          <span style={{ fontSize:12, color:C.t3 }}>⌕</span>
          <span style={{ fontSize:12.5, color:C.t3 }}>Buscar…</span>
          <span style={{ fontSize:10, color:C.t4, marginLeft:8, background:C.surfaceHigh, padding:"1px 5px", borderRadius:4 }}>⌘K</span>
        </div>
        {/* Bell */}
        <button style={{
          width:32, height:32, borderRadius:7, background:C.surface,
          border:`1px solid ${C.borderSub}`, display:"flex",
          alignItems:"center", justifyContent:"center",
          cursor:"pointer", fontSize:14, color:C.t2, position:"relative",
        }}>
          ◫
          <span style={{
            position:"absolute", top:6, right:6, width:5, height:5,
            background:C.orange, borderRadius:"50%",
          }} />
        </button>
        {/* Period selector */}
        <div style={{
          display:"flex", background:C.surface, border:`1px solid ${C.borderSub}`,
          borderRadius:8, overflow:"hidden",
        }}>
          {["7d","30d","90d"].map((p,i)=>(
            <button key={p} style={{
              padding:"5px 11px", border:"none", cursor:"pointer",
              background: i===0 ? C.surfaceHigh : "transparent",
              color: i===0 ? C.t1 : C.t3,
              fontSize:11.5, fontWeight: i===0 ? 600 : 400,
            }}>{p}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── KPI ROW ─────────────────────────────────────────────────────
function KpiRow() {
  const kpis = [
    { label:"Ingresos totales", value:"$93,400", delta:"+18.4%", up:true,  accent:C.gold,   sub:"vs semana anterior" },
    { label:"Obras vendidas",   value:"35",       delta:"+4",     up:true,  accent:C.blue,   sub:"esta semana"        },
    { label:"Obras en galería", value:"138",      delta:"+9",     up:true,  accent:C.purple, sub:"en catálogo activo" },
    { label:"Tasa conversión",  value:"8.2%",     delta:"−0.4%",  up:false, accent:C.orange, sub:"visitas → ventas"   },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
      {kpis.map(({label,value,delta,up,accent,sub})=>(
        <Card key={label} style={{ padding:"20px 18px", position:"relative", overflow:"hidden" }}>
          <div style={{ fontSize:11.5, color:C.t3, marginBottom:10 }}>{label}</div>
          <div style={{ fontSize:32, fontWeight:800, color:C.t1, letterSpacing:"-1.5px", lineHeight:1 }}>
            {value}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:10 }}>
            <span style={{
              fontSize:11, fontWeight:700, color: up ? C.green : C.orange,
              background: up ? `${C.green}14` : `${C.orange}14`,
              padding:"2px 7px", borderRadius:20,
            }}>{delta}</span>
            <span style={{ fontSize:11, color:C.t3 }}>{sub}</span>
          </div>
          {/* accent line */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:2,
            background:`linear-gradient(90deg,${accent},${accent}00)`,
          }} />
        </Card>
      ))}
    </div>
  );
}

// ─── MAIN CHART ──────────────────────────────────────────────────
function MainChart() {
  return (
    <Card style={{ padding:"22px", flex:1 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <div>
          <SectionLabel>Flujo de ventas</SectionLabel>
          <div style={{ fontSize:14, fontWeight:600, color:C.t1 }}>Ingresos & obras por semana</div>
        </div>
        <div style={{ display:"flex", gap:14 }}>
          {[{c:C.blue,l:"Ingresos (k)"},{c:C.pink,l:"Obras"}].map(({c,l})=>(
            <span key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11.5, color:C.t3 }}>
              <span style={{ width:20, height:2, background:c, display:"inline-block", borderRadius:2 }} />
              {l}
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={salesFlow} margin={{ top:4, right:4, bottom:0, left:-20 }}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.blue} stopOpacity={.15}/>
              <stop offset="100%" stopColor={C.blue} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.pink} stopOpacity={.12}/>
              <stop offset="100%" stopColor={C.pink} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke={C.borderSub} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="w" stroke="transparent" tick={{ fill:C.t3, fontSize:11 }} />
          <YAxis stroke="transparent" tick={{ fill:C.t3, fontSize:11 }} />
          <Tooltip content={<ChartTip/>} />
          <Area type="monotone" dataKey="ingresos" name="Ingresos (k)" stroke={C.blue} strokeWidth={2} fill="url(#g1)" dot={false} />
          <Area type="monotone" dataKey="obras" name="Obras" stroke={C.pink} strokeWidth={2} fill="url(#g2)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── TOP ARTISTS ─────────────────────────────────────────────────
function TopArtists() {
  return (
    <Card style={{ padding:"22px", width:240 }}>
      <SectionLabel>Top artistas</SectionLabel>
      <div style={{ fontSize:14, fontWeight:600, color:C.t1, marginBottom:20 }}>Por ingresos</div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {topArtists.map(({name,obras,ingresos,color}, i)=>(
          <div key={name} style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{
              width:26, height:26, borderRadius:7, flexShrink:0,
              background:`${color}18`, border:`1px solid ${color}30`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:700, color,
            }}>{i+1}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12.5, fontWeight:600, color:C.t1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {name}
              </div>
              <div style={{ fontSize:11, color:C.t3, marginTop:1 }}>{obras} obras</div>
            </div>
            <div style={{ fontSize:12.5, fontWeight:700, color, flexShrink:0 }}>
              ${ingresos}k
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── TECH CHART ──────────────────────────────────────────────────
function TechChart() {
  return (
    <Card style={{ padding:"22px", width:220 }}>
      <SectionLabel>Técnicas</SectionLabel>
      <div style={{ fontSize:14, fontWeight:600, color:C.t1, marginBottom:20 }}>Distribución</div>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={techBreakdown} barSize={16} margin={{ top:0, right:0, bottom:0, left:-28 }}>
          <XAxis dataKey="t" stroke="transparent" tick={{ fill:C.t3, fontSize:10 }} />
          <YAxis stroke="transparent" tick={{ fill:C.t3, fontSize:10 }} />
          <Tooltip content={<ChartTip/>} />
          <Bar dataKey="v" name="%" radius={[4,4,0,0]}>
            {techBreakdown.map((_,i)=>(
              <Cell key={i} fill={techColors[i]} fillOpacity={i===0 ? 1 : .4} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:16 }}>
        {techBreakdown.slice(0,3).map(({t,v},i)=>(
          <MetricPill key={t} label={t} value={`${v}%`} color={techColors[i]} />
        ))}
      </div>
    </Card>
  );
}

// ─── TRANSACTIONS ────────────────────────────────────────────────
function Transactions() {
  return (
    <Card style={{ padding:"22px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <SectionLabel>Actividad reciente</SectionLabel>
          <div style={{ fontSize:14, fontWeight:600, color:C.t1 }}>Últimas transacciones</div>
        </div>
        <button style={{
          fontSize:12, color:C.blue, background:`${C.blue}12`,
          border:`1px solid ${C.blue}25`, padding:"5px 12px",
          borderRadius:7, cursor:"pointer", fontWeight:600,
        }}>
          Ver historial →
        </button>
      </div>

      {/* Header row */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 120px 90px 90px 80px",
        gap:8, padding:"0 0 10px", borderBottom:`1px solid ${C.borderSub}`,
      }}>
        {["Obra","Artista","Monto","Estado","Tiempo"].map(h=>(
          <div key={h} style={{ fontSize:10, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:C.t3 }}>{h}</div>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column" }}>
        {recentTx.map(({obra,artista,precio,tipo,ts},i)=>{
          const cfg = txConfig[tipo];
          return (
            <div key={i} style={{
              display:"grid", gridTemplateColumns:"1fr 120px 90px 90px 80px",
              gap:8, padding:"11px 0",
              borderBottom: i < recentTx.length-1 ? `1px solid ${C.borderSub}` : "none",
              alignItems:"center",
              cursor:"default",
              transition:"background .1s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background=`rgba(255,255,255,.02)`}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ fontSize:13, fontWeight:600, color:C.t1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {obra}
              </div>
              <div style={{ fontSize:12.5, color:C.t2 }}>{artista}</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.gold }}>{precio}</div>
              <div>
                <span style={{
                  fontSize:11, padding:"3px 8px", borderRadius:20, fontWeight:600,
                  background:cfg.bg, color:cfg.color,
                }}>
                  {cfg.label}
                </span>
              </div>
              <div style={{ fontSize:11.5, color:C.t3 }}>{ts}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── STAT STRIP ──────────────────────────────────────────────────
function StatStrip() {
  const items = [
    { label:"Favoritos nuevos", value:"47",    accent:C.pink    },
    { label:"Visitas galería",  value:"1,284", accent:C.purple  },
    { label:"Obras pendientes", value:"12",    accent:C.orange  },
    { label:"Nuevos usuarios",  value:"23",    accent:C.green   },
    { label:"Certificados",     value:"8",     accent:C.gold    },
  ];
  return (
    <div style={{ display:"flex", gap:10, marginBottom:20 }}>
      {items.map(({label,value,accent})=>(
        <Card key={label} style={{
          flex:1, padding:"14px 16px",
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <span style={{ fontSize:12, color:C.t3 }}>{label}</span>
          <span style={{ fontSize:16, fontWeight:800, color:accent, letterSpacing:"-.5px" }}>{value}</span>
        </Card>
      ))}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [active, setActive] = useState("overview");

  return (
    <div style={{
      display:"flex", minHeight:"100vh",
      background:C.bg,
      fontFamily:"'DM Sans','Outfit','Nunito Sans',sans-serif",
      color:C.t1, fontSize:14,
    }}>
      <Sidebar active={active} setActive={setActive} />

      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <Topbar />

        <main style={{ flex:1, padding:"24px 28px", overflowY:"auto" }}>

          {/* KPIs */}
          <KpiRow />

          {/* Stat strip */}
          <StatStrip />

          {/* Charts row */}
          <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"stretch" }}>
            <MainChart />
            <TopArtists />
            <TechChart />
          </div>

          {/* Transactions */}
          <Transactions />

        </main>
      </div>
    </div>
  );
}