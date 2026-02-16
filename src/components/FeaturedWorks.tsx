// src/components/FeaturedWorks.tsx - VERSIÓN PREMIUM
import ProductCard from "./ProductCard";
import { Sparkles, TrendingUp, Filter } from "lucide-react";
import "../styles/products.css";

interface Product {
  id: string;
  category: string;
  title: string;
  price: number;
  image: string;
  available: boolean;
}

export default function FeaturedWorks() {
  const products: Product[] = [
    {
      id: '1',
      category: 'Fotografía',
      title: 'Amanecer Huasteco',
      price: 2566,
      image: '/images/amanecer-huasteco.jpg',
      available: true,
    },
    {
      id: '2',
      category: 'Pintura',
      title: 'Tradición Viva',
      price: 2566,
      image: '/images/tradicion-viva.jpg',
      available: true,
    },
    {
      id: '3',
      category: 'Artesanías',
      title: 'Tierra Fértil',
      price: 2566,
      image: '/images/tierra-fertil.jpg',
      available: true,
    }
  ];

  const handleView = (id: string) => {
    console.log("Ver producto:", id);
  };

  const handleBuy = (id: string) => {
    console.log("Comprar producto:", id);
  };

  return (
    <section className="featured-section-premium">
      {/* Fondo decorativo */}
      <div className="section-background">
        <div className="bg-gradient bg-gradient-1"></div>
        <div className="bg-gradient bg-gradient-2"></div>
      </div>

      <div className="container-premium">
        {/* Header de la sección */}
        <div className="section-header-premium">
          <div className="header-top">
            <div className="header-badge">
              <Sparkles size={16} />
              <span>Colección Exclusiva</span>
            </div>
            <button className="filter-btn">
              <Filter size={18} />
              <span>Filtrar</span>
            </button>
          </div>

          <h2 className="section-title-premium">
            Obras <span className="title-highlight">Destacadas</span>
          </h2>
          
          <p className="section-subtitle-premium">
            Selección curada de nuestras mejores piezas. Cada obra cuenta una 
            historia única y preserva la esencia de nuestra cultura ancestral.
          </p>

          {/* Categorías */}
          <div className="category-filters">
            <button className="category-btn active">
              Todas
            </button>
            <button className="category-btn">
              Fotografía
            </button>
            <button className="category-btn">
              Pintura
            </button>
            <button className="category-btn">
              Artesanías
            </button>
            <button className="category-btn">
              Escultura
            </button>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="products-grid-premium">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              category={product.category}
              title={product.title}
              price={product.price}
              image={product.image}
              available={product.available}
              onView={handleView}
              onBuy={handleBuy}
            />
          ))}
        </div>

        {/* CTA final */}
        <div className="section-cta">
          <TrendingUp size={24} />
          <h3>¿Buscas algo específico?</h3>
          <p>Explora nuestra colección completa de más de 500 obras disponibles</p>
          <button className="cta-btn-large">
            Ver Colección Completa
          </button>
        </div>
      </div>
    </section>
  );
}