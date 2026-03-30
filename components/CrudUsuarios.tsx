"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react"; 
import { gql } from 'graphql-tag';
import FormularioUsuario from "./FormularioUsuario";

const GET_USUARIOS = gql`
  query {
    usuarios {
      id
      nickname
      tipo
    }
  }
`

const ELIMINAR_USUARIO = gql`
  mutation EliminarUsuario($id: Int!) {
    eliminarUsuario(id: $id)
  }
`

interface Usuario {
  id: number
  nickname: string
  tipo: 'administrador' | 'empleado'
}

interface QueryUsuarios {
  usuarios: Usuario[]
}

export default function CrudUsuarios() {
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Usuario | null>(null);

  const { data, loading, error, refetch } = useQuery<QueryUsuarios>(GET_USUARIOS)

  const [eliminarUsuario] = useMutation(ELIMINAR_USUARIO, {
    onCompleted: () => refetch(),
  })

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      await eliminarUsuario({ variables: { id } })
    }
  }

  if (loading) return <p>Cargando usuarios...</p>
  if (error) return <p>Error cargando usuarios: {error.message}</p>

  const usuarios: Usuario[] = data?.usuarios ?? []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Listado de Usuarios
        </h2>
        <button
          onClick={() => setMostrandoFormulario(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Nuevo Usuario
        </button>
      </div>

      {(mostrandoFormulario || usuarioEnEdicion) && (
        <FormularioUsuario
          usuarioAEditar={usuarioEnEdicion}
          alCerrar={() => {
            setMostrandoFormulario(false);
            setUsuarioEnEdicion(null);
          }}
          // onUsuarioCreado={obtenerUsuarios}
          onUsuarioCreado={refetch}
        />
      )}

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nickname
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {u.nickname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${u.tipo === "administrador" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}
                  >
                    {u.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setUsuarioEnEdicion(u);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(u.id)}
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
