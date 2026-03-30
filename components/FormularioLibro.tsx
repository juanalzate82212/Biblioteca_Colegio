"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from 'graphql-tag'

const GET_AUTORES = gql`
  query {
    autores {
      cedula
      nombre_completo
    }
}
`

const CREAR_LIBRO = gql`
  mutation CrearLibro($isbn: String!, $titulo: String!, $editorial: String!, $genero: String!, $anio_publicacion: Int!, $autor_cedula: String!) {
    crearLibro(isbn: $isbn, titulo: $titulo, editorial: $editorial, genero: $genero, anio_publicacion: $anio_publicacion, autor_cedula: $autor_cedula) {
      isbn
      titulo
    }
  }
`

const ACTUALIZAR_LIBRO = gql`
  mutation ActualizarLibro($isbn: String!, $titulo: String, $editorial: String, $genero: String, $anio_publicacion: Int) {
    actualizarLibro(isbn: $isbn, titulo: $titulo, editorial: $editorial, genero: $genero, anio_publicacion: $anio_publicacion) {
      isbn
      titulo
    }
  }
`

interface Autor {
  cedula: string
  nombre_completo: string
}

interface QueryAutores {
  autores: Autor[]
}

interface Libro {
  isbn: string
  titulo: string
  editorial: string
  genero: string
  anio_publicacion: number
  autor: Autor
}

interface Props {
  onLibroCreado: () => void
  alCerrar: () => void
  libroAEditar?: Libro | null
}

interface FormData {
  isbn: string
  titulo: string
  editorial: string
  genero: string
  anio_publicacion: string
  autor_cedula: string
}

export default function FormularioLibro({
  onLibroCreado,
  alCerrar,
  libroAEditar = null,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    isbn: "",
    titulo: "",
    editorial: "",
    genero: "",
    anio_publicacion: "",
    autor_cedula: "",
  });

  const { data: dataAutores } = useQuery<QueryAutores>(GET_AUTORES)
  const autores: Autor[] = dataAutores?.autores ?? []

  useEffect(() => {
    if (libroAEditar) {
      setFormData({
        isbn: libroAEditar.isbn,
        titulo: libroAEditar.titulo,
        editorial: libroAEditar.editorial,
        genero: libroAEditar.genero,
        anio_publicacion: String(libroAEditar.anio_publicacion),
        autor_cedula: libroAEditar.autor.cedula,
      });
    }
  }, [libroAEditar]);

  const [crearLibro] = useMutation(CREAR_LIBRO)
  const [actualizarLibro] = useMutation(ACTUALIZAR_LIBRO)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (libroAEditar) {
        await actualizarLibro({
          variables: { 
            isbn: formData.isbn,
            titulo: formData.titulo,
            editorial: formData.editorial,
            genero: formData.genero,
            anio_publicacion: Number(formData.anio_publicacion),
          },
        })
        alert('Libro actualizado correctamente')
      } else {
        await crearLibro({
          variables: {
            ...formData,
            anio_publicacion: Number(formData.anio_publicacion),
          },
        })
        alert('Libro creado correctamente')
      }
      onLibroCreado()
      alCerrar()
    } catch (error) {
      alert(libroAEditar ? 'Error al actualizar el libro' : 'Error al crear el libro')
      console.error(error)
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 p-6 rounded-xl shadow-lg w-full max-w-md border-black border-2"
      >
        <h2 className="text-xl font-bold mb-4 text-black">
          {libroAEditar ? "Editar Libro" : "Registrar Nuevo Libro"}
        </h2>

        <label className="block mb-2 text-sm font-medium text-black">
          ISBN
        </label>
        <input
          type="text"
          value={formData.isbn}
          required
          disabled={!!libroAEditar}
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
        />

        <label className="block mb-2 text-sm font-medium text-black">
          Título
        </label>
        <input
          type="text"
          value={formData.titulo}
          required
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
        />

        <label className="block mb-2 text-sm font-medium text-black">
          Editorial
        </label>
        <input
          type="text"
          value={formData.editorial}
          required
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) =>
            setFormData({ ...formData, editorial: e.target.value })
          }
        />

        <label className="block mb-2 text-sm font-medium text-black">
          Género
        </label>
        <input
          type="text"
          value={formData.genero}
          required
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
        />

        <label className="block mb-2 text-sm font-medium text-black">
          Año de Publicación
        </label>
        <input
          type="number"
          value={formData.anio_publicacion}
          required
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) =>
            setFormData({ ...formData, anio_publicacion: e.target.value })
          }
        />

        <label className="block mb-2 text-sm font-medium text-black">
          Autor
        </label>
        <select
          required
          value={formData.autor_cedula}
          disabled={!!libroAEditar}
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) =>
            setFormData({ ...formData, autor_cedula: e.target.value })
          }
        >
          <option value="">Seleccione un autor</option>
          {autores.map((autor) => (
            <option key={autor.cedula} value={autor.cedula}>
              {autor.nombre_completo}
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={alCerrar}
            className="px-4 py-2 text-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Guardar Libro
          </button>
        </div>
      </form>
    </div>
  );
}
