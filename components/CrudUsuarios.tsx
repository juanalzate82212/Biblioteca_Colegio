'use client';
import { useState, useEffect } from 'react';

export default function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. Cargar usuarios desde la API (MySQL)
  const obtenerUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // 2. Función para eliminar
  const eliminarUsuario = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      obtenerUsuarios(); // Recargamos la lista
    }
  };

  if (cargando) return <p>Cargando usuarios...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Listado de Usuarios</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          + Nuevo Usuario
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nickname</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((u: any) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.nickname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.tipo === 'administrador' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {u.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                  <button 
                    onClick={() => eliminarUsuario(u.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}