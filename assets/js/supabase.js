// =============================================================
// SUPABASE CLIENT — AppRecetas
// Conexión REST a Supabase. Sin build step, usa fetch nativo.
// Las claves anon son públicas (RLS abierto para uso familiar).
// =============================================================

const SUPABASE_URL = "https://wqbetqxdtbqjpzyheiru.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxYmV0cXhkdGJxanB6eWhlaXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NzEyNTIsImV4cCI6MjEwNzI0NzI1Mn0.9WM_ay-8r3_UVQ8u3-XuYnbyHYhOdkDsMzVtVw0AbHg";

const SUPABASE = {
  url: SUPABASE_URL,
  key: SUPABASE_KEY,

  async _request(path, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1${path}`;
    const headers = {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Supabase error ${res.status}: ${err}`);
    }
    if (res.status === 204) return null;
    return res.json();
  },

  // --- Recetas ---
  async listRecetas() {
    return this._request(`/recetas?select=*&order=categoria.asc,titulo.asc`);
  },

  async getReceta(id) {
    const rows = await this._request(`/recetas?id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
    return rows[0] || null;
  },

  // --- Desayunos (miniaturas de video) ---
  async listDesayunos() {
    return this._request(`/desayunos?select=*&order=orden.asc,nombre.asc`);
  },

  // --- Perfiles ---
  async listPerfiles() {
    return this._request(`/perfiles?select=*&order=nombre.asc`);
  },

  async getPerfilActivo() {
    const rows = await this._request(`/perfiles?activo=eq.true&select=*&limit=1`);
    return rows[0] || null;
  },

  async setPerfilActivo(id) {
    // Desactivar todos primero
    await this._request(`/perfiles?activo=eq.true`, { method: "PATCH", body: JSON.stringify({ activo: false }) });
    // Activar el elegido
    return this._request(`/perfiles?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ activo: true }) });
  },

  async upsertPerfil(perfil) {
    return this._request(`/perfiles`, {
      method: "POST",
      headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(perfil)
    });
  },

  async deletePerfil(id) {
    return this._request(`/perfiles?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  // --- Despensa ---
  async listDespensa() {
    return this._request(`/despensa?select=*&order=created_at.desc`);
  },

  async addDespensa(item) {
    return this._request(`/despensa`, {
      method: "POST",
      headers: { "Prefer": "return=representation" },
      body: JSON.stringify(item)
    });
  },

  async updateDespensa(id, item) {
    return this._request(`/despensa?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(item)
    });
  },

  async deleteDespensa(id) {
    return this._request(`/despensa?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  async clearDespensa() {
    return this._request(`/despensa?id=neq.00000000-0000-0000-0000-000000000000`, { method: "DELETE" });
  },

  // --- Plan semanal ---
  async listPlanes() {
    return this._request(`/plan_semanal?select=*&order=created_at.desc`);
  },

  async getPlanSemanaActivo() {
    const rows = await this._request(`/plan_semanal?order=created_at.desc&limit=1`);
    return rows[0] || null;
  },

  async savePlan(plan) {
    return this._request(`/plan_semanal`, {
      method: "POST",
      headers: { "Prefer": "return=representation" },
      body: JSON.stringify(plan)
    });
  },

  async deletePlan(id) {
    return this._request(`/plan_semanal?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  }
};

window.SUPABASE = SUPABASE;