"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from 'graphql-tag';
import FormularioLibro from "./FormularioLibro";

const GET_LIBROS = gql`
  query {
    libros {
      isbn
      titulo
      editorial
      genero
      anio_publicacion
      autor {
        cedula
        nombre_completo
      }
    }
  }
`

const ELIMINAR_LIBRO = gql`
  mutation Eliminarlibro($isbn: String!) {
    eliminarlibro(isbn: $isbn)
  }
`

interface Autor {
  cedula: string
  nombre_completo: string
}

interface Libro {
  isbn: string
  titulo: string
  editorial: string
  genero: string
  anio_publicacion: number
  autor: Autor
}

interface QueryLibros {
  libros: Libro[]
}

export default function CrudLibros() {
  // const [libros, setLibros] = useState([]);
  // const [cargando, setCargando] = useState(true);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [libroEnEdicion, setLibroEnEdicion] = useState<Libro | null>(null);

  const { data, loading, error, refetch } = useQuery<QueryLibros>(GET_LIBROS)

  const [eliminarLibro] = useMutation(ELIMINAR_LIBRO,  {
    onCompleted: () => refetch(),
  })

  const handleEliminar = async (isbn: string) => {
    if (confirm('Estas seguro de eliminar este libro?')) {
      await eliminarLibro({ variables: { isbn } })
    }
  }

  if (loading) return <p>Cargando libros...</p>
  if (error) return <p>Error cargando libros: {error.message}</p>

  const libros: Libro[] = data?.libros ?? []

  // // 1. Cargar libros desde la API (MySQL)
  // const obtenerLibros = async () => {
  //   try {
  //     const res = await fetch("/api/libros");
  //     const data = await res.json();
  //     setLibros(data);
  //   } catch (error) {
  //     console.error("Error cargando libros:", error);
  //   } finally {
  //     setCargando(false);
  //   }
  // };

  // useEffect(() => {
  //   obtenerLibros();
  // }, []);

  // // 2. Función para eliminar
  // const eliminarLibro = async (id: number) => {
  //   if (confirm("¿Estás seguro de eliminar este libro?")) {
  //     await fetch(`/api/libros/${id}`, { method: "DELETE" });
  //     obtenerLibros(); // Recargamos la lista
  //   }
  // };

  // if (cargando) return <p>Cargando libros...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Listado de Libros
        </h2>
        <button
          onClick={() => setMostrandoFormulario(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Nuevo Libro
        </button>
      </div>

      {(mostrandoFormulario || libroEnEdicion) && (
        <FormularioLibro
          libroAEditar={libroEnEdicion}
          alCerrar={() => {
            setMostrandoFormulario(false);
            setLibroEnEdicion(null);
          }}
          onLibroCreado={refetch}
        />
      )}

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ISBN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Titulo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Editorial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Genero
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Año de Publicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {libros.map((u) => (
              <tr key={u.isbn}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.isbn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {u.titulo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.editorial}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.genero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.anio_publicacion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.autor?.nombre_completo} ({u.autor?.cedula})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setLibroEnEdicion(u);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(u.isbn)}
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
