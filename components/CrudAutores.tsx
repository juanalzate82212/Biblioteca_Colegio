"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from 'graphql-tag';
import FormularioAutor from "./FormularioAutor";

const GET_AUTORES = gql`
  query {
    autores {
      cedula
      nombre_completo
      nacionalidad
    }
  }
`

const ELIMINAR_AUTOR = gql`
  mutation EliminarAutor($cedula: String!) {
    eliminarAutor(cedula: $cedula)
  }
`

interface Autor {
  cedula: string
  nombre_completo: string
  nacionalidad: string
}

interface QueryAutores {
  autores: Autor[]
}

export default function CrudAutores() {
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [autorEnEdicion, setAutorEnEdicion] = useState<Autor | null>(null);

  const { data, loading, error, refetch } = useQuery<QueryAutores>(GET_AUTORES)

  const [eliminarAutor] = useMutation(ELIMINAR_AUTOR, {
    onCompleted: () => refetch(),
  })

  const handleEliminar = async (cedula: string) => {
    if (confirm('¿Estás seguro de eliminar este autor?')) {
      await eliminarAutor({ variables: { cedula } })
    }
  }

  if(loading) return <p>Cargando autores...</p>
  if(error) return <p>Error cargando autores: {error.message}</p>

  const autores: Autor[] = data?.autores ?? []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Listado de Autores
        </h2>
        <button
          onClick={() => setMostrandoFormulario(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Nuevo Autor
        </button>
      </div>

      {(mostrandoFormulario || autorEnEdicion) && (
        <FormularioAutor
          autorAEditar={autorEnEdicion}
          alCerrar={() => {
            setMostrandoFormulario(false);
            setAutorEnEdicion(null);
          }}
          onAutorCreado={refetch}
        />
      )}

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cedula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nacionalidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {autores.map((u) => (
              <tr key={u.cedula}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.cedula}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {u.nombre_completo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.nacionalidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => {
                      setAutorEnEdicion(u);
                    }}
                  className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(u.cedula)}
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
