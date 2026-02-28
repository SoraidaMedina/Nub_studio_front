// src/layout/Footer.tsx
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Palette } from "lucide-react";
import logoImg from "../assets/images/logo.png";

export default function Footer() {
  return (
    <footer style={{
      background:"#1C1F26", color:"rgba(255,255,255,0.6)",
      fontFamily:"'Outfit',sans-serif", marginTop:"auto",
      borderTop:"1px solid rgba(255,132,14,0.2)"
    }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"48px 24px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:40 }} className="footer-grid">

          {/* marca */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <img src={logoImg} alt="Nu-B Studio" style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover", border:"2px solid #FF840E" }} />
              <span style={{ fontSize:18, fontWeight:800, color:"#FF840E", letterSpacing:1 }}>NU-B STUDIO</span>
            </div>
            <p style={{ fontSize:14, lineHeight:1.8, color:"rgba(255,255,255,0.5)", marginBottom:20, maxWidth:260 }}>
              Galería de arte huasteco que preserva y promueve la cultura regional. Conectamos artistas locales con coleccionistas de todo México.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              {[
                { Icon:Instagram, href:"#", color:"#CC59AD" },
                { Icon:Facebook,  href:"#", color:"#79AAF5" },
                { Icon:Twitter,   href:"#", color:"#79AAF5" },
              ].map(({ Icon, href, color }, i) => (
                <a key={i} href={href} style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", color, transition:"all .15s", textDecoration:"none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background=`${color}20`; (e.currentTarget as HTMLElement).style.borderColor=color; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.1)"; }}
                >
                  <Icon size={16} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* catálogo */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:16 }}>Catálogo</div>
            {[
              { label:"Todas las obras",  to:"/catalogo"                    },
              { label:"Artesanía",        to:"/catalogo?categoria=artesania" },
              { label:"Pintura",          to:"/catalogo?categoria=pintura"   },
              { label:"Fotografía",       to:"/catalogo?categoria=fotografia"},
              { label:"Escultura",        to:"/catalogo?categoria=escultura" },
            ].map(({ label, to }) => (
              <Link key={to} to={to} style={{ display:"block", fontSize:14, color:"rgba(255,255,255,0.5)", textDecoration:"none", marginBottom:10, transition:"color .15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color="#FF840E"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.5)"}
              >{label}</Link>
            ))}
          </div>

          {/* estudio */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:16 }}>Estudio</div>
            {[
              { label:"Sobre nosotros", to:"/sobre-nosotros" },
              { label:"Artistas",       to:"/artistas"       },
              { label:"Blog",           to:"/blog"           },
              { label:"Contacto",       to:"/contacto"       },
            ].map(({ label, to }) => (
              <Link key={to} to={to} style={{ display:"block", fontSize:14, color:"rgba(255,255,255,0.5)", textDecoration:"none", marginBottom:10, transition:"color .15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color="#FF840E"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.5)"}
              >{label}</Link>
            ))}
          </div>

          {/* contacto */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:16 }}>Contacto</div>
            {[
              { icon:MapPin, text:"Huejutla de Reyes, Hidalgo, México" },
              { icon:Phone,  text:"+52 789 000 0000"                    },
              { icon:Mail,   text:"hola@nubstudio.mx"                   },
            ].map(({ icon:Icon, text }, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                <Icon size={15} color="#FF840E" strokeWidth={1.8} style={{ marginTop:2, flexShrink:0 }} />
                <span style={{ fontSize:13.5, color:"rgba(255,255,255,0.5)", lineHeight:1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* bottom */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"18px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.3)" }}>© 2026 Nu-B Studio. Todos los derechos reservados.</span>
          <div style={{ display:"flex", gap:20 }}>
            {["Términos", "Privacidad", "Cookies"].map(t => (
              <a key={t} href="#" style={{ fontSize:13, color:"rgba(255,255,255,0.3)", textDecoration:"none", transition:"color .15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color="#FF840E"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.3)"}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 28px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}