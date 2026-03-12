"use client";
import { useState, useEffect } from "react";

export default function FormularioLibro({
  onLibroCreado,
  alCerrar,
  libroAEditar = null,
}: any) {
  const [autores, setAutores] = useState([]);
  const [formData, setFormData] = useState({
    isbn: "",
    titulo: "",
    editorial: "",
    genero: "",
    anio_publicacion: "",
    autor_cedula: "",
  });

  useEffect(() => {
    fetch("/api/autores")
      .then((res) => res.json())
      .then((data) => setAutores(data))
      .catch((err) => console.error("Error al cargar autores:", err));
  }, []);

  useEffect(() => {
    if (libroAEditar) {
      setFormData({
        isbn: libroAEditar.isbn,
        titulo: libroAEditar.titulo,
        editorial: libroAEditar.editorial,
        genero: libroAEditar.genero,
        anio_publicacion: libroAEditar.anio_publicacion,
        autor_cedula: libroAEditar.autor_cedula,
      });
    }
  }, [libroAEditar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = libroAEditar ? `/api/libros/${libroAEditar.isbn}` : "/api/libros";
    const metodo = libroAEditar ? "PUT" : "POST";

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert(libroAEditar ? "Libro actualizado exitosamente" : "Libro creado exitosamente");
      onLibroCreado(); // Esta función recargará la lista en el componente padre
      alCerrar(); // Cierra el formulario
    } else {
      alert(libroAEditar ? "Error al actualizar el libro" : "Error al crear el libro");
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
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) =>
            setFormData({ ...formData, autor_cedula: e.target.value })
          }
        >
          <option value="">Seleccione un autor</option>
          {autores.map((autor: any) => (
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
