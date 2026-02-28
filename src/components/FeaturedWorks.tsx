// src/components/FeaturedWorks.tsx - CONECTADO A API
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Sparkles, TrendingUp, Filter, RefreshCw } from "lucide-react";
import "../styles/products.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface Obra {
  id_obra: number;
  titulo: string;
  slug: string;
  imagen_principal: string;
  precio_base: number;
  precio_minimo: number;
  categoria_nombre: string;
  artista_nombre: string;
  artista_alias: string;
  estado: string;
}

interface Categoria {
  id_categoria: number;
  nombre: string;
}

export default function FeaturedWorks() {
  const navigate = useNavigate();
  const [obras, setObras]           = useState<Obra[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [catActiva, setCatActiva]   = useState<number | null>(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/categorias`)
      .then(r => r.json())
      .then(j => setCategorias(j.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "6", ordenar: "recientes" });
    if (catActiva) params.set("categoria", String(catActiva));

    fetch(`${API_URL}/api/obras?${params}`)
      .then(r => r.json())
      .then(j => setObras(j.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [catActiva]);

  const handleView = (id: string) => {
    const obra = obras.find(o => String(o.id_obra) === id);
    if (obra?.slug) navigate(`/obras/${obra.slug}`);
  };

  const handleBuy = (id: string) => {
    const obra = obras.find(o => String(o.id_obra) === id);
    if (obra?.slug) navigate(`/obras/${obra.slug}`);
  };

  return (
    <section className="featured-section-premium">
      <div className="section-background">
        <div className="bg-gradient bg-gradient-1"></div>
        <div className="bg-gradient bg-gradient-2"></div>
      </div>

      <div className="container-premium">
        <div className="section-header-premium">
          <div className="header-top">
            <div className="header-badge">
              <Sparkles size={16} />
              <span>Colección Exclusiva</span>
            </div>
            <button className="filter-btn" onClick={() => navigate("/catalogo")}>
              <Filter size={18} />
              <span>Ver todo</span>
            </button>
          </div>

          <h2 className="section-title-premium">
            Obras <span className="title-highlight">Destacadas</span>
          </h2>

          <p className="section-subtitle-premium">
            Selección curada de nuestras mejores piezas. Cada obra cuenta una
            historia única y preserva la esencia de nuestra cultura ancestral.
          </p>

          <div className="category-filters">
            <button
              className={`category-btn${catActiva === null ? " active" : ""}`}
              onClick={() => setCatActiva(null)}
            >
              Todas
            </button>
            {categorias.map(c => (
              <button
                key={c.id_categoria}
                className={`category-btn${catActiva === c.id_categoria ? " active" : ""}`}
                onClick={() => setCatActiva(c.id_categoria)}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:"60px 0", gap:12, color:"#9CA3AF" }}>
            <RefreshCw size={20} style={{ animation:"spin 1s linear infinite" }} />
            <span style={{ fontSize:15 }}>Cargando obras…</span>
          </div>
        ) : obras.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#9CA3AF" }}>
            <p style={{ fontSize:15 }}>No hay obras en esta categoría aún.</p>
          </div>
        ) : (
          <div className="products-grid-premium">
            {obras.map(obra => (
              <ProductCard
                key={obra.id_obra}
                id={String(obra.id_obra)}
                category={obra.categoria_nombre || "Arte"}
                title={obra.titulo}
                price={Number(obra.precio_minimo || obra.precio_base) || 0}
                image={obra.imagen_principal || ""}
                available={obra.estado === "publicada"}
                onView={handleView}
                onBuy={handleBuy}
              />
            ))}
          </div>
        )}

        <div className="section-cta">
          <TrendingUp size={24} />
          <h3>¿Buscas algo específico?</h3>
          <p>Explora nuestra colección completa de obras disponibles</p>
          <button className="cta-btn-large" onClick={() => navigate("/catalogo")}>
            Ver Colección Completa
          </button>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </section>
  );
}