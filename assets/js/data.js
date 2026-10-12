// =============================================================
// VIDEOS DATA — Loader desde Supabase (tabla `videos`)
// Cada video es una miniatura que al hacer click abre el video
// en una nueva pestaña.
// =============================================================

window.VIDEOS_DATA = [];
window.VIDEOS_INDEX = [];

async function loadVideos() {
  try {
    const videos = await window.SUPABASE.listVideos();
    window.VIDEOS_DATA = videos || [];
    window.VIDEOS_INDEX = (videos || []).map(v => ({
      id: v.id,
      titulo: v.titulo,
      categoria: v.categoria,
      video_url: v.video_url,
      foto_url: v.foto_url,
      kcal: v.kcal,
      proteina_g: v.proteina_g
    }));
    return window.VIDEOS_DATA;
  } catch (err) {
    console.warn("[AppRecetas] No se pudo cargar videos desde Supabase:", err.message);
    window.VIDEOS_DATA = [];
    window.VIDEOS_INDEX = [];
    return window.VIDEOS_DATA;
  }
}