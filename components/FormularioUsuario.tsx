'use client';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from 'graphql-tag'

const CREAR_USUARIO = gql`
  mutation CrearUsuario($nickname: String!, $password: String!, $tipo: TipoUsuario!) {
    crearUsuario(nickname: $nickname, password: $password, tipo: $tipo) {
      id
      nickname
      tipo
    }
  }
`

const ACTUALIZAR_USUARIO = gql`
  mutation ActualizarUsuario($id: Int!, $nickname: String, $tipo: TipoUsuario) {
    actualizarUsuario(id: $id, nickname: $nickname, tipo: $tipo) {
      id
      nickname
      tipo
    }
  }
`
interface Usuario {
  id: number
  nickname: string
  tipo: 'administrador' | 'empleado'
}

interface Props {
  onUsuarioCreado: () => void
  alCerrar: () => void
  usuarioAEditar?: Usuario | null
}

export default function FormularioUsuario({ onUsuarioCreado, alCerrar, usuarioAEditar = null }: Props) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState<'administrador' | 'empleado'>('empleado');

  useEffect(() => {
    if (usuarioAEditar) {
      setNickname(usuarioAEditar.nickname);
      setTipo(usuarioAEditar.tipo);
    }
  }, [usuarioAEditar]);

  const [crearUsuario] = useMutation(CREAR_USUARIO)
  const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      if (usuarioAEditar) {
        await actualizarUsuario({
          variables: { id: usuarioAEditar.id, nickname, tipo },
        })
        alert('Usuario actualizado correctamente')
      } else {
        await crearUsuario({
          variables: { nickname, password, tipo },
        })
        alert('Usuario creado exitosamente')
      }
      onUsuarioCreado()
      alCerrar()
    } catch (error) {
      alert(usuarioAEditar ? 'Error al actualizar el usuario' : 'Error al crear el usuario')
      console.error(error)
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
          onChange={(e) => setTipo(e.target.value as 'administrador' | 'empleado')}
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