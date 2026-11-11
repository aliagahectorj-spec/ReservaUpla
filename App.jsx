import { useCallback, useEffect, useState } from 'react';
import { api, definirUsuarioActual } from './services/api.js';
import Dashboard from './pages/Dashboard.jsx';
import ListaReservas from './pages/ListaReservas.jsx';
import FormReserva from './pages/FormReserva.jsx';
import FormUsuario from './pages/FormUsuario.jsx';
import FormAmbiente from './pages/FormAmbiente.jsx';
import SelectInput from './components/SelectInput.jsx';
import Icono from './components/Icono.jsx';

const SECCIONES = [
  ['dashboard', 'Dashboard', 'dashboard'],
  ['reservas', 'Reservas', 'reservas'],
  ['nueva', 'Nueva reserva', 'nueva'],
  ['ambientes', 'Ambientes', 'ambientes'],
  ['usuarios', 'Usuarios', 'usuarios'],
];

export default function App() {
  const [seccion, setSeccion] = useState('dashboard');
  const [usuarios, setUsuarios] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [actualId, setActualId] = useState('');

  const cargarCatalogos = useCallback(() => {
    api.usuarios.listar().then(setUsuarios).catch(() => {});
    api.ambientes.listar().then(setAmbientes).catch(() => {});
  }, []);
  useEffect(cargarCatalogos, [cargarCatalogos]);

  const usuarioActual = usuarios.find((u) => u.id === actualId) || null;
  useEffect(() => definirUsuarioActual(actualId || null), [actualId]);

  return (
    <div className="app">
      <aside className="lateral">
        <div className="marca">
          <div className="marca__logo">
            <img src="/logo-upla.png" alt="Universidad Peruana Los Andes" />
          </div>
          <p className="marca__nombre">Reserva<strong>UPLA</strong></p>
          <small>Reservas de ambientes</small>
        </div>

        <nav className="menu" aria-label="Secciones">
          {SECCIONES.map(([clave, texto, icono]) => (
            <button key={clave} className={seccion === clave ? 'activo' : ''} aria-current={seccion === clave ? 'page' : undefined} onClick={() => setSeccion(clave)}>
              <Icono nombre={icono} />{texto}
            </button>
          ))}
        </nav>

        <div className="sesion">
          <div className="sesion__perfil">
            <span className="avatar avatar--dorado">{usuarioActual ? usuarioActual.nombreCompleto[0] : '?'}</span>
            <p className="sesion__rol">{usuarioActual ? usuarioActual.rol.replace('ResponsableAmbiente', 'Responsable de ambiente') : 'Elija un usuario para operar'}</p>
          </div>
          <SelectInput id="sesion" etiqueta="Usuario actual" placeholder="Sin identificar"
            opciones={usuarios.map((u) => ({ valor: u.id, texto: u.nombreCompleto }))}
            value={actualId} onChange={(e) => setActualId(e.target.value)} />
        </div>
      </aside>

      <main className="contenido">
        {seccion === 'dashboard' && <Dashboard />}
        {seccion === 'reservas' && <ListaReservas usuarioActual={usuarioActual} />}
        {seccion === 'nueva' && <FormReserva key={actualId} usuarios={usuarios} ambientes={ambientes} usuarioActual={usuarioActual} alGuardar={() => setSeccion('reservas')} />}
        {seccion === 'ambientes' && <FormAmbiente usuarios={usuarios} alGuardar={cargarCatalogos} />}
        {seccion === 'usuarios' && <FormUsuario alGuardar={cargarCatalogos} />}
      </main>
    </div>
  );
}
