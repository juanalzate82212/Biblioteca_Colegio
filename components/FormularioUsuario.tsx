'use client';
import { useState, useEffect } from 'react';

export default function FormularioUsuario({ onUsuarioCreado, alCerrar }: any) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('empleado');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, password, tipo }),
    });

    if (res.ok) {
      alert('Usuario creado con éxito');
      onUsuarioCreado(); // Esta función recargará la lista en el componente padre
      alCerrar();        // Cierra el formulario
    } else {
      alert('Error al crear usuario');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Registrar Nuevo Usuario</h2>
        
        <label className="block mb-2 text-sm font-medium">Nickname</label>
        <input 
          type="text" required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setNickname(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium">Contraseña</label>
        <input 
          type="password" required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium">Tipo de Usuario</label>
        <select 
          className="w-full p-2 mb-6 border rounded"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="empleado">Empleado</option>
          <option value="administrador">Administrador</option>
        </select>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={alCerrar} className="px-4 py-2 text-gray-600">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Guardar Usuario</button>
        </div>
      </form>
    </div>
  );
}