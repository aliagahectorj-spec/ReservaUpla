// Capa de acceso a la API. Todas las páginas usan estas funciones.
let usuarioActualId = null;
export const definirUsuarioActual = (id) => { usuarioActualId = id; };

async function pedir(metodo, ruta, cuerpo) {
  const res = await fetch(`/api${ruta}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(usuarioActualId ? { 'x-usuario-id': usuarioActualId } : {}) },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(datos.mensaje || 'Error de comunicación con el servidor.');
    error.detalles = datos.detalles || [];
    throw error;
  }
  return datos;
}

export const api = {
  usuarios: { listar: () => pedir('GET', '/usuarios'), crear: (d) => pedir('POST', '/usuarios', d) },
  ambientes: { listar: () => pedir('GET', '/ambientes'), crear: (d) => pedir('POST', '/ambientes', d) },
  reservas: {
    listar: (q = {}) => pedir('GET', `/reservas?${new URLSearchParams(Object.entries(q).filter(([, v]) => v))}`),
    obtener: (id) => pedir('GET', `/reservas/${id}`),
    crear: (d) => pedir('POST', '/reservas', d),
    cambiarEstado: (id, estado) => pedir('PATCH', `/reservas/${id}/estado`, { estado }),
    indicadores: () => pedir('GET', '/reservas/indicadores'),
  },
};
