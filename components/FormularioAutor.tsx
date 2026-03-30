"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from 'graphql-tag'

const CREAR_AUTOR = gql`
  mutation CrearAutor($cedula: String!, $nombre_completo: String!, $nacionalidad: String!) {
    crearAutor(cedula: $cedula, nombre_completo: $nombre_completo, nacionalidad: $nacionalidad) {
      cedula
      nombre_completo
    }
  }
`

const ACTUALIZAR_AUTOR = gql`
  mutation ActualizarAutor($cedula: String!, $nombre_completo: String, $nacionalidad: String) {
    actualizarAutor(cedula: $cedula, nombre_completo: $nombre_completo, nacionalidad: $nacionalidad) {
      cedula
      nombre_completo
    }
  }
`

interface Autor {
  cedula: string
  nombre_completo: string
  nacionalidad: string
}

interface Props {
  onAutorCreado: () => void
  alCerrar: () => void
  autorAEditar?: Autor | null
}

export default function FormularioAutor({ onAutorCreado, alCerrar, autorAEditar = null }: Props) {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");

  useEffect(() => {
    if (autorAEditar) {
      setCedula(autorAEditar.cedula);
      setNombre(autorAEditar.nombre_completo);
      setNacionalidad(autorAEditar.nacionalidad);
    }
  }, [autorAEditar]);

  const [crearAutor] = useMutation(CREAR_AUTOR);
  const [actualizarAutor] = useMutation(ACTUALIZAR_AUTOR);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (autorAEditar) {
        await actualizarAutor({
          variables: { cedula, nombre_completo: nombre, nacionalidad },
        })
        alert('Autor actualizado con éxito')
      } else {
        await crearAutor({
          variables: { cedula, nombre_completo: nombre, nacionalidad },
        })
        alert('Autor creado con éxito')
      }
      onAutorCreado()
      alCerrar()
    } catch (error) {
      alert(autorAEditar ? 'Error al actualizar autor' : 'Error al crear autor')
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
          {autorAEditar ? "Editar Autor" : "Registrar Nuevo Autor"}
        </h2>

        <label className="block mb-2 text-sm font-medium text-black">Cédula</label>
        <input
          type="text"
          value={cedula}
          required
          disabled={!!autorAEditar}
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setCedula(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium text-black">
          Nombre Completo
        </label>
        <input
          type="text"
          value={nombre}
          required
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setNombre(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium text-black">Nacionalidad</label>
        <input
          type="text"
          value={nacionalidad}
          required
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setNacionalidad(e.target.value)}
        />

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
            Guardar Autor
          </button>
        </div>
      </form>
    </div>
  );
}
