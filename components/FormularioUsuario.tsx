'use client';
import { useState, useEffect } from 'react';

export default function FormularioUsuario({ onUsuarioCreado, alCerrar, usuarioAEditar = null }: any) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('empleado');

  useEffect(() => {
    if (usuarioAEditar) {
      setNickname(usuarioAEditar.nickname);
      setTipo(usuarioAEditar.tipo);
    }
  }, [usuarioAEditar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = usuarioAEditar ? `/api/usuarios/${usuarioAEditar.id}` : '/api/usuarios';
    const metodo = usuarioAEditar ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, password, tipo }),
    });

    if (res.ok) {
      alert(usuarioAEditar ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
      onUsuarioCreado(); // Esta función recargará la lista en el componente padre
      alCerrar();        // Cierra el formulario
    } else {
      alert(usuarioAEditar ? 'Error al actualizar el usuario' : 'Error al crear el usuario');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-gray-200 p-6 rounded-xl shadow-lg w-full max-w-md border-black border-2">
        <h2 className="text-xl font-bold mb-4 text-black">{usuarioAEditar ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h2>
        
        <label className="block mb-2 text-sm font-medium text-black">Nickname</label>
        <input 
          type="text" required
          value={nickname}
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setNickname(e.target.value)}
        />

        {!usuarioAEditar && (
        <label className="block mb-2 text-sm font-medium text-black">Contraseña</label>
        )}
        {!usuarioAEditar && (
        <input 
          type="password" required
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setPassword(e.target.value)}
        />
        )}

        <label className="block mb-2 text-sm font-medium text-black">Tipo de Usuario</label>
        <select 
          className="w-full p-2 mb-6 border rounded text-black"
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