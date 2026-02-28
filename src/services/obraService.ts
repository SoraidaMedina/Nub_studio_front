// src/services/obraService.ts
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface Obra {
  id_obra?: number;
  titulo: string;
  descripcion: string;
  id_categoria: number;
  id_tecnica?: number;
  id_artista: number;
  precio_base: number;
  anio_creacion?: number;
  dimensiones_alto?: number;
  dimensiones_ancho?: number;
  dimensiones_profundidad?: number;
  permite_marco: boolean;
  con_certificado: boolean;
  imagen_principal?: string;
  estado?: string;
}

interface ObraResponse {
  message: string;
  obra?: Obra;
  obras?: Obra[];
}

class ObraService {
  private getHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // ── OBRAS ──────────────────────────────────────────────────────

  async getAllObras(): Promise<ObraResponse> {
    try {
      const response = await fetch(`${API_URL}/api/obras`, {
        headers: this.getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al obtener obras');
      return data;
    } catch (error) {
      console.error('Error al obtener obras:', error);
      throw error;
    }
  }

  async getObraById(id: number): Promise<ObraResponse> {
    try {
      const response = await fetch(`${API_URL}/api/obras/${id}`, {
        headers: this.getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al obtener la obra');
      return data;
    } catch (error) {
      console.error('Error al obtener obra:', error);
      throw error;
    }
  }

  async createObra(obraData: Obra): Promise<ObraResponse> {
    try {
      const response = await fetch(`${API_URL}/api/obras`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(obraData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al crear la obra');
      return data;
    } catch (error) {
      console.error('Error al crear obra:', error);
      throw error;
    }
  }

  async updateObra(id: number, obraData: Partial<Obra>): Promise<ObraResponse> {
    try {
      const response = await fetch(`${API_URL}/api/obras/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(obraData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al actualizar la obra');
      return data;
    } catch (error) {
      console.error('Error al actualizar obra:', error);
      throw error;
    }
  }

  async deleteObra(id: number): Promise<ObraResponse> {
    try {
      const response = await fetch(`${API_URL}/api/obras/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al eliminar la obra');
      return data;
    } catch (error) {
      console.error('Error al eliminar obra:', error);
      throw error;
    }
  }

  // ── CATÁLOGOS ──────────────────────────────────────────────────

  async getCategorias() {
    try {
      // GET /api/categorias → { success, data: [...] }
      const response = await fetch(`${API_URL}/api/categorias`);
      const data = await response.json();
      return { categorias: data.data || [] };
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  async getTecnicas(id_categoria?: number) {
    try {
      // GET /api/tecnicas  o  /api/tecnicas?categoria=X
      const url = id_categoria
        ? `${API_URL}/api/tecnicas?categoria=${id_categoria}`
        : `${API_URL}/api/tecnicas`;
      const response = await fetch(url);
      const data = await response.json();
      return { tecnicas: data.data || data.tecnicas || [] };
    } catch (error) {
      console.error('Error al obtener técnicas:', error);
      throw error;
    }
  }

  async getArtistas() {
    try {
      // GET /api/artistas → { success, data: [...] }
      const response = await fetch(`${API_URL}/api/artistas`, {
        headers: this.getHeaders(),
      });
      const data = await response.json();
      return { artistas: data.data || data.artistas || [] };
    } catch (error) {
      console.error('Error al obtener artistas:', error);
      throw error;
    }
  }
}

export const obraService = new ObraService();
export type { ObraResponse };