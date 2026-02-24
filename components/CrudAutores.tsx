'use client';
import { useState, useEffect } from 'react';

export default function CrudAutores() {
  const [autores, setAutores] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. Cargar autores desde la API (MySQL)
  const obtenerAutores = async () => {
    try {
      const res = await fetch('/api/autores');
      const data = await res.json();
      setAutores(data);
    } catch (error) {
      console.error("Error cargando autores:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerAutores();
  }, []);

  // 2. Función para eliminar
  const eliminarAutor = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este autor?')) {
      await fetch(`/api/autores/${id}`, { method: 'DELETE' });
      obtenerAutores(); // Recargamos la lista
    }
  };

  if (cargando) return <p>Cargando autores...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Listado de Autores</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          + Nuevo Autor
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cedula</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nacionalidad</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {autores.map((u: any) => (
              <tr key={u.cedula}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.cedula}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.nombre_completo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.nacionalidad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                  <button 
                    onClick={() => eliminarAutor(u.id)}
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