// src/pages/private/admin/CrearObra.tsx
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { obraService } from "../../../services/obraService";
import type { Obra } from "../../../services/obraService";
import "../../../styles/admin-forms.css";

interface Categoria {
  id_categoria: number;
  nombre: string;
}

interface Tecnica {
  id_tecnica: number;
  nombre: string;
}

interface Artista {
  id_artista: number;
  nombre_completo: string;
  nombre_artistico?: string;
}

export default function CrearObra() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [isError, setIsError] = useState(false);

  // Catálogos
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tecnicas, setTecnicas] = useState<Tecnica[]>([]);
  const [artistas, setArtistas] = useState<Artista[]>([]);

  // Form data
  const [formData, setFormData] = useState<Obra>({
    titulo: "",
    descripcion: "",
    id_categoria: 0,
    id_tecnica: undefined,
    id_artista: 0,
    precio_base: 0,
    anio_creacion: new Date().getFullYear(),
    dimensiones_alto: undefined,
    dimensiones_ancho: undefined,
    dimensiones_profundidad: undefined,
    permite_marco: true,
    con_certificado: false,
    imagen_principal: "",
  });

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [categoriasRes, tecnicasRes, artistasRes] = await Promise.all([
        obraService.getCategorias(),
        obraService.getTecnicas(),
        obraService.getArtistas()
      ]);

      setCategorias(categoriasRes.categorias || []);
      setTecnicas(tecnicasRes.tecnicas || []);
      setArtistas(artistasRes.artistas || []);
    } catch (error) {
      console.error("Error al cargar catálogos:", error);
      showMessage("Error al cargar los datos necesarios", true);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const showMessage = (msg: string, error: boolean) => {
    setMensaje(msg);
    setIsError(error);
    setTimeout(() => setMensaje(""), 5000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.titulo || !formData.descripcion) {
      showMessage("Por favor completa todos los campos obligatorios", true);
      return;
    }

    if (!formData.id_categoria || formData.id_categoria === 0) {
      showMessage("Por favor selecciona una categoría", true);
      return;
    }

    if (!formData.id_artista || formData.id_artista === 0) {
      showMessage("Por favor selecciona un artista", true);
      return;
    }

    if (!formData.precio_base || formData.precio_base <= 0) {
      showMessage("El precio debe ser mayor a 0", true);
      return;
    }

    setLoading(true);

    try {
      const response = await obraService.createObra(formData);
      showMessage("✅ Obra creada exitosamente", false);
      
      setTimeout(() => {
        navigate('/admin/obras');
      }, 2000);
    } catch (error: any) {
      console.error("Error al crear obra:", error);
      showMessage(error.message || "Error al crear la obra", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="page-header-form">
        <button className="btn-back" onClick={() => navigate('/admin')}>
          <ArrowLeft size={20} />
          Volver al Dashboard
        </button>
        
        <div className="header-info">
          <h1>Nueva Obra</h1>
          <p>Agrega una nueva obra a la galería</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="form-container">
        <form onSubmit={handleSubmit} className="obra-form">
          {/* Información Básica */}
          <div className="form-section">
            <h2 className="section-title">Información Básica</h2>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="titulo" className="required">Título de la Obra</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Amanecer en la Huasteca"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="descripcion" className="required">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe la obra, su significado, técnica utilizada..."
                  rows={4}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="id_categoria" className="required">Categoría</label>
                <select
                  id="id_categoria"
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="0">Seleccionar categoría...</option>
                  {categorias.map(cat => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="id_tecnica">Técnica</label>
                <select
                  id="id_tecnica"
                  name="id_tecnica"
                  value={formData.id_tecnica || ''}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Sin técnica específica</option>
                  {tecnicas.map(tec => (
                    <option key={tec.id_tecnica} value={tec.id_tecnica}>
                      {tec.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="id_artista" className="required">Artista</label>
                <select
                  id="id_artista"
                  name="id_artista"
                  value={formData.id_artista}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="0">Seleccionar artista...</option>
                  {artistas.map(art => (
                    <option key={art.id_artista} value={art.id_artista}>
                      {art.nombre_artistico || art.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="anio_creacion">Año de Creación</label>
                <input
                  type="number"
                  id="anio_creacion"
                  name="anio_creacion"
                  value={formData.anio_creacion || ''}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2024"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Dimensiones */}
          <div className="form-section">
            <h2 className="section-title">Dimensiones (cm)</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="dimensiones_alto">Alto</label>
                <input
                  type="number"
                  id="dimensiones_alto"
                  name="dimensiones_alto"
                  value={formData.dimensiones_alto || ''}
                  onChange={handleChange}
                  placeholder="50"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dimensiones_ancho">Ancho</label>
                <input
                  type="number"
                  id="dimensiones_ancho"
                  name="dimensiones_ancho"
                  value={formData.dimensiones_ancho || ''}
                  onChange={handleChange}
                  placeholder="70"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dimensiones_profundidad">Profundidad (opcional)</label>
                <input
                  type="number"
                  id="dimensiones_profundidad"
                  name="dimensiones_profundidad"
                  value={formData.dimensiones_profundidad || ''}
                  onChange={handleChange}
                  placeholder="5"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Precio e Imagen */}
          <div className="form-section">
            <h2 className="section-title">Precio e Imagen</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="precio_base" className="required">Precio Base (MXN)</label>
                <input
                  type="number"
                  id="precio_base"
                  name="precio_base"
                  value={formData.precio_base || ''}
                  onChange={handleChange}
                  placeholder="2500"
                  step="0.01"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="imagen_principal">
                  <ImageIcon size={18} />
                  URL de la Imagen Principal
                </label>
                <input
                  type="url"
                  id="imagen_principal"
                  name="imagen_principal"
                  value={formData.imagen_principal || ''}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={loading}
                />
                <small className="form-hint">
                  Por ahora ingresa la URL de una imagen. Puedes usar servicios como Imgur o URLs de ejemplo.
                </small>
              </div>
            </div>
          </div>

          {/* Opciones */}
          <div className="form-section">
            <h2 className="section-title">Opciones</h2>
            
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="permite_marco"
                  checked={formData.permite_marco}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Permite marco personalizado</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="con_certificado"
                  checked={formData.con_certificado}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Incluye certificado de autenticidad</span>
              </label>
            </div>
          </div>

          {/* Mensaje */}
          {mensaje && (
            <div className={`form-message ${isError ? 'error' : 'success'}`}>
              {isError ? (
                <AlertCircle size={20} />
              ) : (
                <CheckCircle2 size={20} />
              )}
              <span>{mensaje}</span>
            </div>
          )}

          {/* Botones */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/admin')}
              disabled={loading}
            >
              Cancelar
            </button>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar Obra
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}