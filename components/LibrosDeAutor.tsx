"use client";
import { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import { gql } from "graphql-tag";

const GET_AUTORES = gql`
  query {
    autores {
      cedula
      nombre_completo
    }
  }
`;

const GET_LIBROS_POR_AUTOR = gql`
  query LibrosPorAutor($cedula: String!) {
    librosPorAutor(cedula: $cedula) {
      isbn
      titulo
      editorial
      genero
      anio_publicacion
    }
  }
`;

interface Autor {
  cedula: string;
  nombre_completo: string;
}

interface Libro {
  isbn: string;
  titulo: string;
  editorial: string;
  genero: string;
  anio_publicacion: string;
}

interface QueryAutores {
  autores: Autor[];
}

interface QueryLibrosPorAutor {
  librosPorAutor: Libro[];
}

export default function LibrosDeAutor() {
  const [cedulaSeleccionada, setCedulaSeleccionada] = useState("");
  const { data: dataAutores } = useQuery<QueryAutores>(GET_AUTORES);
  const autores: Autor[] = dataAutores?.autores ?? [];
  const [buscarLibros, { data: dataLibros, loading }] =
    useLazyQuery<QueryLibrosPorAutor>(GET_LIBROS_POR_AUTOR);
  const handleSelection = (cedula: string) => {
    setCedulaSeleccionada(cedula);
    if (cedula) {
      buscarLibros({ variables: { cedula } });
    }
  };
  const autorSeleccionado = autores.find(
    (a) => a.cedula === cedulaSeleccionada,
  );
  const libros: Libro[] = dataLibros?.librosPorAutor ?? [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Libros por Autor</h2>
      <select
        className="w-full p-2 mb-4 border rounded text-black"
        value={cedulaSeleccionada}
        onChange={(e) => handleSelection(e.target.value)}
      >
        <option value="">Selecciona un autor</option>
        {autores.map((autor) => (
          <option key={autor.cedula} value={autor.cedula}>
            {autor.cedula} - {autor.nombre_completo}
          </option>
        ))}
      </select>

      {loading && <p>Cargando libros...</p>}

      {!loading && autorSeleccionado && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Libros de {autorSeleccionado.nombre_completo}
          </h3>

          {libros.length === 0 ? (
            <p className="text-gray-600">
              No se encontraron libros para este autor.
            </p>
          ) : (
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Editorial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Género
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Año
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {libros.map((libro) => (
                  <tr key={libro.isbn}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {libro.isbn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {libro.titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {libro.editorial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {libro.genero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {libro.anio_publicacion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
