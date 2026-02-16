// src/components/ProductCard.tsx - VERSIÓN PREMIUM
import { Eye, ShoppingCart, Heart, Star } from "lucide-react";
import "../styles/products.css";

interface ProductCardProps {
  id: string;
  category: string;
  title: string;
  price: number;
  image: string;
  available: boolean;
  onView?: (id: string) => void;
  onBuy?: (id: string) => void;
}

export default function ProductCard({
  id,
  category,
  title,
  price,
  image,
  available,
  onView,
  onBuy
}: ProductCardProps) {
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-MX')}`;
  };

  return (
    <article className="product-card-premium">
      {/* Badge de disponibilidad */}
      <div className="card-badge-wrapper">
        <span className={`card-badge ${available ? 'available' : 'unavailable'}`}>
          {available ? 'Disponible' : 'Agotado'}
        </span>
        <button className="card-wishlist">
          <Heart size={18} />
        </button>
      </div>

      {/* Imagen del producto */}
      <div className="card-image-container">
        <div className="card-glow"></div>
        <img 
          src={image} 
          alt={title} 
          className="card-image"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300/e6e2dc/ff6a00?text=Imagen+no+disponible';
          }}
        />
        
        {/* Overlay con acciones */}
        <div className="card-overlay">
          <button 
            className="card-action-btn"
            onClick={() => onView?.(id)}
            aria-label="Ver detalles"
          >
            <Eye size={20} />
            <span>Vista Rápida</span>
          </button>
        </div>

        {/* Rating flotante */}
        <div className="card-rating">
          <Star size={14} fill="#ffd60a" color="#ffd60a" />
          <span>4.8</span>
        </div>
      </div>

      {/* Información del producto */}
      <div className="card-content">
        <span className="card-category">{category}</span>
        
        <h3 className="card-title">{title}</h3>
        
        <div className="card-footer-premium">
          <div className="card-price-section">
            <span className="card-price">{formatPrice(price)}</span>
            <span className="card-price-label">MXN</span>
          </div>
          
          <button 
            className="card-buy-btn"
            onClick={() => onBuy?.(id)}
            disabled={!available}
          >
            <ShoppingCart size={18} />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </article>
  );
}